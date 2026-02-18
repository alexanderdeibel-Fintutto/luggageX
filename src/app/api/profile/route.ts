import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// PATCH: Update user profile
export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, bio, phone } = body;

    const updateData: Record<string, string> = {};
    if (name && name.length >= 2) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Keine Änderungen" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        avatarUrl: true,
        verified: true,
        rating: true,
        totalDeals: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Profil konnte nicht aktualisiert werden" },
      { status: 500 }
    );
  }
}
