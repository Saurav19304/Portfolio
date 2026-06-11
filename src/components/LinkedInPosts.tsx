"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LinkedInPost {
  id: number;
  title: string;
  description: string;
  link: string;
}

const DEFAULT_LINKEDIN_POSTS: LinkedInPost[] = [
  {
    id: 5,
    title: "Project Mary Rose Presentation",
    description: "Presented our collaborative digital marketing strategies and concepts for The Mary Rose Museum alongside my Apollo Media team members under Dr. Mona N.'s guidance.",
    link: "https://www.linkedin.com/posts/sauravvaghela19_appollomedia-projectmaryrose-maryrosemuseum-share-7467231074935373824-Aw41/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEvbroIBnF2_ny4UJu1FyFevVpj7JUY4f_s",
  },
  {
    id: 4,
    title: "BBC Southampton Open Evening",
    description: "Attended the BBC Southampton Open Evening, gaining behind-the-scenes insights into live broadcasting, audience engagement, and networking with presenter Edward Sault.",
    link: "https://www.linkedin.com/posts/sauravvaghela19_bbc-networking-digitalmarketing-ugcPost-7443385269308899328-u_ky/?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEvbroIBnF2_ny4UJu1FyFevVpj7JUY4f_s",
  },
  {
    id: 1,
    title: "LinkedIn Learning Certification Post",
    description: "Shared my Microsoft LinkedIn Learning certification and learning progress.",
    link: "https://www.linkedin.com/posts/sauravvaghela19_certificate-of-completion-activity-7437148038969618433-sqeI",
  },
  {
    id: 2,
    title: "Marketing Automation Project",
    description: "Demonstrated my first marketing automation project using Zapier to automate workflows.",
    link: "https://www.linkedin.com/posts/sauravvaghela19_firstautomation-marketingautomation-zapier-ugcPost-7425322214213722112-4jwP",
  },
  {
    id: 3,
    title: "AI-Assisted Portfolio Development",
    description: "Built my Digital Marketing & SEO portfolio using AI-assisted development to showcase projects, skills, and creative work.",
    link: "https://www.linkedin.com/posts/sauravvaghela19_ai-digitalmarketing-seo-activity-7438694155792424960-1fik?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEvbroIBnF2_ny4UJu1FyFevVpj7JUY4f_s",
  },
];

export default function LinkedInPosts() {
  const [posts, setPosts] = useState<LinkedInPost[]>(DEFAULT_LINKEDIN_POSTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/linkedin");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setPosts(data);
          }
        }
      } catch (err) {
        console.error("Failed to load LinkedIn posts:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  if (isLoading && posts.length === 0) {
    return (
      <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5 animate-pulse">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 bg-white/5 rounded w-1/4 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-48 bg-white/5 rounded-3xl" />
            <div className="h-48 bg-white/5 rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">LinkedIn Posts</h2>
          <p className="text-xl text-white/60 max-w-2xl">
            Professional insights, automation experiments, and project highlights shared on LinkedIn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="relative p-8 md:p-10 rounded-3xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-colors flex flex-col justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                  {post.title}
                </h3>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  {post.description}
                </p>
              </div>

              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-colors self-start text-white/90"
              >
                View Post
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
