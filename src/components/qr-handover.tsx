"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  CheckCircle2,
  Shield,
  Camera,
  Copy,
  Check,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface QrHandoverProps {
  matchId: string;
  handoverCode: string | null;
  pickupConfirmed: boolean;
  pickupConfirmedAt: string | null;
  dropoffConfirmed: boolean;
  dropoffConfirmedAt: string | null;
  isCarrier: boolean;
  isSender: boolean;
  escrowAmount: number | null;
  onAction: (action: string, code?: string) => void;
}

// Simple QR-like visual using the handover code
function QrVisual({ code }: { code: string }) {
  // Generate a deterministic pattern from the code
  const hash = code.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells: boolean[][] = [];
  for (let row = 0; row < 9; row++) {
    cells[row] = [];
    for (let col = 0; col < 9; col++) {
      // Fixed corners (finder patterns)
      if (
        (row < 3 && col < 3) ||
        (row < 3 && col > 5) ||
        (row > 5 && col < 3)
      ) {
        cells[row][col] = (row === 1 && col === 1) || (row === 1 && col === 7) || (row === 7 && col === 1) ||
          row === 0 || row === 2 || col === 0 || col === 2 ||
          (col === 6 && row < 3) || (col === 8 && row < 3) ||
          (row === 6 && col < 3) || (row === 8 && col < 3);
      } else {
        cells[row][col] = ((hash * (row + 1) * (col + 1) + row * 7 + col * 13) % 3) !== 0;
      }
    }
  }

  return (
    <div className="inline-flex flex-col gap-[2px] p-3 bg-white rounded-lg">
      {cells.map((row, ri) => (
        <div key={ri} className="flex gap-[2px]">
          {row.map((filled, ci) => (
            <div
              key={ci}
              className={`w-4 h-4 rounded-[1px] ${filled ? "bg-foreground" : "bg-transparent"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function QrHandover({
  matchId,
  handoverCode,
  pickupConfirmed,
  pickupConfirmedAt,
  dropoffConfirmed,
  dropoffConfirmedAt,
  isCarrier,
  isSender,
  escrowAmount,
  onAction,
}: QrHandoverProps) {
  const [verifyCode, setVerifyCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  function copyCode() {
    if (handoverCode) {
      navigator.clipboard.writeText(handoverCode).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleVerifyAndConfirm(action: string) {
    if (!pickupConfirmed && verifyCode !== handoverCode) {
      return; // Code doesn't match
    }
    onAction(action);
    setShowVerify(false);
    setVerifyCode("");
  }

  // Steps
  const steps = [
    {
      label: "Abholung",
      done: pickupConfirmed,
      date: pickupConfirmedAt,
      description: isCarrier
        ? "Sendung vom Sender entgegennehmen"
        : "Sendung dem Carrier übergeben",
    },
    {
      label: "Transport",
      done: pickupConfirmed && !dropoffConfirmed,
      active: pickupConfirmed && !dropoffConfirmed,
      description: "Sendung wird transportiert",
    },
    {
      label: "Abgabe",
      done: dropoffConfirmed,
      date: dropoffConfirmedAt,
      description: isCarrier
        ? "Sendung an Empfänger übergeben"
        : "Sendung vom Carrier entgegennehmen",
    },
  ];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <QrCode className="h-5 w-5 text-primary" />
          Übergabeprotokoll
          {escrowAmount && (
            <Badge variant="success" className="ml-auto gap-1 text-xs">
              <Shield className="h-3 w-3" />
              {formatCurrency(escrowAmount)} gesichert
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        {handoverCode && (
          <div className="text-center space-y-3">
            <QrVisual code={handoverCode} />
            <div>
              <div className="text-xs text-muted-foreground mb-1">Übergabe-Code</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-mono font-bold tracking-[0.3em]">
                  {handoverCode}
                </span>
                <button onClick={copyCode} className="text-muted-foreground hover:text-foreground transition-colors">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isSender
                  ? "Teile diesen Code mit dem Carrier bei der Übergabe"
                  : "Lass dir diesen Code vom Sender zeigen"}
              </p>
            </div>
          </div>
        )}

        {/* Step Progress */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    step.done
                      ? "bg-green-500 text-white"
                      : step.active
                      ? "bg-primary text-primary-foreground animate-pulse"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">{i + 1}</span>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-px min-h-[32px] ${
                      step.done ? "bg-green-500" : "bg-border"
                    }`}
                  />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${step.done ? "text-green-600" : ""}`}>
                    {step.label}
                  </span>
                  {step.done && step.date && (
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(step.date)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        {!pickupConfirmed && (
          <div className="space-y-3">
            {showVerify ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Übergabe-Code eingeben:</p>
                <div className="flex gap-2">
                  <Input
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
                    placeholder="Code eingeben..."
                    className="font-mono tracking-wider text-center"
                    maxLength={8}
                  />
                  <Button
                    onClick={() => handleVerifyAndConfirm("confirm_pickup")}
                    disabled={verifyCode.length < 4}
                    className="gap-2 shrink-0"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Bestätigen
                  </Button>
                </div>
                {verifyCode && verifyCode !== handoverCode && verifyCode.length >= 4 && (
                  <p className="text-xs text-destructive">Code stimmt nicht überein</p>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowVerify(false)}>
                  Abbrechen
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowVerify(true)}
                  className="flex-1 gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Abholung bestätigen
                </Button>
              </div>
            )}
          </div>
        )}

        {pickupConfirmed && !dropoffConfirmed && (
          <Button
            onClick={() => onAction("confirm_dropoff")}
            className="w-full gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Abgabe bestätigen
          </Button>
        )}

        {dropoffConfirmed && (
          <div className="text-center py-2">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">Übergabe abgeschlossen</p>
            {escrowAmount && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(escrowAmount)} wird an den Carrier freigegeben
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
