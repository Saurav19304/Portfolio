import { NextResponse } from "next/server";
import { saveLinkedInPost, deleteLinkedInPost } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const numId = parseInt(id) || 0;
  try {
    const body = await request.json();
    const updated = await saveLinkedInPost({ ...body, id: numId });
    if (!updated) {
      return NextResponse.json({ error: "Failed to update LinkedIn post" }, { status: 500 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/linkedin/[id] error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const numId = parseInt(id) || 0;
  try {
    const success = await deleteLinkedInPost(numId);
    if (!success) {
      return NextResponse.json({ error: "LinkedIn post not found or deletion failed" }, { status: 404 });
    }
    return NextResponse.json({ message: "LinkedIn post successfully deleted" });
  } catch (error) {
    console.error("DELETE /api/linkedin/[id] error:", error);
    return NextResponse.json({ error: "Request error" }, { status: 500 });
  }
}
