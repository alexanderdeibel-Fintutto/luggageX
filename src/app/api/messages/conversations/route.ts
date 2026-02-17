import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    // Get all matches the user is part of (as carrier or sender)
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { offer: { userId: user.id } },
          { request: { userId: user.id } },
        ],
      },
      include: {
        offer: {
          select: {
            departureAirport: true,
            arrivalAirport: true,
            departureCity: true,
            arrivalCity: true,
            userId: true,
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        request: {
          select: {
            departureCity: true,
            arrivalCity: true,
            userId: true,
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            content: true,
            createdAt: true,
            senderId: true,
            read: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Count unread messages per match
    const unreadCounts = await prisma.message.groupBy({
      by: ["matchId"],
      where: {
        receiverId: user.id,
        read: false,
      },
      _count: { id: true },
    });

    const unreadMap = new Map(unreadCounts.map((u) => [u.matchId, u._count.id]));

    const conversations = matches.map((match) => {
      const isCarrier = match.offer.userId === user.id;
      const partner = isCarrier ? match.request.user : match.offer.user;
      const lastMessage = match.messages[0] || null;

      return {
        matchId: match.id,
        status: match.status,
        partner,
        route: {
          from: match.offer.departureAirport,
          to: match.offer.arrivalAirport,
          fromCity: match.offer.departureCity,
          toCity: match.offer.arrivalCity,
        },
        role: isCarrier ? "carrier" : "sender",
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              isOwn: lastMessage.senderId === user.id,
              isRead: lastMessage.read,
            }
          : null,
        unreadCount: unreadMap.get(match.id) || 0,
      };
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Conversations error:", error);
    return NextResponse.json(
      { error: "Fehler beim Laden" },
      { status: 500 }
    );
  }
}
