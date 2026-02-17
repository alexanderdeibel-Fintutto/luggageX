"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, CheckCircle2, Loader2, X } from "lucide-react";

interface ReportDialogProps {
  type: "user" | "offer" | "match";
  targetId: string;
  onClose: () => void;
}

const REASONS = [
  { value: "spam", label: "Spam oder Betrug" },
  { value: "inappropriate", label: "Unangemessener Inhalt" },
  { value: "fake", label: "Gefälschtes Profil/Angebot" },
  { value: "prohibited", label: "Verbotene Gegenstände" },
  { value: "harassment", label: "Belästigung" },
  { value: "other", label: "Sonstiges" },
];

export function ReportDialog({ type, targetId, onClose }: ReportDialogProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!reason) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, targetId, reason, description }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 2000);
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card className="border-2 border-green-500/30">
        <CardContent className="py-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
          <p className="font-medium">Meldung eingegangen</p>
          <p className="text-sm text-muted-foreground">Wir prüfen den Fall und melden uns bei Bedarf.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-destructive/20">
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-destructive" />
            <h3 className="font-semibold text-sm">
              {type === "user" ? "Nutzer" : type === "offer" ? "Angebot" : "Match"} melden
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`text-xs px-3 py-2 rounded-lg border text-left transition-colors ${
                  reason === r.value
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "hover:border-muted-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Weitere Details (optional)..."
            rows={2}
            className="text-sm"
          />

          <Button
            onClick={handleSubmit}
            disabled={!reason || submitting}
            variant="destructive"
            size="sm"
            className="w-full gap-2"
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Flag className="h-3.5 w-3.5" />}
            Meldung absenden
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
