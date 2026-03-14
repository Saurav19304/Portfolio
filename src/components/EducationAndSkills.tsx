"use client";

import { motion } from "framer-motion";

const EDUCATION = [
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

const CERTIFICATIONS = [
  {
    title: "Data Analytics Certification",
    issuer: "Tops Technology",
    period: "2023 – 2024",
    details: "Data Visualization, Statistical Analysis, Dashboard Creation, Business Data Insights",
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
];

const SKILLS = [
  "Digital Marketing", "On Page SEO", "Off Page SEO", "Technical SEO",
  "Keyword Research", "Content Marketing", "WordPress", "Canva",
  "Microsoft Excel", "Power BI", "Google Search Console",
  "Data Visualization", "Content Creation", "Website Optimization"
];

export default function EducationAndSkills() {
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
              {EDUCATION.map((edu, idx) => (
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
              {SKILLS.map((skill, idx) => (
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
              {CERTIFICATIONS.map((cert, idx) => (
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
              {[
                "Google Analytics",
                "Google Search Console",
                "Ahrefs",
                "SEMrush",
                "Meta Business Suite",
              ].map((tool, idx) => (
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
