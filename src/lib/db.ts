import fs from "fs/promises";
import path from "path";
import { BlogPost } from "./blogUtils";

const dbFilePath = path.join(process.cwd(), "src/data/posts.db.json");
const seoFilePath = path.join(process.cwd(), "src/data/seo.db.json");

export interface PageSeoConfig {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export interface GeneralSeoConfig {
  googleAnalyticsId: string;
  googleSiteVerification: string;
  schemaMarkup: string;
}

export interface SeoSettings {
  home: PageSeoConfig;
  blog: PageSeoConfig;
  general: GeneralSeoConfig;
}

// Helper to read SEO database
export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const data = await fs.readFile(seoFilePath, "utf8");
    return JSON.parse(data) as SeoSettings;
  } catch (error) {
    console.error("SEO database read error, returning default settings:", error);
    return {
      home: {
        title: "Saurav Vaghela | Digital Marketing & SEO Specialist",
        description: "Portfolio of Saurav Vaghela, a Digital Marketing and SEO professional specializing in keyword research, technical SEO, and data-driven strategies.",
        keywords: "Saurav Vaghela, Digital Marketing Specialist, SEO Specialist, Technical SEO, Keyword Research, SEO Consultant, Data-Driven Marketing Specialist",
        robots: "index, follow",
        canonical: "https://saurav.digital/",
        ogTitle: "Saurav Vaghela | Digital Marketing & SEO Specialist",
        ogDescription: "Portfolio of Saurav Vaghela, a Digital Marketing and SEO professional specializing in keyword research, technical SEO, and data-driven strategies.",
        ogImage: "/og-image.png"
      },
      blog: {
        title: "Writings & Insights | Saurav Vaghela",
        description: "Data-driven strategies, technical SEO tutorials, keyword research principles, and updates from my digital marketing journey.",
        keywords: "SEO, Content Marketing, WordPress, Next.js, Technical SEO",
        robots: "index, follow",
        canonical: "https://saurav.digital/blog",
        ogTitle: "Writings & Insights | Saurav Vaghela",
        ogDescription: "Data-driven strategies, technical SEO tutorials, keyword research principles, and updates from my digital marketing journey.",
        ogImage: "/og-image.png"
      },
      general: {
        googleAnalyticsId: "G-ZXXGPSHTHY",
        googleSiteVerification: "",
        schemaMarkup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Person\",\n  \"name\": \"Saurav Vaghela\",\n  \"url\": \"https://saurav.digital\",\n  \"jobTitle\": \"Digital Marketing & SEO Specialist\"\n}"
      }
    };
  }
}

// Helper to save SEO database
export async function saveSeoSettings(settings: SeoSettings): Promise<boolean> {
  try {
    await fs.writeFile(seoFilePath, JSON.stringify(settings, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("SEO database write error:", error);
    return false;
  }
}

// Helper to read database
export async function getPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(dbFilePath, "utf8");
    return JSON.parse(data) as BlogPost[];
  } catch (error) {
    console.error("Database read error, returning empty array:", error);
    return [];
  }
}

// Helper to save posts array
export async function savePosts(posts: BlogPost[]): Promise<boolean> {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(posts, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Database write error:", error);
    return false;
  }
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) || null;
}

// Increment post views dynamically
export async function incrementPostViews(slug: string): Promise<number | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  posts[index].views += 1;
  const success = await savePosts(posts);
  return success ? posts[index].views : null;
}

// Create or update a post
export async function savePost(postData: Partial<BlogPost> & { slug: string; title: string }): Promise<BlogPost | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === postData.slug);

  const now = new Date().toISOString();

  if (index !== -1) {
    // Update existing post
    const existing = posts[index];
    const updated: BlogPost = {
      ...existing,
      ...postData,
      updatedAt: now,
    } as BlogPost;
    
    posts[index] = updated;
    const success = await savePosts(posts);
    return success ? updated : null;
  } else {
    // Create new post
    const newId = posts.length > 0 ? (Math.max(...posts.map(p => parseInt(p.id) || 0)) + 1).toString() : "1";
    const newPost: BlogPost = {
      id: newId,
      views: 0,
      status: "draft",
      featured: false,
      publishedAt: now,
      updatedAt: now,
      excerpt: postData.excerpt || "",
      content: postData.content || "",
      featuredImage: postData.featuredImage || "",
      category: postData.category || "General",
      tags: postData.tags || [],
      metaTitle: postData.metaTitle || `${postData.title} | Saurav Vaghela`,
      metaDescription: postData.metaDescription || postData.excerpt || "",
      focusKeyword: postData.focusKeyword || "",
      author: postData.author || "Saurav Vaghela",
      ...postData,
    } as BlogPost;

    posts.push(newPost);
    const success = await savePosts(posts);
    return success ? newPost : null;
  }
}

// Delete post
export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (posts.length === filtered.length) return false;

  return await savePosts(filtered);
}

// --- PROFILE MANAGER HELPERS ---
const profileFilePath = path.join(process.cwd(), "src/data/profile.db.json");

export interface ProfileData {
  about: {
    text: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  certifications: Array<{
    title: string;
    issuer: string;
    period: string;
    details: string;
  }>;
  skills: string[];
  tools: string[];
  contact: {
    email: string;
    phone: string;
    linkedinUrl: string;
    linkedinName: string;
    location: string;
  };
}

export async function getProfile(): Promise<ProfileData> {
  try {
    const data = await fs.readFile(profileFilePath, "utf8");
    return JSON.parse(data) as ProfileData;
  } catch (error) {
    console.error("Profile db read error:", error);
    throw error;
  }
}

export async function saveProfile(profile: ProfileData): Promise<boolean> {
  try {
    await fs.writeFile(profileFilePath, JSON.stringify(profile, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Profile db write error:", error);
    return false;
  }
}

// --- CASE STUDIES HELPERS ---
const caseStudiesFilePath = path.join(process.cwd(), "src/data/caseStudies.db.json");

export interface CaseStudyData {
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

export async function getCaseStudies(): Promise<CaseStudyData[]> {
  try {
    const data = await fs.readFile(caseStudiesFilePath, "utf8");
    return JSON.parse(data) as CaseStudyData[];
  } catch (error) {
    console.error("Case studies read error:", error);
    return [];
  }
}

export async function saveCaseStudies(caseStudies: CaseStudyData[]): Promise<boolean> {
  try {
    await fs.writeFile(caseStudiesFilePath, JSON.stringify(caseStudies, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Case studies write error:", error);
    return false;
  }
}

export async function saveCaseStudy(csData: Partial<CaseStudyData> & { id: string }): Promise<CaseStudyData | null> {
  const list = await getCaseStudies();
  const index = list.findIndex((c) => c.id === csData.id);

  if (index !== -1) {
    const updated = { ...list[index], ...csData } as CaseStudyData;
    list[index] = updated;
    const success = await saveCaseStudies(list);
    return success ? updated : null;
  } else {
    const newCs = {
      title: "",
      client: "",
      category: "",
      shortDescription: "",
      metricValue: "",
      metricLabel: "",
      challenge: "",
      strategy: "",
      execution: [],
      results: [],
      ...csData
    } as CaseStudyData;
    list.push(newCs);
    const success = await saveCaseStudies(list);
    return success ? newCs : null;
  }
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  const list = await getCaseStudies();
  const filtered = list.filter((c) => c.id !== id);
  if (list.length === filtered.length) return false;
  return await saveCaseStudies(filtered);
}

// --- INSTAGRAM POSTS HELPERS ---
const instagramFilePath = path.join(process.cwd(), "src/data/instagram.db.json");

export interface InstagramPostData {
  id: number;
  title: string;
  link: string;
  mediaSrc: string;
  type: "image" | "video";
}

export async function getInstagramPosts(): Promise<InstagramPostData[]> {
  try {
    const data = await fs.readFile(instagramFilePath, "utf8");
    return JSON.parse(data) as InstagramPostData[];
  } catch (error) {
    console.error("Instagram posts read error:", error);
    return [];
  }
}

export async function saveInstagramPosts(posts: InstagramPostData[]): Promise<boolean> {
  try {
    await fs.writeFile(instagramFilePath, JSON.stringify(posts, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Instagram posts write error:", error);
    return false;
  }
}

export async function saveInstagramPost(postData: Partial<InstagramPostData> & { id: number }): Promise<InstagramPostData | null> {
  const list = await getInstagramPosts();
  const index = list.findIndex((p) => p.id === postData.id);

  if (index !== -1) {
    const updated = { ...list[index], ...postData } as InstagramPostData;
    list[index] = updated;
    const success = await saveInstagramPosts(list);
    return success ? updated : null;
  } else {
    const newPost = {
      title: "",
      link: "",
      mediaSrc: "",
      type: "image",
      ...postData
    } as InstagramPostData;
    list.push(newPost);
    const success = await saveInstagramPosts(list);
    return success ? newPost : null;
  }
}

export async function deleteInstagramPost(id: number): Promise<boolean> {
  const list = await getInstagramPosts();
  const filtered = list.filter((p) => p.id !== id);
  if (list.length === filtered.length) return false;
  return await saveInstagramPosts(filtered);
}

// --- LINKEDIN POSTS HELPERS ---
const linkedinFilePath = path.join(process.cwd(), "src/data/linkedin.db.json");

export interface LinkedInPostData {
  id: number;
  title: string;
  description: string;
  link: string;
}

export async function getLinkedInPosts(): Promise<LinkedInPostData[]> {
  try {
    const data = await fs.readFile(linkedinFilePath, "utf8");
    return JSON.parse(data) as LinkedInPostData[];
  } catch (error) {
    console.error("LinkedIn posts read error:", error);
    return [];
  }
}

export async function saveLinkedInPosts(posts: LinkedInPostData[]): Promise<boolean> {
  try {
    await fs.writeFile(linkedinFilePath, JSON.stringify(posts, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("LinkedIn posts write error:", error);
    return false;
  }
}

export async function saveLinkedInPost(postData: Partial<LinkedInPostData> & { id: number }): Promise<LinkedInPostData | null> {
  const list = await getLinkedInPosts();
  const index = list.findIndex((p) => p.id === postData.id);

  if (index !== -1) {
    const updated = { ...list[index], ...postData } as LinkedInPostData;
    list[index] = updated;
    const success = await saveLinkedInPosts(list);
    return success ? updated : null;
  } else {
    const newPost = {
      title: "",
      description: "",
      link: "",
      ...postData
    } as LinkedInPostData;
    list.push(newPost);
    const success = await saveLinkedInPosts(list);
    return success ? newPost : null;
  }
}

export async function deleteLinkedInPost(id: number): Promise<boolean> {
  const list = await getLinkedInPosts();
  const filtered = list.filter((p) => p.id !== id);
  if (list.length === filtered.length) return false;
  return await saveLinkedInPosts(filtered);
}

