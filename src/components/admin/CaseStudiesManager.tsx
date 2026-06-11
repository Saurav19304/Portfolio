"use client";

import { useState, useEffect } from "react";

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

interface CaseStudiesManagerProps {
  showNotification: (type: "success" | "error", text: string) => void;
}

export default function CaseStudiesManager({ showNotification }: CaseStudiesManagerProps) {
  const [list, setList] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("Local SEO & PPC Strategy");
  const [shortDescription, setShortDescription] = useState("");
  const [metricValue, setMetricValue] = useState("");
  const [metricLabel, setMetricLabel] = useState("");
  const [challenge, setChallenge] = useState("");
  const [strategy, setStrategy] = useState("");
  
  // List arrays
  const [executionStr, setExecutionStr] = useState("");
  const [resultsStr, setResultsStr] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const fetchStudies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/case-studies");
      if (res.ok) {
        const data = await res.json();
        setList(data || []);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to fetch case studies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const handleEdit = (cs: CaseStudy) => {
    setIsEditing(true);
    setId(cs.id);
    setTitle(cs.title);
    setClient(cs.client);
    setCategory(cs.category);
    setShortDescription(cs.shortDescription);
    setMetricValue(cs.metricValue);
    setMetricLabel(cs.metricLabel);
    setChallenge(cs.challenge);
    setStrategy(cs.strategy);
    setExecutionStr(cs.execution.join("\n"));
    setResultsStr(cs.results.join("\n"));

    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleClear = () => {
    setIsEditing(false);
    setId("");
    setTitle("");
    setClient("");
    setCategory("Local SEO & PPC Strategy");
    setShortDescription("");
    setMetricValue("");
    setMetricLabel("");
    setChallenge("");
    setStrategy("");
    setExecutionStr("");
    setResultsStr("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      showNotification("error", "Title and Client are required.");
      return;
    }

    setIsSaving(true);
    const execution = executionStr.split("\n").map(s => s.trim()).filter(s => s.length > 0);
    const results = resultsStr.split("\n").map(s => s.trim()).filter(s => s.length > 0);

    const csData = {
      title,
      client,
      category,
      shortDescription,
      metricValue,
      metricLabel,
      challenge,
      strategy,
      execution,
      results
    };

    try {
      const endpoint = isEditing ? `/api/case-studies/${id}` : "/api/case-studies";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(csData)
      });

      if (res.ok) {
        showNotification("success", isEditing ? "Case Study updated successfully!" : "Case Study added successfully!");
        handleClear();
        fetchStudies();
      } else {
        throw new Error("Failed saving");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to save Case Study.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (deleteId: string) => {
    if (!confirm("Are you sure you want to delete this case study? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/case-studies/${deleteId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        showNotification("success", "Case study deleted.");
        fetchStudies();
      } else {
        throw new Error("Failed deleting");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to delete case study.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-white/40 animate-pulse text-sm">
        Loading case studies database...
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Existing Case Studies List */}
      <section className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-6">Manage Case Studies</h3>
        {list.length === 0 ? (
          <div className="text-center py-8 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
            No case studies found in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Metric</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((study) => (
                  <tr key={study.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-4 font-bold text-white/90">{study.client}</td>
                    <td className="py-4 px-4 text-white/80">{study.title}</td>
                    <td className="py-4 px-4 text-white/60">{study.category}</td>
                    <td className="py-4 px-4 text-xs font-mono text-emerald-400">{study.metricValue} ({study.metricLabel})</td>
                    <td className="py-4 px-4 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => handleEdit(study)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(study.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Case Study Form */}
      <section className="rounded-3xl border border-white/5 bg-white/[0.01] p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-8">
          {isEditing ? `Edit Case Study: ${client}` : "Add New Case Study"}
        </h3>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                Client Name / Organization
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Mary Rose Museum"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                Case Study Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scaling Local Docks Traffic..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                Category / Strategy Type
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Local SEO & PPC Strategy"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                  Highlight Metric (Value)
                </label>
                <input
                  type="text"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  placeholder="e.g. +140% or 3 Personas"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                  Metric Label Description
                </label>
                <input
                  type="text"
                  value={metricLabel}
                  onChange={(e) => setMetricLabel(e.target.value)}
                  placeholder="e.g. Inbound Bookings"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                Short Description (Card Summary)
              </label>
              <textarea
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="A concise, 2-3 sentence overview that appears on the card grid."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                The Challenge Details (Modal)
              </label>
              <textarea
                rows={5}
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                The Strategy Details (Modal)
              </label>
              <textarea
                rows={5}
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                Execution Steps (One item per line)
              </label>
              <textarea
                rows={6}
                value={executionStr}
                onChange={(e) => setExecutionStr(e.target.value)}
                placeholder="Audited local search volume&#10;Configured Google Ads campaign"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm font-mono text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">
                Results / Deliverables (One item per line)
              </label>
              <textarea
                rows={6}
                value={resultsStr}
                onChange={(e) => setResultsStr(e.target.value)}
                placeholder="Ranked Map Pack top 3&#10;Increased bookings by 140%"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm font-mono text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-black font-bold text-sm tracking-wide transition-colors"
            >
              {isSaving ? "Saving..." : isEditing ? "Update Case Study" : "Add Case Study"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-bold text-sm text-white"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
