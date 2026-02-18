import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      offer: {
        select: {
          id: true,
          departureAirport: true,
          arrivalAirport: true,
          departureCity: true,
          arrivalCity: true,
          departureDate: true,
          availableWeight: true,
          flatPrice: true,
          pricePerKg: true,
          status: true,
          user: { select: { name: true, rating: true, verified: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookmarks });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { offerId } = await request.json();

  // Toggle bookmark
  const existing = await prisma.bookmark.findUnique({
    where: { userId_offerId: { userId: user.id, offerId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({
    data: { userId: user.id, offerId },
  });

  return NextResponse.json({ bookmarked: true }, { status: 201 });
}
