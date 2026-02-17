"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Star,
  Shield,
  Package,
  Calendar,
  Loader2,
  ArrowLeft,
  Plane,
  Award,
  Quote,
  ArrowRight,
  Flag,
} from "lucide-react";
import { ReportDialog } from "@/components/report-dialog";

interface PublicUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  verified: boolean;
  rating: number;
  totalDeals: number;
  createdAt: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  fromUser: { id: string; name: string; avatarUrl: string | null };
  route: string;
}

interface UserStats {
  activeOffers: number;
  completedAsCarrier: number;
  completedAsSender: number;
}

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setUser(data.user);
          setReviews(data.reviews || []);
          setStats(data.stats);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Nutzer nicht gefunden</h2>
        <Link href="/search">
          <Button variant="outline">Zur Suche</Button>
        </Link>
      </div>
    );
  }

  const trustLevel =
    user.totalDeals >= 10 && user.rating >= 4.5 ? "gold" :
    user.totalDeals >= 5 && user.rating >= 4.0 ? "silber" :
    user.totalDeals >= 1 ? "bronze" : "neu";

  const trustConfig: Record<string, { label: string; color: string; bg: string }> = {
    gold: { label: "Gold Carrier", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
    silber: { label: "Silber Carrier", color: "text-gray-400", bg: "bg-gray-50 dark:bg-gray-950/30" },
    bronze: { label: "Bronze Carrier", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
    neu: { label: "Neues Mitglied", color: "text-primary", bg: "bg-primary/5" },
  };

  const trust = trustConfig[trustLevel];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück
      </Link>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 sm:gap-6 mb-6">
            <Avatar name={user.name} src={user.avatarUrl} size="lg" />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {user.verified && (
                  <Badge variant="success" className="gap-1">
                    <Shield className="h-3 w-3" /> Verifiziert
                  </Badge>
                )}
                <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${trust.bg} ${trust.color}`}>
                  <Award className="h-3 w-3" />
                  {trust.label}
                </div>
              </div>
              {user.bio && (
                <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-muted rounded-lg">
              <Star className="h-5 w-5 mx-auto mb-1 fill-amber-400 text-amber-400" />
              <div className="text-xl font-bold">{user.rating.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Bewertung</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{user.totalDeals}</div>
              <div className="text-xs text-muted-foreground">Deals</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Plane className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{stats?.completedAsCarrier || 0}</div>
              <div className="text-xs text-muted-foreground">Als Carrier</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg font-bold">
                {new Date(user.createdAt).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
              </div>
              <div className="text-xs text-muted-foreground">Mitglied seit</div>
            </div>
          </div>
          <button
            onClick={() => setShowReport(true)}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors mt-2"
          >
            <Flag className="h-3 w-3" /> Nutzer melden
          </button>
        </CardContent>
      </Card>

      {showReport && (
        <ReportDialog type="user" targetId={id} onClose={() => setShowReport(false)} />
      )}

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            Bewertungen ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Noch keine Bewertungen vorhanden.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar name={review.fromUser.name} src={review.fromUser.avatarUrl} size="sm" />
                      <div>
                        <div className="text-sm font-medium">{review.fromUser.name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Plane className="h-3 w-3" />
                          {review.route}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <Star
                          key={v}
                          className={`h-3.5 w-3.5 ${
                            v <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <div className="flex items-start gap-2 mt-2">
                      <Quote className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(review.createdAt).toLocaleDateString("de-DE", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
