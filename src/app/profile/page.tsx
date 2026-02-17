"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  User,
  Star,
  Shield,
  Package,
  Mail,
  Calendar,
  Loader2,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  verified: boolean;
  rating: number;
  totalDeals: number;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Mein Profil</h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 mb-6">
            <Avatar name={user.name} src={user.avatarUrl} size="lg" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {user.verified ? (
                  <Badge variant="success" className="gap-1">
                    <Shield className="h-3 w-3" /> Verifiziert
                  </Badge>
                ) : (
                  <Badge variant="warning">Nicht verifiziert</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Star className="h-5 w-5 mx-auto mb-1 fill-amber-400 text-amber-400" />
              <div className="text-xl font-bold">{user.rating.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Bewertung</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{user.totalDeals}</div>
              <div className="text-xs text-muted-foreground">Deals</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-xl font-bold">
                {new Date(user.createdAt).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
              </div>
              <div className="text-xs text-muted-foreground">Mitglied seit</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{user.bio || "Noch keine Bio"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Vertrauen & Sicherheit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">E-Mail verifiziert</div>
                <div className="text-xs text-muted-foreground">Deine E-Mail-Adresse ist bestätigt</div>
              </div>
            </div>
            <Badge variant="success">Erledigt</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Identität verifizieren</div>
                <div className="text-xs text-muted-foreground">Ausweis hochladen für mehr Vertrauen</div>
              </div>
            </div>
            {user.verified ? (
              <Badge variant="success">Verifiziert</Badge>
            ) : (
              <Button size="sm" variant="outline">Verifizieren</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
