import type { Metadata } from "next";
import { getSeoSettings } from "@/lib/db";
import BlogIndexClient from "./BlogIndexClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const blogSeo = seo?.blog;

  if (!blogSeo) return {};

  const cleanTitle = blogSeo.title?.replace(/ \| Saurav Vaghela$/, "");

  return {
    title: cleanTitle,
    description: blogSeo.description,
    keywords: blogSeo.keywords ? blogSeo.keywords.split(",").map(k => k.trim()) : [],
    alternates: {
      canonical: blogSeo.canonical || "https://saurav.digital/blog",
    },
    robots: {
      index: !blogSeo.robots?.includes("noindex"),
      follow: !blogSeo.robots?.includes("nofollow"),
    },
    openGraph: {
      title: blogSeo.ogTitle || blogSeo.title,
      description: blogSeo.ogDescription || blogSeo.description,
      images: blogSeo.ogImage ? [{ url: blogSeo.ogImage }] : [],
      url: "https://saurav.digital/blog",
    },
    twitter: {
      card: "summary_large_image",
      title: blogSeo.ogTitle || blogSeo.title,
      description: blogSeo.ogDescription || blogSeo.description,
      images: blogSeo.ogImage ? [blogSeo.ogImage] : [],
    }
  };
}

export default function BlogIndexPage() {
  return <BlogIndexClient />;
}
