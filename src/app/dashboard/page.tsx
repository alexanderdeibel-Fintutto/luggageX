"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Plane,
  Package,
  MessageSquare,
  ArrowRight,
  PlusCircle,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Handshake,
} from "lucide-react";

interface Match {
  id: string;
  status: string;
  agreedPrice: number | null;
  createdAt: string;
  offer: {
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureCity: string;
    arrivalCity: string;
    departureDate: string;
    userId: string;
    user: { id: string; name: string; rating: number; verified: boolean; avatarUrl: string | null };
  };
  request: {
    departureCity: string;
    arrivalCity: string;
    itemDescription: string;
    userId: string;
    user: { id: string; name: string; rating: number; verified: boolean; avatarUrl: string | null };
  };
}

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" }> = {
  proposed: { label: "Vorgeschlagen", variant: "secondary" },
  accepted: { label: "Akzeptiert", variant: "default" },
  declined: { label: "Abgelehnt", variant: "destructive" },
  paid: { label: "Bezahlt", variant: "default" },
  in_transit: { label: "In Zustellung", variant: "warning" },
  handed_over: { label: "Übergeben", variant: "success" },
  completed: { label: "Abgeschlossen", variant: "success" },
  cancelled: { label: "Storniert", variant: "destructive" },
};

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    fetch("/api/matches")
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error("Not authenticated");
      })
      .then((data) => setMatches(data.matches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (tab === "active") return ["proposed", "accepted", "paid", "in_transit"].includes(m.status);
    if (tab === "completed") return ["completed", "cancelled", "declined"].includes(m.status);
    return true;
  });

  const stats = {
    active: matches.filter((m) => ["proposed", "accepted", "paid", "in_transit"].includes(m.status)).length,
    completed: matches.filter((m) => m.status === "completed").length,
    total: matches.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Verwalte deine Matches und Transaktionen</p>
        </div>
        <div className="flex gap-2">
          <Link href="/offers/new">
            <Button variant="outline" size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" /> Anbieten
            </Button>
          </Link>
          <Link href="/requests/new">
            <Button size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" /> Suchen
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Aktiv</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-muted-foreground">Abgeschlossen</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Handshake className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Gesamt</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "completed"] as const).map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(t)}
          >
            {t === "all" ? "Alle" : t === "active" ? "Aktiv" : "Abgeschlossen"}
          </Button>
        ))}
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Noch keine Matches</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Erstelle ein Angebot oder Gesuch um loszulegen.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/offers/new">
                <Button variant="outline" className="gap-2">
                  <Plane className="h-4 w-4" /> Gepäck anbieten
                </Button>
              </Link>
              <Link href="/requests/new">
                <Button className="gap-2">
                  <Package className="h-4 w-4" /> Gepäck suchen
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const status = STATUS_MAP[match.status] || { label: match.status, variant: "secondary" as const };
            return (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(match.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={match.offer.user.name} src={match.offer.user.avatarUrl} size="sm" />
                        <div className="text-sm">
                          <div className="font-medium">{match.offer.user.name}</div>
                          <div className="text-muted-foreground">Carrier</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Avatar name={match.request.user.name} src={match.request.user.avatarUrl} size="sm" />
                        <div className="text-sm">
                          <div className="font-medium">{match.request.user.name}</div>
                          <div className="text-muted-foreground">Sender</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
                      <span className="flex items-center gap-1">
                        <Plane className="h-3.5 w-3.5" />
                        {match.offer.departureAirport} → {match.offer.arrivalAirport}
                        <span className="text-muted-foreground ml-1">({match.offer.flightNumber})</span>
                      </span>
                      {match.agreedPrice && (
                        <span className="font-bold text-primary">
                          {formatCurrency(match.agreedPrice)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
