import type { Metadata } from "next";
import { getSeoSettings, getProfile, getCaseStudies } from "@/lib/db";
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

export default async function Home() {
  const profile = await getProfile().catch(() => null);
  const caseStudies = await getCaseStudies().catch(() => []);

  // 1. Person Schema Setup
  const personSchema: any = {
    "@context": "https://schema.org",
    "@id": "https://saurav.digital/#person",
    "@type": "Person",
    "name": "Saurav Vaghela",
    "url": "https://saurav.digital",
    "jobTitle": "Digital Marketing & SEO Specialist",
    "image": "https://saurav.digital/og-image.png"
  };

  if (profile) {
    if (profile.about?.text) {
      personSchema.description = profile.about.text;
    }
    if (profile.skills && profile.skills.length > 0) {
      personSchema.knowsAbout = [...profile.skills, ...(profile.tools || [])];
    }
    if (profile.contact) {
      personSchema.email = profile.contact.email;
      personSchema.telephone = profile.contact.phone;
      personSchema.address = {
        "@type": "PostalAddress",
        "addressLocality": profile.contact.location || "Southampton",
        "addressCountry": "UK"
      };
      
      const socials = [];
      if (profile.contact.linkedinUrl) socials.push(profile.contact.linkedinUrl);
      personSchema.sameAs = socials;
    }
    if (profile.education && profile.education.length > 0) {
      personSchema.alumniOf = profile.education.map(edu => ({
        "@type": "EducationalOrganization",
        "name": edu.institution,
        "description": edu.degree
      }));
    }
    if (profile.certifications && profile.certifications.length > 0) {
      personSchema.hasCredential = profile.certifications.map(cert => ({
        "@type": "EducationalOccupationalCredential",
        "name": cert.title,
        "credentialCategory": "Certification",
        "recognizedBy": {
          "@type": "Organization",
          "name": cert.issuer
        }
      }));
    }
  }

  // 2. WebSite Schema Setup
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Saurav Vaghela | Digital Marketing & SEO Specialist",
    "url": "https://saurav.digital",
    "publisher": {
      "@id": "https://saurav.digital/#person"
    }
  };

  // 3. Project / Case Study Schema Setup
  const caseStudiesSchema = caseStudies.map(cs => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": cs.title,
    "creator": {
      "@id": "https://saurav.digital/#person"
    },
    "description": cs.shortDescription,
    "alternativeHeadline": `${cs.metricLabel}: ${cs.metricValue}`,
    "publisher": {
      "@id": "https://saurav.digital/#person"
    }
  }));

  const schemasArray = [personSchema, websiteSchema, ...caseStudiesSchema];

  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white/30 selection:text-white">
      {/* Inject Rich JSON-LD Schemas dynamically */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemasArray) }}
      />
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
