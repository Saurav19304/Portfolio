import ScrollyCanvas from "@/components/ScrollyCanvas";
import AboutMe from "@/components/AboutMe";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import EducationAndSkills from "@/components/EducationAndSkills";
import Contact from "@/components/Contact";
import InstagramContent from "@/components/InstagramContent";
import LinkedInPosts from "@/components/LinkedInPosts";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white/30 selection:text-white">
      <ScrollyCanvas />
      <AboutMe />
      <Projects />
      <InstagramContent />
      <LinkedInPosts />
      <Experience />
      <EducationAndSkills />
      <Contact />
    </main>
  );
}
