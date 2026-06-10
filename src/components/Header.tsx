"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const isBlog = pathname.startsWith("/blog");

  // Clean URL hash on mount/path change if present
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const timer = setTimeout(() => {
        window.history.replaceState(
          null,
          "",
          window.location.pathname
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 inset-x-0 z-50 max-w-5xl mx-auto px-6 pointer-events-none"
    >
      <div className="w-full py-3 px-6 md:px-8 rounded-full bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between pointer-events-auto">
        {/* Brand/Logo */}
        <Link href="/" className="text-sm font-bold tracking-tight text-white hover:text-white/80 transition-colors" onClick={handleLogoClick}>
          Saurav.digital
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-white/60">
          <Link href="/#about" className="hover:text-white transition-colors" onClick={(e) => handleScroll(e, "about")}>
            ABOUT
          </Link>
          <Link href="/#projects" className="hover:text-white transition-colors" onClick={(e) => handleScroll(e, "projects")}>
            PROJECTS
          </Link>
          <Link href="/#experience" className="hover:text-white transition-colors" onClick={(e) => handleScroll(e, "experience")}>
            EXPERIENCE
          </Link>
          <Link href="/#contact" className="hover:text-white transition-colors" onClick={(e) => handleScroll(e, "contact")}>
            CONTACT
          </Link>
        </nav>

        {/* Call to Action Button */}
        <div>
          <Link
            href="/blog"
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
              isBlog
                ? "bg-white text-black font-bold"
                : "bg-white/5 border border-white/10 text-white/80 hover:bg-white hover:text-black hover:border-white"
            }`}
          >
            BLOG
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
