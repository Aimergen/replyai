import {
  User,
  CreditCard,
  Bell,
  Shield,
  Facebook,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: pagesCount } = await supabase
    .from("facebook_pages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "starter":
        return "Starter багц";
      case "pro":
        return "Pro багц";
      case "enterprise":
        return "Enterprise багц";
      default:
        return "Үнэгүй туршилт";
    }
  };

  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case "starter":
        return "15,000₮";
      case "pro":
        return "29,000₮";
      case "enterprise":
        return "49,000₮";
      default:
        return "0₮";
    }
  };

  async function updateProfile(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const fullName = formData.get("name") as string;

    await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    revalidatePath("/dashboard/settings");
  }

  async function deleteAccount() {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Delete profile (cascade will delete related data)
    await supabase.from("profiles").delete().eq("id", user.id);

    // Sign out and redirect
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Тохиргоо</h1>
        <p className="text-muted-foreground">
          Аккаунт болон системийн тохиргоогоо удирдаарай
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Профайл</CardTitle>
          </div>
          <CardDescription>Хувийн мэдээллээ засах</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Нэр</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={profile?.full_name || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">И-мэйл</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <Button type="submit">Хадгалах</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Багц & Төлбөр</CardTitle>
          </div>
          <CardDescription>
            Таны одоогийн багц болон төлбөрийн мэдээлэл
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">
                  {getPlanName(profile?.subscription_plan || "free")}
                </span>
                <Badge>Идэвхтэй</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getPlanPrice(profile?.subscription_plan || "free")} / сар
                {profile?.subscription_ends_at &&
                  ` • Дуусах: ${new Date(profile.subscription_ends_at).toLocaleDateString("mn-MN")}`}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Багц солих
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Төлбөрийн түүх</p>
              <p className="text-sm text-muted-foreground">
                Өмнөх төлбөрүүдээ харах
              </p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              Харах
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Мэдэгдэл</CardTitle>
          </div>
          <CardDescription>Мэдэгдлийн тохиргоо</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">И-мэйл мэдэгдэл</p>
              <p className="text-sm text-muted-foreground">
                Өдөр тутмын тайлан авах
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Алдааны мэдэгдэл</p>
              <p className="text-sm text-muted-foreground">
                Системийн алдаа гарахад мэдэгдэл авах
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Facebook холболт</CardTitle>
          </div>
          <CardDescription>Facebook аккаунтын тохиргоо</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Facebook className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{profile?.full_name || "Хэрэглэгч"}</p>
                <p className="text-sm text-muted-foreground">
                  {pagesCount || 0} page холбогдсон
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Дахин холбох
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Аюултай бүс</CardTitle>
          </div>
          <CardDescription>Эдгээр үйлдэл буцаагдахгүй</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Аккаунт устгах</p>
              <p className="text-sm text-muted-foreground">
                Бүх мэдээлэл устгагдана
              </p>
            </div>
            <form action={deleteAccount}>
              <Button variant="destructive" size="sm" type="submit">
                Устгах
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
