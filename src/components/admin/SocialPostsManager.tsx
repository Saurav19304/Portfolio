"use client";

import { useState, useEffect } from "react";

interface InstagramPost {
  id: number;
  title: string;
  link: string;
  mediaSrc: string;
  type: "image" | "video";
}

interface LinkedInPost {
  id: number;
  title: string;
  description: string;
  link: string;
}

interface SocialPostsManagerProps {
  showNotification: (type: "success" | "error", text: string) => void;
}

export default function SocialPostsManager({ showNotification }: SocialPostsManagerProps) {
  const [subTab, setSubTab] = useState<"instagram" | "linkedin">("instagram");
  const [isLoading, setIsLoading] = useState(true);

  // Instagram lists and forms
  const [igList, setIgList] = useState<InstagramPost[]>([]);
  const [igId, setIgId] = useState<number | null>(null);
  const [igTitle, setIgTitle] = useState("");
  const [igLink, setIgLink] = useState("");
  const [igMediaSrc, setIgMediaSrc] = useState("");
  const [igType, setIgType] = useState<"image" | "video">("image");
  const [isUploading, setIsUploading] = useState(false);
  const [isIgSaving, setIsIgSaving] = useState(false);

  // LinkedIn lists and forms
  const [liList, setLiList] = useState<LinkedInPost[]>([]);
  const [liId, setLiId] = useState<number | null>(null);
  const [liTitle, setLiTitle] = useState("");
  const [liDescription, setLiDescription] = useState("");
  const [liLink, setLiLink] = useState("");
  const [isLiSaving, setIsLiSaving] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [igRes, liRes] = await Promise.all([
        fetch("/api/instagram"),
        fetch("/api/linkedin")
      ]);

      if (igRes.ok) {
        const igData = await igRes.json();
        setIgList(igData || []);
      }
      if (liRes.ok) {
        const liData = await liRes.json();
        setLiList(liData || []);
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to fetch social posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Media upload handler for Instagram posts
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect media type from file format
    const isVideoFile = file.type.startsWith("video/");
    setIgType(isVideoFile ? "video" : "image");

    // Warn if file is larger than Vercel's 4.5MB body limit
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 4.5) {
      const proceed = confirm(
        `Warning: This file is ${sizeInMB.toFixed(1)}MB. The live hosting platform (e.g., Vercel) has a strict 4.5MB size limit on uploads. If this site is live, the upload will likely fail.\n\nDo you want to attempt the upload anyway?`
      );
      if (!proceed) {
        e.target.value = ""; // Clear file selector
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error("File is too large for the hosting server limit (max 4.5MB). Please compress the video or enter a direct URL instead.");
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
      }
      const data = await res.json();

      setIgMediaSrc(data.url);
      showNotification("success", "Media uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      showNotification("error", err.message || "Failed to upload media.");
    } finally {
      setIsUploading(false);
    }
  };

  // Instagram CRUD handlers
  const handleEditIg = (post: InstagramPost) => {
    setIgId(post.id);
    setIgTitle(post.title);
    setIgLink(post.link);
    setIgMediaSrc(post.mediaSrc);
    setIgType(post.type);
  };

  const handleClearIg = () => {
    setIgId(null);
    setIgTitle("");
    setIgLink("");
    setIgMediaSrc("");
    setIgType("image");
  };

  const handleSaveIg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!igTitle.trim() || !igMediaSrc.trim()) {
      showNotification("error", "Title and Media Source are required.");
      return;
    }

    setIsIgSaving(true);
    const postData = {
      title: igTitle,
      link: igLink,
      mediaSrc: igMediaSrc,
      type: igType
    };

    try {
      const endpoint = igId ? `/api/instagram/${igId}` : "/api/instagram";
      const method = igId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        showNotification("success", igId ? "Instagram post updated!" : "Instagram post added!");
        handleClearIg();
        fetchData();
      } else {
        throw new Error("Failed saving");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to save Instagram post.");
    } finally {
      setIsIgSaving(false);
    }
  };

  const handleDeleteIg = async (deleteId: number) => {
    if (!confirm("Are you sure you want to delete this Instagram post?")) return;

    try {
      const res = await fetch(`/api/instagram/${deleteId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        showNotification("success", "Instagram post deleted.");
        fetchData();
      } else {
        throw new Error("Failed deleting");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to delete post.");
    }
  };

  // LinkedIn CRUD handlers
  const handleEditLi = (post: LinkedInPost) => {
    setLiId(post.id);
    setLiTitle(post.title);
    setLiDescription(post.description);
    setLiLink(post.link);
  };

  const handleClearLi = () => {
    setLiId(null);
    setLiTitle("");
    setLiDescription("");
    setLiLink("");
  };

  const handleSaveLi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liTitle.trim() || !liLink.trim()) {
      showNotification("error", "Title and Link are required.");
      return;
    }

    setIsLiSaving(true);
    const postData = {
      title: liTitle,
      description: liDescription,
      link: liLink
    };

    try {
      const endpoint = liId ? `/api/linkedin/${liId}` : "/api/linkedin";
      const method = liId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        showNotification("success", liId ? "LinkedIn post updated!" : "LinkedIn post added!");
        handleClearLi();
        fetchData();
      } else {
        throw new Error("Failed saving");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to save LinkedIn post.");
    } finally {
      setIsLiSaving(false);
    }
  };

  const handleDeleteLi = async (deleteId: number) => {
    if (!confirm("Are you sure you want to delete this LinkedIn post?")) return;

    try {
      const res = await fetch(`/api/linkedin/${deleteId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        showNotification("success", "LinkedIn post deleted.");
        fetchData();
      } else {
        throw new Error("Failed deleting");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to delete post.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-white/40 animate-pulse text-sm">
        Loading social posts database...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sub Tabs Toggle */}
      <div className="flex gap-3 border-b border-white/5 pb-4">
        <button
          onClick={() => setSubTab("instagram")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-colors ${
            subTab === "instagram" ? "bg-white text-black font-extrabold" : "bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          Instagram Content
        </button>
        <button
          onClick={() => setSubTab("linkedin")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-colors ${
            subTab === "linkedin" ? "bg-white text-black font-extrabold" : "bg-white/5 text-white/60 hover:text-white"
          }`}
        >
          LinkedIn Posts
        </button>
      </div>

      {subTab === "instagram" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List IG posts */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-bold">Manage Instagram Posts</h4>
            {igList.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-white/40 text-xs">
                No Instagram posts found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {igList.map((post) => (
                  <div key={post.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between h-48">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                          {post.type}
                        </span>
                        <span className="text-[10px] text-white/30 truncate max-w-[150px]">
                          {post.mediaSrc}
                        </span>
                      </div>
                      <h5 className="font-bold text-white/95 text-base truncate">{post.title}</h5>
                      <a href={post.link} target="_blank" rel="noreferrer" className="text-xs text-white/40 hover:text-white/60 mt-1 truncate block hover:underline">
                        {post.link || "(No link)"}
                      </a>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t border-white/[0.05]">
                      <button
                        onClick={() => handleEditIg(post)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteIg(post.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form IG */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-fit space-y-5">
            <h4 className="font-bold text-base border-b border-white/5 pb-3">
              {igId ? "Edit Instagram Post" : "Add Instagram Post"}
            </h4>
            <form onSubmit={handleSaveIg} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Creative Title
                </label>
                <input
                  type="text"
                  value={igTitle}
                  onChange={(e) => setIgTitle(e.target.value)}
                  placeholder="e.g. Cinematic Special"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Instagram Link URL
                </label>
                <input
                  type="url"
                  value={igLink}
                  onChange={(e) => setIgLink(e.target.value)}
                  placeholder="e.g. https://instagram.com/p/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Media Source File (Upload Video/Image)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={igMediaSrc}
                    onChange={(e) => setIgMediaSrc(e.target.value)}
                    placeholder="Upload file or enter URL..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                    required
                  />
                  <label className="px-3 rounded-xl bg-white text-black font-bold text-xs shrink-0 flex items-center justify-center cursor-pointer hover:bg-white/95">
                    {isUploading ? "..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Media Content Type
                </label>
                <select
                  value={igType}
                  onChange={(e) => setIgType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#161616] border border-white/10 text-xs text-white"
                >
                  <option value="image">Image (jpg, png, webp)</option>
                  <option value="video">Video Reel (mp4, webm)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isIgSaving}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs"
                >
                  {isIgSaving ? "Saving..." : igId ? "Update Post" : "Add Post"}
                </button>
                {igId && (
                  <button
                    type="button"
                    onClick={handleClearIg}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List LI posts */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-bold">Manage LinkedIn Posts</h4>
            {liList.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl text-white/40 text-xs">
                No LinkedIn posts found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liList.map((post) => (
                  <div key={post.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between h-48">
                    <div>
                      <h5 className="font-bold text-white/95 text-base truncate">{post.title}</h5>
                      <p className="text-xs text-white/40 line-clamp-3 mt-1.5 leading-relaxed">{post.description}</p>
                    </div>
                    <div className="flex gap-2 justify-end pt-4 border-t border-white/[0.05]">
                      <button
                        onClick={() => handleEditLi(post)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLi(post.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form LI */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-fit space-y-5">
            <h4 className="font-bold text-base border-b border-white/5 pb-3">
              {liId ? "Edit LinkedIn Post" : "Add LinkedIn Post"}
            </h4>
            <form onSubmit={handleSaveLi} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  value={liTitle}
                  onChange={(e) => setLiTitle(e.target.value)}
                  placeholder="e.g. zapier automation experiment"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Post URL Link
                </label>
                <input
                  type="url"
                  value={liLink}
                  onChange={(e) => setLiLink(e.target.value)}
                  placeholder="e.g. https://linkedin.com/posts/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">
                  Description / Body
                </label>
                <textarea
                  rows={4}
                  value={liDescription}
                  onChange={(e) => setLiDescription(e.target.value)}
                  placeholder="Paste details of the post content..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLiSaving}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-xs"
                >
                  {isLiSaving ? "Saving..." : liId ? "Update Post" : "Add Post"}
                </button>
                {liId && (
                  <button
                    type="button"
                    onClick={handleClearLi}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
