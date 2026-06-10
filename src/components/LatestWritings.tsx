"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { BlogPost } from "@/lib/blogUtils";

export default function LatestWritings() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Take the 2 most recent posts
  const recentPosts = posts.slice(0, 2);

  return (
    <section id="writings" className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Latest Writings</h2>
            <p className="text-xl text-white/60 max-w-xl">
              Insights on technical SEO, digital marketing strategy, and web analytics.
            </p>
          </div>
          
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-colors text-white/90 self-start md:self-auto"
          >
            View All Articles
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
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((n) => (
              <div key={n} className="h-[480px] rounded-3xl bg-white/[0.02] border border-white/10 animate-pulse flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="h-44 bg-white/5 rounded-2xl w-full" />
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-24 bg-white/5 rounded-full" />
                    <div className="h-4 w-12 bg-white/5 rounded-full" />
                  </div>
                  <div className="h-8 bg-white/5 rounded-lg w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                  </div>
                </div>
                <div className="h-6 bg-white/5 rounded-lg w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map((post, idx) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
