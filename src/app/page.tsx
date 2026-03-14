import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import EducationAndSkills from "@/components/EducationAndSkills";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white/30 selection:text-white">
      <ScrollyCanvas />
      <Projects />
      <Experience />
      <EducationAndSkills />
    </main>
  );
}
