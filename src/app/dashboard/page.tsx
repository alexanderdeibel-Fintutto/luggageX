"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
import {
  Plane,
  Package,
  MessageSquare,
  ArrowRight,
  PlusCircle,
  Loader2,
  CheckCircle2,
  Clock,
  Handshake,
  Eye,
  Trash2,
  Pause,
  Play,
  Copy,
} from "lucide-react";
import { DashboardAnalytics } from "@/components/dashboard-analytics";
import { ActivityTimeline } from "@/components/activity-timeline";

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

interface MyOffer {
  id: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  availableWeight: number;
  flatPrice: number | null;
  pricePerKg: number | null;
  status: string;
}

interface MyRequest {
  id: string;
  departureCity: string;
  arrivalCity: string;
  earliestDate: string;
  latestDate: string;
  neededWeight: number;
  itemDescription: string;
  maxBudget: number | null;
  status: string;
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

const OFFER_STATUS: Record<string, { label: string; variant: "default" | "secondary" | "success" | "destructive" | "warning" }> = {
  active: { label: "Aktiv", variant: "success" },
  paused: { label: "Pausiert", variant: "warning" },
  matched: { label: "Gematcht", variant: "default" },
  in_transit: { label: "Unterwegs", variant: "warning" },
  completed: { label: "Erledigt", variant: "secondary" },
  cancelled: { label: "Storniert", variant: "destructive" },
  expired: { label: "Abgelaufen", variant: "secondary" },
};

type DashSection = "matches" | "offers" | "requests";

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [myOffers, setMyOffers] = useState<MyOffer[]>([]);
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [section, setSection] = useState<DashSection>("matches");
  const [matchFilter, setMatchFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/matches").then((r) => r.ok ? r.json() : { matches: [] }),
      fetch("/api/offers/my").then((r) => r.ok ? r.json() : { offers: [] }),
      fetch("/api/requests/my").then((r) => r.ok ? r.json() : { requests: [] }),
      fetch("/api/auth/me").then((r) => r.ok ? r.json() : { user: null }),
    ])
      .then(([matchData, offerData, requestData, userData]) => {
        setMatches(matchData.matches || []);
        setMyOffers(offerData.offers || []);
        setMyRequests(requestData.requests || []);
        if (userData.user) setUserId(userData.user.id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (matchFilter === "active") return ["proposed", "accepted", "paid", "in_transit"].includes(m.status);
    if (matchFilter === "completed") return ["completed", "cancelled", "declined"].includes(m.status);
    return true;
  });

  const stats = {
    activeMatches: matches.filter((m) => ["proposed", "accepted", "paid", "in_transit"].includes(m.status)).length,
    completedMatches: matches.filter((m) => m.status === "completed").length,
    activeOffers: myOffers.filter((o) => o.status === "active").length,
    activeRequests: myRequests.filter((r) => r.status === "active").length,
  };

  async function cancelOffer(id: string) {
    const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMyOffers((prev) => prev.map((o) => o.id === id ? { ...o, status: "cancelled" } : o));
    }
  }

  async function togglePauseOffer(id: string, currentStatus: string) {
    const action = currentStatus === "active" ? "pause" : "reactivate";
    const res = await fetch(`/api/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const data = await res.json();
      setMyOffers((prev) => prev.map((o) => o.id === id ? { ...o, status: data.offer.status } : o));
    }
  }

  async function cancelRequest(id: string) {
    const res = await fetch(`/api/requests/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMyRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "cancelled" } : r));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Verwalte deine Angebote, Gesuche und Matches</p>
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

      {/* Analytics Overview */}
      {userId && matches.length > 0 && (
        <DashboardAnalytics matches={matches} userId={userId} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSection("matches")}>
          <CardContent className="pt-6 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.activeMatches}</div>
            <div className="text-sm text-muted-foreground">Aktive Matches</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSection("matches")}>
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.completedMatches}</div>
            <div className="text-sm text-muted-foreground">Abgeschlossen</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSection("offers")}>
          <CardContent className="pt-6 text-center">
            <Plane className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.activeOffers}</div>
            <div className="text-sm text-muted-foreground">Meine Angebote</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSection("requests")}>
          <CardContent className="pt-6 text-center">
            <Package className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.activeRequests}</div>
            <div className="text-sm text-muted-foreground">Meine Gesuche</div>
          </CardContent>
        </Card>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={section === "matches" ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setSection("matches")}
        >
          <Handshake className="h-4 w-4" /> Matches ({matches.length})
        </Button>
        <Button
          variant={section === "offers" ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setSection("offers")}
        >
          <Plane className="h-4 w-4" /> Meine Angebote ({myOffers.length})
        </Button>
        <Button
          variant={section === "requests" ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setSection("requests")}
        >
          <Package className="h-4 w-4" /> Meine Gesuche ({myRequests.length})
        </Button>
      </div>

      {/* MATCHES SECTION */}
      {section === "matches" && (
        <>
          <div className="flex gap-2 mb-4">
            {(["all", "active", "completed"] as const).map((t) => (
              <Button
                key={t}
                variant={matchFilter === t ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setMatchFilter(t)}
              >
                {t === "all" ? "Alle" : t === "active" ? "Aktiv" : "Erledigt"}
              </Button>
            ))}
          </div>

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
            <div className="space-y-3">
              {filteredMatches.map((match) => {
                const status = STATUS_MAP[match.status] || { label: match.status, variant: "secondary" as const };
                return (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={status.variant}>{status.label}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(match.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar name={match.offer.user.name} src={match.offer.user.avatarUrl} size="sm" />
                            <div className="text-sm">
                              <div className="font-medium">{match.offer.user.name}</div>
                              <div className="text-muted-foreground text-xs">Carrier</div>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <Avatar name={match.request.user.name} src={match.request.user.avatarUrl} size="sm" />
                            <div className="text-sm">
                              <div className="font-medium">{match.request.user.name}</div>
                              <div className="text-muted-foreground text-xs">Sender</div>
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
        </>
      )}

      {/* MY OFFERS SECTION */}
      {section === "offers" && (
        <div className="space-y-3">
          {myOffers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Noch keine Angebote</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Biete dein freies Gepäck auf deinem nächsten Flug an.
                </p>
                <Link href="/offers/new">
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Jetzt anbieten
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            myOffers.map((offer) => {
              const s = OFFER_STATUS[offer.status] || { label: offer.status, variant: "secondary" as const };
              return (
                <Card key={offer.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={s.variant}>{s.label}</Badge>
                            <span className="text-sm font-medium">{offer.flightNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-lg font-bold">
                            {offer.departureAirport}
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            {offer.arrivalAirport}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDateTime(offer.departureDate)} | {formatWeight(offer.availableWeight)} |{" "}
                            {offer.flatPrice
                              ? formatCurrency(offer.flatPrice)
                              : offer.pricePerKg
                              ? `${formatCurrency(offer.pricePerKg)}/kg`
                              : "VB"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/offers/${offer.id}`}>
                          <Button variant="ghost" size="icon" title="Ansehen">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {(offer.status === "active" || offer.status === "paused") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title={offer.status === "active" ? "Pausieren" : "Reaktivieren"}
                            onClick={() => togglePauseOffer(offer.id, offer.status)}
                          >
                            {offer.status === "active" ? (
                              <Pause className="h-4 w-4 text-warning" />
                            ) : (
                              <Play className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        )}
                        {(offer.status === "expired" || offer.status === "cancelled" || offer.status === "completed") && (
                          <Link href={`/offers/new?relist=${offer.id}`}>
                            <Button variant="ghost" size="icon" title="Erneut einstellen">
                              <Copy className="h-4 w-4 text-primary" />
                            </Button>
                          </Link>
                        )}
                        {offer.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Stornieren"
                            onClick={() => cancelOffer(offer.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* MY REQUESTS SECTION */}
      {section === "requests" && (
        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Noch keine Gesuche</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Erstelle ein Gesuch, um günstigen Gepäcktransport zu finden.
                </p>
                <Link href="/requests/new">
                  <Button className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Jetzt suchen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            myRequests.map((req) => {
              const s = OFFER_STATUS[req.status] || { label: req.status, variant: "secondary" as const };
              return (
                <Card key={req.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={s.variant}>{s.label}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-bold">
                          {req.departureCity}
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          {req.arrivalCity}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(req.earliestDate).toLocaleDateString("de-DE")} -{" "}
                          {new Date(req.latestDate).toLocaleDateString("de-DE")} |{" "}
                          {formatWeight(req.neededWeight)}
                          {req.maxBudget ? ` | bis ${formatCurrency(req.maxBudget)}` : ""}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{req.itemDescription}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {req.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Stornieren"
                            onClick={() => cancelRequest(req.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Activity Timeline */}
      {userId && matches.length > 0 && (
        <ActivityTimeline matches={matches} userId={userId} />
      )}
    </div>
  );
}
