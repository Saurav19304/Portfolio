"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost, getReadTime } from "@/lib/blogUtils";
import CaseStudiesManager from "@/components/admin/CaseStudiesManager";
import SocialPostsManager from "@/components/admin/SocialPostsManager";
import ProfileManager from "@/components/admin/ProfileManager";

type Block =
  | { id: string; type: "heading"; level: 2 | 3; text: string }
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; src: string; alt: string }
  | { id: string; type: "quote"; text: string }
  | { id: string; type: "list"; style: "ordered" | "unordered"; items: string[] };

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Database Posts list
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Editor State
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Technical SEO");
  const [tagsInput, setTagsInput] = useState("");
  const [author, setAuthor] = useState("Saurav Vaghela");
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [featured, setFeatured] = useState(false);
  const [featuredImage, setFeaturedImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");

  // Blocks State
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "initial-text", type: "text", text: "" }
  ]);

  // UI tabs and feedback
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);

  // Site-wide SEO Dashboard Mode & States
  const [dashboardMode, setDashboardMode] = useState<"blog" | "case" | "social" | "profile" | "seo">("blog");
  const [activeSeoTab, setActiveSeoTab] = useState<"home" | "blog" | "general">("home");
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [seoSettings, setSeoSettings] = useState<{
    home: any;
    blog: any;
    general: any;
  }>({
    home: { title: "", description: "", keywords: "", robots: "index, follow", canonical: "", ogTitle: "", ogDescription: "", ogImage: "" },
    blog: { title: "", description: "", keywords: "", robots: "index, follow", canonical: "", ogTitle: "", ogDescription: "", ogImage: "" },
    general: { googleAnalyticsId: "", googleSiteVerification: "", schemaMarkup: "" }
  });

  const fetchSeoSettings = async () => {
    try {
      const res = await fetch("/api/seo");
      if (res.ok) {
        const data = await res.json();
        setSeoSettings(data);
      }
    } catch (error) {
      console.error("Failed to load SEO settings:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSeoSettings();
    }
  }, [isAuthenticated]);

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoSettings),
      });

      if (res.ok) {
        showNotification("success", "Site-wide SEO configurations saved successfully!");
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save SEO settings");
      }
    } catch (error: any) {
      console.error(error);
      showNotification("error", error.message || "Failed to save SEO settings.");
    } finally {
      setIsSavingSeo(false);
    }
  };

  const updateHomeSeo = (fields: any) => {
    setSeoSettings((prev) => ({
      ...prev,
      home: { ...prev.home, ...fields }
    }));
  };

  const updateBlogSeo = (fields: any) => {
    setSeoSettings((prev) => ({
      ...prev,
      blog: { ...prev.blog, ...fields }
    }));
  };

  const updateGeneralSeo = (fields: any) => {
    setSeoSettings((prev) => ({
      ...prev,
      general: { ...prev.general, ...fields }
    }));
  };

  // Auto-generate slug from title if not editing an existing slug
  useEffect(() => {
    if (!editingSlug) {
      const derived = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(derived);
      
      // Auto-set SEO meta title
      setMetaTitle(title ? `${title} | Saurav Vaghela` : "");
    }
  }, [title, editingSlug]);

  // Check storage for existing session
  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      if (res.ok) {
        localStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
        setLoginError("");
      } else {
        const data = await res.json();
        setLoginError(data.error || "Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Failed to communicate with authentication server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setLoginUsername("");
    setLoginPassword("");
  };

  // Fetch all posts (including drafts) on mount/auth state change
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/posts?drafts=true");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  // Show a message that fades out
  const showNotification = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Block Helpers
  const addBlock = (type: Block["type"]) => {
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    let newBlock: Block;

    if (type === "heading") {
      newBlock = { id: newId, type: "heading", level: 2, text: "" };
    } else if (type === "image") {
      newBlock = { id: newId, type: "image", src: "", alt: "" };
    } else if (type === "quote") {
      newBlock = { id: newId, type: "quote", text: "" };
    } else if (type === "list") {
      newBlock = { id: newId, type: "list", style: "unordered", items: [""] };
    } else {
      newBlock = { id: newId, type: "text", text: "" };
    }

    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) {
      setBlocks([{ id: "default-text", type: "text", text: "" }]);
      return;
    }
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const updateBlock = (id: string, fields: Partial<Block>) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== id) return b;
        return { ...b, ...fields } as Block;
      })
    );
  };

  // List Item Helpers
  const addListItem = (blockId: string, itemIndex: number) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== "list") return b;
        const newItems = [...b.items];
        newItems.splice(itemIndex + 1, 0, "");
        return { ...b, items: newItems };
      })
    );
  };

  const removeListItem = (blockId: string, itemIndex: number) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== "list") return b;
        if (b.items.length === 1) return b;
        const newItems = b.items.filter((_, i) => i !== itemIndex);
        return { ...b, items: newItems };
      })
    );
  };

  const updateListItem = (blockId: string, itemIndex: number, text: string) => {
    setBlocks(
      blocks.map((b) => {
        if (b.id !== blockId || b.type !== "list") return b;
        const newItems = [...b.items];
        newItems[itemIndex] = text;
        return { ...b, items: newItems };
      })
    );
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, blockId: string | null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (blockId) {
        setUploadingBlockId(blockId);
      } else {
        setIsUploadingFeatured(true);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      if (blockId) {
        updateBlock(blockId, { src: data.url });
      } else {
        setFeaturedImage(data.url);
      }
      showNotification("success", "Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to upload image.");
    } finally {
      setUploadingBlockId(null);
      setIsUploadingFeatured(false);
    }
  };

  // Serialization Block -> HTML
  const serializeBlocksToHTML = (blocksList: Block[]): string => {
    return blocksList
      .map((block) => {
        switch (block.type) {
          case "heading":
            return `<h${block.level}>${block.text}</h${block.level}>`;
          case "text":
            // Replace newlines with <br /> or wrap in paragraphs
            return `<p>${block.text.replace(/\n/g, "<br />")}</p>`;
          case "quote":
            return `<blockquote>${block.text}</blockquote>`;
          case "image":
            return `<img src="${block.src}" alt="${block.alt || title}" />`;
          case "list":
            const tag = block.style === "ordered" ? "ol" : "ul";
            const itemsHtml = block.items
              .map((item) => `<li>${item}</li>`)
              .join("\n");
            return `<${tag}>\n${itemsHtml}\n</${tag}>`;
          default:
            return "";
        }
      })
      .join("\n");
  };

  // Parsing HTML -> Blocks
  const parseHTMLToBlocks = (html: string): Block[] => {
    if (typeof window === "undefined") return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const parsedBlocks: Block[] = [];

    doc.body.childNodes.forEach((node, index) => {
      const id = `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        if (tagName === "h2" || tagName === "h3") {
          parsedBlocks.push({
            id,
            type: "heading",
            level: tagName === "h2" ? 2 : 3,
            text: el.textContent || "",
          });
        } else if (tagName === "p") {
          // Replace <br> back to newlines
          const text = el.innerHTML.replace(/<br\s*\/?>/gi, "\n");
          parsedBlocks.push({
            id,
            type: "text",
            text: text || "",
          });
        } else if (tagName === "blockquote") {
          parsedBlocks.push({
            id,
            type: "quote",
            text: el.textContent || "",
          });
        } else if (tagName === "img") {
          parsedBlocks.push({
            id,
            type: "image",
            src: el.getAttribute("src") || "",
            alt: el.getAttribute("alt") || "",
          });
        } else if (tagName === "ul" || tagName === "ol") {
          const items: string[] = [];
          el.querySelectorAll("li").forEach((li) => {
            items.push(li.innerHTML || "");
          });
          parsedBlocks.push({
            id,
            type: "list",
            style: tagName === "ol" ? "ordered" : "unordered",
            items: items.length > 0 ? items : [""],
          });
        } else {
          parsedBlocks.push({
            id,
            type: "text",
            text: el.outerHTML || "",
          });
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        parsedBlocks.push({
          id,
          type: "text",
          text: node.textContent.trim(),
        });
      }
    });

    if (parsedBlocks.length === 0) {
      parsedBlocks.push({ id: `default-${Date.now()}`, type: "text", text: "" });
    }
    return parsedBlocks;
  };

  // Submit / Save Post
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      showNotification("error", "Title and Slug are required.");
      return;
    }

    setIsSubmitting(true);
    const contentHtml = serializeBlocksToHTML(blocks);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postData = {
      title,
      slug,
      excerpt,
      content: contentHtml,
      featuredImage,
      category,
      tags,
      metaTitle,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      author,
      status,
      featured,
    };

    try {
      const endpoint = editingSlug ? `/api/posts/${editingSlug}` : "/api/posts";
      const method = editingSlug ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save post");
      }

      showNotification("success", editingSlug ? "Post updated successfully!" : "Post published successfully!");
      
      // If we saved a new post, reset editing state
      if (!editingSlug) {
        clearForm();
      }
      
      fetchPosts();
    } catch (error: any) {
      console.error(error);
      showNotification("error", error.message || "Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit action
  const handleEdit = (post: BlogPost) => {
    setEditingSlug(post.slug);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setCategory(post.category);
    setTagsInput(post.tags.join(", "));
    setAuthor(post.author);
    setStatus(post.status);
    setFeatured(post.featured);
    setFeaturedImage(post.featuredImage);
    setMetaTitle(post.metaTitle);
    setMetaDescription(post.metaDescription);
    setFocusKeyword(post.focusKeyword);

    const parsed = parseHTMLToBlocks(post.content);
    setBlocks(parsed);
    setActiveTab("write");
    
    // Scroll editor into view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete action
  const handleDelete = async (slugToDelete: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/posts/${slugToDelete}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showNotification("success", "Post deleted successfully.");
        if (editingSlug === slugToDelete) {
          clearForm();
        }
        fetchPosts();
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error(error);
      showNotification("error", "Failed to delete post.");
    }
  };

  // Reset form
  const clearForm = () => {
    setEditingSlug(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setCategory("Technical SEO");
    setTagsInput("");
    setAuthor("Saurav Vaghela");
    setStatus("draft");
    setFeatured(false);
    setFeaturedImage("");
    setMetaTitle("");
    setMetaDescription("");
    setFocusKeyword("");
    setBlocks([{ id: "new-text", type: "text", text: "" }]);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white selection:bg-white/30 selection:text-white flex items-center justify-center p-6 relative">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/80">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Admin Authentication</h2>
            <p className="text-white/40 text-xs mt-1">Please enter credentials to unlock the blog editor.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="admin"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20"
                required
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg"
              >
                {loginError}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors shadow-lg shadow-white/5 mt-2"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white selection:bg-white/30 selection:text-white pb-32">
      {/* Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

      {/* Floating status alert */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              message.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
                : "bg-rose-950/80 border-rose-500/30 text-rose-200"
            }`}
          >
            {message.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-16 relative z-10">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/blog" className="text-xs font-semibold tracking-widest text-white/40 hover:text-white uppercase transition-colors">
                ← Back to Blog
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {dashboardMode === "blog" && "Blog Editor Dashboard"}
              {dashboardMode === "case" && "Case Studies Manager"}
              {dashboardMode === "social" && "Social Media Posts"}
              {dashboardMode === "profile" && "Profile Content Settings"}
              {dashboardMode === "seo" && "Site-wide SEO Manager"}
            </h1>
            <p className="text-white/50 text-sm mt-1">
              {dashboardMode === "blog" && "Create and manage portfolio articles without writing HTML."}
              {dashboardMode === "case" && "Manage case studies and client projects shown on the homepage."}
              {dashboardMode === "social" && "Manage Instagram Reels/Images and LinkedIn posts feeds."}
              {dashboardMode === "profile" && "Manage about text, education, certifications, skills, and contact info."}
              {dashboardMode === "seo" && "Manage page meta tags, analytics tracking, verification keys, and custom JSON-LD schema."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Switcher */}
            <div className="flex rounded-full overflow-hidden bg-white/5 border border-white/10 p-0.5 mr-2 flex-wrap">
              {[
                { id: "blog", label: "Blog" },
                { id: "case", label: "Case Studies" },
                { id: "social", label: "Social Feeds" },
                { id: "profile", label: "Profile Content" },
                { id: "seo", label: "SEO Config" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDashboardMode(tab.id as any)}
                  className={`px-3 py-2 rounded-full text-[11px] font-bold tracking-wider transition-colors ${
                    dashboardMode === tab.id ? "bg-white text-black font-extrabold" : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {dashboardMode === "blog" && editingSlug && (
              <button
                onClick={clearForm}
                className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider border border-white/10 hover:bg-white/5 transition-colors"
              >
                Create New Post
              </button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              View Site
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {dashboardMode === "blog" && (
          <>
            {/* Existing Articles Table/Listing */}
            <section className="mb-16 rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m-2 3h.01M5.5 8.5h-.01M5.5 12h.01M5.5 15.5h-.01" />
            </svg>
            Manage Existing Posts
          </h2>
          {isLoading ? (
            <div className="h-20 animate-pulse bg-white/5 rounded-2xl w-full flex items-center justify-center text-white/30 text-sm">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-white/40 text-sm">
              No blog posts found in the database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Published At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map((post) => (
                    <tr key={post.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 px-4 font-semibold text-white/95">
                        <div className="flex items-center gap-2">
                          {post.featured && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                              Featured
                            </span>
                          )}
                          <span>{post.title}</span>
                        </div>
                        <div className="text-xs text-white/40 mt-0.5 group-hover:text-white/60 font-mono">/{post.slug}</div>
                      </td>
                      <td className="py-4 px-4 text-white/60">{post.category}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          post.status === "published"
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-white/60">{post.views}</td>
                      <td className="py-4 px-4 text-white/40 text-xs">
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug)}
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

        {/* Editor Form Layout */}
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Writing Area (2 Columns Wide) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Title Block */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="Enter a catchy title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xl font-bold focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/25"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  URL Slug (Auto-generated)
                </label>
                <div className="flex rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 focus-within:border-white/30 transition-colors">
                  <span className="px-4 py-3 bg-white/5 border-r border-white/10 text-xs font-mono text-white/30 flex items-center">
                    /blog/
                  </span>
                  <input
                    type="text"
                    placeholder="url-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent text-sm font-mono focus:outline-none text-white placeholder-white/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Excerpt / Brief Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="A short summary of your article shown on cards and listings..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-sm leading-relaxed focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/25 resize-none"
                  required
                />
              </div>
            </div>

            {/* TAB Navigation */}
            <div className="flex border-b border-white/5">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "write"
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                Visual Block Editor
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("preview");
                }}
                className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "preview"
                    ? "border-white text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                Live Article Preview
              </button>
            </div>

            {/* Visual Editor Workspace */}
            {activeTab === "write" ? (
              <div className="space-y-6">
                
                {/* Drag-n-drop simulated Visual Blocks */}
                <div className="space-y-4">
                  {blocks.map((block, index) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 transition-colors p-5 space-y-3"
                    >
                      {/* Block Controls overlay */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => moveBlock(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Block Up"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBlock(index, "down")}
                          disabled={index === blocks.length - 1}
                          className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                          title="Move Block Down"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeBlock(block.id)}
                          className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                          title="Delete Block"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Header block render */}
                      {block.type === "heading" && (
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-300 font-bold uppercase tracking-wider">
                              Heading
                            </span>
                            <div className="flex rounded-md overflow-hidden bg-white/5 border border-white/10">
                              <button
                                type="button"
                                onClick={() => updateBlock(block.id, { level: 2 })}
                                className={`px-2.5 py-1 text-[10px] font-bold ${
                                  block.level === 2 ? "bg-white text-black" : "text-white/60 hover:text-white"
                                }`}
                              >
                                H2
                              </button>
                              <button
                                type="button"
                                onClick={() => updateBlock(block.id, { level: 3 })}
                                className={`px-2.5 py-1 text-[10px] font-bold ${
                                  block.level === 3 ? "bg-white text-black" : "text-white/60 hover:text-white"
                                }`}
                              >
                                H3
                              </button>
                            </div>
                          </div>
                          <input
                            type="text"
                            placeholder="Enter heading title..."
                            value={block.text}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 font-bold focus:outline-none focus:border-white/20 transition-colors text-white placeholder-white/20"
                          />
                        </div>
                      )}

                      {/* Paragraph block render */}
                      {block.type === "text" && (
                        <div className="space-y-2">
                          <span className="px-2 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 text-[9px] text-zinc-300 font-bold uppercase tracking-wider">
                            Body Text
                          </span>
                          <textarea
                            rows={4}
                            placeholder="Start typing your paragraph content here..."
                            value={block.text}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm leading-relaxed focus:outline-none focus:border-white/20 transition-colors text-white placeholder-white/20 resize-y"
                          />
                        </div>
                      )}

                      {/* Quote block render */}
                      {block.type === "quote" && (
                        <div className="space-y-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-300 font-bold uppercase tracking-wider">
                            Quote Block
                          </span>
                          <textarea
                            rows={2}
                            placeholder="Insert citation/quotation text..."
                            value={block.text}
                            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm italic focus:outline-none focus:border-white/20 transition-colors text-white placeholder-white/20 resize-none border-l-2 border-l-white/40"
                          />
                        </div>
                      )}

                      {/* Image block render */}
                      {block.type === "image" && (
                        <div className="space-y-3">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-300 font-bold uppercase tracking-wider">
                            Image Block
                          </span>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              {/* File selector */}
                              <div className="flex flex-col gap-2">
                                <label className="text-xs text-white/40">Upload Image File</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, block.id)}
                                  className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer text-white/40"
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <label className="text-xs text-white/40">Or enter image URL path</label>
                                <input
                                  type="text"
                                  placeholder="/blog/my-image-file.png"
                                  value={block.src}
                                  onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs focus:outline-none focus:border-white/20 transition-colors text-white placeholder-white/20"
                                />
                              </div>

                              <div className="flex flex-col gap-2">
                                <label className="text-xs text-white/40">Alternative (Alt) Text</label>
                                <input
                                  type="text"
                                  placeholder="Describe the image..."
                                  value={block.alt}
                                  onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs focus:outline-none focus:border-white/20 transition-colors text-white placeholder-white/20"
                                />
                              </div>
                            </div>

                            {/* Image preview box */}
                            <div className="rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center overflow-hidden min-h-[140px] relative">
                              {uploadingBlockId === block.id ? (
                                <span className="text-xs text-white/40 animate-pulse">Uploading file...</span>
                              ) : block.src ? (
                                <img
                                  src={block.src}
                                  alt="Block preview"
                                  className="w-full h-full object-cover max-h-[180px]"
                                  onError={(e) => {
                                    // Fallback for broken images
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="text-xs text-white/20">No image selected</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* List block render */}
                      {block.type === "list" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-300 font-bold uppercase tracking-wider">
                                List Block
                              </span>
                              <div className="flex rounded-md overflow-hidden bg-white/5 border border-white/10">
                                <button
                                  type="button"
                                  onClick={() => updateBlock(block.id, { style: "unordered" })}
                                  className={`px-2 py-0.5 text-[9px] font-bold ${
                                    block.style === "unordered" ? "bg-white text-black" : "text-white/60 hover:text-white"
                                  }`}
                                >
                                  Bullet List
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateBlock(block.id, { style: "ordered" })}
                                  className={`px-2 py-0.5 text-[9px] font-bold ${
                                    block.style === "ordered" ? "bg-white text-black" : "text-white/60 hover:text-white"
                                  }`}
                                >
                                  Numbered List
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {block.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <span className="text-white/30 text-xs font-semibold select-none w-5 text-right">
                                  {block.style === "ordered" ? `${itemIdx + 1}.` : "•"}
                                </span>
                                <input
                                  type="text"
                                  placeholder="List item content..."
                                  value={item}
                                  onChange={(e) => updateListItem(block.id, itemIdx, e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-xs focus:outline-none focus:border-white/20 transition-colors text-white placeholder-white/20"
                                />
                                <button
                                  type="button"
                                  onClick={() => addListItem(block.id, itemIdx)}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                  title="Add Item Below"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeListItem(block.id, itemIdx)}
                                  disabled={block.items.length === 1}
                                  className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                  title="Delete Item"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Add Block Toolbar */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-wrap items-center justify-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/30 mr-2">
                    Insert Block:
                  </span>
                  <button
                    type="button"
                    onClick={() => addBlock("text")}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    📝 Paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("heading")}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    🏷️ Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("image")}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    🖼️ Image
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("quote")}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    💬 Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("list")}
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    📋 List
                  </button>
                </div>
              </div>
            ) : (
              /* Preview tab content */
              <div className="rounded-3xl border border-white/5 bg-[#121212] p-8 space-y-6 max-w-4xl mx-auto shadow-2xl">
                {/* Header preview details */}
                <div className="border-b border-white/5 pb-6">
                  <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                    <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
                      {category}
                    </span>
                    <span>•</span>
                    <span>Just Now</span>
                    <span>•</span>
                    <span>{getReadTime(serializeBlocksToHTML(blocks))}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    {title || "Post Title Preview"}
                  </h1>
                  <p className="text-white/50 text-sm mt-3 leading-relaxed font-light">
                    {excerpt || "Add a summary to see the lead paragraph preview..."}
                  </p>
                </div>

                {/* Banner preview */}
                {featuredImage && (
                  <div className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-white/10">
                    <img src={featuredImage} alt="Featured cover banner" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Body Prose Preview */}
                <div 
                  className="prose prose-invert max-w-none text-white/80 space-y-5 leading-relaxed text-sm"
                  dangerouslySetInnerHTML={{
                    __html: serializeBlocksToHTML(blocks) || "<p className='text-white/20 italic'>Write content in editor to see visual preview here...</p>"
                  }}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar Form Settings (1 Column Wide) */}
          <div className="space-y-6">
            
            {/* Save & Publish settings */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 pb-3 border-b border-white/5">
                Publish Status
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Status</span>
                  <div className="flex rounded-lg overflow-hidden bg-white/5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setStatus("draft")}
                      className={`px-3 py-1.5 text-xs font-bold ${
                        status === "draft" ? "bg-white text-black" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("published")}
                      className={`px-3 py-1.5 text-xs font-bold ${
                        status === "published" ? "bg-white text-black" : "text-white/60 hover:text-white"
                      }`}
                    >
                      Publish
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Featured Post</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white/10 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white/80"></div>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-lg shadow-white/5 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : editingSlug ? (
                    "Update Article"
                  ) : (
                    "Save & Publish"
                  )}
                </button>
              </div>
            </div>

            {/* Post details */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 pb-3 border-b border-white/5">
                Article Meta Settings
              </h3>

              <div>
                <label className="block text-xs text-white/40 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white cursor-pointer"
                >
                  <option className="bg-[#121212]" value="Technical SEO">Technical SEO</option>
                  <option className="bg-[#121212]" value="SEO Strategy">SEO Strategy</option>
                  <option className="bg-[#121212]" value="Web Performance">Web Performance</option>
                  <option className="bg-[#121212]" value="Digital Marketing">Digital Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="seo, markup, optimization"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white"
                />
              </div>
            </div>

            {/* Cover image widget */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 pb-3 border-b border-white/5">
                Featured Cover Image
              </h3>

              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, null)}
                  className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer text-white/40"
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-white/40">Cover Image URL path</label>
                  <input
                    type="text"
                    placeholder="/blog/my-cover.png"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                  />
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden aspect-[16/9] flex items-center justify-center relative">
                  {isUploadingFeatured ? (
                    <span className="text-xs text-white/40 animate-pulse">Uploading cover...</span>
                  ) : featuredImage ? (
                    <img src={featuredImage} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-white/20">No cover image uploaded</span>
                  )}
                </div>
              </div>
            </div>

            {/* SEO section */}
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300/80 pb-3 border-b border-white/5 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.242 15.242a4.835 4.835 0 01-3.483 1.417 4.835 4.835 0 01-3.483-1.417m10.45 0a4.835 4.835 0 01-3.482 1.417 4.835 4.835 0 01-3.483-1.417M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Technical SEO Configuration
              </h3>

              <div>
                <label className="block text-xs text-white/40 mb-1.5">Focus Keyword</label>
                <input
                  type="text"
                  placeholder="e.g., Schema Markup"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5">SEO Meta Title</label>
                <input
                  type="text"
                  placeholder="Google Title Tag..."
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                />
              </div>

              <div>
                <label className="block text-xs text-white/40 mb-1.5">SEO Meta Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description displayed on search snippet results..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20 resize-none"
                />
              </div>
            </div>

          </div>

        </form>
      </>
    )}

    {dashboardMode === "case" && (
      <CaseStudiesManager showNotification={showNotification} />
    )}

    {dashboardMode === "social" && (
      <SocialPostsManager showNotification={showNotification} />
    )}

    {dashboardMode === "profile" && (
      <ProfileManager showNotification={showNotification} />
    )}

    {dashboardMode === "seo" && (
      <form onSubmit={handleSaveSeo} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Area (2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tab Selector */}
          <div className="flex border-b border-white/5">
            <button
              type="button"
              onClick={() => setActiveSeoTab("home")}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeSeoTab === "home"
                  ? "border-white text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              🏠 Homepage SEO
            </button>
            <button
              type="button"
              onClick={() => setActiveSeoTab("blog")}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeSeoTab === "blog"
                  ? "border-white text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              📰 Blog Page SEO
            </button>
            <button
              type="button"
              onClick={() => setActiveSeoTab("general")}
              className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeSeoTab === "general"
                  ? "border-white text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              ⚙️ Site Integrations
            </button>
          </div>

          {/* Form Content */}
          {activeSeoTab === "home" && (
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-6">
              <h3 className="text-lg font-bold">Homepage Metadata</h3>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40">
                    Meta Title
                  </label>
                  <span className={`text-[10px] font-mono ${
                    (seoSettings.home.title || "").length > 60 ? "text-amber-400" : "text-white/30"
                  }`}>
                    {(seoSettings.home.title || "").length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Saurav Vaghela | Digital Marketing & SEO Specialist"
                  value={seoSettings.home.title || ""}
                  onChange={(e) => updateHomeSeo({ title: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40">
                    Meta Description
                  </label>
                  <span className={`text-[10px] font-mono ${
                    (seoSettings.home.description || "").length > 160 ? "text-amber-400" : "text-white/30"
                  }`}>
                    {(seoSettings.home.description || "").length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="A short description..."
                  value={seoSettings.home.description || ""}
                  onChange={(e) => updateHomeSeo({ description: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20 resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Focus Keywords (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="SEO Specialist, Digital Marketing"
                    value={seoSettings.home.keywords || ""}
                    onChange={(e) => updateHomeSeo({ keywords: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Robots Settings
                  </label>
                  <select
                    value={seoSettings.home.robots || "index, follow"}
                    onChange={(e) => updateHomeSeo({ robots: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white cursor-pointer"
                  >
                    <option value="index, follow">index, follow (Default - Search Engine Allowed)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Hidden from Search Engines)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  placeholder="https://saurav.digital/"
                  value={seoSettings.home.canonical || ""}
                  onChange={(e) => updateHomeSeo({ canonical: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                />
              </div>

              <div className="border-t border-white/5 pt-6 space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">Open Graph Social Meta Tags</h4>
                
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">OG Title</label>
                  <input
                    type="text"
                    placeholder="Social share title..."
                    value={seoSettings.home.ogTitle || ""}
                    onChange={(e) => updateHomeSeo({ ogTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">OG Description</label>
                  <textarea
                    rows={2}
                    placeholder="Social share description..."
                    value={seoSettings.home.ogDescription || ""}
                    onChange={(e) => updateHomeSeo({ ogDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">OG Share Image Path</label>
                  <input
                    type="text"
                    placeholder="/og-image.png"
                    value={seoSettings.home.ogImage || ""}
                    onChange={(e) => updateHomeSeo({ ogImage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                  />
                </div>
              </div>

            </div>
          )}

          {activeSeoTab === "blog" && (
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-6">
              <h3 className="text-lg font-bold">Blog Page Metadata</h3>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40">
                    Meta Title
                  </label>
                  <span className={`text-[10px] font-mono ${
                    (seoSettings.blog.title || "").length > 60 ? "text-amber-400" : "text-white/30"
                  }`}>
                    {(seoSettings.blog.title || "").length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Writings & Insights | Saurav Vaghela"
                  value={seoSettings.blog.title || ""}
                  onChange={(e) => updateBlogSeo({ title: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40">
                    Meta Description
                  </label>
                  <span className={`text-[10px] font-mono ${
                    (seoSettings.blog.description || "").length > 160 ? "text-amber-400" : "text-white/30"
                  }`}>
                    {(seoSettings.blog.description || "").length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="A short description..."
                  value={seoSettings.blog.description || ""}
                  onChange={(e) => updateBlogSeo({ description: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20 resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Focus Keywords (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="SEO, marketing blog"
                    value={seoSettings.blog.keywords || ""}
                    onChange={(e) => updateBlogSeo({ keywords: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    Robots Settings
                  </label>
                  <select
                    value={seoSettings.blog.robots || "index, follow"}
                    onChange={(e) => updateBlogSeo({ robots: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#121212] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white cursor-pointer"
                  >
                    <option value="index, follow">index, follow (Default - Search Engine Allowed)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Hidden from Search Engines)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  placeholder="https://saurav.digital/blog"
                  value={seoSettings.blog.canonical || ""}
                  onChange={(e) => updateBlogSeo({ canonical: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                />
              </div>

              <div className="border-t border-white/5 pt-6 space-y-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">Open Graph Social Meta Tags</h4>
                
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">OG Title</label>
                  <input
                    type="text"
                    placeholder="Social share title..."
                    value={seoSettings.blog.ogTitle || ""}
                    onChange={(e) => updateBlogSeo({ ogTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">OG Description</label>
                  <textarea
                    rows={2}
                    placeholder="Social share description..."
                    value={seoSettings.blog.ogDescription || ""}
                    onChange={(e) => updateBlogSeo({ ogDescription: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1.5">OG Share Image Path</label>
                  <input
                    type="text"
                    placeholder="/og-image.png"
                    value={seoSettings.blog.ogImage || ""}
                    onChange={(e) => updateBlogSeo({ ogImage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 text-white placeholder-white/20"
                  />
                </div>
              </div>

            </div>
          )}

          {activeSeoTab === "general" && (
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-6">
              <h3 className="text-lg font-bold">Analytics & Site Integrations</h3>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Google Analytics Measurement ID (GA4)
                </label>
                <input
                  type="text"
                  placeholder="e.g. G-ZXXGPSHTHY"
                  value={seoSettings.general.googleAnalyticsId || ""}
                  onChange={(e) => updateGeneralSeo({ googleAnalyticsId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20 font-mono"
                />
                <p className="text-[10px] text-white/30 mt-1">Google Analytics tracking code is injected site-wide.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  Google Site Verification Token
                </label>
                <input
                  type="text"
                  placeholder="e.g. key-verification-token"
                  value={seoSettings.general.googleSiteVerification || ""}
                  onChange={(e) => updateGeneralSeo({ googleSiteVerification: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20 font-mono"
                />
                <p className="text-[10px] text-white/30 mt-1">Required to verify website ownership in Google Search Console.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                  JSON-LD Structured Schema Markup (Site-wide)
                </label>
                <textarea
                  rows={8}
                  placeholder='{\n  "@context": "https://schema.org",\n  "@type": "Person",\n  "name": "Saurav Vaghela"\n}'
                  value={seoSettings.general.schemaMarkup || ""}
                  onChange={(e) => updateGeneralSeo({ schemaMarkup: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/20 font-mono leading-relaxed"
                />
                <p className="text-[10px] text-white/30 mt-1">Paste valid JSON-LD schema snippet to enable Google rich snippets.</p>
              </div>

            </div>
          )}

        </div>

        {/* Right Sidebar (1 Column) */}
        <div className="space-y-6">
          
          {/* Save Card */}
          <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/60 pb-3 border-b border-white/5">
              Publish Changes
            </h3>
            <button
              type="submit"
              disabled={isSavingSeo}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-white/90 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-lg shadow-white/5 flex items-center justify-center gap-2"
            >
              {isSavingSeo ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                "Save SEO Config"
              )}
            </button>
          </div>

          {/* Dynamic Google Snippet Preview (For Home & Blog tabs) */}
          {(activeSeoTab === "home" || activeSeoTab === "blog") && (
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-300/80 pb-3 border-b border-white/5">
                Google Search Preview
              </h3>
              
              <div className="bg-white p-5 rounded-2xl text-black font-sans leading-normal">
                {/* Breadcrumb path */}
                <div className="text-[12px] text-[#202124] flex items-center gap-1 mb-1 font-sans truncate">
                  <span>saurav.digital</span>
                  <span className="text-[#70757a] text-[10px] font-sans">›</span>
                  <span className="text-[#70757a] font-sans truncate">
                    {activeSeoTab === "blog" ? "blog" : ""}
                  </span>
                </div>

                {/* Meta Title */}
                <h4 className="text-[19px] text-[#1a0dab] hover:underline cursor-pointer font-medium font-sans mb-1 leading-snug line-clamp-2">
                  {activeSeoTab === "home" 
                    ? (seoSettings.home.title || "Saurav Vaghela | Portfolio")
                    : (seoSettings.blog.title || "Writings & Insights | Saurav Vaghela")}
                </h4>

                {/* Meta Description snippet */}
                <p className="text-[14px] text-[#4d5156] font-sans leading-normal line-clamp-3">
                  {activeSeoTab === "home"
                    ? (seoSettings.home.description || "Portfolio details and SEO services.")
                    : (seoSettings.blog.description || "Digital Marketing guides and tips.")}
                </p>
              </div>
              <p className="text-[10px] text-white/30 text-center">Simulated desktop snippet view. Max width applies on live Google SERPs.</p>
            </div>
          )}

          {/* OpenGraph Card Preview */}
          {(activeSeoTab === "home" || activeSeoTab === "blog") && (
            <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-6 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300/80 pb-3 border-b border-white/5">
                Facebook Share Preview
              </h3>
              
              <div className="rounded-2xl border border-white/10 bg-[#1e1e1e] overflow-hidden">
                {/* OG Image placeholder/render */}
                <div className="aspect-[1.91/1] bg-zinc-900 border-b border-white/5 flex items-center justify-center relative">
                  {activeSeoTab === "home" && seoSettings.home.ogImage ? (
                    <img src={seoSettings.home.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                  ) : activeSeoTab === "blog" && seoSettings.blog.ogImage ? (
                    <img src={seoSettings.blog.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-mono font-bold">1200 x 630 OG Image</span>
                  )}
                </div>
                
                {/* OG text details */}
                <div className="p-3 space-y-1 bg-white/[0.02]">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-white/30">saurav.digital</span>
                  <h4 className="text-xs font-semibold text-white/80 line-clamp-1">
                    {activeSeoTab === "home" 
                      ? (seoSettings.home.ogTitle || seoSettings.home.title || "Saurav Vaghela | Portfolio")
                      : (seoSettings.blog.ogTitle || seoSettings.blog.title || "Writings & Insights")}
                  </h4>
                  <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed font-light">
                    {activeSeoTab === "home"
                      ? (seoSettings.home.ogDescription || seoSettings.home.description || "Portfolio details...")
                      : (seoSettings.blog.ogDescription || seoSettings.blog.description || "Writings & Insights...")}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </form>
    )}

      </div>
    </main>
  );
}
