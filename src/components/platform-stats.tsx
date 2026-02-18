"use client";

import { useState, useEffect } from "react";
import { Users, Plane, Handshake, CheckCircle2 } from "lucide-react";

interface Stats {
  users: number;
  activeOffers: number;
  totalMatches: number;
  completedDeals: number;
}

export function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setStats(data.stats))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const items = [
    { icon: Users, label: "Nutzer", value: stats.users, color: "text-primary" },
    { icon: Plane, label: "Aktive Angebote", value: stats.activeOffers, color: "text-primary" },
    { icon: Handshake, label: "Matches", value: stats.totalMatches, color: "text-accent" },
    { icon: CheckCircle2, label: "Abgeschlossen", value: stats.completedDeals, color: "text-green-500" },
  ];

  return (
    <section className="py-8 border-b">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <item.icon className={`h-5 w-5 mx-auto mb-1 ${item.color}`} />
              <div className="text-2xl sm:text-3xl font-bold">{item.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
