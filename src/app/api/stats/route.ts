import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Public platform statistics
export async function GET() {
  try {
    const [userCount, offerCount, matchCount, completedCount] = await Promise.all([
      prisma.user.count(),
      prisma.luggageOffer.count({ where: { status: "active" } }),
      prisma.match.count(),
      prisma.match.count({ where: { status: "completed" } }),
    ]);

    return NextResponse.json({
      stats: {
        users: userCount,
        activeOffers: offerCount,
        totalMatches: matchCount,
        completedDeals: completedCount,
      },
    });
  } catch {
    return NextResponse.json({
      stats: { users: 0, activeOffers: 0, totalMatches: 0, completedDeals: 0 },
    });
  }
}
