"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  shortDescription: string;
  metricValue: string;
  metricLabel: string;
  challenge: string;
  strategy: string;
  execution: string[];
  results: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "mary-rose-museum",
    title: "Revitalizing Engagement & Visitor Plan for a Tudor National Treasure",
    client: "Mary Rose Museum (Portsmouth)",
    category: "Strategic Marketing Proposal",
    shortDescription: "Acting as an agency, we delivered a comprehensive digital marketing implementation plan to modernize visitor acquisition and engage younger demographics.",
    metricValue: "Audit & Plan",
    metricLabel: "Agency Proposal",
    challenge: "The Mary Rose Museum in Portsmouth Historic Dockyard needed a data-driven strategy to boost foot traffic and engage younger local demographics, while strictly preserving its historical authority and educational prestige. As a mock marketing agency, our goal was to outline a detailed strategic roadmap.",
    strategy: "Conducted an extensive digital audit of the Portsmouth tourism market. Mapped out target personas (Families, History Buffs, and Tech-Savvy Students) and framed a channel strategy covering local SEO, story-driven social content, and local partnerships.",
    execution: [
      "Audited organic search visibility for Portsmouth historic tourism terms to identify content gaps.",
      "Developed a target visitor persona framework tailored to local Portsmouth Dockyard visitor demographics.",
      "Designed a visual, story-driven social content strategy (Instagram & TikTok) to make Tudor history interactive for student markets.",
      "Proposed experiential recommendations, including augmented reality (AR) overlay tours within physical museum spaces.",
      "Outlined joint co-promotional pricing partnerships with local Portsmouth universities and hospitality operators."
    ],
    results: [
      "Delivered a detailed marketing strategy document ready for museum board consideration.",
      "Provided a tactical 12-month calendar mapping digital campaigns to peak tourism seasons.",
      "Created repeatable template frameworks for local community integration and student outreach."
    ]
  },
  {
    id: "sea-wolf-cleaning",
    title: "Low-Budget PPC & Local SEO Lead Generation Blueprint",
    client: "Sea Wolf Services",
    category: "Local SEO & PPC Strategy",
    shortDescription: "Designed a digital marketing plan to capture high-intent cleaning leads under a strict £50 monthly budget constraint.",
    metricValue: "£50 Budget",
    metricLabel: "Monthly PPC Limit",
    challenge: "Sea Wolf Services faced intense competition in Portsmouth from larger, established players (such as Equity Cleaning). The website lacked trust signals (testimonials), had poor call-to-actions, and had to generate B2B cleaning leads with a tight monthly PPC budget of £50.",
    strategy: "Formulated a dual-channel strategy. For SEO, targeted a 30% organic traffic increase by optimizing Google Business Profile and local keywords. For PPC, targeted 2–3 B2B leads/month under the £50 cap by scheduling Google Ads strictly during business decision-maker hours (Mon-Fri, 8 AM - 6 PM).",
    execution: [
      "Targeted high-intent local B2B keywords: 'commercial cleaning portsmouth', 'office cleaning portsmouth', and 'contract cleaning portsmouth'.",
      "Configured Google Ads using Exact & Phrase match with bids aligned to a £2-£4 average CPC range.",
      "Implemented a strict day-parting schedule (Mon-Fri, 8 AM - 6 PM) to ensure ads only run when office/facilities managers are active.",
      "Redesigned the landing page structure to inject customer testimonials, Cialdini-inspired social proof, and a simplified quick-quote form.",
      "Set up Google Analytics & Search Console conversion tracking to measure KPIs (CTR target >3%, Landing Page Conversion >5%)."
    ],
    results: [
      "Created a phased digital marketing roadmap (SEO on-page, local citations, and bi-weekly PPC adjustments).",
      "Projected 2-3 qualified leads per month within the strict £50 monthly budget.",
      "Established long-term growth benchmarks of +30% organic traffic within 6 months."
    ]
  }
];

export default function CaseStudies() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedStudy = CASE_STUDIES.find((cs) => cs.id === selectedId);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedId]);

  return (
    <section id="case-studies" className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Case Studies</h2>
          <p className="text-xl text-white/60 max-w-2xl">
            Real-world marketing proposals, SEO diagnostics, and lead-gen campaigns built for local impact.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CASE_STUDIES.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
              onClick={() => setSelectedId(study.id)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between h-[450px]"
            >
              {/* Premium Background layers */}
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl transition-colors duration-500 group-hover:bg-white/[0.06] group-hover:border-white/20" />
              
              {/* Accent Glow on Hover */}
              <div className="absolute inset-x-0 -bottom-32 h-64 bg-white/10 blur-[120px] opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100" />

              {/* Card Header & Content */}
              <div className="relative p-8 md:p-10 z-10">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white/5 border border-white/10 text-white/70 mb-6">
                  {study.category}
                </span>
                
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4 group-hover:text-white/90 transition-colors">
                  {study.title}
                </h3>
                
                <p className="text-white/50 text-base md:text-lg max-w-xl line-clamp-3">
                  {study.shortDescription}
                </p>
              </div>

              {/* Card Footer: Metrics and Action */}
              <div className="relative p-8 md:p-10 pt-0 z-10 flex items-end justify-between border-t border-white/[0.05]">
                <div>
                  <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-white/95">
                    {study.metricValue}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wider text-white/40 mt-1">
                    {study.metricLabel}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white/70 group-hover:text-white transition-colors">
                  View Case Study
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="transform transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal Popup Detail Overlay */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedId(null)}
          >
            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-4xl bg-[#161616] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-12 my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 md:top-8 md:right-8 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition-all hover:scale-105"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Modal Header */}
              <div className="border-b border-white/10 pb-8 mb-8 pr-12">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider bg-white/5 border border-white/10 text-white/60 mb-4">
                  {selectedStudy.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                  {selectedStudy.title}
                </h3>
                <p className="text-white/40 text-sm md:text-base font-medium">
                  Client: <span className="text-white/70">{selectedStudy.client}</span>
                </p>
              </div>

              {/* Key Metric Panel */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 flex items-center justify-between mb-8">
                <div>
                  <div className="text-sm font-semibold tracking-wider text-white/40 uppercase mb-1">
                    Key Highlight / Impact
                  </div>
                  <div className="text-lg md:text-xl font-medium text-white/80">
                    {selectedStudy.metricLabel}
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-white animate-pulse">
                  {selectedStudy.metricValue}
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Left Column: Challenge & Strategy */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wider text-white/40 mb-3">
                      The Challenge
                    </h4>
                    <p className="text-white/70 text-base leading-relaxed whitespace-pre-line">
                      {selectedStudy.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wider text-white/40 mb-3">
                      The Strategy
                    </h4>
                    <p className="text-white/70 text-base leading-relaxed whitespace-pre-line">
                      {selectedStudy.strategy}
                    </p>
                  </div>
                </div>

                {/* Right Column: Execution & Deliverables */}
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wider text-white/40 mb-4">
                      Execution & Action Items
                    </h4>
                    <ul className="space-y-3">
                      {selectedStudy.execution.map((item, i) => (
                        <li key={i} className="flex gap-3 text-white/70 text-sm md:text-base leading-relaxed">
                          <span className="text-white/90 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wider text-white/40 mb-4">
                      Results & Target Objectives
                    </h4>
                    <ul className="space-y-3">
                      {selectedStudy.results.map((item, i) => (
                        <li key={i} className="flex gap-3 text-white/70 text-sm md:text-base leading-relaxed">
                          <span className="text-green-400 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
