import { NextResponse } from "next/server";
import { getPostBySlug, incrementPostViews, savePost, deletePost } from "@/lib/db";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/posts/[slug] - Fetch details of a single post and increment view count
export async function GET(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  // Increment view count dynamically in database
  const updatedViews = await incrementPostViews(slug);
  if (updatedViews !== null) {
    post.views = updatedViews;
  }

  return NextResponse.json(post);
}

// PUT /api/posts/[slug] - Update post parameters by slug
export async function PUT(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const body = await request.json();

    // Ensure it updates the correct slug
    const updated = await savePost({ ...body, slug });
    if (!updated) {
      return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}

// DELETE /api/posts/[slug] - Delete post from database
export async function DELETE(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const success = await deletePost(slug);
  if (!success) {
    return NextResponse.json(
      { error: "Post not found or deletion failed." },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Post successfully deleted." });
}
