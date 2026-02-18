import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const body = await request.json();
  const { type, targetId, reason, description } = body;

  if (!type || !targetId || !reason) {
    return NextResponse.json({ error: "Fehlende Angaben" }, { status: 400 });
  }

  if (!["user", "offer", "match"].includes(type)) {
    return NextResponse.json({ error: "Ungültiger Typ" }, { status: 400 });
  }

  // For now, log reports (in production, would store in DB)
  console.log("Report received:", {
    reporterId: user.id,
    type,
    targetId,
    reason,
    description,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, message: "Meldung eingegangen. Wir prüfen den Fall." }, { status: 201 });
}
