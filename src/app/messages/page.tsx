"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  MessageSquare,
  ArrowRight,
  Plane,
  Loader2,
  Inbox,
} from "lucide-react";

interface Conversation {
  matchId: string;
  status: string;
  partner: { id: string; name: string; avatarUrl: string | null };
  route: { from: string; to: string; fromCity: string; toCity: string };
  role: "carrier" | "sender";
  lastMessage: {
    content: string;
    createdAt: string;
    isOwn: boolean;
    isRead: boolean;
  } | null;
  unreadCount: number;
}

const STATUS_LABELS: Record<string, string> = {
  proposed: "Vorgeschlagen",
  accepted: "Akzeptiert",
  paid: "Bezahlt",
  in_transit: "Unterwegs",
  handed_over: "Übergeben",
  completed: "Abgeschlossen",
  declined: "Abgelehnt",
  cancelled: "Storniert",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "gerade eben";
  if (mins < 60) return `vor ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `vor ${days}d`;
  return new Date(dateStr).toLocaleDateString("de-DE");
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetch("/api/messages/conversations")
      .then((r) => (r.ok ? r.json() : { conversations: [] }))
      .then((data) => setConversations(data.conversations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filtered =
    filter === "unread"
      ? conversations.filter((c) => c.unreadCount > 0)
      : conversations;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Nachrichten</h1>
          <p className="text-muted-foreground">
            {totalUnread > 0
              ? `${totalUnread} ungelesene Nachricht${totalUnread > 1 ? "en" : ""}`
              : "Alle Nachrichten gelesen"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
              filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Ungelesen {totalUnread > 0 && `(${totalUnread})`}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              {filter === "unread" ? "Keine ungelesenen Nachrichten" : "Noch keine Konversationen"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === "unread"
                ? "Du hast alle Nachrichten gelesen."
                : "Erstelle ein Angebot oder sende eine Anfrage, um mit anderen Nutzern zu chatten."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((conv) => (
            <Link key={conv.matchId} href={`/matches/${conv.matchId}`}>
              <Card
                className={`hover:shadow-md transition-all cursor-pointer ${
                  conv.unreadCount > 0 ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar name={conv.partner.name} src={conv.partner.avatarUrl} />
                      {conv.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`font-semibold text-sm ${conv.unreadCount > 0 ? "text-foreground" : ""}`}>
                          {conv.partner.name}
                        </span>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground shrink-0 ml-2">
                            {timeAgo(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                        <Plane className="h-3 w-3" />
                        <span>{conv.route.from}</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                        <span>{conv.route.to}</span>
                        <span className="mx-1">|</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {STATUS_LABELS[conv.status] || conv.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {conv.role === "carrier" ? "Carrier" : "Sender"}
                        </Badge>
                      </div>
                      {conv.lastMessage && (
                        <p
                          className={`text-sm truncate ${
                            conv.unreadCount > 0 && !conv.lastMessage.isOwn
                              ? "font-medium text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {conv.lastMessage.isOwn && (
                            <span className="text-muted-foreground">Du: </span>
                          )}
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                    <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
