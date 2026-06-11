import { NextResponse } from "next/server";
import { saveInstagramPost, deleteInstagramPost } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const numId = parseInt(id) || 0;
  try {
    const body = await request.json();
    const updated = await saveInstagramPost({ ...body, id: numId });
    if (!updated) {
      return NextResponse.json({ error: "Failed to update Instagram post" }, { status: 500 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/instagram/[id] error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const numId = parseInt(id) || 0;
  try {
    const success = await deleteInstagramPost(numId);
    if (!success) {
      return NextResponse.json({ error: "Instagram post not found or deletion failed" }, { status: 404 });
    }
    return NextResponse.json({ message: "Instagram post successfully deleted" });
  } catch (error) {
    console.error("DELETE /api/instagram/[id] error:", error);
    return NextResponse.json({ error: "Request error" }, { status: 500 });
  }
}
