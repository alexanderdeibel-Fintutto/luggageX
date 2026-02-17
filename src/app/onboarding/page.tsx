"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Package,
  Shield,
  ArrowRight,
  CheckCircle2,
  Luggage,
} from "lucide-react";

type UserType = "carrier" | "sender" | "both" | null;

const STEPS = [
  { title: "Willkommen", subtitle: "Erzähl uns von dir" },
  { title: "Deine Rolle", subtitle: "Wie möchtest du LuggageX nutzen?" },
  { title: "Los geht's", subtitle: "Du bist bereit!" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [userType, setUserType] = useState<UserType>(null);

  function handleFinish() {
    localStorage.setItem("luggagex-onboarded", "true");
    if (userType === "carrier") {
      router.push("/offers/new");
    } else if (userType === "sender") {
      router.push("/search");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i <= step ? "bg-primary w-10" : "bg-muted w-6"
              }`}
            />
          ))}
        </div>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Luggage className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Willkommen bei LuggageX!</h1>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Die Plattform, die Fluggäste mit freiem Gepäck und Versender auf der gleichen Route verbindet.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-2">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-xs text-muted-foreground">Einstellen</div>
                </div>
                <div>
                  <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-xs text-muted-foreground">Matchen</div>
                </div>
                <div>
                  <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-xs text-muted-foreground">Übergeben</div>
                </div>
              </div>

              <Button onClick={() => setStep(1)} className="gap-2" size="lg">
                Weiter <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-1">Wie möchtest du starten?</h1>
              <p className="text-muted-foreground">Du kannst beides jederzeit nutzen</p>
            </div>

            <Card
              className={`cursor-pointer transition-all ${
                userType === "carrier"
                  ? "border-2 border-primary shadow-md"
                  : "hover:border-primary/30"
              }`}
              onClick={() => setUserType("carrier")}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Plane className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Ich fliege & habe Platz</h3>
                  <p className="text-sm text-muted-foreground">
                    Verdiene Geld, indem du ungenutztes Gepäck anbietest
                  </p>
                </div>
                {userType === "carrier" && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                userType === "sender"
                  ? "border-2 border-accent shadow-md"
                  : "hover:border-accent/30"
              }`}
              onClick={() => setUserType("sender")}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Package className="h-7 w-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Ich suche Gepäcktransport</h3>
                  <p className="text-sm text-muted-foreground">
                    Finde Mitflieger, die deine Sachen günstig mitnehmen
                  </p>
                </div>
                {userType === "sender" && <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />}
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                userType === "both"
                  ? "border-2 border-green-500 shadow-md"
                  : "hover:border-green-500/30"
              }`}
              onClick={() => setUserType("both")}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-green-100 dark:bg-green-950/30 flex items-center justify-center shrink-0">
                  <Luggage className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Beides</h3>
                  <p className="text-sm text-muted-foreground">
                    Ich möchte sowohl anbieten als auch suchen
                  </p>
                </div>
                {userType === "both" && <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />}
              </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(0)}>Zurück</Button>
              <Button onClick={() => setStep(2)} disabled={!userType} className="gap-2">
                Weiter <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Ready */}
        {step === 2 && (
          <Card className="border-2 border-green-500/20">
            <CardContent className="pt-8 pb-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Du bist bereit!</h1>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {userType === "carrier"
                  ? "Erstelle dein erstes Gepäck-Angebot und fange an zu verdienen."
                  : userType === "sender"
                  ? "Durchsuche verfügbare Angebote und finde den perfekten Carrier."
                  : "Erstelle ein Angebot oder suche nach Carriern - du entscheidest."}
              </p>

              <div className="space-y-3 max-w-xs mx-auto">
                <Button onClick={handleFinish} className="w-full gap-2" size="lg">
                  {userType === "carrier" ? (
                    <>
                      <Plane className="h-5 w-5" /> Erstes Angebot erstellen
                    </>
                  ) : userType === "sender" ? (
                    <>
                      <Package className="h-5 w-5" /> Angebote durchsuchen
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-5 w-5" /> Zum Dashboard
                    </>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => { localStorage.setItem("luggagex-onboarded", "true"); router.push("/dashboard"); }}>
                  Überspringen
                </Button>
              </div>

              <div className="flex justify-start pt-4">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Zurück</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
