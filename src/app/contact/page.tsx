"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Mail,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Bug,
  Lightbulb,
  CreditCard,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";

const CATEGORIES = [
  { value: "general", label: "Allgemeine Anfrage", icon: MessageSquare },
  { value: "bug", label: "Fehler melden", icon: Bug },
  { value: "feature", label: "Feature-Vorschlag", icon: Lightbulb },
  { value: "billing", label: "Zahlung & Abrechnung", icon: CreditCard },
  { value: "other", label: "Sonstiges", icon: HelpCircle },
];

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
      category: formData.get("category") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Fehler beim Senden");
        return;
      }
      setSent(true);
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Nachricht gesendet!</h1>
        <p className="text-muted-foreground mb-6">
          Vielen Dank für deine Nachricht. Wir melden uns innerhalb von 24 Stunden bei dir.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Zur Startseite</Button>
          </Link>
          <Link href="/faq">
            <Button variant="outline" className="gap-2">
              <HelpCircle className="h-4 w-4" /> FAQ ansehen
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Kontakt & Support</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Hast du Fragen, Probleme oder Feedback? Wir sind für dich da.
          Schau auch in unsere <Link href="/faq" className="text-primary hover:underline">FAQ</Link> für schnelle Antworten.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">E-Mail</div>
                    <div className="text-sm text-muted-foreground">support@luggagex.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Antwortzeit</div>
                    <div className="text-sm text-muted-foreground">Innerhalb von 24h</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Telefon</div>
                    <div className="text-sm text-muted-foreground">Mo-Fr 9-17 Uhr</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Adresse</div>
                    <div className="text-sm text-muted-foreground">FinnTutto GmbH<br />Berlin, Deutschland</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 text-sm">Häufige Themen</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="text-primary hover:underline flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5" /> FAQ & Hilfe
                  </Link>
                </li>
                <li>
                  <Link href="/legal/agb" className="text-primary hover:underline flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> AGB & Nutzungsbedingungen
                  </Link>
                </li>
                <li>
                  <Link href="/legal/datenschutz" className="text-primary hover:underline flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" /> Datenschutzrichtlinie
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Nachricht senden
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required placeholder="Dein Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail</Label>
                    <Input id="email" name="email" type="email" required placeholder="deine@email.de" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategorie</Label>
                  <Select id="category" name="category" defaultValue="general">
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Betreff</Label>
                  <Input id="subject" name="subject" required placeholder="Worum geht es?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    rows={6}
                    placeholder="Beschreibe dein Anliegen so genau wie möglich..."
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={sending}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Nachricht senden
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
