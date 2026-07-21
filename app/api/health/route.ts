import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    service: "predixai-academy",
    status: "ok",
    version: "1.0.0",
    release: "controlled-pilot",
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown",
    timestamp: new Date().toISOString(),
    capabilities: [
      "catalog",
      "authentication",
      "password-recovery",
      "lesson-progress",
      "quizzes",
      "student-dashboard",
      "library",
      "cms-crud",
      "editorial-workflow",
      "roles-and-permissions",
      "asset-management",
      "audit-history",
      "pilot-feedback",
      "quality-workflow",
      "production-smoke-test",
    ],
  });
}
