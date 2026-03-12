"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AirportSearch } from "@/components/airport-search";
import { SIZE_CATEGORIES, ITEM_CATEGORIES, PROHIBITED_ITEMS } from "@/lib/airports";
import { Package, MapPin, Euro, Loader2, AlertTriangle, Plane, Truck, Home, Info } from "lucide-react";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [requestType, setRequestType] = useState("shipment");
  const [needsFirstMile, setNeedsFirstMile] = useState(false);
  const [needsLastMile, setNeedsLastMile] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      departureCity: formData.get("departureCity") as string,
      arrivalCity: formData.get("arrivalCity") as string,
      departureAirport: departureAirport || undefined,
      arrivalAirport: arrivalAirport || undefined,
      earliestDate: formData.get("earliestDate") as string,
      latestDate: formData.get("latestDate") as string,
      neededWeight: Number(formData.get("neededWeight")),
      sizeCategory: formData.get("sizeCategory") as string,
      itemDescription: formData.get("itemDescription") as string,
      itemCategory: formData.get("itemCategory") as string,
      maxBudget: Number(formData.get("maxBudget")) || undefined,
      requestType,
      flightNumber: requestType === "extra_luggage" ? (formData.get("flightNumber") as string) : undefined,
      senderAddress: formData.get("senderAddress") as string || undefined,
      senderCity: formData.get("senderCity") as string || undefined,
      recipientAddress: formData.get("recipientAddress") as string || undefined,
      recipientCity: formData.get("recipientCity") as string || undefined,
      needsFirstMile,
      needsLastMile,
      pickupPreference: formData.get("pickupPreference") as string,
      dropoffPreference: formData.get("dropoffPreference") as string,
    };

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Fehler beim Erstellen");
        return;
      }

      router.push(`/search?tab=requests&highlight=${result.request.id}`);
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Paket versenden</h1>
        <p className="text-muted-foreground">
          Finde Reisende, die dein Paket auf ihrem Flug mitnehmen - guenstiger und schneller als klassische Paketdienste
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
            {error}
          </div>
        )}

        {/* Request Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Was brauchst du?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRequestType("shipment")}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  requestType === "shipment"
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <Package className="h-6 w-6 mb-2 text-primary" />
                <div className="font-semibold text-sm">Paket versenden</div>
                <div className="text-xs text-muted-foreground">
                  Ich bleibe zu Hause und moechte etwas von A nach B schicken
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRequestType("extra_luggage")}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  requestType === "extra_luggage"
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <Plane className="h-6 w-6 mb-2 text-primary" />
                <div className="font-semibold text-sm">Extra-Gepaeck</div>
                <div className="text-xs text-muted-foreground">
                  Ich fliege selbst und brauche mehr Gepaeck
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Route */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Route
            </CardTitle>
            <CardDescription>Von wo nach wo soll dein Paket transportiert werden?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureCity">Von (Stadt)</Label>
                <Input id="departureCity" name="departureCity" placeholder="z.B. Lima" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalCity">Nach (Stadt)</Label>
                <Input id="arrivalCity" name="arrivalCity" placeholder="z.B. Zuerich" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Naechster Flughafen am Startort (optional)</Label>
                <AirportSearch value={departureAirport} onChange={setDepartureAirport} placeholder="Bevorzugter Flughafen" />
              </div>
              <div className="space-y-2">
                <Label>Naechster Flughafen am Zielort (optional)</Label>
                <AirportSearch value={arrivalAirport} onChange={setArrivalAirport} placeholder="Bevorzugter Flughafen" />
              </div>
            </div>
            {requestType === "extra_luggage" && (
              <div className="space-y-2">
                <Label htmlFor="flightNumber">Deine Flugnummer</Label>
                <Input id="flightNumber" name="flightNumber" placeholder="z.B. LH1234" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="earliestDate">Fruehestes Datum</Label>
                <Input id="earliestDate" name="earliestDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latestDate">Spaetestes Datum</Label>
                <Input id="latestDate" name="latestDate" type="date" required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Was wird versendet?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neededWeight">Gewicht (kg)</Label>
                <Input id="neededWeight" name="neededWeight" type="number" step="0.1" min="0.1" placeholder="z.B. 5" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sizeCategory">Groesse</Label>
                <Select id="sizeCategory" name="sizeCategory" defaultValue="M">
                  {SIZE_CATEGORIES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemCategory">Kategorie</Label>
              <Select id="itemCategory" name="itemCategory" defaultValue="general">
                {ITEM_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Beschreibung</Label>
              <Textarea
                id="itemDescription"
                name="itemDescription"
                placeholder="Beschreibe genau, was transportiert werden soll..."
                required
                minLength={5}
                rows={3}
              />
            </div>

            {/* Prohibited Items Warning */}
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Verbotene Gegenstaende
                  </p>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 mt-1 space-y-0.5">
                    {PROHIBITED_ITEMS.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sender Address (Origin Country) */}
        {requestType === "shipment" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Home className="h-5 w-5 text-primary" />
                Deine Adresse (Absender)
              </CardTitle>
              <CardDescription>
                Von hier wird das Paket zum Reisenden gebracht oder per lokalem Versand geschickt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senderAddress">Absenderadresse</Label>
                <Input id="senderAddress" name="senderAddress" placeholder="Strasse, PLZ, Ort" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderCity">Stadt</Label>
                <Input id="senderCity" name="senderCity" placeholder="z.B. Lima" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="needsFirstMile"
                  checked={needsFirstMile}
                  onChange={(e) => setNeedsFirstMile(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="needsFirstMile" className="font-normal">
                  Ich brauche lokalen Versand zum Reisenden (Erste Meile)
                </Label>
              </div>
              {needsFirstMile && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Wir vermitteln lokale Versandpartner, die dein Paket von deiner Adresse zur Empfangsadresse
                      des Reisenden bringen. Die Kosten werden separat berechnet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recipient Address (Destination Country) */}
        {requestType === "shipment" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Empfaengeradresse (Zielland)
              </CardTitle>
              <CardDescription>
                Wohin soll das Paket nach Ankunft im Zielland geliefert werden?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipientAddress">Empfaengeradresse</Label>
                <Input id="recipientAddress" name="recipientAddress" placeholder="Strasse, PLZ, Ort" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientCity">Stadt</Label>
                <Input id="recipientCity" name="recipientCity" placeholder="z.B. Zuerich" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="needsLastMile"
                  checked={needsLastMile}
                  onChange={(e) => setNeedsLastMile(e.target.checked)}
                  className="h-4 w-4 rounded border-input"
                />
                <Label htmlFor="needsLastMile" className="font-normal">
                  Ich brauche lokale Zustellung vom Reisenden zu mir (Letzte Meile)
                </Label>
              </div>
              {needsLastMile && (
                <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Wir vermitteln lokale Versandpartner, die dein Paket von der Abgabeadresse des Reisenden
                      zu deiner Empfaengeradresse liefern. Die Kosten werden separat berechnet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Budget & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Euro className="h-5 w-5 text-primary" />
              Budget & Uebergabe-Praeferenz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxBudget">Maximales Budget (EUR, optional)</Label>
              <Input id="maxBudget" name="maxBudget" type="number" step="1" min="0" placeholder="z.B. 50" />
              <p className="text-xs text-muted-foreground">
                Nur fuer den Flugtransport - lokale Versandkosten kommen ggf. dazu
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupPreference">Uebergabe im Abflugland</Label>
                <Select id="pickupPreference" name="pickupPreference" defaultValue="flexible">
                  <option value="address">An einer Adresse</option>
                  <option value="airport">Am Flughafen</option>
                  <option value="flexible">Flexibel</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoffPreference">Uebergabe im Zielland</Label>
                <Select id="dropoffPreference" name="dropoffPreference" defaultValue="flexible">
                  <option value="address">An einer Adresse</option>
                  <option value="airport">Am Flughafen</option>
                  <option value="flexible">Flexibel</option>
                </Select>
              </div>
            </div>

            {/* Explanation */}
            <div className="rounded-lg bg-muted/50 border p-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-medium">So funktioniert der Versand:</p>
                  <p>1. Dein Paket wird zum Reisenden im Abflugland gebracht (von dir oder per Erste-Meile-Service)</p>
                  <p>2. Der Reisende nimmt es als Gepaeck auf seinem Flug mit</p>
                  <p>3. Im Zielland holst du es beim Reisenden ab (oder per Letzte-Meile-Service)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Versandgesuch veroeffentlichen
        </Button>
      </form>
    </div>
  );
}
