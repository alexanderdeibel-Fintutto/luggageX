"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
import { SIZE_CATEGORIES, ITEM_CATEGORIES } from "@/lib/airports";
import {
  Plane,
  ArrowRight,
  MapPin,
  Star,
  Shield,
  Package,
  Euro,
  Clock,
  Loader2,
  ArrowLeft,
  Send,
  CheckCircle2,
  User,
  Bookmark,
  Share2,
  Flag,
} from "lucide-react";
import { ReportDialog } from "@/components/report-dialog";
import { RouteVisual } from "@/components/route-visual";
import { DepartureCountdown } from "@/components/departure-countdown";

interface SimilarOffer {
  id: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  availableWeight: number;
  flatPrice: number | null;
  pricePerKg: number | null;
  user: { name: string; rating: number };
}

interface OfferDetail {
  id: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  arrivalDate: string;
  availableWeight: number;
  maxSingleItem: number | null;
  sizeCategory: string;
  description: string | null;
  pricePerKg: number | null;
  flatPrice: number | null;
  negotiable: boolean;
  pickupType: string;
  pickupAddress: string | null;
  dropoffType: string;
  dropoffAddress: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    rating: number;
    totalDeals: number;
    verified: boolean;
    avatarUrl: string | null;
    bio: string | null;
  };
}

const HANDOVER_LABELS: Record<string, string> = {
  airport: "Am Flughafen",
  address: "An einer Adresse",
  meetingPoint: "Treffpunkt",
};

export default function OfferDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [similarOffers, setSimilarOffers] = useState<SimilarOffer[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareText, setShareText] = useState("");
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetch(`/api/offers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOffer(data.offer);
        // Fetch similar offers on the same route
        if (data.offer) {
          fetch(`/api/offers?from=${data.offer.departureAirport}&to=${data.offer.arrivalAirport}`)
            .then((r) => r.json())
            .then((d) => {
              const others = (d.offers || []).filter((o: SimilarOffer) => o.id !== id).slice(0, 3);
              setSimilarOffers(others);
            })
            .catch(() => {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleBookmark() {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerId: id }),
    });
    if (res.ok) {
      const data = await res.json();
      setBookmarked(data.bookmarked);
    }
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `LuggageX Angebot`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      setShareText("Link kopiert!");
      setTimeout(() => setShareText(""), 2000);
    }
  }

  async function handleContactCarrier() {
    // Check if logged in first
    const res = await fetch("/api/auth/me");
    if (!res.ok) {
      router.push(`/login?redirect=/offers/${id}`);
      return;
    }
    setShowRequestForm(true);
  }

  async function handleSubmitRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!offer) return;
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    // Step 1: Create a request
    const requestData = {
      departureCity: offer.departureCity,
      arrivalCity: offer.arrivalCity,
      departureAirport: offer.departureAirport,
      arrivalAirport: offer.arrivalAirport,
      earliestDate: offer.departureDate.split("T")[0],
      latestDate: offer.departureDate.split("T")[0],
      neededWeight: Number(formData.get("neededWeight")),
      sizeCategory: formData.get("sizeCategory") as string,
      itemDescription: formData.get("itemDescription") as string,
      itemCategory: formData.get("itemCategory") as string,
      maxBudget: Number(formData.get("maxBudget")) || undefined,
      requestType: "shipment",
      pickupPreference: "flexible",
      dropoffPreference: "flexible",
    };

    try {
      const reqRes = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const reqResult = await reqRes.json();
      if (!reqRes.ok) {
        setError(reqResult.error || "Fehler beim Erstellen");
        return;
      }

      // Step 2: Create a match
      const matchRes = await fetch("/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.id,
          requestId: reqResult.request.id,
        }),
      });
      const matchResult = await matchRes.json();
      if (!matchRes.ok) {
        setError(matchResult.error || "Fehler beim Erstellen des Matches");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/matches/${matchResult.match.id}`);
      }, 1500);
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Angebot nicht gefunden</h2>
        <Link href="/search">
          <Button variant="outline">Zurück zur Suche</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Suche
      </Link>

      {/* Route Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge variant={offer.status === "active" ? "success" : "secondary"}>
            {offer.status === "active" ? "Aktiv" : offer.status === "paused" ? "Pausiert" : offer.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {offer.airline}
          </span>
          <DepartureCountdown departureDate={offer.departureDate} />
        </div>
        <RouteVisual
          departureCity={offer.departureCity}
          arrivalCity={offer.arrivalCity}
          departureAirport={offer.departureAirport}
          arrivalAirport={offer.arrivalAirport}
          departureDate={offer.departureDate}
          arrivalDate={offer.arrivalDate}
          flightNumber={offer.flightNumber}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Flight Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Flugdetails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Abflug</div>
                  <div className="font-semibold">{formatDateTime(offer.departureDate)}</div>
                  <div className="text-sm">{offer.departureAirport} - {offer.departureCity}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Ankunft</div>
                  <div className="font-semibold">{formatDateTime(offer.arrivalDate)}</div>
                  <div className="text-sm">{offer.arrivalAirport} - {offer.arrivalCity}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Luggage Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" />
                Gepäck-Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Verfügbar</div>
                  <div className="text-xl font-bold">{formatWeight(offer.availableWeight)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Max. Größe</div>
                  <div className="text-xl font-bold">{offer.sizeCategory}</div>
                </div>
                {offer.maxSingleItem && (
                  <div>
                    <div className="text-sm text-muted-foreground">Max. Einzelstück</div>
                    <div className="text-xl font-bold">{formatWeight(offer.maxSingleItem)}</div>
                  </div>
                )}
              </div>
              {offer.description && (
                <p className="text-sm text-muted-foreground pt-3 border-t">
                  {offer.description}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Handover */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Übergabe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Abholung</div>
                  <div className="font-semibold">{HANDOVER_LABELS[offer.pickupType]}</div>
                  {offer.pickupAddress && (
                    <div className="text-sm text-muted-foreground">{offer.pickupAddress}</div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Abgabe</div>
                  <div className="font-semibold">{HANDOVER_LABELS[offer.dropoffType]}</div>
                  {offer.dropoffAddress && (
                    <div className="text-sm text-muted-foreground">{offer.dropoffAddress}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Form (inline) */}
          {showRequestForm && !success && (
            <Card className="border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Send className="h-5 w-5 text-primary" />
                  Anfrage an {offer.user.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="neededWeight">Benötigtes Gewicht (kg)</Label>
                      <Input
                        id="neededWeight"
                        name="neededWeight"
                        type="number"
                        step="0.5"
                        max={offer.availableWeight}
                        placeholder={`max. ${offer.availableWeight}`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sizeCategory">Größe</Label>
                      <Select id="sizeCategory" name="sizeCategory" defaultValue="M">
                        {SIZE_CATEGORIES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemCategory">Kategorie</Label>
                    <Select id="itemCategory" name="itemCategory" defaultValue="general">
                      {ITEM_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemDescription">Was möchtest du transportieren?</Label>
                    <Textarea
                      id="itemDescription"
                      name="itemDescription"
                      placeholder="Beschreibe genau, was du versenden möchtest..."
                      required
                      minLength={5}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBudget">Dein Budget (EUR, optional)</Label>
                    <Input
                      id="maxBudget"
                      name="maxBudget"
                      type="number"
                      placeholder={
                        offer.flatPrice
                          ? `Vorgeschlagen: ${offer.flatPrice}`
                          : offer.pricePerKg
                          ? `z.B. ${offer.pricePerKg * 5} für 5kg`
                          : "Dein Angebot"
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="gap-2" disabled={submitting}>
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Send className="h-4 w-4" />
                      Anfrage senden
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setShowRequestForm(false)}>
                      Abbrechen
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card className="border-2 border-green-500/30">
              <CardContent className="py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">Anfrage gesendet!</h3>
                <p className="text-sm text-muted-foreground">
                  Du wirst gleich zum Chat weitergeleitet...
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price */}
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-6 text-center">
              <Euro className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary">
                {offer.flatPrice
                  ? formatCurrency(offer.flatPrice)
                  : offer.pricePerKg
                  ? `${formatCurrency(offer.pricePerKg)}/kg`
                  : "Verhandelbar"}
              </div>
              {offer.negotiable && (
                <Badge variant="secondary" className="mt-2">Verhandlungsbasis</Badge>
              )}
              {!showRequestForm && !success && offer.status === "active" && (
                <Button className="w-full mt-4 gap-2" size="lg" onClick={handleContactCarrier}>
                  <Send className="h-4 w-4" />
                  Anfrage senden
                </Button>
              )}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 gap-1.5 ${bookmarked ? "text-primary border-primary" : ""}`}
                  onClick={toggleBookmark}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-primary" : ""}`} />
                  {bookmarked ? "Gespeichert" : "Merken"}
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleShare}>
                  <Share2 className="h-3.5 w-3.5" />
                  {shareText || "Teilen"}
                </Button>
              </div>
              <button
                onClick={() => setShowReport(true)}
                className="text-xs text-muted-foreground hover:text-destructive mt-3 flex items-center gap-1 mx-auto transition-colors"
              >
                <Flag className="h-3 w-3" /> Angebot melden
              </button>
            </CardContent>
          </Card>

          {showReport && (
            <ReportDialog type="offer" targetId={id} onClose={() => setShowReport(false)} />
          )}

          {/* Carrier Profile */}
          <Card>
            <CardContent className="pt-6">
              <Link href={`/users/${offer.user.id}`} className="block">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={offer.user.name} src={offer.user.avatarUrl} size="lg" />
                  <div>
                    <div className="font-semibold hover:text-primary transition-colors">{offer.user.name}</div>
                    {offer.user.verified && (
                      <Badge variant="success" className="text-xs gap-1">
                        <Shield className="h-3 w-3" /> Verifiziert
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
              <div className="space-y-2 text-sm">
                {offer.user.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{offer.user.rating.toFixed(1)} Bewertung</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{offer.user.totalDeals} abgeschlossene Deals</span>
                </div>
              </div>
              {offer.user.bio && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                  {offer.user.bio}
                </p>
              )}
              <Link href={`/users/${offer.user.id}`}>
                <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                  <User className="h-3.5 w-3.5" />
                  Profil ansehen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Similar Offers */}
      {similarOffers.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Ähnliche Angebote auf dieser Route</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similarOffers.map((sim) => (
              <Link key={sim.id} href={`/offers/${sim.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 font-bold mb-2">
                      {sim.departureAirport}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                      {sim.arrivalAirport}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {formatDateTime(sim.departureDate)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{formatWeight(sim.availableWeight)}</span>
                      <span className="font-bold text-primary">
                        {sim.flatPrice
                          ? formatCurrency(sim.flatPrice)
                          : sim.pricePerKg
                          ? `${formatCurrency(sim.pricePerKg)}/kg`
                          : "VB"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      {sim.user.rating > 0 && (
                        <>
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>{sim.user.rating.toFixed(1)}</span>
                          <span className="mx-1">|</span>
                        </>
                      )}
                      <span>{sim.user.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
