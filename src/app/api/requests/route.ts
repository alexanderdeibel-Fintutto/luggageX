import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { luggageRequestSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status") || "active";

  const where: Record<string, unknown> = { status };
  if (from) where.departureCity = { contains: from };
  if (to) where.arrivalCity = { contains: to };

  const requests = await prisma.luggageRequest.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, rating: true, totalDeals: true, verified: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = luggageRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const luggageRequest = await prisma.luggageRequest.create({
      data: {
        userId: user.id,
        departureCity: data.departureCity,
        arrivalCity: data.arrivalCity,
        departureAirport: data.departureAirport || null,
        arrivalAirport: data.arrivalAirport || null,
        earliestDate: new Date(data.earliestDate),
        latestDate: new Date(data.latestDate),
        neededWeight: data.neededWeight,
        sizeCategory: data.sizeCategory,
        itemDescription: data.itemDescription,
        itemCategory: data.itemCategory,
        maxBudget: data.maxBudget || null,
        requestType: data.requestType,
        flightNumber: data.flightNumber || null,
        pickupPreference: data.pickupPreference,
        dropoffPreference: data.dropoffPreference,
      },
    });

    return NextResponse.json({ request: luggageRequest }, { status: 201 });
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json(
      { error: "Gesuch konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
