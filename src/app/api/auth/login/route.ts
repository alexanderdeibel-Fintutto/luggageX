import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "E-Mail oder Passwort falsch" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "E-Mail oder Passwort falsch" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
    setSessionCookie(response, user.id);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Login error:", message);
    return NextResponse.json(
      { error: "Anmeldung fehlgeschlagen", details: process.env.NODE_ENV !== "production" ? message : undefined },
      { status: 500 }
    );
  }
}
