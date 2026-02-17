import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const offer = await prisma.luggageOffer.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, rating: true, totalDeals: true, verified: true, avatarUrl: true, bio: true },
      },
      matches: {
        include: {
          request: {
            include: {
              user: { select: { id: true, name: true, rating: true, verified: true } },
            },
          },
        },
      },
    },
  });

  if (!offer) {
    return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json({ offer });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { id } = await params;
  const offer = await prisma.luggageOffer.findUnique({ where: { id } });

  if (!offer || offer.userId !== user.id) {
    return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
  }

  await prisma.luggageOffer.update({
    where: { id },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ success: true });
}
