"use client";

import { useState } from "react";
import Image from "next/image";

type MediaType = "image" | "video";

interface InstagramPost {
  id: number;
  title: string;
  link: string;
  mediaSrc: string;
  type: MediaType;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 1,
    title: "Sips and Special",
    link: "https://www.instagram.com/p/DKO7ZdVomEB/",
    mediaSrc: "/sips-and-specials.jpg",
    type: "image",
  },
  {
    id: 2,
    title: "Pasta Special",
    link: "https://www.instagram.com/p/DKO7ZdVomEB/",
    mediaSrc: "/pasta-special.jpg",
    type: "image",
  },
  {
    id: 3,
    title: "Video Editing",
    link: "https://www.instagram.com/reel/DP4MjtmDKBO/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    mediaSrc: "/get.mp4",
    type: "video",
  },
  {
    id: 4,
    title: "Cinematic Video",
    link: "https://www.instagram.com/reel/DVeYj_ADPly/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    mediaSrc: "/insta-video.mp4",
    type: "video",
  },
];

export default function InstagramContent() {
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate the array exactly once so that when we translate -50%, it seamlessly loops
  const allPosts = [...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS];

  return (
    <section className="relative z-20 bg-[#121212] py-32 overflow-hidden text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Instagram Content</h2>
        <p className="text-xl text-white/60 max-w-2xl">
          Social media creatives for brands and personal video projects.
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="animate-scroll gap-8 px-4 py-4"
          style={{ animationPlayState: isHovered ? "paused" : "running" }}
        >
          {allPosts.map((post, idx) => (
            <div
              key={`${post.id}-${idx}`}
              className="flex-shrink-0 w-[350px] h-[450px] rounded-3xl overflow-hidden relative group/card cursor-pointer transition-transform duration-500 ease-out hover:scale-105 hover:z-30 hover:shadow-2xl hover:shadow-white/10 border border-white/10 bg-white/[0.03]"
            >
              {/* Media Preview */}
              {post.type === "video" ? (
                <video
                  src={post.mediaSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
              ) : (
                <Image
                  src={post.mediaSrc}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
              )}

              <div className="w-full h-full absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent z-10 pointer-events-none" />

              <div className="relative z-20 w-full h-full flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold mb-6 tracking-tight drop-shadow-md text-white/90">
                  {post.title}
                </h3>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-center text-sm font-semibold transition-all flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 shadow-lg"
                >
                  View Post
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
