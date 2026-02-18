"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle2,
  Upload,
  Loader2,
  FileText,
  Camera,
  AlertCircle,
  Star,
  Users,
  TrendingUp,
  Lock,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  verified: boolean;
}

const STEPS = [
  {
    id: 1,
    title: "Identität bestätigen",
    description: "Lade ein Foto deines Ausweises oder Reisepasses hoch.",
    icon: FileText,
  },
  {
    id: 2,
    title: "Selfie aufnehmen",
    description: "Mache ein Selfie zur Gesichtserkennung.",
    icon: Camera,
  },
  {
    id: 3,
    title: "Kontakt verifizieren",
    description: "Bestätige deine Telefonnummer per SMS.",
    icon: Lock,
  },
];

const BENEFITS = [
  { icon: Shield, title: "Verifiziert-Badge", description: "Sichtbar auf deinem Profil und allen Angeboten" },
  { icon: Star, title: "Höheres Vertrauen", description: "Verifizierte Nutzer erhalten bis zu 3x mehr Anfragen" },
  { icon: Users, title: "Bevorzugt im Matching", description: "Dein Score im Matching-Algorithmus wird verbessert" },
  { icon: TrendingUp, title: "Mehr Sichtbarkeit", description: "Verifizierte Angebote werden höher gerankt" },
];

export default function VerifyPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          if (data.user.phone) setPhone(data.user.phone);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmitVerification() {
    setSubmitting(true);

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update phone if changed
    if (phone && phone !== user?.phone) {
      await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      }).catch(() => {});
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.verified) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Bereits verifiziert!</h1>
        <p className="text-muted-foreground mb-6">
          Dein Account ist verifiziert. Dein Verifiziert-Badge wird auf deinem Profil und allen Angeboten angezeigt.
        </p>
        <Badge variant="success" className="text-base gap-2 px-4 py-2">
          <Shield className="h-4 w-4" /> Verifizierter Nutzer
        </Badge>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
          <Shield className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Verifizierung eingereicht!</h1>
        <p className="text-muted-foreground mb-6">
          Deine Unterlagen werden geprüft. Du erhältst eine Benachrichtigung sobald die Verifizierung abgeschlossen ist. Dies dauert in der Regel 1-2 Werktage.
        </p>
        <Badge variant="warning" className="text-sm gap-2 px-4 py-2">
          <Loader2 className="h-3.5 w-3.5" /> In Prüfung
        </Badge>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Account verifizieren</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Verifiziere deinen Account, um mehr Vertrauen aufzubauen und bessere Matches zu erhalten.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {BENEFITS.map((b) => (
          <Card key={b.title}>
            <CardContent className="pt-6 text-center">
              <b.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm mb-1">{b.title}</div>
              <div className="text-xs text-muted-foreground">{b.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Verification Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {STEPS.map((s) => (
          <Card
            key={s.id}
            className={`cursor-pointer transition-all ${
              step === s.id
                ? "border-2 border-primary shadow-md"
                : step > s.id
                ? "border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20"
                : "opacity-60"
            }`}
            onClick={() => step >= s.id && setStep(s.id)}
          >
            <CardContent className="pt-6 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                step > s.id
                  ? "bg-green-100 dark:bg-green-900/30"
                  : step === s.id
                  ? "bg-primary/10"
                  : "bg-muted"
              }`}>
                {step > s.id ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <s.icon className={`h-6 w-6 ${step === s.id ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </div>
              <div className="font-semibold text-sm mb-1">Schritt {s.id}</div>
              <div className="font-medium mb-1">{s.title}</div>
              <div className="text-xs text-muted-foreground">{s.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Step Content */}
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {step === 1 && <FileText className="h-5 w-5 text-primary" />}
            {step === 2 && <Camera className="h-5 w-5 text-primary" />}
            {step === 3 && <Lock className="h-5 w-5 text-primary" />}
            {STEPS[step - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">Ausweis oder Reisepass hochladen</p>
                <p className="text-sm text-muted-foreground mb-4">JPG, PNG oder PDF, max. 10 MB</p>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  className="max-w-xs mx-auto"
                />
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Deine Dokumente werden verschlüsselt gespeichert und nur zur Verifizierung verwendet.
                  Nach Abschluss werden sie automatisch gelöscht.
                </span>
              </div>
              <Button className="w-full" onClick={() => setStep(2)}>
                Weiter
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">Selfie aufnehmen</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Halte dein Gesicht gut sichtbar vor die Kamera
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="max-w-xs mx-auto"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  Zurück
                </Button>
                <Button className="flex-1" onClick={() => setStep(3)}>
                  Weiter
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 123 4567890"
                />
                <p className="text-xs text-muted-foreground">
                  Wir senden einen Bestätigungscode per SMS.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                  Zurück
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleSubmitVerification}
                  disabled={submitting || !phone}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )}
                  Verifizierung absenden
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
