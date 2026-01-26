import {
  MessageSquare,
  TrendingUp,
  FileText,
  Facebook,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch stats
  const { count: rulesCount } = await supabase
    .from("reply_rules")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_active", true);

  const { count: pagesCount } = await supabase
    .from("facebook_pages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_active", true);

  const { count: totalReplies } = await supabase
    .from("reply_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get today's replies count
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: todayReplies } = await supabase
    .from("reply_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", today.toISOString());

  // Fetch recent activity
  const { data: recentActivity } = await supabase
    .from("reply_logs")
    .select(
      `
      id,
      original_comment,
      reply_sent,
      commenter_name,
      created_at,
      reply_rules (keyword),
      facebook_pages (page_name)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Өнөөдөр илгээсэн",
      value: todayReplies?.toString() || "0",
      icon: MessageSquare,
    },
    {
      title: "Нийт хариулт",
      value: totalReplies?.toLocaleString() || "0",
      icon: TrendingUp,
    },
    {
      title: "Идэвхтэй дүрэм",
      value: rulesCount?.toString() || "0",
      icon: FileText,
    },
    {
      title: "Холбогдсон хуудас",
      value: pagesCount?.toString() || "0",
      icon: Facebook,
    },
  ];

  const userName =
    profile?.full_name || user.user_metadata?.full_name || "Хэрэглэгч";

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Саяхан";
    if (diffInMinutes < 60) return `${diffInMinutes} минутын өмнө`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} цагийн өмнө`;
    return `${Math.floor(diffInMinutes / 1440)} өдрийн өмнө`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
          <div>
            <h2 className="text-lg font-semibold">Тавтай морил, {userName}!</h2>
            <p className="text-sm text-muted-foreground">
              {pagesCount && pagesCount > 0
                ? "Таны autoreply.mn tool идэвхжлээ. Одоо comment-үүдэд автоматаар хариулж эхэллээ."
                : "Facebook хуудсаа холбож, автомат хариулт эхлүүлээрэй."}
            </p>
          </div>
          <Button asChild>
            <Link
              href={
                pagesCount && pagesCount > 0
                  ? "/dashboard/rules"
                  : "/dashboard/pages"
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              {pagesCount && pagesCount > 0
                ? "Шинэ дүрэм нэмэх"
                : "Хуудас холбох"}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Сүүлийн үйлдлүүд</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/stats">Бүгдийг харах</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0 sm:w-40">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Facebook className="h-4 w-4 text-primary" />
                    </div>
                    {/* <span className="text-sm font-medium truncate">
                      {(activity.facebook_pages as { page_name: string } | null)
                        ?.page_name || "Хуудас"}
                    </span> */}
                  </div>
                  {/* <Badge variant="outline" className="w-fit">
                    {(activity.reply_rules as { keyword: string } | null)
                      ?.keyword || "keyword"}
                  </Badge> */}
                  <p className="flex-1 text-sm text-muted-foreground truncate">
                    {activity.reply_sent}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(activity.created_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                Одоогоор үйлдэл байхгүй байна
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Facebook хуудсаа холбож, дүрэм үүсгэсний дараа энд харагдана
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
