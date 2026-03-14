"use client";

import { motion } from "framer-motion";

const LINKEDIN_POSTS = [
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
          {LINKEDIN_POSTS.map((post, idx) => (
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
