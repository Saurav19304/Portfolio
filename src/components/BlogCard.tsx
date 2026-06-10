"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BlogPost, getReadTime, formatDate } from "@/lib/blogUtils";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-full flex flex-col justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden cursor-pointer hover:bg-white/[0.05] transition-colors duration-300"
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-x-0 -bottom-32 h-64 bg-gradient-to-t from-white/10 to-transparent blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          {/* Card Cover Image */}
          {post.featuredImage && (
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/5">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            {/* Category */}
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white/5 border border-white/10 text-white/80 group-hover:border-white/20 transition-colors">
              {post.category}
            </span>
            {/* Read Time */}
            <span className="text-xs text-white/40 font-medium">
              {getReadTime(post.content)}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-white/40">{formatDate(post.publishedAt)}</span>
          
          <span className="text-xs font-semibold text-white/80 group-hover:text-white flex items-center gap-1.5 transition-colors">
            Read Article
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </motion.article>
    </Link>
  );
}
