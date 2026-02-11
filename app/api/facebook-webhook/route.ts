import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

// ============= Type Definitions =============
interface FacebookWebhookEntry {
  id: string;
  time: number;
  changes: FacebookChange[];
}

interface FacebookChange {
  field: string;
  value: {
    item: string;
    comment_id: string;
    message: string;
    post_id: string;
    from?: {
      id: string;
      name: string;
    };
  };
}

interface FacebookWebhookBody {
  object: string;
  entry: FacebookWebhookEntry[];
}

interface ReplyRule {
  id: string;
  keyword: string;
  reply_text: string;
  usage_count: number;
  is_active: boolean;
}

interface PageData {
  access_token: string;
  user_id: string;
  is_active: boolean;
}

// ============= Security: Signature Verification =============
function verifySignature(payload: string, signature: string | null): boolean {
  if (!signature || !process.env.FACEBOOK_APP_SECRET) {
    console.error("❌ Missing signature or app secret");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.FACEBOOK_APP_SECRET)
    .update(payload)
    .digest("hex");

  const signatureHash = signature.replace("sha256=", "");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signatureHash),
  );
}

// ============= Webhook Verification (GET) =============
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully");
    return new NextResponse(challenge, { status: 200 });
  }

  console.error("❌ Webhook verification failed");
  return new NextResponse("Verification failed", { status: 403 });
}

// ============= Comment Notification Handler (POST) =============
export async function POST(request: NextRequest) {
  try {
    // 1. Security: Verify Facebook signature
    const signature = request.headers.get("x-hub-signature-256");
    const rawBody = await request.text();

    if (!verifySignature(rawBody, signature)) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 },
      );
    }

    const body: FacebookWebhookBody = JSON.parse(rawBody);

    // Production-д бүрэн body log хийхгүй (sensitive data)
    console.log("📨 Webhook received:", {
      object: body.object,
      entryCount: body.entry?.length,
    });

    if (body.object !== "page") {
      return NextResponse.json({ success: false, message: "Not a page event" });
    }

    const supabase = await createClient();

    // Performance: Бүх page ID-уудыг нэг query-гээр авах (N+1 problem шийдэл)
    const pageIds = body.entry.map(entry => entry.id);
    const { data: pagesData, error: pagesError } = await supabase
      .from("user_facebook_pages")
      .select("page_id, access_token, user_id, is_active")
      .in("page_id", pageIds);

    if (pagesError) {
      console.error("❌ Pages fetch error:", pagesError);
      return NextResponse.json(
        { success: false, error: "Database error" },
        { status: 500 },
      );
    }

    // Map болгож хурдан lookup хийх
    const pagesMap = new Map<string, PageData & { page_id: string }>(
      pagesData?.map(p => [p.page_id, p]) ?? [],
    );

    // Бүх entry-г боловсруулах
    for (const entry of body.entry) {
      const pageId = entry.id;
      const pageData = pagesMap.get(pageId);

      if (!pageData) {
        console.error(`❌ Page ${pageId} олдсонгүй`);
        continue;
      }

      if (!pageData.is_active) {
        console.log(`⏸️ Page ${pageId} идэвхгүй байна`);
        continue;
      }

      const pageAccessToken = pageData.access_token;
      const userId = pageData.user_id;

      // Бүх changes-г боловсруулах
      for (const change of entry.changes) {
        if (change.field === "feed" && change.value.item === "comment") {
          const { comment_id, message, post_id, from } = change.value;

          console.log("💬 Шинэ comment олдлоо:");
          console.log("  Comment ID:", comment_id);
          console.log("  Message:", message);
          console.log("  Post ID:", post_id);
          console.log("  From:", from?.name);

          // Comment-д хариулах
          await replyToComment({
            commentId: comment_id,
            message,
            pageAccessToken,
            userId,
            pageId,
            postId: post_id,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { success: false, error: "Processing failed" },
      { status: 500 },
    );
  }
}

// ============= Comment-д хариулах функц =============
interface ReplyParams {
  commentId: string;
  message: string;
  pageAccessToken: string;
  userId: string;
  pageId: string;
  postId: string;
}

async function replyToComment({
  commentId,
  message,
  pageAccessToken,
  userId,
  pageId,
  postId,
}: ReplyParams): Promise<void> {
  const supabase = await createClient();

  try {
    // 1. User-ийн reply rules-ийг татах
    const { data: rules, error: rulesError } = await supabase
      .from("reply_rules")
      .select("id, keyword, reply_text, usage_count, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .returns<ReplyRule[]>();

    if (rulesError) {
      console.error("❌ Rules fetch error:", rulesError);
      return;
    }

    if (!rules || rules.length === 0) {
      console.log("⚠️ Идэвхтэй rule олдсонгүй");
      return;
    }

    // 2. Message дотор keyword байгаа эсэхийг шалгах
    const lowerMessage = message.toLowerCase();
    const matchedRule = rules.find(rule =>
      lowerMessage.includes(rule.keyword.toLowerCase()),
    );

    if (!matchedRule) {
      // Production-д хэрэглэгчийн message log хийхгүй
      console.log("⚠️ Keyword олдсонгүй");
      return;
    }

    console.log("✅ Keyword олдлоо:", matchedRule.keyword);

    // 3. Facebook Graph API-аар хариулт илгээх
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${commentId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: matchedRule.reply_text,
          access_token: pageAccessToken,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Facebook API error:", {
        status: response.status,
        error: result.error?.message,
      });
      return;
    }

    console.log("✅ Reply амжилттай илгээлээ:", result.id);

    // 4. Performance: Database operations-ийг parallel ажиллуулах
    await Promise.all([
      // Reply log-д хадгалах
      supabase.from("reply_logs").insert({
        user_id: userId,
        page_id: pageId,
        post_id: postId,
        comment_id: commentId,
        rule_id: matchedRule.id,
        original_comment: message,
        reply_sent: matchedRule.reply_text,
      }),
      // Rule usage count нэмэгдүүлэх (RPC ашиглах нь race condition-с сэргийлнэ)
      supabase.rpc("increment_rule_usage", { rule_id: matchedRule.id }),
    ]);

    console.log("✅ Database амжилттай шинэчлэгдлээ");
  } catch (error) {
    console.error(
      "❌ Reply error:",
      error instanceof Error ? error.message : error,
    );
  }
}
