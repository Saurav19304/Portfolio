"use client";

import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">About Me</h2>

          <div className="p-8 md:p-12 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-75" />
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light relative z-10">
              I am a Digital Marketing and SEO professional with hands-on experience in keyword research, on-page SEO, technical SEO, and content optimization. I focus on leveraging data-driven strategies to enhance website visibility, improve search rankings, and drive sustainable organic traffic growth. I am passionate about helping businesses strengthen their online presence and achieve measurable results through effective digital marketing strategies.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
