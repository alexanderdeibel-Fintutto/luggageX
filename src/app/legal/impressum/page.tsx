import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück
      </Link>

      <h1 className="text-3xl font-bold mb-8">Impressum</h1>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-lg font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
          <div className="text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">FinnTutto UG (haftungsbeschränkt)</p>
            <p>Musterstraße 1</p>
            <p>10115 Berlin</p>
            <p>Deutschland</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Kontakt</h2>
          <div className="text-muted-foreground space-y-1">
            <p>E-Mail: info@finntutto.de</p>
            <p>Telefon: +49 30 12345678</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Vertreten durch</h2>
          <p className="text-muted-foreground">Geschäftsführer: Alexander Deibel</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Registereintrag</h2>
          <div className="text-muted-foreground space-y-1">
            <p>Handelsregister: Amtsgericht Charlottenburg</p>
            <p>Registernummer: HRB XXXXX</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Umsatzsteuer-ID</h2>
          <p className="text-muted-foreground">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: DE XXXXXXXXX
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Streitbeilegung</h2>
          <p className="text-muted-foreground">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit.
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Haftungshinweis</h2>
          <p className="text-muted-foreground">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
            externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber
            verantwortlich.
          </p>
        </section>
      </div>
    </div>
  );
}
