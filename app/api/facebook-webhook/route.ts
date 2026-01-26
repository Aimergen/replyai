import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verification (Facebook webhook баталгаажуулах)
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Verification failed", { status: 403 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.object === "page") {
    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field === "feed" && change.value.item === "comment") {
          const commentId = change.value.comment_id;
          const message = change.value.message;

          // Эндээс reply хийх логикийг нэмнэ (эхэндээ hardcoded)
          console.log("Шинэ comment:", message);

          // Жишээ reply (дараа нь AI-ээр сольж болно)
          await fetch(
            `https://graph.facebook.com/v20.0/${commentId}/comments`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: "Баярлалаа! Таны сэтгэгдлийг хүлээн авлаа 😊",
                access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN, // Дараа нь user-ийн token-аар соль
              }),
            },
          );
        }
      }
    }
  }

  return NextResponse.json({ success: true });
}
