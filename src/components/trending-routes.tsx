"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plane, ArrowRight } from "lucide-react";

interface Route {
  from: string;
  to: string;
  count: number;
  avgPrice: number | null;
}

export function TrendingRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    fetch("/api/routes/trending")
      .then((r) => r.ok ? r.json() : { routes: [] })
      .then((data) => setRoutes(data.routes || []))
      .catch(() => {});
  }, []);

  if (routes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          Beliebte Routen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {routes.map((route, i) => (
            <Link
              key={`${route.from}-${route.to}`}
              href={`/search?from=${route.from}&to=${route.to}`}
            >
              <div className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-5">
                    #{i + 1}
                  </span>
                  <Plane className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-sm">{route.from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium text-sm">{route.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {route.count} Angebote
                  </Badge>
                  {route.avgPrice != null && (
                    <span className="text-xs text-muted-foreground">
                      ~{route.avgPrice.toFixed(0)} EUR
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
