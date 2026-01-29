"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";

interface FacebookPage {
  id: string;
  name: string;
  access_token: string;
}

const FacebookCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Session-г шалга (Facebook token байгаа эсэх)
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          console.error("Session error:", sessionError);
          router.push("/dashboard?error=session_not_found");
          return;
        }

        const providerToken = session.provider_token;

        if (!providerToken) {
          console.error("No provider_token found");
          router.push("/dashboard?error=no_token");
          return;
        }

        // Facebook Graph API-аар хэрэглэгчийн Pages-үүдийг авна
        const response = await fetch(
          `https://graph.facebook.com/v20.0/me/accounts?access_token=${providerToken}&fields=id,name,access_token`,
        );

        if (!response.ok) {
          const errData = await response.json();
          console.error("Graph API error:", errData);
          router.push("/dashboard?error=graph_api_failed");
          return;
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          console.log("No pages found");
          router.push("/dashboard?message=no_pages_found");
          return;
        }

        // Pages-үүдийг Supabase-д хадгалах (upsert)
        const pagesToInsert = data.data.map((page: FacebookPage) => ({
          user_id: session.user.id,
          page_id: page.id,
          page_name: page.name,
          access_token: page.access_token,
          token_expires_at: null, // long-lived token учраас null
          is_active: true,
          last_sync_at: new Date().toISOString(),
        }));

        const { error: upsertError } = await supabase
          .from("user_facebook_pages")
          .upsert(pagesToInsert, {
            onConflict: "user_id, page_id",
            ignoreDuplicates: false, // шинэчлэх бол update хийнэ
          });

        if (upsertError) {
          console.error("Upsert error:", upsertError);
          router.push("/dashboard?error=save_failed");
          return;
        }

        // Амжилттай бол dashboard руу буцаана
        router.push("/dashboard?fb_connected=true");
      } catch (err) {
        console.error("Callback error:", err);
        router.push("/dashboard?error=unknown");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
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
