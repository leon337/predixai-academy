import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    service: "predixai-academy",
    status: "ok",
    version: "0.5.0-mvp",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    timestamp: new Date().toISOString(),
    capabilities: [
      "catalog",
      "authentication",
      "lesson-progress",
      "quizzes",
      "student-dashboard",
      "library",
      "content-admin",
    ],
  });
}
