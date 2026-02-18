"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AirportSearch } from "@/components/airport-search";
import { SIZE_CATEGORIES } from "@/lib/airports";
import { Plane, Package, MapPin, Euro, Loader2, Copy } from "lucide-react";

interface RelistData {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  availableWeight: number;
  maxSingleItem: number | null;
  sizeCategory: string;
  description: string | null;
  pricePerKg: number | null;
  flatPrice: number | null;
  negotiable: boolean;
  pickupType: string;
  pickupAddress: string | null;
  dropoffType: string;
  dropoffAddress: string | null;
}

export default function NewOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [relistData, setRelistData] = useState<RelistData | null>(null);
  const [isRelist, setIsRelist] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const relistId = params.get("relist");
    if (relistId) {
      setIsRelist(true);
      fetch(`/api/offers/${relistId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.offer) {
            const o = data.offer;
            setRelistData(o);
            setDepartureAirport(o.departureAirport);
            setArrivalAirport(o.arrivalAirport);
          }
        })
        .catch(() => {});
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      flightNumber: formData.get("flightNumber") as string,
      departureAirport,
      arrivalAirport,
      departureDate: formData.get("departureDate") as string,
      arrivalDate: formData.get("arrivalDate") as string,
      availableWeight: Number(formData.get("availableWeight")),
      maxSingleItem: Number(formData.get("maxSingleItem")) || undefined,
      sizeCategory: formData.get("sizeCategory") as string,
      description: formData.get("description") as string,
      pricePerKg: Number(formData.get("pricePerKg")) || undefined,
      flatPrice: Number(formData.get("flatPrice")) || undefined,
      negotiable: formData.get("negotiable") === "on",
      pickupType: formData.get("pickupType") as string,
      pickupAddress: formData.get("pickupAddress") as string,
      dropoffType: formData.get("dropoffType") as string,
      dropoffAddress: formData.get("dropoffAddress") as string,
    };

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Fehler beim Erstellen");
        return;
      }

      router.push(`/offers/${result.offer.id}`);
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isRelist ? "Angebot erneut einstellen" : "Gepäck anbieten"}
        </h1>
        <p className="text-muted-foreground">
          {isRelist
            ? "Daten aus dem vorherigen Angebot wurden übernommen. Aktualisiere Datum und Details."
            : "Biete dein freies Gepäck-Kontingent auf deinem Flug an"}
        </p>
        {isRelist && (
          <Badge variant="secondary" className="mt-2 gap-1">
            <Copy className="h-3 w-3" /> Kopie eines früheren Angebots
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
            {error}
          </div>
        )}

        {/* Flight Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plane className="h-5 w-5 text-primary" />
              Flugdaten
            </CardTitle>
            <CardDescription>Gib deine Fluginformationen ein</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="flightNumber">Flugnummer</Label>
              <Input
                id="flightNumber"
                name="flightNumber"
                placeholder="z.B. LH1234"
                defaultValue={relistData?.flightNumber || ""}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Abflughafen</Label>
                <AirportSearch
                  value={departureAirport}
                  onChange={setDepartureAirport}
                  placeholder="z.B. Frankfurt"
                />
              </div>
              <div className="space-y-2">
                <Label>Zielflughafen</Label>
                <AirportSearch
                  value={arrivalAirport}
                  onChange={setArrivalAirport}
                  placeholder="z.B. London"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Abflug Datum & Zeit</Label>
                <Input
                  id="departureDate"
                  name="departureDate"
                  type="datetime-local"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Ankunft Datum & Zeit</Label>
                <Input
                  id="arrivalDate"
                  name="arrivalDate"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Luggage Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Gepäck-Details
            </CardTitle>
            <CardDescription>Wie viel Platz hast du frei?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableWeight">Verfügbares Gewicht (kg)</Label>
                <Input
                  id="availableWeight"
                  name="availableWeight"
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="z.B. 10"
                  defaultValue={relistData?.availableWeight || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSingleItem">Max. Einzelstück (kg)</Label>
                <Input
                  id="maxSingleItem"
                  name="maxSingleItem"
                  type="number"
                  step="0.5"
                  placeholder="optional"
                  defaultValue={relistData?.maxSingleItem || ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sizeCategory">Maximale Größe</Label>
              <Select id="sizeCategory" name="sizeCategory" defaultValue={relistData?.sizeCategory || "M"}>
                {SIZE_CATEGORIES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label} ({s.description})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="z.B. Platz in meinem Koffer, keine Flüssigkeiten..."
                rows={3}
                defaultValue={relistData?.description || ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Euro className="h-5 w-5 text-primary" />
              Preisgestaltung
            </CardTitle>
            <CardDescription>Setze deinen Preis oder wähle &quot;Verhandelbar&quot;</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerKg">Preis pro kg (EUR)</Label>
                <Input
                  id="pricePerKg"
                  name="pricePerKg"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="z.B. 5"
                  defaultValue={relistData?.pricePerKg || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="flatPrice">Oder: Pauschalpreis (EUR)</Label>
                <Input
                  id="flatPrice"
                  name="flatPrice"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="z.B. 20"
                  defaultValue={relistData?.flatPrice || ""}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="negotiable"
                name="negotiable"
                defaultChecked={relistData ? relistData.negotiable : true}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="negotiable" className="font-normal">
                Preis ist verhandelbar
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Handover */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Übergabe
            </CardTitle>
            <CardDescription>Wo und wie soll die Übergabe stattfinden?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupType">Abholung</Label>
                <Select id="pickupType" name="pickupType" defaultValue={relistData?.pickupType || "airport"}>
                  <option value="airport">Am Flughafen</option>
                  <option value="address">An einer Adresse</option>
                  <option value="meetingPoint">Treffpunkt</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickupAddress">Abholadresse (optional)</Label>
                <Input
                  id="pickupAddress"
                  name="pickupAddress"
                  placeholder="Straße, PLZ, Ort"
                  defaultValue={relistData?.pickupAddress || ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dropoffType">Abgabe</Label>
                <Select id="dropoffType" name="dropoffType" defaultValue={relistData?.dropoffType || "airport"}>
                  <option value="airport">Am Flughafen</option>
                  <option value="address">An einer Adresse</option>
                  <option value="meetingPoint">Treffpunkt</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropoffAddress">Abgabeadresse (optional)</Label>
                <Input
                  id="dropoffAddress"
                  name="dropoffAddress"
                  placeholder="Straße, PLZ, Ort"
                  defaultValue={relistData?.dropoffAddress || ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Angebot veröffentlichen
        </Button>
      </form>
    </div>
  );
}
