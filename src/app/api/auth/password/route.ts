import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Beide Passwortfelder sind erforderlich" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Neues Passwort muss mindestens 8 Zeichen haben" },
        { status: 400 }
      );
    }

    // Get the full user record with passwordHash
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "Nutzer nicht gefunden" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, fullUser.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Aktuelles Passwort ist falsch" },
        { status: 401 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Passwort konnte nicht geändert werden" },
      { status: 500 }
    );
  }
}
