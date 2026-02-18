"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Send,
  FileText,
  Shield,
  Clock,
  ArrowRight,
  Scale,
} from "lucide-react";

const DISPUTE_REASONS = [
  { value: "item_damaged", label: "Sendung beschädigt" },
  { value: "item_lost", label: "Sendung verloren / nicht erhalten" },
  { value: "item_wrong", label: "Falscher Inhalt erhalten" },
  { value: "no_handover", label: "Carrier nicht erschienen" },
  { value: "quality_issue", label: "Qualitätsproblem" },
  { value: "price_dispute", label: "Preisstreit" },
  { value: "communication", label: "Kommunikationsproblem" },
  { value: "other", label: "Sonstiges" },
];

interface MatchInfo {
  id: string;
  status: string;
  offer: {
    departureAirport: string;
    arrivalAirport: string;
    flightNumber: string;
    user: { name: string };
  };
  request: {
    itemDescription: string;
    user: { name: string };
  };
}

export default function DisputesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <DisputesContent />
    </Suspense>
  );
}

function DisputesContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("match");

  const [match, setMatch] = useState<MatchInfo | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (matchId) {
      setLoadingMatch(true);
      fetch(`/api/matches/${matchId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.match) setMatch(data.match);
        })
        .catch(() => {})
        .finally(() => setLoadingMatch(false));
    }
  }, [matchId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      // Update match status to disputed
      if (matchId) {
        const res = await fetch(`/api/matches/${matchId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "dispute" }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Fehler beim Einreichen");
          return;
        }
      }

      // Submit dispute as contact message
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name") || "User",
          email: formData.get("email") || "user@luggagex.com",
          subject: `Streitfall: ${formData.get("reason")} - Match ${matchId || "N/A"}`,
          message: `Grund: ${formData.get("reason")}\n\nMatch-ID: ${matchId || "nicht angegeben"}\n\nBeschreibung:\n${formData.get("description")}\n\nGewünschte Lösung: ${formData.get("resolution")}`,
          category: "billing",
        }),
      });

      setSubmitted(true);
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Streitfall eingereicht</h1>
        <p className="text-muted-foreground mb-6">
          Dein Fall wird geprüft. Unser Team meldet sich innerhalb von 24-48 Stunden bei dir.
          Du erhältst eine E-Mail mit der Bestätigung und der Fallnummer.
        </p>
        <div className="flex justify-center gap-3">
          {matchId && (
            <Link href={`/matches/${matchId}`}>
              <Button variant="outline">Zum Match</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button>Zum Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
          <Scale className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Streitfall melden</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Wenn es ein Problem mit einem Transport gibt, helfen wir dir bei der Lösung.
        </p>
      </div>

      {/* Match Info */}
      {matchId && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            {loadingMatch ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : match ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold">
                    {match.offer.departureAirport}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    {match.offer.arrivalAirport}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({match.offer.flightNumber})
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Carrier: {match.offer.user.name} | Sender: {match.request.user.name}
                  </div>
                </div>
                <Badge variant="warning">{match.status}</Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Match nicht gefunden
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dispute Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Streitfall-Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                {error}
              </div>
            )}

            {!matchId && (
              <div className="space-y-2">
                <Label htmlFor="matchInput">Match-ID (optional)</Label>
                <Input
                  id="matchInput"
                  name="matchId"
                  placeholder="Falls bekannt, die Match-ID eingeben"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Dein Name</Label>
                <Input id="name" name="name" required placeholder="Dein Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Deine E-Mail</Label>
                <Input id="email" name="email" type="email" required placeholder="deine@email.de" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Grund des Streitfalls</Label>
              <Select id="reason" name="reason" required>
                <option value="">Bitte wählen...</option>
                {DISPUTE_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                name="description"
                required
                minLength={20}
                rows={5}
                placeholder="Beschreibe den Vorfall so genau wie möglich. Was ist passiert? Wann? Gibt es Beweise (Fotos, Chat-Nachrichten)?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Gewünschte Lösung</Label>
              <Select id="resolution" name="resolution" required>
                <option value="">Bitte wählen...</option>
                <option value="full_refund">Volle Erstattung</option>
                <option value="partial_refund">Teilerstattung</option>
                <option value="replacement">Ersatzlieferung</option>
                <option value="mediation">Vermittlung/Mediation</option>
                <option value="other">Andere Lösung</option>
              </Select>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Shield className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Dein Streitfall wird vertraulich behandelt. Wir kontaktieren beide Parteien
                und vermitteln eine faire Lösung. Die Bearbeitung dauert in der Regel 2-5 Werktage.
              </span>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Streitfall einreichen
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Process Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            So läuft die Streitbeilegung ab
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 1, title: "Einreichung", desc: "Du reichst den Streitfall mit allen Details ein." },
              { step: 2, title: "Prüfung", desc: "Unser Team prüft den Fall und kontaktiert beide Parteien." },
              { step: 3, title: "Mediation", desc: "Wir vermitteln eine faire Lösung zwischen beiden Parteien." },
              { step: 4, title: "Lösung", desc: "Der Fall wird gelöst - per Erstattung, Einigung oder Entscheidung." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="font-medium text-sm">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
