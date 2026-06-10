import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

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
