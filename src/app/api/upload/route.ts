import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { saveImageToDb } from "@/lib/db";

// POST /api/upload - Handle file upload for blog post images
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Clean up file name to be URL-safe
    const cleanFilename = file.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.\-_]/g, "");
      
    // Prefix with timestamp to avoid name collisions
    const filename = `${Date.now()}-${cleanFilename}`;
    
    // If a database URL is present (i.e. production environment like Vercel),
    // save the file directly to the PostgreSQL database to bypass read-only filesystem limitations.
    const hasDb = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
    if (hasDb) {
      const mimeType = file.type || "image/png";
      const base64Data = buffer.toString("base64");
      const success = await saveImageToDb(filename, mimeType, base64Data);
      if (success) {
        return NextResponse.json({ 
          url: `/api/images/${filename}` 
        });
      }
    }
    
    // Fallback for local development: Save file to public/blog directory
    const uploadDir = path.join(process.cwd(), "public/blog");
    
    // Ensure the destination folder exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      url: `/blog/${filename}` 
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file to the server." },
      { status: 500 }
    );
  }
}
