"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
import {
  Plane,
  ArrowRight,
  Star,
  Shield,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

interface ScoredMatch {
  offer: {
    id: string;
    flightNumber: string;
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
    user: {
      id: string;
      name: string;
      rating: number;
      totalDeals: number;
      verified: boolean;
      avatarUrl: string | null;
    };
  };
  score: number;
}

interface MatchSuggestionsProps {
  requestId: string;
}

export function MatchSuggestions({ requestId }: MatchSuggestionsProps) {
  const [matches, setMatches] = useState<ScoredMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/matches?requestId=${requestId}`);
        if (res.ok) {
          const data = await res.json();
          setMatches(data.matches || []);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [requestId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Suche passende Angebote...</p>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Passende Angebote gefunden
          <Badge variant="default" className="ml-auto">{matches.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.slice(0, 5).map(({ offer, score }) => (
          <Link key={offer.id} href={`/offers/${offer.id}`}>
            <div className="p-3 rounded-lg border hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar name={offer.user.name} src={offer.user.avatarUrl} size="sm" />
                  <div>
                    <div className="text-sm font-medium">{offer.user.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {offer.user.verified && <Shield className="h-3 w-3 text-green-500" />}
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {offer.user.rating.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className={`h-3.5 w-3.5 ${score >= 80 ? "text-green-500" : score >= 60 ? "text-amber-500" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {score}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Plane className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-semibold">{offer.departureAirport}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-semibold">{offer.arrivalAirport}</span>
                  <span className="text-muted-foreground text-xs">
                    {offer.flightNumber}
                  </span>
                </div>
                <div className="text-sm font-bold text-primary">
                  {offer.flatPrice
                    ? formatCurrency(offer.flatPrice)
                    : offer.pricePerKg
                    ? `${formatCurrency(offer.pricePerKg)}/kg`
                    : "VB"}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{formatDateTime(offer.departureDate)}</span>
                <span>{formatWeight(offer.availableWeight)}</span>
                <span>Größe {offer.sizeCategory}</span>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
