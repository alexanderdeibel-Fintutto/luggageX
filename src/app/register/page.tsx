"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Luggage, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    if (data.password !== data.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Registrierung fehlgeschlagen");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Luggage className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Konto erstellen</CardTitle>
          <CardDescription>Werde Teil der LuggageX Community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Dein vollständiger Name" required minLength={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" placeholder="deine@email.de" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" name="password" type="password" placeholder="Mind. 8 Zeichen" required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Passwort wiederholen" required minLength={8} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Registrieren
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Bereits ein Konto?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Jetzt anmelden
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
