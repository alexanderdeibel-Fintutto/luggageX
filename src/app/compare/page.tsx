"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
import {
  ArrowLeft,
  Plane,
  ArrowRight,
  Loader2,
  X,
  Plus,
  Star,
  Package,
  Euro,
  Clock,
  MapPin,
  Shield,
} from "lucide-react";

interface CompareOffer {
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
  dropoffType: string;
  status: string;
  user: {
    id: string;
    name: string;
    rating: number;
    totalDeals: number;
    verified: boolean;
  };
}

const HANDOVER_LABELS: Record<string, string> = {
  airport: "Flughafen",
  address: "Adresse",
  meetingPoint: "Treffpunkt",
};

export default function ComparePage() {
  const [offerIds, setOfferIds] = useState<string[]>([]);
  const [offers, setOffers] = useState<CompareOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ids = params.get("ids")?.split(",").filter(Boolean) || [];
    setOfferIds(ids);

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id) =>
        fetch(`/api/offers/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.offer || null)
      )
    )
      .then((results) => setOffers(results.filter(Boolean)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function removeOffer(id: string) {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    const newIds = offerIds.filter((i) => i !== id);
    setOfferIds(newIds);
    const url = new URL(window.location.href);
    url.searchParams.set("ids", newIds.join(","));
    window.history.replaceState({}, "", url.toString());
  }

  function getEffectivePrice(offer: CompareOffer): number {
    return offer.flatPrice || (offer.pricePerKg ? offer.pricePerKg * 5 : 999);
  }

  function getBestValue(field: "price" | "weight" | "rating"): string | null {
    if (offers.length < 2) return null;
    if (field === "price") {
      const min = Math.min(...offers.map(getEffectivePrice));
      return offers.find((o) => getEffectivePrice(o) === min)?.id || null;
    }
    if (field === "weight") {
      const max = Math.max(...offers.map((o) => o.availableWeight));
      return offers.find((o) => o.availableWeight === max)?.id || null;
    }
    if (field === "rating") {
      const max = Math.max(...offers.map((o) => o.user.rating));
      return offers.find((o) => o.user.rating === max)?.id || null;
    }
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück zur Suche
      </Link>

      <h1 className="text-3xl font-bold mb-2">Angebote vergleichen</h1>
      <p className="text-muted-foreground mb-6">
        Vergleiche bis zu 3 Angebote nebeneinander
      </p>

      {offers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Keine Angebote zum Vergleich</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Füge Angebote über die Suche hinzu, um sie zu vergleichen.
            </p>
            <Link href="/search">
              <Button className="gap-2">
                <Plane className="h-4 w-4" /> Zur Suche
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-muted-foreground p-3 w-40" />
                {offers.map((offer) => (
                  <th key={offer.id} className="p-3 text-center">
                    <div className="relative">
                      <button
                        onClick={() => removeOffer(offer.id)}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <Link href={`/offers/${offer.id}`} className="hover:text-primary transition-colors">
                        <div className="font-bold text-lg">
                          {offer.departureAirport} <ArrowRight className="h-3.5 w-3.5 inline" /> {offer.arrivalAirport}
                        </div>
                        <div className="text-xs text-muted-foreground">{offer.flightNumber}</div>
                      </Link>
                    </div>
                  </th>
                ))}
                {offers.length < 3 && (
                  <th className="p-3 text-center">
                    <Link href="/search">
                      <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                        <Plus className="h-6 w-6 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Hinzufügen</span>
                      </div>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {/* Route */}
              <tr className="bg-muted/30">
                <td className="p-3 text-sm font-medium flex items-center gap-1.5">
                  <Plane className="h-3.5 w-3.5" /> Route
                </td>
                {offers.map((o) => (
                  <td key={o.id} className="p-3 text-center text-sm">
                    {o.departureCity} → {o.arrivalCity}
                  </td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
              {/* Date */}
              <tr>
                <td className="p-3 text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Abflug
                </td>
                {offers.map((o) => (
                  <td key={o.id} className="p-3 text-center text-sm">
                    {formatDateTime(o.departureDate)}
                  </td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
              {/* Price */}
              <tr className="bg-muted/30">
                <td className="p-3 text-sm font-medium flex items-center gap-1.5">
                  <Euro className="h-3.5 w-3.5" /> Preis
                </td>
                {offers.map((o) => (
                  <td key={o.id} className={`p-3 text-center text-sm font-bold ${getBestValue("price") === o.id ? "text-green-600" : ""}`}>
                    {o.flatPrice
                      ? formatCurrency(o.flatPrice)
                      : o.pricePerKg
                      ? `${formatCurrency(o.pricePerKg)}/kg`
                      : "VB"}
                    {o.negotiable && <Badge variant="secondary" className="ml-1 text-[10px]">VB</Badge>}
                    {getBestValue("price") === o.id && <div className="text-[10px] text-green-600 font-normal">Bester Preis</div>}
                  </td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
              {/* Weight */}
              <tr>
                <td className="p-3 text-sm font-medium flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Gewicht
                </td>
                {offers.map((o) => (
                  <td key={o.id} className={`p-3 text-center text-sm ${getBestValue("weight") === o.id ? "text-green-600 font-bold" : ""}`}>
                    {formatWeight(o.availableWeight)}
                    {getBestValue("weight") === o.id && <div className="text-[10px] text-green-600 font-normal">Meistes Gewicht</div>}
                  </td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
              {/* Size */}
              <tr className="bg-muted/30">
                <td className="p-3 text-sm font-medium flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" /> Größe
                </td>
                {offers.map((o) => (
                  <td key={o.id} className="p-3 text-center text-sm">{o.sizeCategory}</td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
              {/* Handover */}
              <tr>
                <td className="p-3 text-sm font-medium flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Übergabe
                </td>
                {offers.map((o) => (
                  <td key={o.id} className="p-3 text-center text-sm">
                    {HANDOVER_LABELS[o.pickupType] || o.pickupType} / {HANDOVER_LABELS[o.dropoffType] || o.dropoffType}
                  </td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
              {/* Carrier Rating */}
              <tr className="bg-muted/30">
                <td className="p-3 text-sm font-medium flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5" /> Carrier
                </td>
                {offers.map((o) => (
                  <td key={o.id} className={`p-3 text-center text-sm ${getBestValue("rating") === o.id ? "text-green-600 font-bold" : ""}`}>
                    <div>{o.user.name}</div>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {o.user.rating.toFixed(1)} | {o.user.totalDeals} Deals
                      {o.user.verified && <Shield className="h-3 w-3 text-green-500 ml-1" />}
                    </div>
                  </td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
              {/* Actions */}
              <tr>
                <td className="p-3" />
                {offers.map((o) => (
                  <td key={o.id} className="p-3 text-center">
                    <Link href={`/offers/${o.id}`}>
                      <Button size="sm" className="gap-1">
                        Zum Angebot
                      </Button>
                    </Link>
                  </td>
                ))}
                {offers.length < 3 && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
