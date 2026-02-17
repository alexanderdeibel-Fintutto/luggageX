"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { PaymentFlow } from "@/components/payment-flow";
import { QrHandover } from "@/components/qr-handover";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
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
  CreditCard,
  Weight,
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
    availableWeight: number;
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
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [showPriceProposal, setShowPriceProposal] = useState(false);
  const [proposedPrice, setProposedPrice] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMatch();
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-refresh chat every 10s for active matches
  useEffect(() => {
    if (!match || ["completed", "cancelled", "declined"].includes(match.status)) return;
    const interval = setInterval(() => {
      fetch(`/api/matches/${id}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data?.match) setMatch(data.match); })
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [match?.status, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [match?.messages?.length]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (match) {
      fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: id }),
      }).catch(() => {});
    }
  }, [match, id]);

  async function loadUser() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.user.id);
      }
    } catch {
      // silent
    }
  }

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

  async function proposePrice() {
    const price = parseFloat(proposedPrice);
    if (!price || price <= 0) return;
    try {
      const res = await fetch(`/api/matches/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "propose_price", price }),
      });
      if (res.ok) {
        setProposedPrice("");
        setShowPriceProposal(false);
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
    paid: "default",
    in_transit: "warning",
    completed: "success",
    cancelled: "destructive",
    declined: "destructive",
  };

  const statusLabels: Record<string, string> = {
    proposed: "Vorgeschlagen",
    accepted: "Akzeptiert",
    paid: "Bezahlt",
    in_transit: "In Zustellung",
    completed: "Abgeschlossen",
    cancelled: "Storniert",
    declined: "Abgelehnt",
  };

  const isSender = match.request.userId === currentUserId;
  const isCarrier = match.offer.userId === currentUserId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zum Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge variant={(statusColors[match.status] || "secondary") as "default" | "secondary" | "destructive" | "success" | "warning"}>
              {statusLabels[match.status] || match.status}
            </Badge>
            {match.transaction && (
              <Badge variant="success" className="gap-1">
                <CreditCard className="h-3 w-3" /> Escrow
              </Badge>
            )}
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
        {match.agreedPrice != null && match.agreedPrice > 0 && (
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

          {/* Payment Flow - for accepted matches where sender hasn't paid */}
          {match.status === "accepted" && isSender && !match.transaction && (
            showPayment ? (
              <PaymentFlow
                matchId={match.id}
                amount={match.agreedPrice || 0}
                carrierName={match.offer.user.name}
                route={`${match.offer.departureAirport} → ${match.offer.arrivalAirport}`}
                onComplete={() => { setShowPayment(false); loadMatch(); }}
              />
            ) : (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">Escrow-Zahlung leisten</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Bezahle jetzt, um die Übergabe zu starten. Dein Geld ist sicher bis zur Bestätigung.
                      </p>
                      <Button onClick={() => setShowPayment(true)} className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        {formatCurrency(match.agreedPrice || 0)} bezahlen
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          )}

          {/* Carrier waiting for payment */}
          {match.status === "accepted" && isCarrier && !match.transaction && (
            <Card className="border-amber-300/30 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Warte auf Zahlung vom Sender...
                </div>
              </CardContent>
            </Card>
          )}

          {/* Handover Protocol */}
          {["paid", "in_transit"].includes(match.status) && (
            <QrHandover
              matchId={match.id}
              handoverCode={match.handoverCode}
              pickupConfirmed={match.pickupConfirmed}
              pickupConfirmedAt={match.pickupConfirmedAt}
              dropoffConfirmed={match.dropoffConfirmed}
              dropoffConfirmedAt={match.dropoffConfirmedAt}
              isCarrier={isCarrier}
              isSender={isSender}
              escrowAmount={match.transaction?.amount || null}
              onAction={(action) => handleAction(action)}
            />
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
                    <h3 className="font-semibold mb-1">Deal abgeschlossen!</h3>
                    {match.transaction && (
                      <p className="text-sm text-green-600 mb-2">
                        {formatCurrency(match.transaction.amount)} wurde freigegeben
                      </p>
                    )}
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
                  match.messages.map((msg) => {
                    const isMe = msg.sender.id === currentUserId;
                    return (
                      <div key={msg.id} className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                        <Avatar name={msg.sender.name} src={msg.sender.avatarUrl} size="sm" />
                        <div className={`flex-1 ${isMe ? "text-right" : ""}`}>
                          <div className={`flex items-center gap-2 mb-0.5 ${isMe ? "justify-end" : ""}`}>
                            <span className="text-sm font-medium">{msg.sender.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(msg.createdAt)}
                            </span>
                          </div>
                          <p className={`text-sm rounded-lg px-3 py-2 inline-block max-w-[80%] ${
                            isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {!["completed", "cancelled", "declined"].includes(match.status) && (
                <div className="space-y-2">
                  {/* Price Proposal */}
                  {showPriceProposal ? (
                    <div className="flex gap-2 items-center bg-muted/50 rounded-lg p-2">
                      <span className="text-sm text-muted-foreground shrink-0">EUR</span>
                      <Input
                        type="number"
                        step="0.50"
                        min="1"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(e.target.value)}
                        placeholder="Preis..."
                        className="h-8"
                      />
                      <Button size="sm" onClick={proposePrice} disabled={!proposedPrice}>
                        Senden
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowPriceProposal(false)}>
                        X
                      </Button>
                    </div>
                  ) : (
                    ["proposed", "accepted"].includes(match.status) && (
                      <button
                        onClick={() => setShowPriceProposal(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Preis vorschlagen
                      </button>
                    )
                  )}
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
                </div>
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
              <div><span className="text-muted-foreground">Kapazität:</span> {formatWeight(match.offer.availableWeight)}</div>
            </CardContent>
          </Card>

          {/* Shipment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" /> Sendung
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>{match.request.itemDescription}</p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Weight className="h-3.5 w-3.5" />
                {formatWeight(match.request.neededWeight)}
              </div>
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
