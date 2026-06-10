import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://saurav.digital";
  
  // 1. Core pages
  const routes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  // 2. Fetch published blog posts dynamically
  try {
    const posts = await getPosts();
    const publishedPosts = posts.filter((post) => post.status === "published");
    
    const postRoutes = publishedPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...routes, ...postRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic blog sitemap routes:", error);
    return routes;
  }
}
