import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setSession: session =>
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        }),

      setLoading: isLoading => set({ isLoading }),

      initialize: async () => {
        const supabase = createClient();
        set({ isLoading: true });

        try {
          // Get current session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error("❌ Auth initialize алдаа:", error);
            set({ user: null, session: null, isAuthenticated: false });
          } else {
            set({
              session,
              user: session?.user ?? null,
              isAuthenticated: !!session?.user,
            });
            if (session?.user) {
              console.log(
                "✅ Auth initialized - Хэрэглэгч:",
                session.user.email,
              );
              toast.success("Хэрэглэгч амжилттай нэвтэрлээ");
            } else {
              console.log("ℹ️ Auth initialized - Хэрэглэгч нэвтрээгүй");
            }
          }
        } catch (error) {
          console.error("❌ Auth initialize алдаа:", error);
          set({ user: null, session: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      //   todo: -------- Google-р нэвтрэх функц --------
      signInWithGoogle: async () => {
        const supabase = createClient();
        set({ isLoading: true });

        try {
          console.log("🔐 Google нэвтрэлт эхлэв...");

          // window.location.origin ашиглах нь local болон production аль алинд зөв ажиллана
          const redirectUrl = `${window.location.origin}/auth/callback`;
          console.log("🔗 Redirect URL:", redirectUrl);

          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: redirectUrl,
            },
          });

          if (error) {
            console.error("❌ Google нэвтрэлтийн алдаа:", error);
            toast.error("Google нэвтрэлтийн алдаа гарлаа");
          }
          console.log("✅ Google нэвтрэлт амжилттай эхлэв");
          toast.success("Google нэвтрэлт амжилттай");
        } catch (error) {
          console.error("❌ SignIn алдаа:", error);
          toast.error("Нэвтрэхэд алдаа гарлаа");
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        const supabase = createClient();
        set({ isLoading: true });

        try {
          console.log("🚪 Гарах хүсэлт...");
          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error("❌ SignOut алдаа:", error);
            throw error;
          }

          set({
            user: null,
            session: null,
            isAuthenticated: false,
          });
          console.log("✅ Амжилттай гарлаа");
        } catch (error) {
          console.error("❌ SignOut алдаа:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      reset: () =>
        set({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: state => ({
        // Only persist these fields
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
