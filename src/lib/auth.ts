import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

const SESSION_COOKIE = "luggagex_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const token = uuid();
  // Store session in a simple way - in production use a proper session store
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${userId}:${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return token;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;

  const userId = session.value.split(":")[0];
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        verified: true,
        rating: true,
        totalDeals: true,
        createdAt: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
