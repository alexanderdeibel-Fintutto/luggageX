"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  CheckCircle2,
  Package,
  Euro,
  AlertTriangle,
  FileText,
  Clock,
  HelpCircle,
  ArrowRight,
  Umbrella,
} from "lucide-react";

const TIERS = [
  {
    name: "Basis-Schutz",
    price: "Kostenlos",
    coverage: "bis 50 EUR",
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    features: [
      "Schutz bei Totalverlust",
      "Streitfall-Mediation",
      "E-Mail Support",
    ],
    excluded: [
      "Keine Beschädigungsdeckung",
      "Kein Expressversand",
    ],
  },
  {
    name: "Standard",
    price: "2,99 EUR",
    coverage: "bis 250 EUR",
    color: "text-primary",
    bg: "bg-primary/5",
    popular: true,
    features: [
      "Schutz bei Verlust & Beschädigung",
      "Streitfall-Mediation mit Priorität",
      "24h Chat-Support",
      "Foto-Dokumentation",
    ],
    excluded: [
      "Kein Schutz für Elektronik >500 EUR",
    ],
  },
  {
    name: "Premium",
    price: "7,99 EUR",
    coverage: "bis 1.000 EUR",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    features: [
      "Vollschutz bei Verlust & Beschädigung",
      "Elektronik & Wertgegenstände",
      "Express-Schadensabwicklung (48h)",
      "Prioritäts-Support (Telefon + Chat)",
      "Ersatzlieferung bei Totalverlust",
      "Reisekosten-Erstattung",
    ],
    excluded: [],
  },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: "Schutz auswählen",
    description: "Wähle beim Abschluss eines Matches deine gewünschte Schutz-Stufe.",
    icon: Shield,
  },
  {
    step: 2,
    title: "Sendung dokumentieren",
    description: "Dokumentiere den Zustand deiner Sendung mit Fotos vor der Übergabe.",
    icon: Package,
  },
  {
    step: 3,
    title: "Schadensfall melden",
    description: "Im Schadensfall: Melde den Fall innerhalb von 48 Stunden nach Zustellung.",
    icon: AlertTriangle,
  },
  {
    step: 4,
    title: "Erstattung erhalten",
    description: "Nach Prüfung erhältst du deine Erstattung innerhalb von 5-10 Werktagen.",
    icon: Euro,
  },
];

const FAQS = [
  {
    q: "Was ist durch den LuggageX-Schutz abgedeckt?",
    a: "Unser Schutz deckt Verlust, Diebstahl und Beschädigung deiner Sendung während des Transports ab. Die genaue Deckung hängt von der gewählten Schutz-Stufe ab.",
  },
  {
    q: "Wie melde ich einen Schadensfall?",
    a: "Gehe zu deinem Match-Detail, klicke auf 'Streitfall melden' und beschreibe den Vorfall mit Fotos. Unser Team prüft den Fall und meldet sich innerhalb von 24-48 Stunden.",
  },
  {
    q: "Wie lange habe ich Zeit einen Schaden zu melden?",
    a: "Du hast 48 Stunden nach der bestätigten Übergabe Zeit, einen Schadensfall zu melden. Bei Totalverlust gilt eine Frist von 7 Tagen.",
  },
  {
    q: "Kann ich den Schutz nachträglich hinzufügen?",
    a: "Der Schutz kann bis zum Zeitpunkt der Bezahlung (Escrow) hinzugebucht werden. Danach ist eine nachträgliche Buchung nicht mehr möglich.",
  },
];

export default function InsurancePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Umbrella className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Versicherung & Schutz</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Schütze deine Sendungen mit unserem LuggageX-Schutz.
          Vom kostenlosen Basis-Schutz bis zur Premium-Vollversicherung.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {TIERS.map((tier) => (
          <Card key={tier.name} className={`relative ${tier.popular ? "border-2 border-primary shadow-lg" : ""}`}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Beliebt</Badge>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${tier.bg} mx-auto mb-2`}>
                <Shield className={`h-6 w-6 ${tier.color}`} />
              </div>
              <CardTitle className="text-lg">{tier.name}</CardTitle>
              <div className="text-2xl font-bold mt-2">{tier.price}</div>
              <div className="text-sm text-muted-foreground">Deckung {tier.coverage}</div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
                {tier.excluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.popular ? "default" : "outline"}
                className="w-full"
              >
                {tier.price === "Kostenlos" ? "Inklusive" : "Auswählen"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">So funktioniert der Schutz</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((s) => (
            <div key={s.step} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="text-sm font-bold text-primary mb-1">Schritt {s.step}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Häufige Fragen</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {FAQS.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-8 text-center">
          <h2 className="text-xl font-bold mb-2">Bereit loszulegen?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Erstelle ein Angebot oder finde günstigen Gepäcktransport - mit dem LuggageX-Schutz bist du immer abgesichert.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/search">
              <Button variant="outline" className="gap-2">
                <Package className="h-4 w-4" /> Angebote durchsuchen
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="gap-2">
                <FileText className="h-4 w-4" /> Fragen? Kontaktiere uns
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
