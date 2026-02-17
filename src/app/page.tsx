import Link from "next/link";
import {
  Luggage,
  Search,
  PlusCircle,
  Shield,
  Star,
  ArrowRight,
  Plane,
  Package,
  Handshake,
  TrendingUp,
  Users,
  Globe,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlatformStats } from "@/components/platform-stats";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 sm:py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Luggage className="h-4 w-4" />
              FinnTutto Ökosystem
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Ungenutztes Gepäck{" "}
              <span className="text-primary">teilen</span>,{" "}
              <span className="text-accent">sparen</span>,{" "}
              <span className="text-primary">verdienen</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              LuggageX verbindet Fluggäste mit freiem Gepäck-Kontingent und Menschen,
              die Sendungen auf der gleichen Route versenden möchten. Spare bis zu 80%
              gegenüber klassischen Versandwegen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/offers/new">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <PlusCircle className="h-5 w-5" />
                  Gepäck anbieten
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Search className="h-5 w-5" />
                  Gepäck suchen
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-20 left-10 opacity-10 hidden sm:block">
          <Plane className="h-32 w-32 text-primary rotate-45" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10 hidden sm:block">
          <Package className="h-24 w-24 text-accent" />
        </div>
      </section>

      {/* Platform Stats */}
      <PlatformStats />

      {/* How It Works */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            So funktioniert&apos;s
          </h2>
          <p className="text-muted-foreground text-center mb-10 sm:mb-12 max-w-xl mx-auto">
            In drei einfachen Schritten zum günstigen Gepäcktransport
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="relative border-none shadow-md">
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <CardContent className="pt-8 pb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Einstellen</h3>
                <p className="text-sm text-muted-foreground">
                  Fluggäste geben ihre Route, freies Gewicht und Preis an.
                  Versender beschreiben ihre Sendung und Route.
                </p>
              </CardContent>
            </Card>

            <Card className="relative border-none shadow-md">
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                2
              </div>
              <CardContent className="pt-8 pb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Matchen</h3>
                <p className="text-sm text-muted-foreground">
                  Unser Smart-Matching findet automatisch passende Partner.
                  Chat und Preisverhandlung direkt in der App.
                </p>
              </CardContent>
            </Card>

            <Card className="relative border-none shadow-md">
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                3
              </div>
              <CardContent className="pt-8 pb-6">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Übergeben</h3>
                <p className="text-sm text-muted-foreground">
                  Sichere Übergabe mit QR-Code und Foto-Dokumentation.
                  Zahlung wird erst nach Bestätigung freigegeben.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Two Sides */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-6 sm:p-8">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Plane className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Für Fluggäste</h3>
                <p className="text-muted-foreground mb-6">
                  Du fliegst und hast noch Gepäck-Kapazität frei? Verdiene Geld,
                  indem du anderen hilfst, ihre Sachen zu transportieren.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Verdiene 5-50 EUR pro Flug mit ungenutztem Gepäck</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Du entscheidest, was du mitnimmst</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Star className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Baue dir ein Profil als zuverlässiger Carrier auf</span>
                  </li>
                </ul>
                <Link href="/offers/new">
                  <Button className="w-full gap-2">
                    Gepäck anbieten <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
              <CardContent className="p-6 sm:p-8">
                <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                  <Package className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Für Versender</h3>
                <p className="text-muted-foreground mb-6">
                  Du brauchst Extra-Gepäck für deinen Flug oder willst etwas
                  günstig von A nach B schicken? Finde Mitflieger mit freiem Platz.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Bis zu 80% günstiger als klassischer Versand</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Shield className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Verifizierte Carrier mit Bewertungen</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Star className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <span>Schneller als Paketdienste auf vielen Routen</span>
                  </li>
                </ul>
                <Link href="/requests/new">
                  <Button variant="outline" className="w-full gap-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    Gepäck suchen <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Sicherheit & Vertrauen
          </h2>
          <p className="text-muted-foreground text-center mb-10 sm:mb-12 max-w-xl mx-auto">
            Deine Sicherheit hat höchste Priorität
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "ID-Verifizierung", desc: "Alle Nutzer werden mit Ausweis verifiziert" },
              { icon: Star, title: "Bewertungssystem", desc: "Transparente Bewertungen nach jeder Übergabe" },
              { icon: Handshake, title: "Escrow-Zahlung", desc: "Geld wird erst nach erfolgreicher Übergabe freigegeben" },
              { icon: Package, title: "Übergabeprotokoll", desc: "QR-Code und Foto-Dokumentation für jeden Transfer" },
            ].map((item) => (
              <Card key={item.title} className="text-center border-none shadow-sm">
                <CardContent className="pt-6 px-3 sm:px-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why LuggageX */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Warum LuggageX?
          </h2>
          <p className="text-muted-foreground text-center mb-10 sm:mb-12 max-w-xl mx-auto">
            Die Vorteile unserer Plattform auf einen Blick
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-2xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Schnell & Einfach</h3>
              <p className="text-sm text-muted-foreground">
                In unter 2 Minuten ein Angebot oder Gesuch erstellen.
                Smart-Matching findet sofort passende Partner.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">90+ Flughäfen</h3>
              <p className="text-sm text-muted-foreground">
                Weltweite Abdeckung mit über 90 Flughäfen.
                Von Frankfurt bis Dubai, von New York bis Tokio.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="h-14 w-14 rounded-2xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Wachsende Community von verifizierten Nutzern.
                Bewertungssystem für maximales Vertrauen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Bereit loszulegen?</h2>
            <p className="text-muted-foreground mb-8">
              Registriere dich kostenlos und werde Teil der LuggageX Community.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Jetzt kostenlos registrieren
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
