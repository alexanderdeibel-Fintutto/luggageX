import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      offer: {
        include: {
          user: { select: { id: true, name: true, rating: true, verified: true, avatarUrl: true, phone: true } },
        },
      },
      request: {
        include: {
          user: { select: { id: true, name: true, rating: true, verified: true, avatarUrl: true, phone: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          sender: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
      reviews: true,
      transaction: true,
    },
  });

  if (!match) {
    return NextResponse.json({ error: "Match nicht gefunden" }, { status: 404 });
  }

  // Only participants can view
  if (match.offer.userId !== user.id && match.request.userId !== user.id) {
    return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
  }

  return NextResponse.json({ match });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  const match = await prisma.match.findUnique({
    where: { id },
    include: { offer: true, request: true },
  });

  if (!match) {
    return NextResponse.json({ error: "Match nicht gefunden" }, { status: 404 });
  }

  if (match.offer.userId !== user.id && match.request.userId !== user.id) {
    return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
  }

  switch (action) {
    case "accept":
      await prisma.match.update({
        where: { id },
        data: { status: "accepted" },
      });
      break;

    case "decline":
      await prisma.match.update({
        where: { id },
        data: { status: "declined" },
      });
      break;

    case "confirm_pickup":
      await prisma.match.update({
        where: { id },
        data: {
          pickupConfirmed: true,
          pickupConfirmedAt: new Date(),
          status: "in_transit",
        },
      });
      break;

    case "confirm_dropoff":
      await prisma.match.update({
        where: { id },
        data: {
          dropoffConfirmed: true,
          dropoffConfirmedAt: new Date(),
          status: "completed",
        },
      });
      // Update user stats
      await prisma.user.update({
        where: { id: match.offer.userId },
        data: { totalDeals: { increment: 1 } },
      });
      await prisma.user.update({
        where: { id: match.request.userId },
        data: { totalDeals: { increment: 1 } },
      });
      // Update offer/request status
      await prisma.luggageOffer.update({
        where: { id: match.offerId },
        data: { status: "completed" },
      });
      await prisma.luggageRequest.update({
        where: { id: match.requestId },
        data: { status: "completed" },
      });
      break;

    case "cancel":
      await prisma.match.update({
        where: { id },
        data: { status: "cancelled" },
      });
      break;

    default:
      return NextResponse.json({ error: "Ungültige Aktion" }, { status: 400 });
  }

  const updated = await prisma.match.findUnique({ where: { id } });
  return NextResponse.json({ match: updated });
}
