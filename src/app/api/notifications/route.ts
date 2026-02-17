import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET: Fetch user's notifications (unread messages + match updates)
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  // Unread messages
  const unreadMessages = await prisma.message.findMany({
    where: {
      receiverId: user.id,
      read: false,
    },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true } },
      match: {
        select: {
          id: true,
          offer: { select: { departureAirport: true, arrivalAirport: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Recent match status changes (matches where user is involved)
  const recentMatches = await prisma.match.findMany({
    where: {
      OR: [
        { offer: { userId: user.id } },
        { request: { userId: user.id } },
      ],
      status: { in: ["proposed", "accepted", "in_transit", "completed"] },
      updatedAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
      },
    },
    include: {
      offer: {
        select: {
          departureAirport: true,
          arrivalAirport: true,
          userId: true,
          user: { select: { name: true } },
        },
      },
      request: {
        select: {
          departureCity: true,
          arrivalCity: true,
          userId: true,
          user: { select: { name: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 10,
  });

  const notifications = [
    ...unreadMessages.map((msg) => ({
      id: `msg-${msg.id}`,
      type: "message" as const,
      title: `Neue Nachricht von ${msg.sender.name}`,
      description: msg.content.length > 60 ? msg.content.slice(0, 60) + "..." : msg.content,
      route: msg.match.offer.departureAirport + " → " + msg.match.offer.arrivalAirport,
      matchId: msg.matchId,
      createdAt: msg.createdAt,
      read: false,
    })),
    ...recentMatches.map((m) => {
      const isCarrier = m.offer.userId === user.id;
      const otherName = isCarrier ? m.request.user.name : m.offer.user.name;
      const statusLabel =
        m.status === "proposed" ? "Neues Match vorgeschlagen" :
        m.status === "accepted" ? "Match akzeptiert" :
        m.status === "in_transit" ? "Übergabe gestartet" :
        m.status === "completed" ? "Deal abgeschlossen" : m.status;
      return {
        id: `match-${m.id}`,
        type: "match" as const,
        title: statusLabel,
        description: `${otherName} - ${m.offer.departureAirport} → ${m.offer.arrivalAirport}`,
        route: m.offer.departureAirport + " → " + m.offer.arrivalAirport,
        matchId: m.id,
        createdAt: m.updatedAt,
        read: true,
      };
    }),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = unreadMessages.length;

  return NextResponse.json({ notifications, unreadCount });
}

// POST: Mark messages as read
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const body = await request.json();
  const { matchId } = body;

  if (matchId) {
    await prisma.message.updateMany({
      where: {
        matchId,
        receiverId: user.id,
        read: false,
      },
      data: { read: true },
    });
  } else {
    // Mark all as read
    await prisma.message.updateMany({
      where: {
        receiverId: user.id,
        read: false,
      },
      data: { read: true },
    });
  }

  return NextResponse.json({ success: true });
}
