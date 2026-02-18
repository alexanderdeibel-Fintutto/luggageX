import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AGBPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Zurück
      </Link>

      <h1 className="text-3xl font-bold mb-2">Allgemeine Geschäftsbedingungen</h1>
      <p className="text-muted-foreground mb-8">Zuletzt aktualisiert: Februar 2026</p>

      <div className="prose prose-sm max-w-none space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">1. Geltungsbereich</h2>
          <p className="text-muted-foreground">
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der Plattform LuggageX,
            betrieben von FinnTutto UG (haftungsbeschränkt). Durch die Registrierung und Nutzung der
            Plattform erklären Sie sich mit diesen AGB einverstanden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">2. Leistungsbeschreibung</h2>
          <p className="text-muted-foreground">
            LuggageX ist eine Vermittlungsplattform, die Fluggäste mit freiem Gepäck-Kontingent
            (Carrier) und Personen, die Sendungen transportieren möchten (Sender), zusammenbringt.
            LuggageX ist selbst kein Transportunternehmen und übernimmt keine Haftung für den Transport.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">3. Registrierung & Nutzerkonto</h2>
          <p className="text-muted-foreground">
            Zur Nutzung ist eine Registrierung mit gültiger E-Mail-Adresse erforderlich. Nutzer müssen
            mindestens 18 Jahre alt sein. Die Angabe wahrheitsgemäßer Daten ist Pflicht. Jeder Nutzer
            darf nur ein Konto besitzen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">4. Gebühren & Zahlung</h2>
          <p className="text-muted-foreground">
            Die Registrierung ist kostenlos. LuggageX erhebt eine Servicegebühr von 10% auf jede
            erfolgreiche Transaktion. Zahlungen werden über unser Escrow-System abgewickelt. Das Geld
            wird erst nach bestätigter Übergabe an den Carrier ausgezahlt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">5. Verbotene Gegenstände</h2>
          <p className="text-muted-foreground">
            Der Transport folgender Gegenstände ist strengstens untersagt: Waffen, Munition, Explosivstoffe,
            Drogen und illegale Substanzen, giftige oder radioaktive Materialien, lebende Tiere (ohne
            Genehmigung), gefälschte Waren sowie unverzollte Waren über Freigrenzen. Verstöße führen
            zur sofortigen Kontosperrung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">6. Haftung</h2>
          <p className="text-muted-foreground">
            LuggageX haftet nicht für Schäden, Verluste oder Verspätungen beim Transport. Die Haftung
            liegt beim jeweiligen Carrier. Wir empfehlen, wertvolle Gegenstände zusätzlich zu versichern.
            LuggageX vermittelt bei Streitigkeiten, übernimmt jedoch keine Garantie für eine Lösung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">7. Kündigung</h2>
          <p className="text-muted-foreground">
            Nutzer können ihr Konto jederzeit über die Einstellungen löschen. LuggageX behält sich
            das Recht vor, Konten bei Verstößen gegen diese AGB zu sperren oder zu löschen. Offene
            Transaktionen werden vor der Löschung abgewickelt.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">8. Anwendbares Recht</h2>
          <p className="text-muted-foreground">
            Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin, soweit gesetzlich
            zulässig.
          </p>
        </section>
      </div>
    </div>
  );
}
