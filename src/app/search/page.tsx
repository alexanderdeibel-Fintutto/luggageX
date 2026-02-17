"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AirportSearch } from "@/components/airport-search";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
import {
  Search,
  Plane,
  Package,
  Star,
  Shield,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { TrendingRoutes } from "@/components/trending-routes";

interface Offer {
  id: string;
  flightNumber: string;
  airline: string;
  departureAirport: string;
  arrivalAirport: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  availableWeight: number;
  sizeCategory: string;
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
    avatarUrl: string | null;
  };
}

interface LuggageRequest {
  id: string;
  departureCity: string;
  arrivalCity: string;
  earliestDate: string;
  latestDate: string;
  neededWeight: number;
  sizeCategory: string;
  itemDescription: string;
  itemCategory: string;
  maxBudget: number | null;
  requestType: string;
  user: {
    id: string;
    name: string;
    rating: number;
    totalDeals: number;
    verified: boolean;
    avatarUrl: string | null;
  };
}

export default function SearchPage() {
  const [tab, setTab] = useState<"offers" | "requests">("offers");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [requests, setRequests] = useState<LuggageRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFrom = params.get("from") || "";
    const urlTo = params.get("to") || "";
    if (urlFrom) setFrom(urlFrom);
    if (urlTo) setTo(urlTo);
    if (urlFrom || urlTo) setShowFilters(true);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, initialized]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "offers") {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        if (date) params.set("date", date);
        if (minWeight) params.set("minWeight", minWeight);
        const res = await fetch(`/api/offers?${params}`);
        const data = await res.json();
        setOffers(data.offers || []);
      } else {
        const params = new URLSearchParams();
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const res = await fetch(`/api/requests?${params}`);
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadData();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Suchen & Finden</h1>
        <p className="text-muted-foreground mb-6">
          Durchsuche verfügbare Gepäck-Angebote und Gesuche
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "offers" ? "default" : "outline"}
            onClick={() => setTab("offers")}
            className="gap-2"
          >
            <Plane className="h-4 w-4" />
            Angebote
          </Button>
          <Button
            variant={tab === "requests" ? "default" : "outline"}
            onClick={() => setTab("requests")}
            className="gap-2"
          >
            <Package className="h-4 w-4" />
            Gesuche
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Von</Label>
                    <AirportSearch value={from} onChange={setFrom} placeholder="Abflug..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Nach</Label>
                    <AirportSearch value={to} onChange={setTo} placeholder="Ziel..." />
                  </div>
                  {tab === "offers" && (
                    <>
                      <div className="space-y-2">
                        <Label>Datum</Label>
                        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Min. Gewicht (kg)</Label>
                        <Input
                          type="number"
                          value={minWeight}
                          onChange={(e) => setMinWeight(e.target.value)}
                          placeholder="z.B. 5"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    <Search className="h-4 w-4" />
                    Suchen
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setFrom("");
                      setTo("");
                      setDate("");
                      setMinWeight("");
                    }}
                  >
                    Zurücksetzen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : tab === "offers" ? (
          <div className="space-y-4">
            {offers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Keine Angebote gefunden</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Aktuell gibt es keine passenden Gepäck-Angebote.
                  </p>
                  <Link href="/requests/new">
                    <Button variant="outline" className="gap-2">
                      <Package className="h-4 w-4" />
                      Gesuch erstellen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              offers.map((offer) => (
                <Link key={offer.id} href={`/offers/${offer.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar name={offer.user.name} src={offer.user.avatarUrl} />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">
                                {offer.departureAirport}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              <span className="font-bold text-lg">
                                {offer.arrivalAirport}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{offer.flightNumber}</span>
                              <span>|</span>
                              <span>{formatDateTime(offer.departureDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 sm:text-right">
                          <div>
                            <div className="font-semibold">
                              {formatWeight(offer.availableWeight)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Größe {offer.sizeCategory}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-primary text-lg">
                              {offer.flatPrice
                                ? formatCurrency(offer.flatPrice)
                                : offer.pricePerKg
                                ? `${formatCurrency(offer.pricePerKg)}/kg`
                                : "Verhandelbar"}
                            </div>
                            {offer.negotiable && (
                              <Badge variant="secondary" className="text-xs">VB</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                        <span className="text-sm font-medium">{offer.user.name}</span>
                        {offer.user.verified && (
                          <Badge variant="success" className="text-xs gap-1">
                            <Shield className="h-3 w-3" /> Verifiziert
                          </Badge>
                        )}
                        {offer.user.rating > 0 && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {offer.user.rating.toFixed(1)}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {offer.user.totalDeals} Deals
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Keine Gesuche gefunden</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Aktuell gibt es keine passenden Gepäck-Gesuche.
                  </p>
                  <Link href="/offers/new">
                    <Button variant="outline" className="gap-2">
                      <Plane className="h-4 w-4" />
                      Angebot erstellen
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              requests.map((req) => (
                <Card key={req.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar name={req.user.name} src={req.user.avatarUrl} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg">{req.departureCity}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="font-bold text-lg">{req.arrivalCity}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(req.earliestDate).toLocaleDateString("de-DE")} -{" "}
                            {new Date(req.latestDate).toLocaleDateString("de-DE")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-semibold">{formatWeight(req.neededWeight)}</div>
                          <Badge variant="secondary" className="text-xs">
                            {req.requestType === "shipment" ? "Versand" : "Extra-Gepäck"}
                          </Badge>
                        </div>
                        {req.maxBudget && (
                          <div className="font-bold text-primary text-lg">
                            bis {formatCurrency(req.maxBudget)}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 pt-3 border-t line-clamp-2">
                      {req.itemDescription}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Trending Routes */}
        <div className="mt-8">
          <TrendingRoutes />
        </div>
      </div>
    </div>
  );
}
