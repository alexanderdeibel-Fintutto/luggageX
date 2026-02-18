import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  // Simple admin check - in production use role-based auth
  // For now, allow any authenticated user to view admin stats
  // TODO: Add proper admin role check

  const [
    totalUsers,
    verifiedUsers,
    totalOffers,
    activeOffers,
    totalRequests,
    activeRequests,
    totalMatches,
    completedMatches,
    totalTransactions,
    totalReviews,
    totalMessages,
    totalBookmarks,
    totalReports,
    totalContacts,
    recentUsers,
    recentOffers,
    topRoutes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { verified: true } }),
    prisma.luggageOffer.count(),
    prisma.luggageOffer.count({ where: { status: "active" } }),
    prisma.luggageRequest.count(),
    prisma.luggageRequest.count({ where: { status: "active" } }),
    prisma.match.count(),
    prisma.match.count({ where: { status: "completed" } }),
    prisma.transaction.count(),
    prisma.review.count(),
    prisma.message.count(),
    prisma.bookmark.count(),
    prisma.contactMessage.count().catch(() => 0),
    prisma.contactMessage.count({ where: { status: "open" } }).catch(() => 0),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, verified: true, createdAt: true },
    }),
    prisma.luggageOffer.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { name: true } },
      },
    }),
    prisma.luggageOffer.groupBy({
      by: ["departureAirport", "arrivalAirport"],
      _count: true,
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  // Calculate revenue
  const transactions = await prisma.transaction.findMany({
    where: { status: { in: ["held", "released"] } },
  });
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Average rating
  const reviews = await prisma.review.aggregate({
    _avg: { rating: true },
  });

  return NextResponse.json({
    overview: {
      totalUsers,
      verifiedUsers,
      totalOffers,
      activeOffers,
      totalRequests,
      activeRequests,
      totalMatches,
      completedMatches,
      totalTransactions,
      totalRevenue,
      totalReviews,
      avgRating: reviews._avg.rating || 0,
      totalMessages,
      totalBookmarks,
      totalReports,
      openContacts: totalContacts,
    },
    recentUsers,
    recentOffers: recentOffers.map((o) => ({
      id: o.id,
      route: `${o.departureAirport} → ${o.arrivalAirport}`,
      departureDate: o.departureDate,
      status: o.status,
      userName: o.user.name,
      createdAt: o.createdAt,
    })),
    topRoutes: topRoutes.map((r) => ({
      route: `${r.departureAirport} → ${r.arrivalAirport}`,
      count: r._count,
    })),
  });
}
