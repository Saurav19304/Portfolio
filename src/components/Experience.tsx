"use client";

import { motion } from "framer-motion";

const EXPERIENCES = [
  {
    id: 1,
    role: "Junior SEO Executive",
    company: "ShreyWebs",
    period: "April 2025 – December 2025",
    description: "Implemented off-page SEO strategies including backlink creation and outreach. Conducted keyword research to improve search rankings. Wrote SEO optimized blogs to increase organic traffic. Designed social media graphics using Canva to enhance engagement. Assisted in improving website authority and domain ranking.",
  },
  {
    id: 2,
    role: "SEO Intern",
    company: "ShreyWebs",
    period: "December 2024 – March 2025",
    description: "Assisted with link building and off-page SEO activities. Performed keyword research and competitor analysis. Created blog content optimized for search engines and readability. Designed digital marketing creatives using Canva.",
  },
  {
    id: 3,
    role: "Stock Manager",
    company: "Nikunj Enterprise",
    period: "June 2022 – September 2024",
    description: "Managed inventory operations and maintained accurate stock levels. Coordinated supply chain activities to ensure smooth product flow. Improved operational efficiency and reduced stock discrepancies.",
  },
  {
    id: 4,
    role: "Information Retrieval Officer",
    company: "Justdial",
    period: "June 2021 – September 2021",
    description: "Handled incoming customer calls and provided relevant business information. Identified customer requirements and delivered accurate responses. Maintained excellent attention to detail and customer satisfaction.",
  },
];

export default function Experience() {
  return (
    <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Professional Experience</h2>
          <p className="text-xl text-white/60 max-w-2xl">
            A history of driving growth, managing operations, and delivering results.
          </p>
        </div>

        <div className="space-y-8">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl transition-colors duration-500 group-hover:bg-white/[0.05]" />
              
              <div className="relative p-8 md:p-10 z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="md:w-1/3">
                  <h3 className="text-2xl font-semibold mb-2 tracking-tight">
                    {exp.role}
                  </h3>
                  <p className="text-lg text-white/70 font-medium">
                    {exp.company}
                  </p>
                  <p className="text-sm text-white/50 mt-1">
                    {exp.period}
                  </p>
                </div>

                <div className="md:w-2/3">
                  <p className="text-lg text-white/60 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
