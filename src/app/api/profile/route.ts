import { NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/lib/db";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to read profile data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const success = await saveProfile(body);
    if (!success) {
      return NextResponse.json({ error: "Failed to save profile data" }, { status: 500 });
    }
    return NextResponse.json(body);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
