import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// POST: Create an escrow payment for a match
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchId } = body;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { offer: true, request: true, transaction: true },
    });

    if (!match) {
      return NextResponse.json({ error: "Match nicht gefunden" }, { status: 404 });
    }

    if (match.transaction) {
      return NextResponse.json({ error: "Zahlung existiert bereits" }, { status: 409 });
    }

    if (match.status !== "accepted") {
      return NextResponse.json({ error: "Match muss zuerst akzeptiert werden" }, { status: 400 });
    }

    // Only the sender (request owner) can pay
    if (match.request.userId !== user.id) {
      return NextResponse.json({ error: "Nur der Sender kann bezahlen" }, { status: 403 });
    }

    const amount = match.agreedPrice || 0;

    const transaction = await prisma.transaction.create({
      data: {
        matchId,
        userId: user.id,
        amount,
        status: "held", // simulate escrow hold
        paidAt: new Date(),
      },
    });

    // Update match status to paid
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "paid" },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Zahlung konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}

// GET: Get transaction for a match
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const matchId = request.nextUrl.searchParams.get("matchId");
  if (!matchId) {
    return NextResponse.json({ error: "Match-ID erforderlich" }, { status: 400 });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { matchId },
  });

  return NextResponse.json({ transaction });
}
