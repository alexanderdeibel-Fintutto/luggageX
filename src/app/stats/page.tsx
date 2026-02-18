"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Plane,
  Package,
  Euro,
  Star,
  TrendingUp,
  ArrowRight,
  Loader2,
  BarChart3,
  Award,
} from "lucide-react";

interface CarrierStats {
  totalOffers: number;
  activeOffers: number;
  completedAsCarrier: number;
  completedAsSender: number;
  totalEarnings: number;
  totalSpent: number;
  avgDealValue: number;
  rating: number;
  totalReviews: number;
  ratingDistribution: number[];
  topRoutes: { count: number; from: string; to: string; fromCity: string; toCity: string }[];
  monthlyActivity: { month: string; deals: number; earnings: number }[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<CarrierStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats/carrier")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.stats) setStats(data.stats);
      })
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
        <h2 className="text-2xl font-bold mb-4">Bitte anmelden</h2>
        <Link href="/login">
          <Button>Anmelden</Button>
        </Link>
      </div>
    );
  }

  const maxDeals = Math.max(...stats.monthlyActivity.map((m) => m.deals), 1);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Meine Statistiken
        </h1>
        <p className="text-muted-foreground">Deine Performance und Earnings auf einen Blick</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Euro className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</div>
            <div className="text-sm text-muted-foreground">Einnahmen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.completedAsCarrier + stats.completedAsSender}</div>
            <div className="text-sm text-muted-foreground">Abgeschlossen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{formatCurrency(stats.avgDealValue)}</div>
            <div className="text-sm text-muted-foreground">Ø pro Deal</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-6 w-6 fill-amber-400 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">{stats.totalReviews} Bewertungen</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Monthly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monatliche Aktivität
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.monthlyActivity.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16 shrink-0">{m.month}</span>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all flex items-center justify-end pr-2"
                      style={{ width: `${Math.max((m.deals / maxDeals) * 100, 5)}%` }}
                    >
                      {m.deals > 0 && (
                        <span className="text-[10px] font-bold text-primary-foreground">{m.deals}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium w-16 text-right">
                    {m.earnings > 0 ? formatCurrency(m.earnings) : "–"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Bewertungsverteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating - 1];
                const total = stats.totalReviews || 1;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 w-16 shrink-0">
                      {[...Array(rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Top Routen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topRoutes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Noch keine Routen</p>
            ) : (
              <div className="space-y-3">
                {stats.topRoutes.map((route, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary/60 w-6">{i + 1}</span>
                      <div>
                        <div className="flex items-center gap-1.5 font-medium text-sm">
                          {route.from} <ArrowRight className="h-3 w-3" /> {route.to}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {route.fromCity} → {route.toCity}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold">{route.count}x</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Zusammenfassung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Angebote erstellt</span>
                <span className="font-bold">{stats.totalOffers}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Aktive Angebote</span>
                <span className="font-bold">{stats.activeOffers}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Als Carrier abgeschlossen</span>
                <span className="font-bold">{stats.completedAsCarrier}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Als Sender abgeschlossen</span>
                <span className="font-bold">{stats.completedAsSender}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Gesamteinnahmen</span>
                <span className="font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Gesamtausgaben</span>
                <span className="font-bold">{formatCurrency(stats.totalSpent)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
