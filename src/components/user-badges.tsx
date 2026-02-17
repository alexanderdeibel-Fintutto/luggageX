"use client";

import {
  Award,
  Star,
  Shield,
  Plane,
  Package,
  Zap,
  Globe,
  Heart,
} from "lucide-react";

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  earned: boolean;
}

interface UserBadgesProps {
  totalDeals: number;
  rating: number;
  verified: boolean;
  completedAsCarrier: number;
  completedAsSender: number;
  memberSince: string;
}

export function UserBadges({
  totalDeals,
  rating,
  verified,
  completedAsCarrier,
  completedAsSender,
  memberSince,
}: UserBadgesProps) {
  const monthsActive = Math.floor(
    (Date.now() - new Date(memberSince).getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  const badges: Badge[] = [
    {
      id: "first_deal",
      label: "Erster Deal",
      description: "Ersten Transport abgeschlossen",
      icon: <Zap className="h-4 w-4" />,
      color: "text-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
      earned: totalDeals >= 1,
    },
    {
      id: "five_deals",
      label: "Routiniert",
      description: "5 Transporte abgeschlossen",
      icon: <Package className="h-4 w-4" />,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
      earned: totalDeals >= 5,
    },
    {
      id: "ten_deals",
      label: "Profi",
      description: "10 Transporte abgeschlossen",
      icon: <Award className="h-4 w-4" />,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
      earned: totalDeals >= 10,
    },
    {
      id: "top_rated",
      label: "Top bewertet",
      description: "Bewertung von 4.5+ mit mind. 3 Deals",
      icon: <Star className="h-4 w-4" />,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
      earned: rating >= 4.5 && totalDeals >= 3,
    },
    {
      id: "verified",
      label: "Verifiziert",
      description: "Identität bestätigt",
      icon: <Shield className="h-4 w-4" />,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
      earned: verified,
    },
    {
      id: "carrier_pro",
      label: "Carrier Pro",
      description: "5+ Transporte als Carrier",
      icon: <Plane className="h-4 w-4" />,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
      earned: completedAsCarrier >= 5,
    },
    {
      id: "globetrotter",
      label: "Globetrotter",
      description: "Seit 6+ Monaten aktiv",
      icon: <Globe className="h-4 w-4" />,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
      earned: monthsActive >= 6,
    },
    {
      id: "community",
      label: "Community-Held",
      description: "25+ Transporte abgeschlossen",
      icon: <Heart className="h-4 w-4" />,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
      earned: totalDeals >= 25,
    },
  ];

  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  if (earned.length === 0 && locked.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
        <Award className="h-4 w-4 text-primary" />
        Abzeichen ({earned.length}/{badges.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {earned.map((badge) => (
          <div
            key={badge.id}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${badge.bg} ${badge.color}`}
            title={badge.description}
          >
            {badge.icon}
            {badge.label}
          </div>
        ))}
        {locked.slice(0, 3).map((badge) => (
          <div
            key={badge.id}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border border-dashed border-muted-foreground/30 text-muted-foreground/50"
            title={`Noch nicht freigeschaltet: ${badge.description}`}
          >
            {badge.icon}
            {badge.label}
          </div>
        ))}
      </div>
    </div>
  );
}
