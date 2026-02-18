import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { luggageOfferSchema } from "@/lib/validations";
import { getAirport, getAirlineByFlightNumber } from "@/lib/airports";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");
  const minWeight = searchParams.get("minWeight");
  const maxPrice = searchParams.get("maxPrice");
  const size = searchParams.get("size");
  const negotiable = searchParams.get("negotiable");
  const status = searchParams.get("status") || "active";

  const where: Record<string, unknown> = { status };

  if (from) where.departureAirport = from;
  if (to) where.arrivalAirport = to;
  if (date) {
    const d = new Date(date);
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    where.departureDate = { gte: dayStart, lte: dayEnd };
  }
  if (minWeight) where.availableWeight = { gte: parseFloat(minWeight) };
  if (size) where.sizeCategory = size;
  if (negotiable === "true") where.negotiable = true;
  if (maxPrice) {
    const mp = parseFloat(maxPrice);
    where.OR = [
      { flatPrice: { lte: mp } },
      { pricePerKg: { lte: mp } },
    ];
  }

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const [offers, total] = await Promise.all([
    prisma.luggageOffer.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, rating: true, totalDeals: true, verified: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.luggageOffer.count({ where }),
  ]);

  return NextResponse.json({
    offers,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: skip + offers.length < total,
  });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = luggageOfferSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const depAirport = getAirport(data.departureAirport);
    const arrAirport = getAirport(data.arrivalAirport);
    const airline = getAirlineByFlightNumber(data.flightNumber) || "Unbekannt";

    const offer = await prisma.luggageOffer.create({
      data: {
        userId: user.id,
        flightNumber: data.flightNumber.toUpperCase(),
        airline,
        departureAirport: data.departureAirport.toUpperCase(),
        arrivalAirport: data.arrivalAirport.toUpperCase(),
        departureCity: depAirport?.city || data.departureAirport,
        arrivalCity: arrAirport?.city || data.arrivalAirport,
        departureDate: new Date(data.departureDate),
        arrivalDate: new Date(data.arrivalDate),
        availableWeight: data.availableWeight,
        maxSingleItem: data.maxSingleItem || null,
        sizeCategory: data.sizeCategory,
        description: data.description || null,
        pricePerKg: data.pricePerKg || null,
        flatPrice: data.flatPrice || null,
        negotiable: data.negotiable,
        pickupType: data.pickupType,
        pickupAddress: data.pickupAddress || null,
        dropoffType: data.dropoffType,
        dropoffAddress: data.dropoffAddress || null,
      },
    });

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error("Create offer error:", error);
    return NextResponse.json(
      { error: "Angebot konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
