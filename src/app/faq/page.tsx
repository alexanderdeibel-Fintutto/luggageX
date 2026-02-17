"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  ChevronDown,
  Plane,
  Package,
  Shield,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FaqItem[] = [
  // Allgemein
  {
    category: "allgemein",
    question: "Was ist LuggageX?",
    answer: "LuggageX ist eine Peer-to-Peer-Plattform, die Fluggäste mit freiem Gepäck-Kontingent und Menschen verbindet, die Sendungen auf der gleichen Route versenden möchten. Wie Uber, aber für Gepäck.",
  },
  {
    category: "allgemein",
    question: "Ist LuggageX kostenlos?",
    answer: "Die Registrierung und das Erstellen von Angeboten/Gesuchen ist komplett kostenlos. LuggageX erhebt eine kleine Service-Gebühr von 10% auf jede erfolgreiche Transaktion.",
  },
  {
    category: "allgemein",
    question: "In welchen Ländern ist LuggageX verfügbar?",
    answer: "LuggageX ist weltweit verfügbar. Unsere Datenbank umfasst über 90 Flughäfen auf 6 Kontinenten. Du kannst auf jeder Flugroute anbieten oder suchen.",
  },
  // Für Carrier
  {
    category: "carrier",
    question: "Wie viel kann ich als Carrier verdienen?",
    answer: "Die Einnahmen variieren je nach Route und Gewicht. Typische Preise liegen zwischen 5-15 EUR pro kg. Auf Langstreckenflügen (z.B. Europa → Asien) kannst du 20-50 EUR pro Flug verdienen.",
  },
  {
    category: "carrier",
    question: "Was darf ich mitnehmen?",
    answer: "Du entscheidest selbst, welche Sendungen du annimmst. Verbotene Gegenstände (Waffen, Drogen, gefährliche Materialien) sind strengstens untersagt. Bei der Übergabe solltest du den Inhalt überprüfen.",
  },
  {
    category: "carrier",
    question: "Was passiert, wenn mein Flug ausfällt?",
    answer: "Kontaktiere den Sender über den Chat sofort. Ihr könnt den Deal stornieren und die Escrow-Zahlung wird zurückerstattet. Bei alternativer Umbuchung könnt ihr den Deal anpassen.",
  },
  // Für Sender
  {
    category: "sender",
    question: "Wie sicher ist der Versand über LuggageX?",
    answer: "Alle Carrier werden mit Ausweis verifiziert und haben ein öffentliches Bewertungsprofil. Jede Übergabe wird mit QR-Code und optional Foto dokumentiert. Die Escrow-Zahlung schützt dein Geld bis zur bestätigten Übergabe.",
  },
  {
    category: "sender",
    question: "Was passiert, wenn meine Sendung beschädigt wird?",
    answer: "Dokumentiere den Schaden bei der Übergabe mit Fotos. LuggageX vermittelt bei Streitigkeiten. Die Escrow-Zahlung wird einbehalten, bis der Fall geklärt ist. Wir empfehlen, wertvolle Gegenstände extra zu versichern.",
  },
  {
    category: "sender",
    question: "Wie schnell wird meine Sendung transportiert?",
    answer: "So schnell wie der Flug! Anders als Paketdienste, die 3-7 Tage brauchen, ist deine Sendung oft noch am selben Tag am Ziel. Du siehst die genauen Flugzeiten im Angebot.",
  },
  // Zahlung & Sicherheit
  {
    category: "zahlung",
    question: "Wie funktioniert die Escrow-Zahlung?",
    answer: "Der Sender bezahlt nach dem Match. Das Geld wird auf einem sicheren Escrow-Konto verwahrt. Erst wenn beide Seiten die Übergabe bestätigt haben, wird das Geld an den Carrier ausgezahlt.",
  },
  {
    category: "zahlung",
    question: "Welche Zahlungsmethoden werden akzeptiert?",
    answer: "Aktuell unterstützen wir Kreditkarte (Visa, Mastercard) und PayPal. Weitere Zahlungsmethoden wie SEPA-Lastschrift und Apple Pay kommen bald.",
  },
  {
    category: "zahlung",
    question: "Wie funktioniert die Verifizierung?",
    answer: "Du kannst dein Profil mit E-Mail, Telefonnummer und Ausweis verifizieren. Verifizierte Nutzer bekommen ein Vertrauens-Badge und werden in Suchergebnissen bevorzugt angezeigt.",
  },
];

const CATEGORIES = [
  { id: "alle", label: "Alle Fragen", icon: HelpCircle },
  { id: "allgemein", label: "Allgemein", icon: HelpCircle },
  { id: "carrier", label: "Für Carrier", icon: Plane },
  { id: "sender", label: "Für Sender", icon: Package },
  { id: "zahlung", label: "Zahlung & Sicherheit", icon: CreditCard },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [category, setCategory] = useState("alle");

  const filteredFaqs = category === "alle"
    ? FAQ_DATA
    : FAQ_DATA.filter((f) => f.category === category);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <HelpCircle className="h-4 w-4" />
          Hilfe & FAQ
        </div>
        <h1 className="text-3xl font-bold mb-2">Häufig gestellte Fragen</h1>
        <p className="text-muted-foreground">
          Hier findest du Antworten auf die wichtigsten Fragen rund um LuggageX
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.id}
            variant={category === cat.id ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setCategory(cat.id)}
          >
            <cat.icon className="h-3.5 w-3.5" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <Card
            key={index}
            className={`cursor-pointer transition-colors ${
              openIndex === index ? "border-primary/30" : "hover:border-primary/20"
            }`}
          >
            <button
              className="w-full text-left p-5"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-medium text-sm sm:text-base">{faq.question}</h3>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>
              {openIndex === index && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </button>
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <Card className="mt-8 border-primary/20 bg-primary/5">
        <CardContent className="pt-6 text-center">
          <MessageSquare className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Noch Fragen?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Unser Support-Team hilft dir gerne weiter.
          </p>
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Kontakt aufnehmen
          </Button>
        </CardContent>
      </Card>

      {/* Prohibited Items */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-2">Verbotene Gegenstände</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>- Waffen und Munition</li>
                <li>- Explosivstoffe und Feuerwerkskörper</li>
                <li>- Drogen und illegale Substanzen</li>
                <li>- Giftige oder radioaktive Materialien</li>
                <li>- Lebende Tiere (ohne Genehmigung)</li>
                <li>- Gefälschte Waren</li>
                <li>- Unverzollte Waren über Freigrenzen</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
