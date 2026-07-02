import { NextResponse } from "next/server";
import { getImageFromDb } from "@/lib/db";

interface RouteParams {
  params: Promise<{ filename: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { filename } = await params;
    const img = await getImageFromDb(filename);

    if (!img) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const buffer = Buffer.from(img.data, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": img.mimeType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Error serving image", { status: 500 });
  }
}
