"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";

interface FacebookPage {
  id: string;
  name: string;
  tasks?: string[];
  category?: string;
  access_token: string;
}

const FacebookCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("🔄 Facebook callback эхлэв...");

        // 1. Supabase session шалгах
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("❌ Session error:", sessionError);
          router.push("/dashboard?error=session_not_found");
          return;
        }

        console.log("✅ Session олдсон:", session.user.email);

        // 2. Provider token авах (Facebook User Access Token)
        const providerToken = session.provider_token;

        if (!providerToken) {
          console.error("❌ No provider_token found");
          router.push("/dashboard?error=no_token");
          return;
        }

        console.log("✅ Provider token олдсон");

        // 3. Long-lived User Access Token авах
        const longLivedTokenResponse = await fetch(
          `https://graph.facebook.com/v21.0/oauth/access_token?` +
            `grant_type=fb_exchange_token` +
            `&client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}` +
            `&client_secret=${process.env.NEXT_PUBLIC_FACEBOOK_APP_SECRET}` +
            `&fb_exchange_token=${providerToken}`,
        );

        if (!longLivedTokenResponse.ok) {
          const errData = await longLivedTokenResponse.json();
          console.error("❌ Long-lived token error:", errData);
          router.push("/dashboard?error=token_exchange_failed");
          return;
        }

        const longLivedData = await longLivedTokenResponse.json();
        const longLivedToken = longLivedData.access_token;

        console.log("✅ Long-lived token авлаа");

        // 4. Facebook Pages-үүдийг татах
        const pagesResponse = await fetch(
          `https://graph.facebook.com/v21.0/me/accounts?` +
            `access_token=${longLivedToken}&` +
            `fields=id,name,access_token,category,tasks`,
        );

        if (!pagesResponse.ok) {
          const errData = await pagesResponse.json();
          console.error("❌ Graph API error:", errData);
          router.push("/dashboard?error=graph_api_failed");
          return;
        }

        const pagesData = await pagesResponse.json();

        if (!pagesData.data || pagesData.data.length === 0) {
          console.log("⚠️ No pages found");
          router.push("/dashboard?message=no_pages_found");
          return;
        }

        console.log(`✅ ${pagesData.data.length} page олдлоо`);

        // 5. Page Access Token-уудыг long-lived болгох
        const pagesWithLongLivedTokens = await Promise.all(
          pagesData.data.map(async (page: FacebookPage) => {
            try {
              // Page token-ийг long-lived болгох
              const pageTokenResponse = await fetch(
                `https://graph.facebook.com/v21.0/${page.id}?` +
                  `fields=access_token&` +
                  `access_token=${longLivedToken}`,
              );

              if (pageTokenResponse.ok) {
                const pageTokenData = await pageTokenResponse.json();
                return {
                  ...page,
                  access_token: pageTokenData.access_token || page.access_token,
                };
              }
            } catch (err) {
              console.error(`⚠️ Page ${page.id} token exchange алдаа:`, err);
            }
            return page;
          }),
        );

        console.log("✅ Бүх page tokens long-lived болгосон");

        // 6. Database-д хадгалах
        const pagesToInsert = pagesWithLongLivedTokens.map(page => ({
          user_id: session.user.id,
          page_id: page.id,
          page_name: page.name,
          access_token: page.access_token,
          category: page.category,
          is_active: true,
          token_expires_at: null, // long-lived token учраас null
          last_sync_at: new Date().toISOString(),
        }));

        const { error: upsertError } = await supabase
          .from("user_facebook_pages")
          .upsert(pagesToInsert, {
            onConflict: "user_id,page_id",
            ignoreDuplicates: false,
          });

        if (upsertError) {
          console.error("❌ Database save error:", upsertError);
          router.push("/dashboard?error=save_failed");
          return;
        }

        console.log("✅ Database-д амжилттай хадгалав");

        // 7. Амжилттай бол dashboard руу буцаах
        router.push("/dashboard?fb_connected=true");
      } catch (err) {
        console.error("❌ Callback error:", err);
        router.push("/dashboard?error=unknown");
      }
    };

    handleCallback();
  }, [router, searchParams, supabase]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-4">
          Facebook Page холбож байна...
        </h2>
        <p className="text-gray-600">Түр хүлээнэ үү, удахгүй дуусна.</p>
      </div>
    </div>
  );
};

const FacebookCallback = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <p>Loading...</p>
        </div>
      }
    >
      <FacebookCallbackContent />
    </Suspense>
  );
};

export default FacebookCallback;
