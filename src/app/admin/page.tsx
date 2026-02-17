"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Users,
  Plane,
  Package,
  Handshake,
  CreditCard,
  Star,
  MessageSquare,
  Bookmark,
  Shield,
  TrendingUp,
  Loader2,
  ArrowRight,
  Mail,
} from "lucide-react";

interface AdminStats {
  overview: {
    totalUsers: number;
    verifiedUsers: number;
    totalOffers: number;
    activeOffers: number;
    totalRequests: number;
    activeRequests: number;
    totalMatches: number;
    completedMatches: number;
    totalTransactions: number;
    totalRevenue: number;
    totalReviews: number;
    avgRating: number;
    totalMessages: number;
    totalBookmarks: number;
    totalReports: number;
    openContacts: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    verified: boolean;
    createdAt: string;
  }>;
  recentOffers: Array<{
    id: string;
    route: string;
    departureDate: string;
    status: string;
    userName: string;
    createdAt: string;
  }>;
  topRoutes: Array<{
    route: string;
    count: number;
  }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Zugriff verweigert</h2>
        <p className="text-muted-foreground">Du hast keinen Zugriff auf diesen Bereich.</p>
      </div>
    );
  }

  const o = stats.overview;

  const metricCards = [
    { label: "Nutzer", value: o.totalUsers, sub: `${o.verifiedUsers} verifiziert`, icon: Users, color: "text-blue-500" },
    { label: "Angebote", value: o.totalOffers, sub: `${o.activeOffers} aktiv`, icon: Plane, color: "text-primary" },
    { label: "Gesuche", value: o.totalRequests, sub: `${o.activeRequests} aktiv`, icon: Package, color: "text-violet-500" },
    { label: "Matches", value: o.totalMatches, sub: `${o.completedMatches} abgeschlossen`, icon: Handshake, color: "text-green-500" },
    { label: "Umsatz", value: formatCurrency(o.totalRevenue), sub: `${o.totalTransactions} Transaktionen`, icon: CreditCard, color: "text-amber-500" },
    { label: "Bewertungen", value: o.totalReviews, sub: `Ø ${o.avgRating.toFixed(1)} Sterne`, icon: Star, color: "text-yellow-500" },
    { label: "Nachrichten", value: o.totalMessages, sub: `${o.totalBookmarks} Bookmarks`, icon: MessageSquare, color: "text-sky-500" },
    { label: "Support", value: o.totalReports, sub: `${o.openContacts} offen`, icon: Mail, color: "text-red-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Plattform-Übersicht und Kennzahlen</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <TrendingUp className="h-3.5 w-3.5 mr-1" />
          Live
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metricCards.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{m.label}</span>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div className="text-2xl font-bold">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Neue Nutzer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUsers.map((u) => (
                <Link key={u.id} href={`/users/${u.id}`} className="block">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar name={u.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{u.name}</span>
                        {u.verified && <Shield className="h-3 w-3 text-green-500" />}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("de-DE")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Offers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plane className="h-5 w-5 text-primary" />
              Neue Angebote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOffers.map((offer) => (
                <Link key={offer.id} href={`/offers/${offer.id}`} className="block">
                  <div className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{offer.route}</span>
                      <Badge variant={offer.status === "active" ? "success" : "secondary"} className="text-xs">
                        {offer.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{offer.userName}</span>
                      <span>{new Date(offer.createdAt).toLocaleDateString("de-DE")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Routen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topRoutes.map((route, idx) => (
                <div key={route.route} className="flex items-center gap-3 p-2 rounded-lg">
                  <span className={`text-sm font-bold w-6 text-center ${idx < 3 ? "text-primary" : "text-muted-foreground"}`}>
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 flex-1 text-sm font-medium">
                    {route.route.split(" → ")[0]}
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    {route.route.split(" → ")[1]}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {route.count}x
                  </Badge>
                </div>
              ))}
              {stats.topRoutes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Noch keine Routen-Daten
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Conversion-Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { label: "Nutzer", value: o.totalUsers, color: "bg-blue-500" },
              { label: "Angebote erstellt", value: o.totalOffers, color: "bg-primary" },
              { label: "Matches", value: o.totalMatches, color: "bg-amber-500" },
              { label: "Abgeschlossen", value: o.completedMatches, color: "bg-green-500" },
              { label: "Bewertet", value: o.totalReviews, color: "bg-yellow-500" },
            ].map((step, idx) => {
              const maxVal = o.totalUsers || 1;
              const width = Math.max(20, (step.value / maxVal) * 100);
              return (
                <div key={step.label} className="flex-1 min-w-[120px]">
                  <div className="text-center mb-2">
                    <div className="text-sm font-medium">{step.label}</div>
                    <div className="text-lg font-bold">{step.value}</div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${step.color} rounded-full transition-all`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  {idx < 4 && o.totalUsers > 0 && (
                    <div className="text-xs text-muted-foreground text-center mt-1">
                      {Math.round((step.value / maxVal) * 100)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
