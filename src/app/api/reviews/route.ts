import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchId, rating, comment } = body;

    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { offer: true, request: true },
    });

    if (!match || match.status !== "completed") {
      return NextResponse.json(
        { error: "Match nicht gefunden oder noch nicht abgeschlossen" },
        { status: 400 }
      );
    }

    const isOfferOwner = match.offer.userId === user.id;
    const isRequestOwner = match.request.userId === user.id;

    if (!isOfferOwner && !isRequestOwner) {
      return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
    }

    const toUserId = isOfferOwner ? match.request.userId : match.offer.userId;

    // Check if already reviewed
    const existing = await prisma.review.findFirst({
      where: { matchId, fromUserId: user.id },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bereits bewertet" },
        { status: 409 }
      );
    }

    const review = await prisma.review.create({
      data: {
        matchId,
        fromUserId: user.id,
        toUserId,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
      },
    });

    // Update user rating
    const allReviews = await prisma.review.findMany({
      where: { toUserId },
    });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await prisma.user.update({
      where: { id: toUserId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Bewertung konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
