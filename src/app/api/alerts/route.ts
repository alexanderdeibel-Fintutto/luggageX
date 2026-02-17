import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET: List user's route alerts
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const alerts = await prisma.routeAlert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // For each alert, count matching active offers
  const alertsWithCounts = await Promise.all(
    alerts.map(async (alert) => {
      const where: Record<string, unknown> = {
        status: "active",
      };

      if (alert.departureAirport) {
        where.departureAirport = alert.departureAirport;
      } else {
        where.departureCity = { contains: alert.departureCity };
      }

      if (alert.arrivalAirport) {
        where.arrivalAirport = alert.arrivalAirport;
      } else {
        where.arrivalCity = { contains: alert.arrivalCity };
      }

      if (alert.earliestDate) {
        where.departureDate = { gte: alert.earliestDate };
      }
      if (alert.latestDate) {
        if (where.departureDate) {
          (where.departureDate as Record<string, unknown>).lte = alert.latestDate;
        } else {
          where.departureDate = { lte: alert.latestDate };
        }
      }
      if (alert.maxPrice) {
        where.OR = [
          { flatPrice: { lte: alert.maxPrice } },
          { pricePerKg: { lte: alert.maxPrice } },
        ];
      }
      if (alert.minWeight) {
        where.availableWeight = { gte: alert.minWeight };
      }

      const matchCount = await prisma.luggageOffer.count({ where });

      return {
        ...alert,
        matchingOffers: matchCount,
      };
    })
  );

  return NextResponse.json({ alerts: alertsWithCounts });
}

// POST: Create a route alert
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { departureCity, arrivalCity, departureAirport, arrivalAirport, earliestDate, latestDate, maxPrice, minWeight } = body;

    if (!departureCity || !arrivalCity) {
      return NextResponse.json(
        { error: "Abgangs- und Zielort sind erforderlich" },
        { status: 400 }
      );
    }

    // Limit to 10 alerts per user
    const count = await prisma.routeAlert.count({ where: { userId: user.id } });
    if (count >= 10) {
      return NextResponse.json(
        { error: "Maximal 10 Route-Alerts erlaubt" },
        { status: 400 }
      );
    }

    const alert = await prisma.routeAlert.create({
      data: {
        userId: user.id,
        departureCity,
        arrivalCity,
        departureAirport: departureAirport || null,
        arrivalAirport: arrivalAirport || null,
        earliestDate: earliestDate ? new Date(earliestDate) : null,
        latestDate: latestDate ? new Date(latestDate) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        minWeight: minWeight ? parseFloat(minWeight) : null,
      },
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch (error) {
    console.error("Create alert error:", error);
    return NextResponse.json(
      { error: "Alert konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a route alert
export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const alertId = searchParams.get("id");
  if (!alertId) {
    return NextResponse.json({ error: "Alert-ID fehlt" }, { status: 400 });
  }

  const alert = await prisma.routeAlert.findUnique({ where: { id: alertId } });
  if (!alert || alert.userId !== user.id) {
    return NextResponse.json({ error: "Nicht berechtigt" }, { status: 403 });
  }

  await prisma.routeAlert.delete({ where: { id: alertId } });

  return NextResponse.json({ success: true });
}
