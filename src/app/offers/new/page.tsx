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
import { Plane, Package, MapPin, Euro, Loader2, Copy, Truck, Briefcase, Info } from "lucide-react";

interface RelistData {
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  luggageType: string;
  extraSuitcaseCount: number;
  availableWeight: number;
  maxSingleItem: number | null;
  sizeCategory: string;
  description: string | null;
  pricePerKg: number | null;
  flatPrice: number | null;
  negotiable: boolean;
  pickupType: string;
  pickupAddress: string | null;
  pickupCity: string | null;
  offersOriginPickup: boolean;
  dropoffType: string;
  dropoffAddress: string | null;
  dropoffCity: string | null;
  offersDestinationDelivery: boolean;
}

export default function NewOfferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [relistData, setRelistData] = useState<RelistData | null>(null);
  const [isRelist, setIsRelist] = useState(false);
  const [luggageType, setLuggageType] = useState("extra_suitcase");
  const [offersOriginPickup, setOffersOriginPickup] = useState(false);
  const [offersDestinationDelivery, setOffersDestinationDelivery] = useState(false);

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
            setLuggageType(o.luggageType || "extra_suitcase");
            setOffersOriginPickup(o.offersOriginPickup || false);
            setOffersDestinationDelivery(o.offersDestinationDelivery || false);
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
      luggageType,
      extraSuitcaseCount: luggageType !== "space_in_own" ? Number(formData.get("extraSuitcaseCount")) || 1 : 0,
      availableWeight: Number(formData.get("availableWeight")),
      maxSingleItem: Number(formData.get("maxSingleItem")) || undefined,
      sizeCategory: formData.get("sizeCategory") as string,
      description: formData.get("description") as string,
      pricePerKg: Number(formData.get("pricePerKg")) || undefined,
      flatPrice: Number(formData.get("flatPrice")) || undefined,
      negotiable: formData.get("negotiable") === "on",
      pickupType: formData.get("pickupType") as string,
      pickupAddress: formData.get("pickupAddress") as string,
      pickupCity: formData.get("pickupCity") as string,
      offersOriginPickup,
      dropoffType: formData.get("dropoffType") as string,
      dropoffAddress: formData.get("dropoffAddress") as string,
      dropoffCity: formData.get("dropoffCity") as string,
      offersDestinationDelivery,
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
          {isRelist ? "Angebot erneut einstellen" : "Transport anbieten"}
        </h1>
        <p className="text-muted-foreground">
          {isRelist
            ? "Daten aus dem vorherigen Angebot wurden uebernommen. Aktualisiere Datum und Details."
            : "Du fliegst bald? Biete an, Pakete oder Koffer fuer andere mitzunehmen und verdiene dabei."}
        </p>
        {isRelist && (
          <Badge variant="secondary" className="mt-2 gap-1">
            <Copy className="h-3 w-3" /> Kopie eines frueheren Angebots
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
              Deine Flugdaten
            </CardTitle>
            <CardDescription>Auf welchem Flug kannst du etwas mitnehmen?</CardDescription>
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
                  placeholder="z.B. Lima (LIM)"
                />
              </div>
              <div className="space-y-2">
                <Label>Zielflughafen</Label>
                <AirportSearch
                  value={arrivalAirport}
                  onChange={setArrivalAirport}
                  placeholder="z.B. Zuerich (ZRH)"
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

        {/* Luggage Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              Art des Transports
            </CardTitle>
            <CardDescription>Wie moechtest du Gepaeck mitnehmen?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLuggageType("extra_suitcase")}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  luggageType === "extra_suitcase"
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <Package className="h-6 w-6 mb-2 text-primary" />
                <div className="font-semibold text-sm">Zusatzkoffer</div>
                <div className="text-xs text-muted-foreground">
                  Ich checke extra Koffer ein
                </div>
              </button>
              <button
                type="button"
                onClick={() => setLuggageType("space_in_own")}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  luggageType === "space_in_own"
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <Briefcase className="h-6 w-6 mb-2 text-primary" />
                <div className="font-semibold text-sm">Platz im Koffer</div>
                <div className="text-xs text-muted-foreground">
                  Ich habe Platz in meinem eigenen Koffer
                </div>
              </button>
              <button
                type="button"
                onClick={() => setLuggageType("both")}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  luggageType === "both"
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <Package className="h-6 w-6 mb-2 text-primary" />
                <div className="font-semibold text-sm">Beides</div>
                <div className="text-xs text-muted-foreground">
                  Platz im Koffer + Zusatzkoffer
                </div>
              </button>
            </div>

            {luggageType !== "space_in_own" && (
              <div className="space-y-2">
                <Label htmlFor="extraSuitcaseCount">Anzahl Zusatzkoffer</Label>
                <Select
                  id="extraSuitcaseCount"
                  name="extraSuitcaseCount"
                  defaultValue={String(relistData?.extraSuitcaseCount || 1)}
                >
                  <option value="1">1 Koffer</option>
                  <option value="2">2 Koffer</option>
                  <option value="3">3 Koffer</option>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Luggage Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-primary" />
              Kapazitaet
            </CardTitle>
            <CardDescription>Wie viel Platz / Gewicht kannst du anbieten?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableWeight">Verfuegbares Gewicht (kg)</Label>
                <Input
                  id="availableWeight"
                  name="availableWeight"
                  type="number"
                  step="0.5"
                  min="0.5"
                  placeholder="z.B. 23"
                  defaultValue={relistData?.availableWeight || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxSingleItem">Max. Einzelstueck (kg)</Label>
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
              <Label htmlFor="sizeCategory">Maximale Groesse</Label>
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
                placeholder="z.B. Nehme gerne Pakete bis Koffergroesse mit. Keine Fluessigkeiten oder zerbrechliche Waren..."
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
            <CardDescription>Was verlangst du fuer den Transport?</CardDescription>
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
                <Label htmlFor="flatPrice">Oder: Pauschalpreis pro Koffer (EUR)</Label>
                <Input
                  id="flatPrice"
                  name="flatPrice"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="z.B. 50"
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

        {/* Origin Handover - Where traveler receives packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Empfangsort im Abflugland
            </CardTitle>
            <CardDescription>
              Wohin soll der Absender das Paket schicken oder bringen, damit du es vor dem Flug erhaeltst?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pickupType">Empfangsart</Label>
              <Select id="pickupType" name="pickupType" defaultValue={relistData?.pickupType || "address"}>
                <option value="address">An meiner Adresse (Empfehlung)</option>
                <option value="airport">Am Flughafen</option>
                <option value="meetingPoint">Treffpunkt vereinbaren</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupAddress">Deine Empfangsadresse</Label>
              <Input
                id="pickupAddress"
                name="pickupAddress"
                placeholder="Strasse, PLZ, Ort"
                defaultValue={relistData?.pickupAddress || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupCity">Stadt</Label>
              <Input
                id="pickupCity"
                name="pickupCity"
                placeholder="z.B. Lima"
                defaultValue={relistData?.pickupCity || ""}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offersOriginPickup"
                checked={offersOriginPickup}
                onChange={(e) => setOffersOriginPickup(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="offersOriginPickup" className="font-normal">
                Ich biete an, das Paket beim Absender abzuholen
              </Label>
            </div>
            {offersOriginPickup && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Der Absender sieht, dass du bereit bist, das Paket direkt abzuholen. Die Details koennt ihr im Chat klaren.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Destination Handover - Where traveler delivers packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Truck className="h-5 w-5 text-primary" />
              Abgabeort im Zielland
            </CardTitle>
            <CardDescription>
              Wo kann der Empfaenger das Paket abholen oder wohin lieferst du es nach der Ankunft?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dropoffType">Abgabeart</Label>
              <Select id="dropoffType" name="dropoffType" defaultValue={relistData?.dropoffType || "address"}>
                <option value="address">An meiner Adresse (Empfehlung)</option>
                <option value="airport">Am Flughafen</option>
                <option value="meetingPoint">Treffpunkt vereinbaren</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffAddress">Deine Abgabeadresse</Label>
              <Input
                id="dropoffAddress"
                name="dropoffAddress"
                placeholder="Strasse, PLZ, Ort"
                defaultValue={relistData?.dropoffAddress || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffCity">Stadt</Label>
              <Input
                id="dropoffCity"
                name="dropoffCity"
                placeholder="z.B. Zuerich"
                defaultValue={relistData?.dropoffCity || ""}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offersDestinationDelivery"
                checked={offersDestinationDelivery}
                onChange={(e) => setOffersDestinationDelivery(e.target.checked)}
                className="h-4 w-4 rounded border-input"
              />
              <Label htmlFor="offersDestinationDelivery" className="font-normal">
                Ich biete an, das Paket zum Empfaenger zu liefern
              </Label>
            </div>
            {offersDestinationDelivery && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Der Empfaenger sieht, dass du bereit bist, das Paket direkt zu liefern. Die Details koennt ihr im Chat klaren.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Transport-Angebot veroeffentlichen
        </Button>
      </form>
    </div>
  );
}
