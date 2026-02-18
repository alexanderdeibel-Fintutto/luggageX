"use client";

import { Plane } from "lucide-react";

interface RouteVisualProps {
  departureCity: string;
  arrivalCity: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  arrivalDate: string;
  flightNumber: string;
}

export function RouteVisual({
  departureCity,
  arrivalCity,
  departureAirport,
  arrivalAirport,
  departureDate,
  arrivalDate,
  flightNumber,
}: RouteVisualProps) {
  const depTime = new Date(departureDate);
  const arrTime = new Date(arrivalDate);
  const durationMs = arrTime.getTime() - depTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="relative rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute border border-primary rounded-full"
            style={{
              width: `${100 + i * 80}px`,
              height: `${100 + i * 80}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-between">
        {/* Departure */}
        <div className="text-center">
          <div className="text-2xl font-bold">{departureAirport}</div>
          <div className="text-sm text-muted-foreground">{departureCity}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {depTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* Flight path */}
        <div className="flex-1 mx-4 sm:mx-8 relative">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-primary shrink-0" />
            <div className="flex-1 relative h-0.5 bg-gradient-to-r from-primary via-primary/60 to-primary">
              <div className="absolute left-1/2 -translate-x-1/2 -top-3">
                <Plane className="h-6 w-6 text-primary rotate-0" />
              </div>
            </div>
            <div className="h-3 w-3 rounded-full bg-primary shrink-0" />
          </div>
          <div className="text-center mt-2">
            <span className="text-xs font-medium text-primary">{flightNumber}</span>
            {hours > 0 || minutes > 0 ? (
              <span className="text-xs text-muted-foreground ml-2">
                {hours > 0 ? `${hours}h ` : ""}{minutes > 0 ? `${minutes}min` : ""}
              </span>
            ) : null}
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center">
          <div className="text-2xl font-bold">{arrivalAirport}</div>
          <div className="text-sm text-muted-foreground">{arrivalCity}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {arrTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
    </div>
  );
}
