"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Settings,
  Edit2,
  Save,
  X,
  Phone,
  TrendingUp,
  Award,
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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhone, setEditPhone] = useState("");

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
        if (data?.user) {
          setUser(data.user);
          setEditName(data.user.name);
          setEditBio(data.user.bio || "");
          setEditPhone(data.user.phone || "");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, bio: editBio, phone: editPhone }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditing(false);
      }
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Trust level based on rating and deals
  const trustLevel =
    user.totalDeals >= 10 && user.rating >= 4.5 ? "gold" :
    user.totalDeals >= 5 && user.rating >= 4.0 ? "silber" :
    user.totalDeals >= 1 ? "bronze" : "neu";

  const trustConfig = {
    gold: { label: "Gold Carrier", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
    silber: { label: "Silber Carrier", color: "text-gray-400", bg: "bg-gray-50 dark:bg-gray-950/30" },
    bronze: { label: "Bronze Carrier", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30" },
    neu: { label: "Neues Mitglied", color: "text-primary", bg: "bg-primary/5" },
  };

  const trust = trustConfig[trustLevel];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mein Profil</h1>
        <Link href="/settings">
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" /> Einstellungen
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <Avatar name={user.name} src={user.avatarUrl} size="lg" />
              <div>
                {editing ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-lg font-bold mb-1"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {user.verified ? (
                    <Badge variant="success" className="gap-1">
                      <Shield className="h-3 w-3" /> Verifiziert
                    </Badge>
                  ) : (
                    <Badge variant="warning">Nicht verifiziert</Badge>
                  )}
                  <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${trust.bg} ${trust.color}`}>
                    <Award className="h-3 w-3" />
                    {trust.label}
                  </div>
                </div>
              </div>
            </div>
            {!editing ? (
              <Button variant="ghost" size="icon" onClick={() => setEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditing(false)} disabled={saving}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="icon" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
              <Star className="h-5 w-5 mx-auto mb-1 fill-amber-400 text-amber-400" />
              <div className="text-xl font-bold">{user.rating.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Bewertung</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
              <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{user.totalDeals}</div>
              <div className="text-xs text-muted-foreground">Deals</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
              <div className="text-xl font-bold">100%</div>
              <div className="text-xs text-muted-foreground">Erfolgsrate</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-lg sm:text-xl font-bold">
                {new Date(user.createdAt).toLocaleDateString("de-DE", { month: "short", year: "numeric" })}
              </div>
              <div className="text-xs text-muted-foreground">Mitglied seit</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            {editing ? (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Telefonnummer"
                    className="flex-1"
                  />
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0 mt-2" />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Über mich..."
                    className="flex-1 min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    maxLength={300}
                  />
                </div>
              </>
            ) : (
              <>
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className={!user.bio ? "text-muted-foreground italic" : ""}>
                    {user.bio || "Noch keine Bio"}
                  </span>
                </div>
              </>
            )}
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
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Telefonnummer</div>
                <div className="text-xs text-muted-foreground">
                  {user.phone ? "Hinterlegt" : "Noch nicht hinterlegt"}
                </div>
              </div>
            </div>
            {user.phone ? (
              <Badge variant="success">Erledigt</Badge>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                Hinzufügen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
