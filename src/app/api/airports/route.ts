import { NextRequest, NextResponse } from "next/server";
import { searchAirports, AIRPORTS } from "@/lib/airports";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    // Return popular airports
    const popular = AIRPORTS.filter((a) =>
      ["FRA", "MUC", "BER", "VIE", "ZRH", "LHR", "CDG", "BCN", "FCO", "IST", "AMS", "DXB"].includes(a.code)
    );
    return NextResponse.json({ airports: popular });
  }

  const results = searchAirports(q);
  return NextResponse.json({ airports: results });
}
