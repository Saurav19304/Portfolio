import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts, getPostBySlug, incrementPostViews } from "@/lib/db";
import { formatDate, getReadTime } from "@/lib/blogUtils";

export const revalidate = 0; // Force dynamic rendering on every request to fetch latest database entries

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Statically generate routes at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate dynamic SEO metadata for each post
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const rawTitle = post.metaTitle || post.title;
  const cleanTitle = rawTitle.replace(/ \| Saurav Vaghela$/, "");

  return {
    title: cleanTitle,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: `https://saurav.digital/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      url: `https://saurav.digital/blog/${post.slug}`,
      publishedTime: new Date(post.publishedAt).toISOString(),
      tags: post.tags,
      images: [post.featuredImage || "/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: [post.featuredImage || "/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Increment view count dynamically on load
  await incrementPostViews(slug);
  
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Schema.org Article Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription || post.excerpt,
    "datePublished": new Date(post.publishedAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": "Saurav Vaghela",
      "url": "https://saurav.digital"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Saurav Vaghela Portfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://saurav.digital/og-image.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://saurav.digital/blog/${post.slug}`
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-white selection:bg-white/30 selection:text-white pb-32">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Local Typographical styles for the blog content */}
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-prose h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.025em;
          color: #ffffff;
        }
        .blog-prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.025em;
          color: #ffffff;
        }
        .blog-prose p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 1.75rem;
        }
        .blog-prose ul {
          list-style-type: disc;
          margin-bottom: 1.75rem;
          padding-left: 1.5rem;
        }
        .blog-prose ol {
          list-style-type: decimal;
          margin-bottom: 1.75rem;
          padding-left: 1.5rem;
        }
        .blog-prose li {
          font-size: 1.125rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.75);
          margin-bottom: 0.5rem;
        }
        .blog-prose blockquote {
          border-left: 3px solid rgba(255, 255, 255, 0.2);
          padding-left: 1.5rem;
          font-style: italic;
          color: rgba(255, 255, 255, 0.9);
          margin: 2.5rem 0;
          font-size: 1.25rem;
          line-height: 1.7;
        }
        .blog-prose strong {
          color: #ffffff;
          font-weight: 600;
        }
        .blog-prose img {
          width: 100%;
          height: auto;
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin: 2.5rem 0;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .blog-prose pre {
          background-color: #1e1e1e;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 2.5rem 0;
          font-family: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .blog-prose code {
          font-family: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.85rem;
          background-color: rgba(255, 255, 255, 0.08);
          padding: 0.2rem 0.4rem;
          border-radius: 0.375rem;
        }
        .blog-prose pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          color: #f8f8f2;
          font-size: 0.9rem;
        }
      `}} />

      {/* Background Decorative Glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Navigation */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group mb-12"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transform group-hover:-translate-x-1 transition-transform"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to all articles
        </Link>

        {/* Article Header */}
        <header className="mb-12 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4 text-xs font-semibold tracking-wider text-white/40 mb-4">
            <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
              {post.category}
            </span>
            <span>•</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>{getReadTime(post.content)}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-white/50 leading-relaxed font-light">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Cover Image */}
        {post.featuredImage && (
          <div className="relative w-full h-[400px] mb-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <article 
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Tags */}
        <footer className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-wrap gap-2.5">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="px-4 py-2 rounded-full text-xs font-medium bg-white/[0.03] border border-white/5 text-white/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>

      </div>
    </main>
  );
}
