import fs from "fs/promises";
import path from "path";
import { BlogPost } from "./blogUtils";

const dbFilePath = path.join(process.cwd(), "src/data/posts.db.json");

// Helper to read database
export async function getPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(dbFilePath, "utf8");
    return JSON.parse(data) as BlogPost[];
  } catch (error) {
    console.error("Database read error, returning empty array:", error);
    return [];
  }
}

// Helper to save posts array
export async function savePosts(posts: BlogPost[]): Promise<boolean> {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(posts, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Database write error:", error);
    return false;
  }
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) || null;
}

// Increment post views dynamically
export async function incrementPostViews(slug: string): Promise<number | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  posts[index].views += 1;
  const success = await savePosts(posts);
  return success ? posts[index].views : null;
}

// Create or update a post
export async function savePost(postData: Partial<BlogPost> & { slug: string; title: string }): Promise<BlogPost | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === postData.slug);

  const now = new Date().toISOString();

  if (index !== -1) {
    // Update existing post
    const existing = posts[index];
    const updated: BlogPost = {
      ...existing,
      ...postData,
      updatedAt: now,
    } as BlogPost;
    
    posts[index] = updated;
    const success = await savePosts(posts);
    return success ? updated : null;
  } else {
    // Create new post
    const newId = posts.length > 0 ? (Math.max(...posts.map(p => parseInt(p.id) || 0)) + 1).toString() : "1";
    const newPost: BlogPost = {
      id: newId,
      views: 0,
      status: "draft",
      featured: false,
      publishedAt: now,
      updatedAt: now,
      excerpt: postData.excerpt || "",
      content: postData.content || "",
      featuredImage: postData.featuredImage || "",
      category: postData.category || "General",
      tags: postData.tags || [],
      metaTitle: postData.metaTitle || `${postData.title} | Saurav Vaghela`,
      metaDescription: postData.metaDescription || postData.excerpt || "",
      focusKeyword: postData.focusKeyword || "",
      author: postData.author || "Saurav Vaghela",
      ...postData,
    } as BlogPost;

    posts.push(newPost);
    const success = await savePosts(posts);
    return success ? newPost : null;
  }
}

// Delete post
export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (posts.length === filtered.length) return false;

  return await savePosts(filtered);
}

