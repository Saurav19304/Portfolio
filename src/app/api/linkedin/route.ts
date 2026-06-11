import { NextResponse } from "next/server";
import { getLinkedInPosts, saveLinkedInPost } from "@/lib/db";

export async function GET() {
  try {
    const list = await getLinkedInPosts();
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/linkedin error:", error);
    return NextResponse.json({ error: "Failed to read LinkedIn posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      body.id = Date.now();
    }
    const created = await saveLinkedInPost(body);
    if (!created) {
      return NextResponse.json({ error: "Failed to create LinkedIn post" }, { status: 500 });
    }
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/linkedin error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
