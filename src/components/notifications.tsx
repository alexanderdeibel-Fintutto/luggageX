"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, Handshake, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  type: "message" | "match";
  title: string;
  description: string;
  route: string;
  matchId: string;
  createdAt: string;
  read: boolean;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silent fail
    }
  }

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // silent fail
    }
  }

  function handleClick(notification: Notification) {
    setOpen(false);
    router.push(`/matches/${notification.matchId}`);
  }

  function timeAgo(date: string) {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Gerade eben";
    if (mins < 60) return `vor ${mins} Min.`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `vor ${hours} Std.`;
    const days = Math.floor(hours / 24);
    return `vor ${days} Tag${days > 1 ? "en" : ""}`;
  }

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-popover border rounded-lg shadow-xl z-50 max-h-[28rem] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">Benachrichtigungen</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  Alle gelesen
                </button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setOpen(false)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                Keine Benachrichtigungen
              </div>
            ) : (
              notifications.slice(0, 15).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 border-b last:border-b-0 transition-colors ${
                    !n.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      n.type === "message" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                    }`}>
                      {n.type === "message" ? (
                        <MessageSquare className="h-4 w-4" />
                      ) : (
                        <Handshake className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {n.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
