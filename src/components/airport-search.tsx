"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { searchAirports, type Airport } from "@/lib/airports";
import { MapPin } from "lucide-react";

interface AirportSearchProps {
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  id?: string;
}

export function AirportSearch({ value, onChange, placeholder, id }: AirportSearchProps) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInput(val: string) {
    setQuery(val);
    if (val.length >= 2) {
      setResults(searchAirports(val));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }

  function selectAirport(airport: Airport) {
    setQuery(`${airport.code} - ${airport.city}`);
    onChange(airport.code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <Input
        id={id}
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        placeholder={placeholder || "Flughafen suchen..."}
      />
      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-popover border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((airport) => (
            <button
              key={airport.code}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2 text-sm"
              onClick={() => selectAirport(airport)}
            >
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium">{airport.code}</span>
              <span className="text-muted-foreground">
                {airport.name}, {airport.city}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
