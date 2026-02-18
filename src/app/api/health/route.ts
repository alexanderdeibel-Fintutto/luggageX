import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const checks: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database_url_set: process.env.DATABASE_URL ? "yes" : "NO - missing!",
    direct_url_set: process.env.DIRECT_URL ? "yes" : "not set",
    node_env: process.env.NODE_ENV || "not set",
  };

  // Test database connection
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    checks.database = "connected";

    // Check if luggagex schema exists
    const userCount = await prisma.user.count();
    checks.user_count = String(userCount);
  } catch (error) {
    checks.database = "ERROR";
    checks.database_error = error instanceof Error ? error.message : String(error);
    checks.status = "error";
  }

  return NextResponse.json(checks, {
    status: checks.status === "ok" ? 200 : 503,
  });
}
