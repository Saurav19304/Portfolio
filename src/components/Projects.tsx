"use client";

import { motion } from "framer-motion";

const PROJECTS = [
  {
    id: 1,
    title: "HR Analytics Dashboard",
    description: "Data analytics dashboard using Power BI to analyze employee performance and visualize workforce insights.",
    tags: ["Power BI", "Data Analytics", "Data Visualization"],
  },
  {
    id: 2,
    title: "Netflix Data Analytics",
    description: "Dashboard analyzing Netflix datasets including genres, release trends, and content distribution to extract insights.",
    tags: ["Data Analysis", "Dashboarding", "Excel/Power BI"],
  },
  {
    id: 3,
    title: "Social Media Content Design",
    description: "Created high-quality digital marketing creatives, Instagram promotional posts, and brand awareness graphics.",
    tags: ["Canva", "Social Media", "Graphic Design"],
  },
  {
    id: 4,
    title: "SEO Blog Content Creation",
    description: "Produced SEO optimized blog articles targeting relevant keywords to improve visibility and search rankings.",
    tags: ["SEO", "Content Marketing", "WordPress"],
  },
];

export default function Projects() {
  return (
    <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Selected Work</h2>
          <p className="text-xl text-white/60 max-w-2xl">
            A showcase of recent projects focusing on performant animations and premium aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Glassmorphism Background layer */}
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl transition-colors duration-500 group-hover:bg-white/[0.08]" />
              
              {/* Optional ambient glow on hover */}
              <div className="absolute inset-x-0 -bottom-32 h-64 bg-white/20 blur-[100px] opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100" />

              <div className="relative h-full flex flex-col justify-between p-8 md:p-10 z-10">
                <div>
                  <h3 className="text-3xl font-semibold mb-3 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-lg text-white/50 max-w-sm">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-white/5 border border-white/10 text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
