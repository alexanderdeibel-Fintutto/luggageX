import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message, category } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Alle Pflichtfelder müssen ausgefüllt sein" },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { error: "Nachricht muss mindestens 10 Zeichen lang sein" },
        { status: 400 }
      );
    }

    const user = await getCurrentUser().catch(() => null);

    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        category: category || "general",
        userId: user?.id || null,
      },
    });

    return NextResponse.json({ id: contact.id, success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Nachricht konnte nicht gesendet werden" },
      { status: 500 }
    );
  }
}
