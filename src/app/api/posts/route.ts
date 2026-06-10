import { NextResponse } from "next/server";
import { getPosts, savePost } from "@/lib/db";

// GET /api/posts - Fetch all posts (optionally including drafts)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeDrafts = searchParams.get("drafts") === "true";

  let posts = await getPosts();

  // Filter drafts out by default for public SEO listings
  if (!includeDrafts) {
    posts = posts.filter((p) => p.status === "published");
  }

  // Sort: Featured first, then by publishedAt date descending
  posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return NextResponse.json(posts);
}

// POST /api/posts - Create a new post
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required fields." },
        { status: 400 }
      );
    }

    const post = await savePost(body);
    if (!post) {
      return NextResponse.json(
        { error: "Failed to save post to the database." },
        { status: 500 }
      );
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload in request." },
      { status: 400 }
    );
  }
}
