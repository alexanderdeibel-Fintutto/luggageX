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
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserData {
  id: string;
  name: string;
  email: string;
}

export function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

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
              Suchen
            </Button>
          </Link>
          <Link href="/offers/new">
            <Button variant="ghost" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Gepäck anbieten
            </Button>
          </Link>
          <Link href="/requests/new">
            <Button variant="ghost" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Gepäck suchen
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link href="/login">
                <Button variant="outline" size="sm">Anmelden</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Registrieren</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          <Link href="/search" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Search className="h-4 w-4" /> Suchen
            </Button>
          </Link>
          <Link href="/offers/new" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <PlusCircle className="h-4 w-4" /> Gepäck anbieten
            </Button>
          </Link>
          <Link href="/requests/new" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <PlusCircle className="h-4 w-4" /> Gepäck suchen
            </Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Abmelden
              </Button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full">Anmelden</Button>
              </Link>
              <Link href="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                <Button className="w-full">Registrieren</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
