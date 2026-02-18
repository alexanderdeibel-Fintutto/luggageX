import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  // Total offers created
  const totalOffers = await prisma.luggageOffer.count({
    where: { userId: user.id },
  });

  const activeOffers = await prisma.luggageOffer.count({
    where: { userId: user.id, status: "active" },
  });

  // Matches as carrier
  const carrierMatches = await prisma.match.findMany({
    where: { offer: { userId: user.id } },
    include: {
      offer: { select: { departureAirport: true, arrivalAirport: true, departureCity: true, arrivalCity: true } },
      transaction: { select: { amount: true, status: true } },
    },
  });

  // Matches as sender
  const senderMatches = await prisma.match.findMany({
    where: { request: { userId: user.id } },
    include: {
      offer: { select: { departureAirport: true, arrivalAirport: true } },
      transaction: { select: { amount: true, status: true } },
    },
  });

  const completedAsCarrier = carrierMatches.filter((m) => m.status === "completed").length;
  const completedAsSender = senderMatches.filter((m) => m.status === "completed").length;

  // Revenue from completed matches (as carrier)
  const totalEarnings = carrierMatches
    .filter((m) => m.status === "completed" && m.transaction)
    .reduce((sum, m) => sum + (m.transaction?.amount || m.agreedPrice || 0), 0);

  // Total spent (as sender)
  const totalSpent = senderMatches
    .filter((m) => m.status === "completed" && m.transaction)
    .reduce((sum, m) => sum + (m.transaction?.amount || m.agreedPrice || 0), 0);

  // Average deal value
  const avgDealValue = completedAsCarrier > 0 ? totalEarnings / completedAsCarrier : 0;

  // Top routes (as carrier)
  const routeCounts: Record<string, { count: number; from: string; to: string; fromCity: string; toCity: string }> = {};
  carrierMatches.forEach((m) => {
    const key = `${m.offer.departureAirport}-${m.offer.arrivalAirport}`;
    if (!routeCounts[key]) {
      routeCounts[key] = {
        count: 0,
        from: m.offer.departureAirport,
        to: m.offer.arrivalAirport,
        fromCity: m.offer.departureCity,
        toCity: m.offer.arrivalCity,
      };
    }
    routeCounts[key].count++;
  });
  const topRoutes = Object.values(routeCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Monthly activity (last 6 months)
  const monthlyActivity: { month: string; deals: number; earnings: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const monthLabel = monthStart.toLocaleDateString("de-DE", { month: "short", year: "2-digit" });

    const monthDeals = carrierMatches.filter((m) => {
      const date = new Date(m.createdAt);
      return m.status === "completed" && date >= monthStart && date <= monthEnd;
    });

    monthlyActivity.push({
      month: monthLabel,
      deals: monthDeals.length,
      earnings: monthDeals.reduce((sum, m) => sum + (m.transaction?.amount || m.agreedPrice || 0), 0),
    });
  }

  // Reviews
  const reviews = await prisma.review.findMany({
    where: { toUserId: user.id },
  });
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) ratingDistribution[r.rating - 1]++;
  });

  return NextResponse.json({
    stats: {
      totalOffers,
      activeOffers,
      completedAsCarrier,
      completedAsSender,
      totalEarnings: Math.round(totalEarnings * 100) / 100,
      totalSpent: Math.round(totalSpent * 100) / 100,
      avgDealValue: Math.round(avgDealValue * 100) / 100,
      rating: user.rating,
      totalReviews: reviews.length,
      ratingDistribution,
      topRoutes,
      monthlyActivity,
    },
  });
}
