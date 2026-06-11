import { NextResponse } from "next/server";
import { saveCaseStudy, deleteCaseStudy } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = await saveCaseStudy({ ...body, id });
    if (!updated) {
      return NextResponse.json({ error: "Failed to update case study" }, { status: 500 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/case-studies/[id] error:", error);
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const success = await deleteCaseStudy(id);
    if (!success) {
      return NextResponse.json({ error: "Case study not found or deletion failed" }, { status: 404 });
    }
    return NextResponse.json({ message: "Case study successfully deleted" });
  } catch (error) {
    console.error("DELETE /api/case-studies/[id] error:", error);
    return NextResponse.json({ error: "Request error" }, { status: 500 });
  }
}
