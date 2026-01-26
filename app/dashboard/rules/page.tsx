"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const initialRules = [
  {
    id: 1,
    keyword: "үнэ",
    reply:
      "Сайн байна уу! Үнийн мэдээллийг DM-ээр илгээлээ. Шалгаад үзээрэй! 🙏",
    active: true,
    usageCount: 342,
  },
  {
    id: 2,
    keyword: "захиалга",
    reply:
      "Баярлалаа! Захиалга өгөхийн тулд 9911-XXXX утсаар холбогдоно уу. Эсвэл DM бичээрэй!",
    active: true,
    usageCount: 256,
  },
  {
    id: 3,
    keyword: "хүргэлт",
    reply:
      "Хүргэлт УБ хотод 24 цагийн дотор, хөдөө орон нутагт 3-5 хоногт хүргэнэ. Хүргэлтийн төлбөр 5,000₮.",
    active: true,
    usageCount: 189,
  },
  {
    id: 4,
    keyword: "size",
    reply:
      "Бүх size байгаа шүү! DM-ээр size-аа бичээрэй, бид шалгаад хариулъя. 📏",
    active: true,
    usageCount: 167,
  },
  {
    id: 5,
    keyword: "баталгаа",
    reply:
      "Бүх бүтээгдэхүүн 1 жилийн баталгаатай. Асуудал гарвал бид солиж өгнө!",
    active: false,
    usageCount: 98,
  },
  {
    id: 6,
    keyword: "утас",
    reply: "Манай утас: 9911-XXXX. Ажлын цагаар 09:00-18:00 холбогдоно уу!",
    active: true,
    usageCount: 134,
  },
];

const Loading = () => null;

export default function RulesPage() {
  const [rules, setRules] = useState(initialRules);
  const [searchQuery, setSearchQuery] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newReply, setNewReply] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const searchParams = useSearchParams();

  const filteredRules = rules.filter(
    (rule) =>
      rule.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.reply.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRule = (id: number) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  const addRule = () => {
    if (newKeyword.trim() && newReply.trim()) {
      setRules([
        ...rules,
        {
          id: Date.now(),
          keyword: newKeyword.trim(),
          reply: newReply.trim(),
          active: true,
          usageCount: 0,
        },
      ]);
      setNewKeyword("");
      setNewReply("");
      setDialogOpen(false);
    }
  };

  const deleteRule = (id: number) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Дүрмүүд</h1>
            <p className="text-muted-foreground">
              Keyword болон автомат хариултуудаа тохируулаарай
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Шинэ дүрэм нэмэх
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Шинэ дүрэм үүсгэх</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="keyword">Keyword</Label>
                  <Input
                    id="keyword"
                    placeholder="Жишээ: үнэ, захиалга, хүргэлт"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Comment-д энэ үг байвал автоматаар хариулна
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reply">Хариулт</Label>
                  <Textarea
                    id="reply"
                    placeholder="Автоматаар илгээх хариултаа бичнэ үү..."
                    rows={4}
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Болих</Button>
                </DialogClose>
                <Button onClick={addRule}>Хадгалах</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Дүрэм хайх..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 py-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Switch
                    checked={rule.active}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono">
                        {rule.keyword}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {rule.usageCount} удаа ашиглагдсан
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {rule.reply}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Badge variant={rule.active ? "default" : "secondary"}>
                    {rule.active ? "Идэвхтэй" : "Идэвхгүй"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Засах
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Хуулах
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Устгах
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRules.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">Дүрэм олдсонгүй</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Хайлтад тохирох дүрэм байхгүй байна"
                    : "Эхний дүрмээ үүсгээрэй"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Suspense>
  );
}
