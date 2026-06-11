"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DEFAULT_EDUCATION = [
  {
    degree: "MA Digital Marketing",
    institution: "University of Portsmouth",
    period: "2026 – 2027",
  },
  {
    degree: "Bachelor of Commerce",
    institution: "Gujarat University",
    period: "2021 – 2024",
  },
];

const DEFAULT_CERTIFICATIONS = [
  {
    title: "Digital Skills: Digital Marketing",
    issuer: "Accenture (via FutureLearn)",
    period: "2026",
    details: "Completed Accenture's certified course focusing on Search Engine Optimisation (SEO), Pay-Per-Click (PPC), Display Advertising, Email Marketing, Customer Targeting, and Strategy Integration.",
  },
  {
    title: "Digital Marketing Certification",
    issuer: "Digital Azadi",
    period: "2024",
    details: "SEO strategies, Content marketing, Social media marketing, Digital campaign management",
  },
  {
    title: "Microsoft Certification",
    issuer: "LinkedIn Learning",
    period: "2024",
    details: "Completed Microsoft certification course focusing on digital tools, productivity, and professional development.",
  },
  {
    title: "Data Analytics Certification",
    issuer: "Tops Technology",
    period: "2023 – 2024",
    details: "Data Visualization, Statistical Analysis, Dashboard Creation, Business Data Insights",
  },
];

const DEFAULT_SKILLS = [
  "Digital Marketing", "On Page SEO", "Off Page SEO", "Technical SEO",
  "Keyword Research", "Content Marketing", "WordPress", "Canva",
  "Microsoft Excel", "Power BI", "Google Search Console",
  "Data Visualization", "Content Creation", "Website Optimization"
];

const DEFAULT_TOOLS = [
  "Google Analytics",
  "Google Search Console",
  "Ahrefs",
  "SEMrush",
  "Meta Business Suite",
];

export default function EducationAndSkills() {
  const [education, setEducation] = useState(DEFAULT_EDUCATION);
  const [certifications, setCertifications] = useState(DEFAULT_CERTIFICATIONS);
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [tools, setTools] = useState(DEFAULT_TOOLS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.education) setEducation(data.education);
          if (data.certifications) setCertifications(data.certifications);
          if (data.skills) setSkills(data.skills);
          if (data.tools) setTools(data.tools);
        }
      } catch (err) {
        console.error("Failed to load Education/Skills data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto space-y-16 animate-pulse">
          <div className="h-10 bg-white/5 rounded w-1/4 mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="h-32 bg-white/5 rounded-2xl" />
              <div className="h-32 bg-white/5 rounded-2xl" />
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 w-28 bg-white/5 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Row: Education & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Education</h2>
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-white/70 mt-1">{edu.institution}</p>
                  <p className="text-sm text-white/50 mt-2">{edu.period}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-5 py-3 rounded-full text-sm font-medium tracking-wide bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Certifications & Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Certifications</h2>
            <div className="space-y-6">
              {certifications.map((cert, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10">
                  <h3 className="text-xl font-semibold">{cert.title}</h3>
                  <p className="text-white/70 mt-1">{cert.issuer} ({cert.period})</p>
                  <p className="text-sm text-white/50 mt-3 leading-relaxed">{cert.details}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-5 py-3 rounded-full text-sm font-medium tracking-wide bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
