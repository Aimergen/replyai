"use client";

import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore(state => state.initialize);
  const setSession = useAuthStore(state => state.setSession);
  const router = useRouter();
  const pathname = usePathname();

  // Auth state listener
  useEffect(() => {
    const supabase = createClient();

    // Initial session check
    initialize();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔄 Auth event:", event, "Session:", !!session);

      setSession(session);

      // Handle specific events
      if (event === "SIGNED_IN" && session) {
        console.log("✅ Signed in - refreshing...");
        router.refresh();
      }

      if (event === "SIGNED_OUT") {
        console.log("🚪 Signed out - redirecting to home...");
        router.push("/");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize, setSession, router]);

  return <>{children}</>;
}
