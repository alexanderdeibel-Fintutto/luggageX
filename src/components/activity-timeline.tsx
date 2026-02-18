"use client";

import {
  Plane,
  Package,
  Handshake,
  MessageSquare,
  CheckCircle2,
  Star,
  CreditCard,
  XCircle,
} from "lucide-react";

interface Match {
  id: string;
  status: string;
  agreedPrice: number | null;
  createdAt: string;
  offer: {
    departureAirport: string;
    arrivalAirport: string;
    userId: string;
  };
  request: {
    departureCity: string;
    arrivalCity: string;
    userId: string;
  };
}

interface TimelineProps {
  matches: Match[];
  userId: string;
}

interface TimelineEvent {
  id: string;
  icon: typeof Plane;
  iconColor: string;
  title: string;
  description: string;
  date: string;
  matchId: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "gerade eben";
  if (mins < 60) return `vor ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `vor ${days}d`;
  return new Date(dateStr).toLocaleDateString("de-DE");
}

const STATUS_EVENTS: Record<string, { icon: typeof Plane; color: string; label: string }> = {
  proposed: { icon: Handshake, color: "text-blue-500", label: "Match vorgeschlagen" },
  accepted: { icon: CheckCircle2, color: "text-green-500", label: "Match akzeptiert" },
  paid: { icon: CreditCard, color: "text-primary", label: "Zahlung erhalten" },
  in_transit: { icon: Package, color: "text-amber-500", label: "Sendung unterwegs" },
  handed_over: { icon: Package, color: "text-green-600", label: "Übergabe bestätigt" },
  completed: { icon: Star, color: "text-green-500", label: "Deal abgeschlossen" },
  declined: { icon: XCircle, color: "text-destructive", label: "Match abgelehnt" },
  cancelled: { icon: XCircle, color: "text-muted-foreground", label: "Deal storniert" },
};

export function ActivityTimeline({ matches, userId }: TimelineProps) {
  // Build timeline events from matches
  const events: TimelineEvent[] = matches
    .slice(0, 10)
    .map((match) => {
      const isCarrier = match.offer.userId === userId;
      const route = `${match.offer.departureAirport} → ${match.offer.arrivalAirport}`;
      const statusEvent = STATUS_EVENTS[match.status] || STATUS_EVENTS.proposed;

      return {
        id: match.id,
        icon: statusEvent.icon,
        iconColor: statusEvent.color,
        title: statusEvent.label,
        description: `${route} | als ${isCarrier ? "Carrier" : "Sender"}`,
        date: match.createdAt,
        matchId: match.id,
      };
    });

  if (events.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4">Letzte Aktivitäten</h3>
      <div className="space-y-0">
        {events.map((event, i) => {
          const Icon = event.icon;
          return (
            <div key={event.id} className="flex gap-3">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 ${event.iconColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {i < events.length - 1 && (
                  <div className="w-px h-full bg-border min-h-[24px]" />
                )}
              </div>
              {/* Content */}
              <div className="pb-4 min-w-0">
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs text-muted-foreground truncate">{event.description}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{timeAgo(event.date)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
