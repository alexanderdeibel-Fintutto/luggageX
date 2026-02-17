"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Plane,
  ArrowRight,
  Send,
  CheckCircle2,
  QrCode,
  Star,
  ArrowLeft,
  Loader2,
  Shield,
  Package,
  XCircle,
} from "lucide-react";

interface MatchDetail {
  id: string;
  status: string;
  agreedPrice: number | null;
  handoverCode: string | null;
  pickupConfirmed: boolean;
  pickupConfirmedAt: string | null;
  dropoffConfirmed: boolean;
  dropoffConfirmedAt: string | null;
  createdAt: string;
  offer: {
    id: string;
    flightNumber: string;
    airline: string;
    departureAirport: string;
    arrivalAirport: string;
    departureCity: string;
    arrivalCity: string;
    departureDate: string;
    userId: string;
    user: { id: string; name: string; rating: number; verified: boolean; avatarUrl: string | null; phone: string | null };
  };
  request: {
    id: string;
    departureCity: string;
    arrivalCity: string;
    itemDescription: string;
    neededWeight: number;
    userId: string;
    user: { id: string; name: string; rating: number; verified: boolean; avatarUrl: string | null; phone: string | null };
  };
  messages: {
    id: string;
    content: string;
    createdAt: string;
    sender: { id: string; name: string; avatarUrl: string | null };
  }[];
  reviews: { id: string; rating: number; fromUserId: string }[];
  transaction: { id: string; amount: number; status: string } | null;
}

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match?.messages]);

  async function loadMatch() {
    try {
      const res = await fetch(`/api/matches/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMatch(data.match);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: id, content: message }),
      });
      if (res.ok) {
        setMessage("");
        await loadMatch();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  async function handleAction(action: string) {
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) await loadMatch();
    } catch (err) {
      console.error(err);
    }
  }

  async function submitReview() {
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: id, rating, comment: reviewComment }),
      });
      if (res.ok) {
        setShowReview(false);
        await loadMatch();
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Match nicht gefunden</h2>
        <Link href="/dashboard">
          <Button variant="outline">Zum Dashboard</Button>
        </Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    proposed: "secondary",
    accepted: "default",
    in_transit: "warning",
    completed: "success",
    cancelled: "destructive",
    declined: "destructive",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zum Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge variant={(statusColors[match.status] || "secondary") as "default" | "secondary" | "destructive" | "success" | "warning"}>
              {match.status === "proposed" ? "Vorgeschlagen" :
               match.status === "accepted" ? "Akzeptiert" :
               match.status === "in_transit" ? "In Zustellung" :
               match.status === "completed" ? "Abgeschlossen" :
               match.status === "cancelled" ? "Storniert" : match.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xl font-bold">
            {match.offer.departureCity}
            <ArrowRight className="h-4 w-4" />
            {match.offer.arrivalCity}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {match.offer.flightNumber}
            </span>
          </div>
        </div>
        {match.agreedPrice && (
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(match.agreedPrice)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat & Actions - Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actions */}
          {match.status === "proposed" && (
            <Card className="border-primary/30">
              <CardContent className="pt-6">
                <p className="text-sm mb-4">Möchtest du dieses Match annehmen?</p>
                <div className="flex gap-2">
                  <Button onClick={() => handleAction("accept")} className="gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Annehmen
                  </Button>
                  <Button variant="outline" onClick={() => handleAction("decline")} className="gap-2">
                    <XCircle className="h-4 w-4" /> Ablehnen
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Handover Protocol */}
          {["accepted", "in_transit"].includes(match.status) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <QrCode className="h-5 w-5 text-primary" />
                  Übergabeprotokoll
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {match.handoverCode && (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Übergabe-Code</div>
                    <div className="text-3xl font-mono font-bold tracking-wider">
                      {match.handoverCode}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Zeige diesen Code bei der Übergabe
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-2">Abholung</div>
                    {match.pickupConfirmed ? (
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Bestätigt</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction("confirm_pickup")}
                      >
                        Abholung bestätigen
                      </Button>
                    )}
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <div className="text-sm text-muted-foreground mb-2">Abgabe</div>
                    {match.dropoffConfirmed ? (
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Bestätigt</span>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction("confirm_dropoff")}
                        disabled={!match.pickupConfirmed}
                      >
                        Abgabe bestätigen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review */}
          {match.status === "completed" && (
            <Card>
              <CardContent className="pt-6">
                {showReview ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Bewertung abgeben</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setRating(v)}
                          className="p-1"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              v <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <Input
                      placeholder="Kommentar (optional)"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={submitReview}>Bewertung absenden</Button>
                      <Button variant="ghost" onClick={() => setShowReview(false)}>
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold mb-2">Deal abgeschlossen!</h3>
                    {match.reviews.length === 0 ? (
                      <Button onClick={() => setShowReview(true)} className="gap-2">
                        <Star className="h-4 w-4" /> Bewertung abgeben
                      </Button>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Bewertung abgegeben. Danke!
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nachrichten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto space-y-3 mb-4 p-2">
                {match.messages.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Noch keine Nachrichten. Schreibe die erste!
                  </div>
                ) : (
                  match.messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2">
                      <Avatar name={msg.sender.name} src={msg.sender.avatarUrl} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium">{msg.sender.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm bg-muted rounded-lg px-3 py-2 inline-block">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {!["completed", "cancelled", "declined"].includes(match.status) && (
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nachricht schreiben..."
                    disabled={sending}
                  />
                  <Button type="submit" size="icon" disabled={sending || !message.trim()}>
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Carrier */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Carrier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar name={match.offer.user.name} src={match.offer.user.avatarUrl} />
                <div>
                  <div className="font-semibold">{match.offer.user.name}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {match.offer.user.verified && <Shield className="h-3 w-3 text-green-500" />}
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {match.offer.user.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sender */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Sender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar name={match.request.user.name} src={match.request.user.avatarUrl} />
                <div>
                  <div className="font-semibold">{match.request.user.name}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    {match.request.user.verified && <Shield className="h-3 w-3 text-green-500" />}
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {match.request.user.rating.toFixed(1)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flight Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Plane className="h-4 w-4" /> Flug
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div><span className="text-muted-foreground">Flug:</span> {match.offer.flightNumber}</div>
              <div><span className="text-muted-foreground">Route:</span> {match.offer.departureAirport} → {match.offer.arrivalAirport}</div>
              <div><span className="text-muted-foreground">Datum:</span> {formatDateTime(match.offer.departureDate)}</div>
            </CardContent>
          </Card>

          {/* Shipment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" /> Sendung
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{match.request.itemDescription}</p>
            </CardContent>
          </Card>

          {/* Cancel */}
          {["proposed", "accepted"].includes(match.status) && (
            <Button
              variant="outline"
              className="w-full text-destructive"
              onClick={() => handleAction("cancel")}
            >
              Match stornieren
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
