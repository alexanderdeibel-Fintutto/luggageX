"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime, formatWeight } from "@/lib/utils";
import {
  Bookmark,
  ArrowRight,
  Star,
  Shield,
  Loader2,
  Trash2,
} from "lucide-react";

interface BookmarkItem {
  id: string;
  createdAt: string;
  offer: {
    id: string;
    departureAirport: string;
    arrivalAirport: string;
    departureCity: string;
    arrivalCity: string;
    departureDate: string;
    availableWeight: number;
    flatPrice: number | null;
    pricePerKg: number | null;
    status: string;
    user: { name: string; rating: number; verified: boolean };
  };
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => (r.ok ? r.json() : { bookmarks: [] }))
      .then((data) => setBookmarks(data.bookmarks || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function removeBookmark(offerId: string) {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerId }),
    });
    if (res.ok) {
      setBookmarks((prev) => prev.filter((b) => b.offer.id !== offerId));
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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Gemerkte Angebote</h1>
          <p className="text-muted-foreground">
            {bookmarks.length} gespeichert{bookmarks.length !== 1 ? "e" : "s"} Angebot{bookmarks.length !== 1 ? "e" : ""}
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Noch keine gespeicherten Angebote</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Klicke auf &quot;Merken&quot; bei einem Angebot, um es hier zu speichern.
            </p>
            <Link href="/search">
              <Button className="gap-2">Angebote durchsuchen</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bm) => (
            <Card key={bm.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <Link href={`/offers/${bm.offer.id}`} className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 font-bold text-lg">
                          {bm.offer.departureAirport}
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          {bm.offer.arrivalAirport}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(bm.offer.departureDate)} | {formatWeight(bm.offer.availableWeight)}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-bold text-primary">
                            {bm.offer.flatPrice
                              ? formatCurrency(bm.offer.flatPrice)
                              : bm.offer.pricePerKg
                              ? `${formatCurrency(bm.offer.pricePerKg)}/kg`
                              : "VB"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            von {bm.offer.user.name}
                          </span>
                          {bm.offer.user.verified && (
                            <Shield className="h-3 w-3 text-green-500" />
                          )}
                          {bm.offer.user.rating > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {bm.offer.user.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge variant={bm.offer.status === "active" ? "success" : "secondary"}>
                      {bm.offer.status === "active" ? "Aktiv" : "Inaktiv"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(bm.offer.id)}
                      title="Entfernen"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
