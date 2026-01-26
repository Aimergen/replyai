import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const weeklyStats = [
  { day: "Даваа", replies: 145 },
  { day: "Мягмар", replies: 132 },
  { day: "Лхагва", replies: 178 },
  { day: "Пүрэв", replies: 165 },
  { day: "Баасан", replies: 198 },
  { day: "Бямба", replies: 234 },
  { day: "Ням", replies: 189 },
];

const topKeywords = [
  { keyword: "үнэ", count: 342, change: 12 },
  { keyword: "захиалга", count: 256, change: 8 },
  { keyword: "хүргэлт", count: 189, change: -3 },
  { keyword: "size", count: 167, change: 15 },
  { keyword: "утас", count: 134, change: 5 },
];

const maxReplies = Math.max(...weeklyStats.map((s) => s.replies));

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Статистик</h1>
        <p className="text-muted-foreground">
          Автомат хариултын гүйцэтгэлийг хянах
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Энэ 7 хоногт
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">1,241</span>
              <Badge
                variant="secondary"
                className="text-xs font-normal text-green-600 bg-green-100"
              >
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                +18%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Өмнөх 7 хоногоос
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Дундаж хариу/өдөр
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">177</span>
              <Badge
                variant="secondary"
                className="text-xs font-normal text-green-600 bg-green-100"
              >
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                +5%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Сүүлийн 30 хоногийн дундаж
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Хариу өгөх хугацаа
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{"<"}1с</span>
              <Badge
                variant="secondary"
                className="text-xs font-normal text-green-600 bg-green-100"
              >
                Маш хурдан
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Автомат хариултын хугацаа
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Keyword тохирол
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">94%</span>
              <Badge
                variant="secondary"
                className="text-xs font-normal text-red-600 bg-red-100"
              >
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
                -2%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Comment-д keyword олдсон хувь
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>7 хоногийн хариулт</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {weeklyStats.map((stat) => (
                <div
                  key={stat.day}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <span className="text-xs font-medium">{stat.replies}</span>
                  <div
                    className="w-full bg-primary rounded-t transition-all"
                    style={{
                      height: `${(stat.replies / maxReplies) * 100}%`,
                      minHeight: "8px",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {stat.day.slice(0, 2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Түгээмэл keyword-үүд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topKeywords.map((item, index) => (
                <div key={item.keyword} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-4">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="font-mono">
                        {item.keyword}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {item.count}
                        </span>
                        <span
                          className={`text-xs ${item.change >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {item.change >= 0 ? "+" : ""}
                          {item.change}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(item.count / topKeywords[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
