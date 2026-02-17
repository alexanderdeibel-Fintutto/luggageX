"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Wallet,
  Plane,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface AnalyticsProps {
  matches: Array<{
    status: string;
    agreedPrice: number | null;
    createdAt: string;
    offer: { userId: string };
    request: { userId: string };
  }>;
  userId: string;
}

export function DashboardAnalytics({ matches, userId }: AnalyticsProps) {
  const completedMatches = matches.filter((m) => m.status === "completed");

  // Earnings (as carrier)
  const carrierEarnings = completedMatches
    .filter((m) => m.offer.userId === userId)
    .reduce((sum, m) => sum + (m.agreedPrice || 0), 0);

  // Spent (as sender)
  const senderSpent = completedMatches
    .filter((m) => m.request.userId === userId)
    .reduce((sum, m) => sum + (m.agreedPrice || 0), 0);

  // Monthly activity
  const now = new Date();
  const thisMonth = matches.filter((m) => {
    const d = new Date(m.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const lastMonth = matches.filter((m) => {
    const d = new Date(m.createdAt);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  }).length;

  const monthlyChange = lastMonth > 0
    ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
    : thisMonth > 0 ? 100 : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <Card>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Verdient</span>
            <Wallet className="h-3.5 w-3.5 text-green-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-green-600">
            {formatCurrency(carrierEarnings)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <ArrowUpRight className="h-3 w-3 text-green-500" />
            als Carrier
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Ausgegeben</span>
            <Package className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {formatCurrency(senderSpent)}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <ArrowDownRight className="h-3 w-3 text-primary" />
            als Sender
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Deals</span>
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {completedMatches.length}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            von {matches.length} Matches
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-3 px-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Diesen Monat</span>
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="text-lg sm:text-xl font-bold">
            {thisMonth}
          </div>
          <div className="flex items-center gap-1 text-xs mt-0.5">
            {monthlyChange > 0 ? (
              <span className="text-green-500 flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                +{monthlyChange}%
              </span>
            ) : monthlyChange < 0 ? (
              <span className="text-destructive flex items-center gap-0.5">
                <ArrowDownRight className="h-3 w-3" />
                {monthlyChange}%
              </span>
            ) : (
              <span className="text-muted-foreground">gleich</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
