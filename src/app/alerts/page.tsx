"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BellPlus,
  Loader2,
  Trash2,
  Plane,
  ArrowRight,
  Search,
  Calendar,
  Euro,
  Weight,
  Plus,
  X,
} from "lucide-react";

interface RouteAlert {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureAirport: string | null;
  arrivalAirport: string | null;
  earliestDate: string | null;
  latestDate: string | null;
  maxPrice: number | null;
  minWeight: number | null;
  active: boolean;
  matchingOffers: number;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<RouteAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const res = await fetch("/api/alerts");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data.alerts || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      departureCity: formData.get("departureCity") as string,
      arrivalCity: formData.get("arrivalCity") as string,
      departureAirport: formData.get("departureAirport") as string || undefined,
      arrivalAirport: formData.get("arrivalAirport") as string || undefined,
      earliestDate: formData.get("earliestDate") as string || undefined,
      latestDate: formData.get("latestDate") as string || undefined,
      maxPrice: formData.get("maxPrice") as string || undefined,
      minWeight: formData.get("minWeight") as string || undefined,
    };

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Fehler beim Erstellen");
        return;
      }
      setShowForm(false);
      fetchAlerts();
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setCreating(false);
    }
  }

  async function deleteAlert(id: string) {
    const res = await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Route-Alerts
          </h1>
          <p className="text-muted-foreground">
            Erhalte Benachrichtigungen wenn neue Angebote auf deinen Wunschrouten erscheinen.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Abbrechen" : "Neuer Alert"}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellPlus className="h-5 w-5 text-primary" />
              Neuen Route-Alert erstellen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureCity">Von (Stadt) *</Label>
                  <Input id="departureCity" name="departureCity" required placeholder="z.B. Berlin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalCity">Nach (Stadt) *</Label>
                  <Input id="arrivalCity" name="arrivalCity" required placeholder="z.B. Istanbul" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departureAirport">Abflughafen (optional)</Label>
                  <Input id="departureAirport" name="departureAirport" placeholder="z.B. BER" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrivalAirport">Zielflughafen (optional)</Label>
                  <Input id="arrivalAirport" name="arrivalAirport" placeholder="z.B. IST" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="earliestDate">Frühestes Datum</Label>
                  <Input id="earliestDate" name="earliestDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latestDate">Spätestes Datum</Label>
                  <Input id="latestDate" name="latestDate" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max. Preis (EUR)</Label>
                  <Input id="maxPrice" name="maxPrice" type="number" step="0.01" placeholder="z.B. 15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minWeight">Min. Gewicht (kg)</Label>
                  <Input id="minWeight" name="minWeight" type="number" step="0.5" placeholder="z.B. 5" />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellPlus className="h-4 w-4" />}
                Alert erstellen
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Alert List */}
      {alerts.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">Noch keine Route-Alerts</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Erstelle einen Alert und wir benachrichtigen dich, wenn neue Angebote auf deiner Wunschroute erscheinen.
            </p>
            <Button className="gap-2" onClick={() => setShowForm(true)}>
              <BellPlus className="h-4 w-4" /> Ersten Alert erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 text-lg font-bold">
                        <Plane className="h-4 w-4 text-primary" />
                        {alert.departureCity}
                        {alert.departureAirport && (
                          <span className="text-sm font-normal text-muted-foreground">({alert.departureAirport})</span>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        {alert.arrivalCity}
                        {alert.arrivalAirport && (
                          <span className="text-sm font-normal text-muted-foreground">({alert.arrivalAirport})</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                      {(alert.earliestDate || alert.latestDate) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {alert.earliestDate
                            ? new Date(alert.earliestDate).toLocaleDateString("de-DE")
                            : "..."}{" "}
                          -{" "}
                          {alert.latestDate
                            ? new Date(alert.latestDate).toLocaleDateString("de-DE")
                            : "..."}
                        </span>
                      )}
                      {alert.maxPrice && (
                        <span className="flex items-center gap-1">
                          <Euro className="h-3.5 w-3.5" />
                          bis {alert.maxPrice} EUR
                        </span>
                      )}
                      {alert.minWeight && (
                        <span className="flex items-center gap-1">
                          <Weight className="h-3.5 w-3.5" />
                          ab {alert.minWeight} kg
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      {alert.matchingOffers > 0 ? (
                        <Link
                          href={`/search?from=${alert.departureAirport || ""}&to=${alert.arrivalAirport || ""}`}
                        >
                          <Badge variant="success" className="gap-1 cursor-pointer">
                            <Search className="h-3 w-3" />
                            {alert.matchingOffers} passende{alert.matchingOffers === 1 ? "s" : ""} Angebot{alert.matchingOffers === 1 ? "" : "e"}
                          </Badge>
                        </Link>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          Noch keine Treffer
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => deleteAlert(alert.id)}
                    title="Alert löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
