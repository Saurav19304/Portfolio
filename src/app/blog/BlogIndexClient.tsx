"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import BlogCard from "@/components/BlogCard";
import { BlogPost } from "@/lib/blogUtils";

export default function BlogIndexClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Get list of unique categories
  const categories = ["All", ...Array.from(new Set(posts.map((post) => post.category)))];

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#121212] text-white selection:bg-white/30 selection:text-white pb-32">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 relative z-10">
        
        {/* Back Link */}
        <Link 
          href="/"
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
          Back to Portfolio
        </Link>

        {/* Title Section */}
        <div className="max-w-3xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Writings & Insights
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/60 leading-relaxed"
          >
            Data-driven strategies, technical SEO tutorials, keyword research principles, and updates from my digital marketing journey.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-white/5">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-white text-black shadow-lg shadow-white/10"
                    : "bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/30"
            />
            <svg
              className="absolute left-4 top-3.5 w-4 h-4 text-white/30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Blog Post Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[480px] rounded-3xl bg-white/[0.02] border border-white/10 animate-pulse flex flex-col justify-between p-6">
                <div className="space-y-4">
                  {/* Card Cover Image Skeleton */}
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
          <AnimatePresence mode="popLayout">
            {filteredPosts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]"
              >
                <svg
                  className="w-12 h-12 text-white/20 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-white/80">No articles found</h3>
                <p className="text-sm text-white/40 mt-1 max-w-xs mx-auto">
                  Try adjusting your filters or search terms.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

      </div>
    </main>
  );
}
