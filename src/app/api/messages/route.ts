import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { messageSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { matchId, content } = body;

    const parsed = messageSchema.safeParse({ content });
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

    if (!match) {
      return NextResponse.json({ error: "Match nicht gefunden" }, { status: 404 });
    }

    // Determine receiver
    const isOfferOwner = match.offer.userId === user.id;
    const isRequestOwner = match.request.userId === user.id;

    if (!isOfferOwner && !isRequestOwner) {
      return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
    }

    const receiverId = isOfferOwner ? match.request.userId : match.offer.userId;

    const message = await prisma.message.create({
      data: {
        matchId,
        senderId: user.id,
        receiverId,
        content: parsed.data.content,
      },
      include: {
        sender: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Nachricht konnte nicht gesendet werden" },
      { status: 500 }
    );
  }
}
