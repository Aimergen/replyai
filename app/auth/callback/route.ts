import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("❌ OAuth error:", error, errorDescription);
    const errorUrl = new URL("/auth/error", origin);
    errorUrl.searchParams.set("error", error);
    if (errorDescription) {
      errorUrl.searchParams.set("message", errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  if (!code) {
    console.warn("⚠️ Auth callback: code олдсонгүй");
    return NextResponse.redirect(new URL("/", origin));
  }

  try {
    const supabase = await createClient();
    const { data, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error("❌ Session exchange error:", sessionError.message);
      const errorUrl = new URL("/auth/error", origin);
      errorUrl.searchParams.set("error", "session_error");
      errorUrl.searchParams.set("message", sessionError.message);
      return NextResponse.redirect(errorUrl);
    }

    console.log("✅ Session амжилттай:", data.user?.email);
    return NextResponse.redirect(new URL("/dashboard", origin));
  } catch (error) {
    console.error("❌ Auth callback exception:", error);
    return NextResponse.redirect(
      new URL("/auth/error?error=unexpected", origin),
    );
  }
}
