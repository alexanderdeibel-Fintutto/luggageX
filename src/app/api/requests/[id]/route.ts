import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const luggageRequest = await prisma.luggageRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, rating: true, totalDeals: true, verified: true, avatarUrl: true, bio: true },
      },
      matches: {
        include: {
          offer: {
            include: {
              user: { select: { id: true, name: true, rating: true, verified: true } },
            },
          },
        },
      },
    },
  });

  if (!luggageRequest) {
    return NextResponse.json({ error: "Gesuch nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json({ request: luggageRequest });
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
  const luggageRequest = await prisma.luggageRequest.findUnique({ where: { id } });

  if (!luggageRequest || luggageRequest.userId !== user.id) {
    return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
  }

  await prisma.luggageRequest.update({
    where: { id },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ success: true });
}
