"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  // Section 1: 0% to 20%
  const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // Section 2: 25% to 55%
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.45, 0.55], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.55], [100, -100]);

  // Section 3: 60% to 90%
  const opacity3 = useTransform(scrollYProgress, [0.55, 0.65, 0.8, 0.9], [0, 1, 1, 0]);
  const y3 = useTransform(scrollYProgress, [0.55, 0.9], [100, -100]);

  // Ensure this wrapper has pointer-events-none so it doesn't block scrolling/clicking
  // Text will be pointer-events-auto if needed
  return (
    <div className="absolute inset-0 pointer-events-none z-10 text-white flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-12 p-8">
      {/* SECTION 1: Center Aligned */}
      <motion.div
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-shadow-sm">
          Saurav Vaghela.
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-medium mb-8">
          Digital Marketing & SEO Professional.
        </p>
        <a
          href="/saurav-cv .pdf"
          download="Saurav_CV.pdf"
          className="pointer-events-auto px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Download Resume
        </a>
      </motion.div>

      {/* SECTION 2: Left Aligned */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex flex-col items-start justify-center pl-6 md:pl-20"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-xl leading-tight">
          I drive organic growth & data insights.
        </h2>
      </motion.div>

      {/* SECTION 3: Right Aligned */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex flex-col items-end justify-center pr-6 md:pr-20 text-right"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-xl leading-tight">
          Bridging strategy, content, and analytics.
        </h2>
      </motion.div>
    </div>
  );
}
