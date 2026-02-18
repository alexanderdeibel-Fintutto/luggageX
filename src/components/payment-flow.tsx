"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Shield,
  Lock,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Wallet,
} from "lucide-react";

interface PaymentFlowProps {
  matchId: string;
  amount: number;
  carrierName: string;
  route: string;
  onComplete: () => void;
}

type PaymentStep = "overview" | "method" | "confirm" | "processing" | "done";

export function PaymentFlow({ matchId, amount, carrierName, route, onComplete }: PaymentFlowProps) {
  const [step, setStep] = useState<PaymentStep>("overview");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function processPayment() {
    setStep("processing");
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Zahlung fehlgeschlagen");
        setStep("confirm");
        return;
      }

      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 1500));
      setStep("done");
    } catch {
      setError("Netzwerkfehler");
      setStep("confirm");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-primary" />
          Escrow-Zahlung
        </CardTitle>
        <CardDescription>
          Dein Geld wird sicher verwahrt, bis die Übergabe bestätigt ist
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "overview" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium">{route}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Carrier</span>
                <span className="font-medium">{carrierName}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-semibold">Gesamtbetrag</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <Shield className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
              <span>
                Dein Geld wird in einem sicheren Escrow-Konto verwahrt. Die Auszahlung
                an den Carrier erfolgt erst nach bestätigter Übergabe.
              </span>
            </div>

            <Button className="w-full gap-2" onClick={() => setStep("method")}>
              Jetzt bezahlen <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === "method" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Kreditkarte</div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-4 rounded-lg border-2 text-center transition-colors ${
                  paymentMethod === "paypal"
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <Wallet className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">PayPal</div>
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Kartennummer</Label>
                  <Input placeholder="4242 4242 4242 4242" maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Gültig bis</Label>
                    <Input placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input placeholder="123" maxLength={4} type="password" />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="p-6 text-center text-sm text-muted-foreground bg-muted rounded-lg">
                Du wirst nach der Bestätigung zu PayPal weitergeleitet.
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("overview")}>Zurück</Button>
              <Button className="flex-1 gap-2" onClick={() => setStep("confirm")}>
                Weiter <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                {error}
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zahlungsmethode</span>
                <span className="font-medium">
                  {paymentMethod === "card" ? "Kreditkarte" : "PayPal"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Betrag</span>
                <span className="font-bold text-primary">{formatCurrency(amount)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span>256-Bit SSL-verschlüsselte Verbindung</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("method")}>Zurück</Button>
              <Button className="flex-1 gap-2" onClick={processPayment}>
                <Lock className="h-4 w-4" />
                {formatCurrency(amount)} bezahlen
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="py-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div>
              <p className="font-semibold">Zahlung wird verarbeitet...</p>
              <p className="text-sm text-muted-foreground">Bitte warte einen Moment</p>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
            <div>
              <p className="font-semibold text-lg">Zahlung erfolgreich!</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(amount)} wird sicher im Escrow verwahrt
              </p>
            </div>
            <Badge variant="success" className="gap-1">
              <Shield className="h-3 w-3" />
              Escrow aktiv
            </Badge>
            <Button className="w-full" onClick={onComplete}>
              Weiter zum Chat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
