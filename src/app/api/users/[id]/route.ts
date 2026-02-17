import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Public user profile
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      bio: true,
      verified: true,
      rating: true,
      totalDeals: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
  }

  // Get user's reviews
  const reviews = await prisma.review.findMany({
    where: { toUserId: id },
    include: {
      fromUser: { select: { id: true, name: true, avatarUrl: true } },
      match: {
        select: {
          offer: { select: { departureAirport: true, arrivalAirport: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Get stats
  const [offerCount, completedAsCarrier, completedAsSender] = await Promise.all([
    prisma.luggageOffer.count({ where: { userId: id, status: "active" } }),
    prisma.match.count({
      where: { offer: { userId: id }, status: "completed" },
    }),
    prisma.match.count({
      where: { request: { userId: id }, status: "completed" },
    }),
  ]);

  return NextResponse.json({
    user,
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      response: r.response,
      respondedAt: r.respondedAt,
      createdAt: r.createdAt,
      fromUser: r.fromUser,
      route: r.match.offer.departureAirport + " → " + r.match.offer.arrivalAirport,
    })),
    stats: {
      activeOffers: offerCount,
      completedAsCarrier,
      completedAsSender,
    },
  });
}
