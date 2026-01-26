import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("🔄 Auth callback эхлэв, code байгаа:", !!code);

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("❌ Session солилцоо алдаа:", error);
      } else {
        console.log(
          "✅ Supabase session амжилттай солилцоо эхлэв - Хэрэглэгч:",
          data.user?.email,
        );
      }
    } catch (error) {
      console.error("❌ Auth callback алдаа:", error);
    }
  } else {
    console.warn("⚠️ Auth callback: code олдсонгүй");
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", request.url));
}
