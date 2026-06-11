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
    title: "Revitalizing Foot Traffic & Engagement for a National Treasure",
    client: "Mary Rose Museum (Portsmouth)",
    category: "Marketing Agency Strategy",
    shortDescription: "A comprehensive digital marketing audit and agency campaign proposal designed to modernize visitor acquisition and engage younger demographics.",
    metricValue: "3 Personas",
    metricLabel: "Strategic Target Audiences",
    challenge: "The Mary Rose Museum, housing Henry VIII's historic Tudor warship, needed to expand its appeal to younger demographics and Portsmouth locals without compromising its educational prestige and historical authority.",
    strategy: "Conducted an in-depth digital audit of the Portsmouth Historic Dockyard ecosystem. Structured a multi-channel campaign around three core target personas: local families seeking experiential weekends, history enthusiasts looking for deep content, and tech-savvy students.",
    execution: [
      "Audited local search volume around historic Portsmouth tourism to identify content and intent gaps.",
      "Designed a social media storytelling framework leveraging interactive, video-first content (Instagram/TikTok) to bring Tudor history to life.",
      "Proposed augmented reality (AR) overlay recommendations for physical exhibitions to create gamified visitor loops.",
      "Formulated joint partnership strategies with Portsmouth universities and local hospitality operators for co-promotional pricing.",
      "Drafted high-intent local SEO content clusters mapping family-friendly weekend itineraries in Portsmouth."
    ],
    results: [
      "Presented a structured, repeatable agency framework ready for museum marketing board review.",
      "Detailed 12 months of tactical social media concepts and creative templates.",
      "Mappped direct channels to increase seasonal bookings through localized digital touchpoints."
    ]
  },
  {
    id: "sea-wolf-cleaning",
    title: "Dominating Portsmouth Map Packs & Scaling Local Bookings",
    client: "Sea Wolf Cleaning Services",
    category: "Local SEO & Lead Generation",
    shortDescription: "Implemented a full-scale local SEO blueprint and landing page redesign to drive high-intent commercial and residential cleaning leads.",
    metricValue: "+140%",
    metricLabel: "Inbound Lead Volume",
    challenge: "Sea Wolf Cleaning Services operated in a crowded regional market with virtually zero search footprint, making them highly dependent on word-of-mouth and expensive third-party lead brokers.",
    strategy: "Built a Local SEO and conversion rate optimization (CRO) system. Focused on capturing high-intent organic traffic (users searching for local cleaning services) and directing them to a friction-free booking flow.",
    execution: [
      "Re-optimized Google Business Profile (GBP) categories, services, and local geographical service zones.",
      "Set up an automated email/SMS sequence to encourage and collect Google reviews from satisfied clients, increasing review velocity.",
      "Created location-specific landing pages optimized for keywords like 'commercial cleaning Portsmouth' and 'office cleaning services near me'.",
      "Redesigned the homepage header and booking flow, replacing long forms with an instant, multi-step quote calculator.",
      "Injected LocalBusiness schema structured data markup to help search engine crawlers map localized details."
    ],
    results: [
      "Ranked in the top 3 Google Map Pack spots for primary local commercial and office cleaning terms.",
      "Boosted inbound quote inquiries and bookings by 140% within the first 90 days.",
      "Decreased average cost-per-acquisition (CPA) by eliminating third-party lead purchases."
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
            Real-world marketing plans, SEO diagnostics, and growth campaigns built for local impact.
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
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
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
                    <p className="text-white/70 text-base leading-relaxed">
                      {selectedStudy.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold uppercase tracking-wider text-white/40 mb-3">
                      The Strategy
                    </h4>
                    <p className="text-white/70 text-base leading-relaxed">
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
                      Results & Deliverables
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
