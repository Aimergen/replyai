import React, { useState, useMemo, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ConnectFacebookProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ConnectFacebook = ({ open, setOpen }: ConnectFacebookProps) => {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/facebook-callback`,
          scopes:
            "pages_show_list,pages_read_engagement,pages_manage_metadata,pages_manage_posts",
        },
      });

      if (error) {
        console.error("❌ Facebook connect error:", error.message);
        toast.error("Холбогдоход алдаа гарлаа");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      toast.error("Төхөөрөмжгүй алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  if (!open) return null;
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-facebook-icon lucide-facebook"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </AlertDialogMedia>
          <AlertDialogTitle>
            Facebook хуудсаа холбохыг зөвшөөрөх үү?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Та энэ төхөөрөмжтэй Facebook хуудсаа холбохыг зөвшөөрч байна уу?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Хаах</AlertDialogCancel>
          <AlertDialogAction onClick={handleConnect}>
            Зөвшөөрөх
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConnectFacebook;
