"use client";

import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="relative z-20 bg-[#121212] py-32 px-6 lg:px-12 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Contact Me</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            I'm currently open to new opportunities. Let's create something great together.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-3xl overflow-hidden"
          >
            {/* Glassmorphism Background layer */}
            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl transition-colors duration-500 group-hover:bg-white/[0.08]" />

            <div className="relative flex flex-col sm:flex-row justify-center sm:justify-around items-start sm:items-center p-8 md:p-12 z-10 gap-8 sm:gap-0">

              <div className="flex flex-col space-y-10 w-full sm:w-auto">
                <a href="mailto:sauravvaghela22@gmail.com" className="flex items-center space-x-6 group/link w-full">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/link:bg-white/10 transition-colors">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/50 mb-1 font-medium tracking-wider uppercase">Email</p>
                    <p className="text-lg md:text-xl font-semibold hover:text-white/80 transition-colors truncate">
                      sauravvaghela22@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center space-x-6 w-full">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/50 mb-1 font-medium tracking-wider uppercase">Phone</p>
                    <p className="text-lg md:text-xl font-semibold truncate">
                      +44 7352697112
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-10 w-full sm:w-auto">
                <a href="https://www.linkedin.com/in/sauravvaghela19/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-6 group/link w-full">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/link:bg-white/10 transition-colors">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/50 mb-1 font-medium tracking-wider uppercase">LinkedIn</p>
                    <p className="text-lg md:text-xl font-semibold hover:text-white/80 transition-colors truncate">
                      Saurav Vaghela
                    </p>
                  </div>
                </a>

                <div className="flex items-center space-x-6 w-full">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/50 mb-1 font-medium tracking-wider uppercase">Location</p>
                    <p className="text-lg md:text-xl font-semibold truncate">
                      Southampton, UK
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
