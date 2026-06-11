"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ProfileManagerProps {
  showNotification: (type: "success" | "error", text: string) => void;
}

export default function ProfileManager({ showNotification }: ProfileManagerProps) {
  const [activeTab, setActiveTab] = useState<"about" | "contact" | "education" | "certs" | "skills">("about");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile States
  const [aboutText, setAboutText] = useState("");
  const [contact, setContact] = useState({
    email: "",
    phone: "",
    linkedinUrl: "",
    linkedinName: "",
    location: ""
  });
  const [education, setEducation] = useState<Array<{ degree: string; institution: string; period: string }>>([]);
  const [certs, setCerts] = useState<Array<{ title: string; issuer: string; period: string; details: string }>>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);

  // Temp item builders
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", period: "" });
  const [newCert, setNewCert] = useState({ title: "", issuer: "", period: "", details: "" });
  const [newSkill, setNewSkill] = useState("");
  const [newTool, setNewTool] = useState("");

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setAboutText(data.about?.text || "");
        setContact(data.contact || { email: "", phone: "", linkedinUrl: "", linkedinName: "", location: "" });
        setEducation(data.education || []);
        setCerts(data.certifications || []);
        setSkills(data.skills || []);
        setTools(data.tools || []);
      }
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to load profile settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const payload = {
      about: { text: aboutText },
      education,
      certifications: certs,
      skills,
      tools,
      contact
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showNotification("success", "Profile settings saved successfully!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to update profile settings.");
    } finally {
      setIsSaving(false);
    }
  };

  // List manipulation helpers
  const addEducation = () => {
    if (!newEdu.degree || !newEdu.institution || !newEdu.period) {
      showNotification("error", "Please fill in all education fields.");
      return;
    }
    setEducation([...education, newEdu]);
    setNewEdu({ degree: "", institution: "", period: "" });
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addCert = () => {
    if (!newCert.title || !newCert.issuer || !newCert.period) {
      showNotification("error", "Please fill in core certification fields.");
      return;
    }
    setCerts([...certs, newCert]);
    setNewCert({ title: "", issuer: "", period: "", details: "" });
  };

  const removeCert = (index: number) => {
    setCerts(certs.filter((_, i) => i !== index));
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (skills.includes(newSkill.trim())) return;
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (tag: string) => {
    setSkills(skills.filter((s) => s !== tag));
  };

  const addTool = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTool.trim()) {
      e.preventDefault();
      if (tools.includes(newTool.trim())) return;
      setTools([...tools, newTool.trim()]);
      setNewTool("");
    }
  };

  const removeTool = (tag: string) => {
    setTools(tools.filter((t) => t !== tag));
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-white/40 animate-pulse text-sm">
        Loading profile configuration database...
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8 backdrop-blur-sm relative">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-1/4 flex flex-col gap-2 border-r border-white/5 pr-0 md:pr-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/30 mb-4 px-3">Sections</h3>
          {[
            { id: "about", label: "About Me" },
            { id: "contact", label: "Contact Details" },
            { id: "education", label: "Education" },
            { id: "certs", label: "Certifications" },
            { id: "skills", label: "Skills & Tools" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-xl text-left text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-black shadow-lg"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="mt-8 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-black font-bold text-sm tracking-wide transition-colors"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === "about" && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Edit About Me Summary</h4>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                  Biography Statement
                </label>
                <textarea
                  rows={8}
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20 leading-relaxed font-light"
                  placeholder="Introduce yourself and describe your expertise..."
                />
              </div>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Edit Contact Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    LinkedIn Link URL
                  </label>
                  <input
                    type="url"
                    value={contact.linkedinUrl}
                    onChange={(e) => setContact({ ...contact, linkedinUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    LinkedIn Display Name
                  </label>
                  <input
                    type="text"
                    value={contact.linkedinName}
                    onChange={(e) => setContact({ ...contact, linkedinName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                    Location (City, Country)
                  </label>
                  <input
                    type="text"
                    value={contact.location}
                    onChange={(e) => setContact({ ...contact, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Manage Education Degrees</h4>
              
              {/* Creator Form */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                    Degree Name
                  </label>
                  <input
                    type="text"
                    value={newEdu.degree}
                    onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                    placeholder="e.g. MA Digital Marketing"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={newEdu.institution}
                    onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                    placeholder="e.g. University of Portsmouth"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                    Period
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newEdu.period}
                      onChange={(e) => setNewEdu({ ...newEdu, period: e.target.value })}
                      placeholder="e.g. 2026 – 2027"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={addEducation}
                      className="px-3 rounded-lg bg-white text-black font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-3">
                {education.length === 0 ? (
                  <div className="text-xs text-white/30 text-center py-6">No education history added yet.</div>
                ) : (
                  education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.01] border border-white/5">
                      <div>
                        <h5 className="font-semibold text-white/90 text-sm">{edu.degree}</h5>
                        <p className="text-xs text-white/50 mt-0.5">{edu.institution} • {edu.period}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "certs" && (
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Manage Certifications</h4>
              
              {/* Creator Form */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                      Certificate Title
                    </label>
                    <input
                      type="text"
                      value={newCert.title}
                      onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                      placeholder="e.g. Google SEO Fundamentals"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      value={newCert.issuer}
                      onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                      placeholder="e.g. Coursera"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                      Period
                    </label>
                    <input
                      type="text"
                      value={newCert.period}
                      onChange={(e) => setNewCert({ ...newCert, period: e.target.value })}
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                    Details / Highlights
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCert.details}
                      onChange={(e) => setNewCert({ ...newCert, details: e.target.value })}
                      placeholder="Describe what you learned or achievements..."
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={addCert}
                      className="px-4 rounded-lg bg-white text-black font-bold text-xs shrink-0"
                    >
                      Add Certificate
                    </button>
                  </div>
                </div>
              </div>

              {/* Items list */}
              <div className="space-y-3">
                {certs.length === 0 ? (
                  <div className="text-xs text-white/30 text-center py-6">No certifications added yet.</div>
                ) : (
                  certs.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-start p-4 rounded-xl bg-white/[0.01] border border-white/5">
                      <div className="pr-4">
                        <h5 className="font-semibold text-white/90 text-sm">{c.title}</h5>
                        <p className="text-xs text-white/50 mt-0.5">{c.issuer} • {c.period}</p>
                        {c.details && <p className="text-xs text-white/40 mt-2 leading-relaxed">{c.details}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCert(idx)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-8">
              {/* Skills Tags */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold">Manage Skills Tags</h4>
                <div className="flex flex-wrap gap-2 p-4 min-h-[100px] rounded-xl bg-white/[0.02] border border-white/10">
                  {skills.length === 0 && <span className="text-xs text-white/30 self-center">No skills added. Press Enter to add tags.</span>}
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/90">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="w-4 h-4 rounded-full bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                    Press Enter to add Skill Tag
                  </label>
                  <input
                    type="text"
                    value={newSkill}
                    onKeyDown={addSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Type skill name and press Enter..."
                    className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              {/* Tools Tags */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold">Manage Tools & Technologies</h4>
                <div className="flex flex-wrap gap-2 p-4 min-h-[100px] rounded-xl bg-white/[0.02] border border-white/10">
                  {tools.length === 0 && <span className="text-xs text-white/30 self-center">No tools added. Press Enter to add tags.</span>}
                  {tools.map((tool) => (
                    <span key={tool} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/90">
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeTool(tool)}
                        className="w-4 h-4 rounded-full bg-white/10 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                    Press Enter to add Tool/Tech Tag
                  </label>
                  <input
                    type="text"
                    value={newTool}
                    onKeyDown={addTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    placeholder="Type tool name and press Enter..."
                    className="w-full px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
