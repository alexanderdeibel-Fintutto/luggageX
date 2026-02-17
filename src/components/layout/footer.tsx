import { Luggage } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Luggage className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">
                Luggage<span className="text-primary">X</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Die Tauschbörse für freies Fluggepäck. Spare Geld beim Versand oder verdiene mit ungenutztem Gepäck.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Plattform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>So funktioniert&apos;s</li>
              <li>Sicherheit & Vertrauen</li>
              <li>Verbotene Gegenstände</li>
              <li>Versicherung</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Unternehmen</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Über FinnTutto</li>
              <li>Karriere</li>
              <li>Blog</li>
              <li>Presse</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>AGB</li>
              <li>Datenschutz</li>
              <li>Impressum</li>
              <li>Cookie-Richtlinie</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} FinnTutto LuggageX. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}
