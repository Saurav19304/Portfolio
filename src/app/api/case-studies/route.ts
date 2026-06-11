import { NextResponse } from "next/server";
import { getCaseStudies, saveCaseStudy } from "@/lib/db";

export async function GET() {
  try {
    const list = await getCaseStudies();
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/case-studies error:", error);
    return NextResponse.json({ error: "Failed to read case studies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      body.id = titleToId(body.title);
    }
    const created = await saveCaseStudy(body);
    if (!created) {
      return NextResponse.json({ error: "Failed to create case study" }, { status: 500 });
    }
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/case-studies error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

function titleToId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
