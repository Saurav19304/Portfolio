import { NextResponse } from "next/server";
import { getInstagramPosts, saveInstagramPost } from "@/lib/db";

export async function GET() {
  try {
    const list = await getInstagramPosts();
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/instagram error:", error);
    return NextResponse.json({ error: "Failed to read Instagram posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      body.id = Date.now();
    }
    const created = await saveInstagramPost(body);
    if (!created) {
      return NextResponse.json({ error: "Failed to create Instagram post" }, { status: 500 });
    }
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/instagram error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
