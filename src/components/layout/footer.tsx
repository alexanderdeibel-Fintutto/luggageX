import Link from "next/link";
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
              <li><Link href="/search" className="hover:text-foreground transition-colors">Angebote durchsuchen</Link></li>
              <li><Link href="/offers/new" className="hover:text-foreground transition-colors">Gepäck anbieten</Link></li>
              <li><Link href="/requests/new" className="hover:text-foreground transition-colors">Gepäck suchen</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ & Hilfe</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Unternehmen</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">Über FinnTutto</span></li>
              <li><span className="cursor-default">Karriere</span></li>
              <li><span className="cursor-default">Blog</span></li>
              <li><span className="cursor-default">Presse</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/agb" className="hover:text-foreground transition-colors">AGB</Link></li>
              <li><Link href="/legal/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</Link></li>
              <li><Link href="/legal/impressum" className="hover:text-foreground transition-colors">Impressum</Link></li>
              <li><span className="cursor-default">Cookie-Richtlinie</span></li>
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
