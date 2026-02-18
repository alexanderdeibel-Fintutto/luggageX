import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Trending/popular routes based on active offers
export async function GET() {
  try {
    const offers = await prisma.luggageOffer.findMany({
      where: { status: "active" },
      select: {
        departureAirport: true,
        arrivalAirport: true,
        flatPrice: true,
        pricePerKg: true,
      },
    });

    // Aggregate by route
    const routeMap = new Map<string, { count: number; prices: number[] }>();

    for (const offer of offers) {
      const key = `${offer.departureAirport}-${offer.arrivalAirport}`;
      const existing = routeMap.get(key) || { count: 0, prices: [] };
      existing.count++;
      const price = offer.flatPrice ?? (offer.pricePerKg ? offer.pricePerKg * 5 : null);
      if (price != null) existing.prices.push(price);
      routeMap.set(key, existing);
    }

    const routes = Array.from(routeMap.entries())
      .map(([key, { count, prices }]) => {
        const [from, to] = key.split("-");
        const avgPrice = prices.length > 0
          ? prices.reduce((a, b) => a + b, 0) / prices.length
          : null;
        return { from, to, count, avgPrice };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return NextResponse.json({ routes });
  } catch {
    return NextResponse.json({ routes: [] });
  }
}
