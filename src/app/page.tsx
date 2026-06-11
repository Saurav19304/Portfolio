import type { Metadata } from "next";
import { getSeoSettings } from "@/lib/db";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import EducationAndSkills from "@/components/EducationAndSkills";
import Contact from "@/components/Contact";
import InstagramContent from "@/components/InstagramContent";
import LinkedInPosts from "@/components/LinkedInPosts";
import CaseStudies from "@/components/CaseStudies";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const homeSeo = seo?.home;

  if (!homeSeo) return {};

  return {
    title: homeSeo.title,
    description: homeSeo.description,
    keywords: homeSeo.keywords ? homeSeo.keywords.split(",").map(k => k.trim()) : [],
    alternates: {
      canonical: homeSeo.canonical || "https://saurav.digital/",
    },
    robots: {
      index: !homeSeo.robots?.includes("noindex"),
      follow: !homeSeo.robots?.includes("nofollow"),
    },
    openGraph: {
      title: homeSeo.ogTitle || homeSeo.title,
      description: homeSeo.ogDescription || homeSeo.description,
      images: homeSeo.ogImage ? [{ url: homeSeo.ogImage }] : [],
      url: "https://saurav.digital/",
    },
    twitter: {
      card: "summary_large_image",
      title: homeSeo.ogTitle || homeSeo.title,
      description: homeSeo.ogDescription || homeSeo.description,
      images: homeSeo.ogImage ? [homeSeo.ogImage] : [],
    }
  };
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white/30 selection:text-white">
      <ScrollyCanvas />
      <AboutMe />
      <Projects />
      <InstagramContent />
      <LinkedInPosts />
      <CaseStudies />
      <Experience />
      <EducationAndSkills />
      <Contact />
    </main>
  );
}
