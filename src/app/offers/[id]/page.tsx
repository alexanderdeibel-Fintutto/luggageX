"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
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
} from "lucide-react";

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
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/offers/${id}`)
      .then((r) => r.json())
      .then((data) => setOffer(data.offer))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
        <div className="flex items-center gap-3 mb-2">
          <Badge variant={offer.status === "active" ? "success" : "secondary"}>
            {offer.status === "active" ? "Aktiv" : offer.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {offer.flightNumber} | {offer.airline}
          </span>
        </div>
        <div className="flex items-center gap-4 text-3xl font-bold">
          <span>{offer.departureCity}</span>
          <div className="flex flex-col items-center">
            <Plane className="h-6 w-6 text-primary" />
            <div className="text-xs font-normal text-muted-foreground mt-1">
              {offer.departureAirport} <ArrowRight className="h-3 w-3 inline" /> {offer.arrivalAirport}
            </div>
          </div>
          <span>{offer.arrivalCity}</span>
        </div>
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
              <Button className="w-full mt-4 gap-2" size="lg">
                Anfrage senden
              </Button>
            </CardContent>
          </Card>

          {/* Carrier Profile */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={offer.user.name} src={offer.user.avatarUrl} size="lg" />
                <div>
                  <div className="font-semibold">{offer.user.name}</div>
                  {offer.user.verified && (
                    <Badge variant="success" className="text-xs gap-1">
                      <Shield className="h-3 w-3" /> Verifiziert
                    </Badge>
                  )}
                </div>
              </div>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
