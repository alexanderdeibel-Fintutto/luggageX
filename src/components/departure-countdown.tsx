"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface DepartureCountdownProps {
  departureDate: string;
  compact?: boolean;
}

export function DepartureCountdown({ departureDate, compact = false }: DepartureCountdownProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "soon" | "urgent" | "past">("normal");

  useEffect(() => {
    function update() {
      const now = Date.now();
      const dep = new Date(departureDate).getTime();
      const diff = dep - now;

      if (diff <= 0) {
        setTimeLeft("Abgeflogen");
        setUrgency("past");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 3) {
        setTimeLeft(`${days}T ${hours}h`);
        setUrgency("normal");
      } else if (days > 0) {
        setTimeLeft(`${days}T ${hours}h`);
        setUrgency("soon");
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}min`);
        setUrgency("urgent");
      } else {
        setTimeLeft(`${minutes} Min.`);
        setUrgency("urgent");
      }
    }

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [departureDate]);

  const config = {
    normal: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      icon: <Clock className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    },
    soon: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-600 dark:text-amber-400",
      icon: <Clock className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    },
    urgent: {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-600 dark:text-red-400",
      icon: <AlertTriangle className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    },
    past: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      icon: <CheckCircle2 className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />,
    },
  };

  const c = config[urgency];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium ${c.text}`}>
        {c.icon} {timeLeft}
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.icon}
      <span>{urgency === "past" ? "Abgeflogen" : `Abflug in ${timeLeft}`}</span>
    </div>
  );
}
