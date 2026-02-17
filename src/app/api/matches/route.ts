import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { calculateMatchScore } from "@/lib/matching";
import { v4 as uuid } from "uuid";

// GET: Find matches for a request or list user's matches
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const requestId = searchParams.get("requestId");

  // Find matching offers for a specific request
  if (requestId) {
    const luggageRequest = await prisma.luggageRequest.findUnique({
      where: { id: requestId },
    });

    if (!luggageRequest) {
      return NextResponse.json({ error: "Gesuch nicht gefunden" }, { status: 404 });
    }

    const offers = await prisma.luggageOffer.findMany({
      where: { status: "active" },
      include: {
        user: {
          select: { id: true, name: true, rating: true, totalDeals: true, verified: true, avatarUrl: true },
        },
      },
    });

    const scored = offers
      .map((offer) => ({
        offer,
        score: calculateMatchScore(
          {
            departureAirport: offer.departureAirport,
            arrivalAirport: offer.arrivalAirport,
            departureDate: offer.departureDate,
            availableWeight: offer.availableWeight,
            sizeCategory: offer.sizeCategory,
            pricePerKg: offer.pricePerKg,
            flatPrice: offer.flatPrice,
          },
          {
            departureAirport: luggageRequest.departureAirport,
            arrivalAirport: luggageRequest.arrivalAirport,
            departureCity: luggageRequest.departureCity,
            arrivalCity: luggageRequest.arrivalCity,
            earliestDate: luggageRequest.earliestDate,
            latestDate: luggageRequest.latestDate,
            neededWeight: luggageRequest.neededWeight,
            sizeCategory: luggageRequest.sizeCategory,
            maxBudget: luggageRequest.maxBudget,
          }
        ),
      }))
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ matches: scored });
  }

  // List user's existing matches
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { offer: { userId: user.id } },
        { request: { userId: user.id } },
      ],
    },
    include: {
      offer: {
        include: {
          user: { select: { id: true, name: true, rating: true, verified: true, avatarUrl: true } },
        },
      },
      request: {
        include: {
          user: { select: { id: true, name: true, rating: true, verified: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ matches });
}

// POST: Create a match (accept an offer for a request)
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { offerId, requestId, agreedPrice } = body;

    if (!offerId || !requestId) {
      return NextResponse.json(
        { error: "Angebot-ID und Gesuch-ID erforderlich" },
        { status: 400 }
      );
    }

    const offer = await prisma.luggageOffer.findUnique({ where: { id: offerId } });
    const luggageRequest = await prisma.luggageRequest.findUnique({ where: { id: requestId } });

    if (!offer || !luggageRequest) {
      return NextResponse.json({ error: "Angebot oder Gesuch nicht gefunden" }, { status: 404 });
    }

    // User must own either the offer or the request
    if (offer.userId !== user.id && luggageRequest.userId !== user.id) {
      return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
    }

    const handoverCode = uuid().slice(0, 8).toUpperCase();

    const match = await prisma.match.create({
      data: {
        offerId,
        requestId,
        agreedPrice: agreedPrice || offer.flatPrice || (offer.pricePerKg ? offer.pricePerKg * luggageRequest.neededWeight : 0),
        handoverCode,
        score: 100,
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error("Create match error:", error);
    return NextResponse.json(
      { error: "Match konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
