"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Luggage,
  Search,
  PlusCircle,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  Settings,
  Bookmark,
  BarChart3,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Luggage className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold">
            Luggage<span className="text-primary">X</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/search">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              {t("nav.search")}
            </Button>
          </Link>
          <Link href="/offers/new">
            <Button variant="ghost" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              {t("nav.offerLuggage")}
            </Button>
          </Link>
          <Link href="/requests/new">
            <Button variant="ghost" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              {t("nav.searchLuggage")}
            </Button>
          </Link>
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  {t("nav.dashboard")}
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  {t("nav.messages")}
                </Button>
              </Link>
              <Link href="/bookmarks">
                <Button variant="ghost" size="icon" title={t("nav.bookmarks")}>
                  <Bookmark className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/stats">
                <Button variant="ghost" size="icon" title={t("nav.stats")}>
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/alerts">
                <Button variant="ghost" size="icon" title={t("nav.alerts")}>
                  <Bell className="h-4 w-4" />
                </Button>
              </Link>
              <NotificationBell />
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link href="/login">
                <Button variant="outline" size="sm">{t("nav.login")}</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t("nav.register")}</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-1 md:hidden">
          {user && <NotificationBell />}
          <button
            className="p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          <Link href="/search" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Search className="h-4 w-4" /> {t("nav.search")}
            </Button>
          </Link>
          <Link href="/offers/new" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <PlusCircle className="h-4 w-4" /> {t("nav.offerLuggage")}
            </Button>
          </Link>
          <Link href="/requests/new" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <PlusCircle className="h-4 w-4" /> {t("nav.searchLuggage")}
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  {t("nav.dashboard")}
                </Button>
              </Link>
              <Link href="/messages" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" /> {t("nav.messages")}
                </Button>
              </Link>
              <Link href="/bookmarks" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Bookmark className="h-4 w-4" /> {t("nav.bookmarks")}
                </Button>
              </Link>
              <Link href="/stats" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" /> {t("nav.stats")}
                </Button>
              </Link>
              <Link href="/alerts" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Bell className="h-4 w-4" /> {t("nav.alerts")}
                </Button>
              </Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" /> {t("nav.profile")}
                </Button>
              </Link>
              <Link href="/settings" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" /> {t("nav.settings")}
                </Button>
              </Link>
              <div className="pt-2 border-t">
                <ThemeToggle />
              </div>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> {t("nav.logout")}
              </Button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full">{t("nav.login")}</Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">{t("nav.register")}</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
