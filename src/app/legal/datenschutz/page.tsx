import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück
      </Link>

      <h1 className="text-3xl font-bold mb-2">Datenschutzerklärung</h1>
      <p className="text-muted-foreground mb-8">Zuletzt aktualisiert: Februar 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">1. Verantwortlicher</h2>
          <p className="text-muted-foreground">
            Verantwortlich für die Datenverarbeitung ist FinnTutto UG (haftungsbeschränkt),
            Musterstraße 1, 10115 Berlin, Deutschland. E-Mail: datenschutz@finntutto.de
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Erhobene Daten</h2>
          <p className="text-muted-foreground">
            Wir erheben folgende personenbezogene Daten: Name, E-Mail-Adresse, Telefonnummer (optional),
            Profilbild (optional), Fluginformationen für Angebote, Nachrichten zwischen Nutzern,
            Transaktionsdaten sowie Bewertungen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Zweck der Verarbeitung</h2>
          <p className="text-muted-foreground">
            Die Daten werden verarbeitet zur: Bereitstellung und Verbesserung unserer Dienste,
            Vermittlung zwischen Carriern und Sendern, Abwicklung von Zahlungen, Kommunikation
            zwischen Nutzern, Sicherstellung der Plattform-Sicherheit sowie zur Erfüllung
            rechtlicher Pflichten.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">4. Rechtsgrundlage</h2>
          <p className="text-muted-foreground">
            Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung),
            Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse) und Art. 6 Abs. 1 lit. a DSGVO
            (Einwilligung) sowie Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. Datenweitergabe</h2>
          <p className="text-muted-foreground">
            Personenbezogene Daten werden nur im Rahmen der Vermittlung an andere Nutzer weitergegeben
            (Name, Bewertung, Profilbild). Zahlungsdaten werden an unseren Zahlungsdienstleister
            übermittelt. Eine Weitergabe an Dritte erfolgt nur bei rechtlicher Verpflichtung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">6. Speicherdauer</h2>
          <p className="text-muted-foreground">
            Kontodaten werden bis zur Löschung des Kontos gespeichert. Transaktionsdaten werden
            gemäß steuerrechtlicher Vorschriften 10 Jahre aufbewahrt. Nachrichten werden 2 Jahre
            nach Abschluss des Deals gelöscht.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">7. Ihre Rechte</h2>
          <p className="text-muted-foreground">
            Sie haben das Recht auf: Auskunft über Ihre gespeicherten Daten, Berichtigung unrichtiger
            Daten, Löschung Ihrer Daten, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
            Widerspruch gegen die Verarbeitung. Kontaktieren Sie uns unter datenschutz@finntutto.de.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Cookies</h2>
          <p className="text-muted-foreground">
            Wir verwenden technisch notwendige Cookies für die Session-Verwaltung und Authentifizierung.
            Analytische Cookies werden nur mit Ihrer Einwilligung gesetzt.
          </p>
        </section>
      </div>
    </div>
  );
}
