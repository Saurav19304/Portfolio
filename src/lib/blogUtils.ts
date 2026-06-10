export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  author: string;
  status: "published" | "draft";
  publishedAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
}

// Helper to calculate reading time
export function getReadTime(content: string): string {
  if (!content) return "1 min read";
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper to format date
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return dateStr;
  }
}
