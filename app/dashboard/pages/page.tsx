import { Facebook, Plus, MoreHorizontal, Pause, Trash2, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function PagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch connected pages
  const { data: connectedPages } = await supabase
    .from("facebook_pages")
    .select("*")
    .eq("user_id", user.id)
    .order("connected_at", { ascending: false });

  // Get reply counts for each page
  const pagesWithReplies = await Promise.all(
    (connectedPages || []).map(async (page) => {
      const { count } = await supabase
        .from("reply_logs")
        .select("*", { count: "exact", head: true })
        .eq("page_id", page.id);
      return { ...page, repliesSent: count || 0 };
    })
  );

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  async function togglePageStatus(pageId: string, currentStatus: boolean) {
    "use server";
    const supabase = await createClient();
    await supabase
      .from("facebook_pages")
      .update({ is_active: !currentStatus })
      .eq("id", pageId);
    revalidatePath("/dashboard/pages");
  }

  async function deletePage(pageId: string) {
    "use server";
    const supabase = await createClient();
    await supabase.from("facebook_pages").delete().eq("id", pageId);
    revalidatePath("/dashboard/pages");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Холбогдсон хуудсууд</h1>
          <p className="text-muted-foreground">
            Facebook Page-үүдээ холбож, автомат хариулт идэвхжүүлээрэй
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Шинэ хуудас холбох
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pagesWithReplies.map((page) => (
          <Card key={page.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {page.page_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{page.page_name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {formatFollowers(page.followers_count)} дагагч
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <form action={togglePageStatus.bind(null, page.id, page.is_active)}>
                    <DropdownMenuItem asChild>
                      <button type="submit" className="w-full flex items-center">
                        {page.is_active ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Түр зогсоох
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Идэвхжүүлэх
                          </>
                        )}
                      </button>
                    </DropdownMenuItem>
                  </form>
                  <form action={deletePage.bind(null, page.id)}>
                    <DropdownMenuItem asChild>
                      <button
                        type="submit"
                        className="w-full flex items-center text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Салгах
                      </button>
                    </DropdownMenuItem>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {page.repliesSent.toLocaleString()} хариулт
                  </span>
                </div>
                <Badge variant={page.is_active ? "default" : "secondary"}>
                  {page.is_active ? "Идэвхтэй" : "Зогссон"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed flex items-center justify-center min-h-[140px]">
          <Button variant="ghost" className="flex-col gap-2 h-auto py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30">
              <Plus className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              Facebook Page холбох
            </span>
          </Button>
        </Card>
      </div>

      {(!connectedPages || connectedPages.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Facebook className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Facebook Page холбоогүй байна
            </h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Автомат хариулт эхлүүлэхийн тулд Facebook Page-ээ холбоно уу.
              Холбосны дараа comment-үүдэд автоматаар хариулах боломжтой болно.
            </p>
            <Button className="gap-2">
              <Facebook className="h-4 w-4" />
              Facebook-ээр холбогдох
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
