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
import { Package, MapPin, Euro, Loader2, AlertTriangle, Plane } from "lucide-react";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [requestType, setRequestType] = useState("shipment");

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
        <h1 className="text-3xl font-bold mb-2">Gepäck suchen</h1>
        <p className="text-muted-foreground">
          Erstelle ein Gesuch für Gepäcktransport auf deiner Route
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
            <CardTitle className="text-lg">Was suchst du?</CardTitle>
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
                <div className="font-semibold text-sm">Versand</div>
                <div className="text-xs text-muted-foreground">
                  Ich fliege nicht selbst, will etwas versenden
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
                <div className="font-semibold text-sm">Extra-Gepäck</div>
                <div className="text-xs text-muted-foreground">
                  Ich fliege und brauche mehr Gepäck
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
            <CardDescription>Von wo nach wo soll transportiert werden?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureCity">Von (Stadt)</Label>
                <Input id="departureCity" name="departureCity" placeholder="z.B. Frankfurt" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalCity">Nach (Stadt)</Label>
                <Input id="arrivalCity" name="arrivalCity" placeholder="z.B. London" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Abflughafen (optional)</Label>
                <AirportSearch value={departureAirport} onChange={setDepartureAirport} placeholder="Bevorzugter Flughafen" />
              </div>
              <div className="space-y-2">
                <Label>Zielflughafen (optional)</Label>
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
                <Label htmlFor="earliestDate">Frühestes Datum</Label>
                <Input id="earliestDate" name="earliestDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latestDate">Spätestes Datum</Label>
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
                <Label htmlFor="neededWeight">Benötigtes Gewicht (kg)</Label>
                <Input id="neededWeight" name="neededWeight" type="number" step="0.1" min="0.1" placeholder="z.B. 5" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sizeCategory">Größe</Label>
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
                    Verbotene Gegenstände
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

        {/* Budget & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Euro className="h-5 w-5 text-primary" />
              Budget & Übergabe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxBudget">Maximales Budget (EUR, optional)</Label>
              <Input id="maxBudget" name="maxBudget" type="number" step="1" min="0" placeholder="z.B. 30" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupPreference">Abholung bevorzugt</Label>
                <Select id="pickupPreference" name="pickupPreference" defaultValue="flexible">
                  <option value="airport">Am Flughafen</option>
                  <option value="address">An einer Adresse</option>
                  <option value="flexible">Flexibel</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoffPreference">Abgabe bevorzugt</Label>
                <Select id="dropoffPreference" name="dropoffPreference" defaultValue="flexible">
                  <option value="airport">Am Flughafen</option>
                  <option value="address">An einer Adresse</option>
                  <option value="flexible">Flexibel</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Gesuch veröffentlichen
        </Button>
      </form>
    </div>
  );
}
