"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AirportSearch } from "@/components/airport-search";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

export function HeroSearch() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mt-8 max-w-2xl mx-auto bg-card border rounded-xl p-3 sm:p-4 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Von</label>
          <AirportSearch
            value={from}
            onChange={setFrom}
            placeholder="Abflughafen..."
          />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block shrink-0 mb-2.5" />
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Nach</label>
          <AirportSearch
            value={to}
            onChange={setTo}
            placeholder="Zielflughafen..."
          />
        </div>
        <Button type="submit" className="gap-2 w-full sm:w-auto shrink-0">
          <Search className="h-4 w-4" />
          Suchen
        </Button>
      </div>
    </form>
  );
}
