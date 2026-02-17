"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  Globe,
  Loader2,
  Save,
  CheckCircle2,
  Mail,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { useI18n, Locale } from "@/lib/i18n";

interface UserSettings {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  verified: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { locale, setLocale, t } = useI18n();
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"profile" | "notifications" | "security" | "language">("profile");

  // Profile form
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  // Notification preferences (persisted to localStorage)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [matchNotifs, setMatchNotifs] = useState(true);
  const [messageNotifs, setMessageNotifs] = useState(true);
  const [marketingNotifs, setMarketingNotifs] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Security
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwChanging, setPwChanging] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) { router.push("/login"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setName(data.user.name);
          setBio(data.user.bio || "");
          setPhone(data.user.phone || "");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));

    // Load notification preferences
    try {
      const notifPrefs = JSON.parse(localStorage.getItem("luggagex-notif-prefs") || "{}");
      if (notifPrefs.email !== undefined) setEmailNotifs(notifPrefs.email);
      if (notifPrefs.match !== undefined) setMatchNotifs(notifPrefs.match);
      if (notifPrefs.message !== undefined) setMessageNotifs(notifPrefs.message);
      if (notifPrefs.marketing !== undefined) setMarketingNotifs(notifPrefs.marketing);
    } catch {}
  }, [router]);

  function saveNotifPrefs() {
    localStorage.setItem("luggagex-notif-prefs", JSON.stringify({
      email: emailNotifs,
      match: matchNotifs,
      message: messageNotifs,
      marketing: marketingNotifs,
    }));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 3000);
  }

  async function changePassword() {
    if (newPassword !== confirmNewPassword) {
      setPwError("Passwörter stimmen nicht überein");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Passwort muss mindestens 8 Zeichen haben");
      return;
    }
    setPwChanging(true);
    setPwError("");
    setPwSuccess(false);

    try {
      const res = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.error || "Fehler beim Ändern");
        return;
      }
      setPwSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPwSuccess(false), 3000);
    } catch {
      setPwError("Netzwerkfehler");
    } finally {
      setPwChanging(false);
    }
  }

  async function saveProfile() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Fehler beim Speichern");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Netzwerkfehler");
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

  const tabs = [
    { id: "profile" as const, label: "Profil", icon: User },
    { id: "notifications" as const, label: "Benachrichtigungen", icon: Bell },
    { id: "security" as const, label: "Sicherheit", icon: Shield },
    { id: "language" as const, label: "Sprache", icon: Globe },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Einstellungen</h1>
      <p className="text-muted-foreground mb-8">Verwalte dein Konto und deine Präferenzen</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  tab === t.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Settings */}
          {tab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profil bearbeiten</CardTitle>
                <CardDescription>Deine öffentlichen Profilinformationen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{error}</div>
                )}
                {saved && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-sm p-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Änderungen gespeichert
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} minLength={2} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" value={user.email} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">E-Mail kann nicht geändert werden</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" /> Telefon
                  </Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 123 456789" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Über mich</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Erzähle etwas über dich..."
                    maxLength={300}
                  />
                  <p className="text-xs text-muted-foreground">{bio.length}/300 Zeichen</p>
                </div>

                <Button onClick={saveProfile} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Speichern
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {tab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungen</CardTitle>
                <CardDescription>Wähle, worüber du informiert werden möchtest</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "E-Mail Benachrichtigungen", desc: "Erhalte Updates per E-Mail", value: emailNotifs, set: setEmailNotifs, icon: Mail },
                  { label: "Match-Benachrichtigungen", desc: "Wenn ein neues Match gefunden wird", value: matchNotifs, set: setMatchNotifs, icon: User },
                  { label: "Nachrichten", desc: "Wenn du eine neue Nachricht erhältst", value: messageNotifs, set: setMessageNotifs, icon: Bell },
                  { label: "Marketing", desc: "Angebote, Tipps und Neuigkeiten", value: marketingNotifs, set: setMarketingNotifs, icon: Globe },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => item.set(!item.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        item.value ? "bg-primary" : "bg-input"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          item.value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}

                {notifSaved && (
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-sm p-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Einstellungen gespeichert
                  </div>
                )}

                <Button className="gap-2" onClick={saveNotifPrefs}>
                  <Save className="h-4 w-4" /> {t("common.save")}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {tab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Passwort ändern</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pwError && (
                    <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">{pwError}</div>
                  )}
                  {pwSuccess && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-sm p-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Passwort erfolgreich geändert
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Aktuelles Passwort</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Aktuelles Passwort"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Neues Passwort</Label>
                    <Input
                      type="password"
                      placeholder="Mind. 8 Zeichen"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Neues Passwort bestätigen</Label>
                    <Input
                      type="password"
                      placeholder="Passwort wiederholen"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="gap-2"
                    onClick={changePassword}
                    disabled={pwChanging || !currentPassword || !newPassword}
                  >
                    {pwChanging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    Passwort ändern
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verifizierung</CardTitle>
                  <CardDescription>Verifiziere deine Identität für mehr Vertrauen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">E-Mail</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <Badge variant="success">Verifiziert</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Identität (Ausweis)</div>
                        <div className="text-xs text-muted-foreground">Für erhöhtes Vertrauen</div>
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
                          {user.phone || "Noch nicht hinterlegt"}
                        </div>
                      </div>
                    </div>
                    {user.phone ? (
                      <Badge variant="success">Hinterlegt</Badge>
                    ) : (
                      <Button size="sm" variant="outline">Hinzufügen</Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive">Gefahrenzone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Das Löschen deines Kontos ist unwiderruflich. Alle deine Daten werden gelöscht.
                  </p>
                  <Button variant="destructive" size="sm">Konto löschen</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Language Settings */}
          {tab === "language" && (
            <Card>
              <CardHeader>
                <CardTitle>Sprache & Region</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Sprache</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { id: "de" as Locale, label: "Deutsch", sub: "German" },
                      { id: "en" as Locale, label: "English", sub: "Englisch" },
                    ]).map((lang) => (
                      <button
                        key={lang.id}
                        className={`p-3 rounded-lg border-2 text-left transition-colors ${
                          locale === lang.id
                            ? "border-primary bg-primary/5"
                            : "border-input hover:border-primary/50"
                        }`}
                        onClick={() => setLocale(lang.id)}
                      >
                        <div className="font-medium text-sm">{lang.label}</div>
                        <div className="text-xs text-muted-foreground">{lang.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Währung</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { code: "EUR", symbol: "\u20AC", label: "Euro" },
                      { code: "USD", symbol: "$", label: "US Dollar" },
                      { code: "GBP", symbol: "\u00A3", label: "Brit. Pfund" },
                    ].map((c) => (
                      <button
                        key={c.code}
                        className={`p-3 rounded-lg border-2 text-center transition-colors ${
                          c.code === "EUR"
                            ? "border-primary bg-primary/5"
                            : "border-input hover:border-primary/50"
                        }`}
                      >
                        <div className="text-lg font-bold">{c.symbol}</div>
                        <div className="text-xs text-muted-foreground">{c.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  {locale === "de" ? "Sprache wird sofort geändert." : "Language changes instantly."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
