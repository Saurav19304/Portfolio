import { NextResponse } from "next/server";
import { getSeoSettings, saveSeoSettings } from "@/lib/db";

// GET /api/seo - Fetch current site SEO settings
export async function GET() {
  try {
    const settings = await getSeoSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to read SEO settings:", error);
    return NextResponse.json(
      { error: "Failed to read SEO settings." },
      { status: 500 }
    );
  }
}

// PUT /api/seo - Update site SEO settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Basic structure validation
    if (!body.home || !body.blog || !body.general) {
      return NextResponse.json(
        { error: "Invalid payload. Home, blog, and general configurations are required." },
        { status: 400 }
      );
    }

    const success = await saveSeoSettings(body);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to save SEO configurations." },
        { status: 500 }
      );
    }

    return NextResponse.json(body);
  } catch (error) {
    console.error("Failed to save SEO settings:", error);
    return NextResponse.json(
      { error: "Invalid JSON body payload." },
      { status: 400 }
    );
  }
}
