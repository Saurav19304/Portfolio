import fs from "fs/promises";
import path from "path";
import { Pool } from "pg";
import { BlogPost } from "./blogUtils";

// --- DATABASE CONNECTION MANAGER ---
let pool: Pool | null = null;
let isInitialized = false;

function getPool() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!dbUrl) return null;
  
  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false // Required for serverless database connections like Neon
      }
    });
  }
  return pool;
}

async function ensureDb() {
  if (isInitialized) return;
  const p = getPool();
  if (!p) return;
  
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_data (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize database table:", error);
    throw error;
  }
}

// Generic helper to get data (with DB fallback to local files)
async function getData<T>(key: string, localPath: string, defaultValue: T): Promise<T> {
  const p = getPool();
  if (p) {
    try {
      await ensureDb();
      const res = await p.query("SELECT value FROM portfolio_data WHERE key = $1", [key]);
      if (res.rows.length > 0) {
        return JSON.parse(res.rows[0].value) as T;
      } else {
        // Seed database with local JSON file contents on the first run
        let localDataStr = "";
        try {
          localDataStr = await fs.readFile(localPath, "utf8");
        } catch {
          localDataStr = JSON.stringify(defaultValue);
        }
        const val = JSON.parse(localDataStr) as T;
        await p.query(
          "INSERT INTO portfolio_data (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
          [key, JSON.stringify(val)]
        );
        return val;
      }
    } catch (dbError) {
      console.error(`Database read error for key "${key}", falling back to local file:`, dbError);
    }
  }

  // Fallback to local files (development / localhost)
  try {
    const data = await fs.readFile(localPath, "utf8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Local file read error for key "${key}", returning default:`, error);
    return defaultValue;
  }
}

// Generic helper to save data
async function saveData<T>(key: string, localPath: string, val: T): Promise<boolean> {
  const p = getPool();
  if (p) {
    try {
      await ensureDb();
      await p.query(
        "INSERT INTO portfolio_data (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
        [key, JSON.stringify(val)]
      );
      // Optional local backup write (will fail silently in read-only environments like Vercel)
      try {
        await fs.writeFile(localPath, JSON.stringify(val, null, 2), "utf8");
      } catch {
        // Ignore read-only filesystem errors in production
      }
      return true;
    } catch (dbError) {
      console.error(`Database write error for key "${key}":`, dbError);
      return false;
    }
  }

  // Fallback to local files (development / localhost)
  try {
    await fs.writeFile(localPath, JSON.stringify(val, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Local file write error for key "${key}":`, error);
    return false;
  }
}

// --- FILE PATH CONFIGURATIONS ---
const dbFilePath = path.join(process.cwd(), "src/data/posts.db.json");
const seoFilePath = path.join(process.cwd(), "src/data/seo.db.json");
const profileFilePath = path.join(process.cwd(), "src/data/profile.db.json");
const caseStudiesFilePath = path.join(process.cwd(), "src/data/caseStudies.db.json");
const instagramFilePath = path.join(process.cwd(), "src/data/instagram.db.json");
const linkedinFilePath = path.join(process.cwd(), "src/data/linkedin.db.json");

// --- INTERFACES & TYPES ---
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

export interface InstagramPostData {
  id: number;
  title: string;
  link: string;
  mediaSrc: string;
  type: "image" | "video";
}

export interface LinkedInPostData {
  id: number;
  title: string;
  description: string;
  link: string;
}

// --- SEO CONFIG HELPERS ---
export async function getSeoSettings(): Promise<SeoSettings> {
  const defaultSettings: SeoSettings = {
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
      title: "Writings & Insights",
      description: "Data-driven strategies, technical SEO tutorials, keyword research principles, and updates from my digital marketing journey.",
      keywords: "SEO, Content Marketing, WordPress, Next.js, Technical SEO",
      robots: "index, follow",
      canonical: "https://saurav.digital/blog",
      ogTitle: "Writings & Insights",
      ogDescription: "Data-driven strategies, technical SEO tutorials, keyword research principles, and updates from my digital marketing journey.",
      ogImage: "/og-image.png"
    },
    general: {
      googleAnalyticsId: "G-ZXXGPSHTHY",
      googleSiteVerification: "",
      schemaMarkup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Person\",\n  \"name\": \"Saurav Vaghela\",\n  \"url\": \"https://saurav.digital\",\n  \"jobTitle\": \"Digital Marketing & SEO Specialist\"\n}"
    }
  };
  return getData<SeoSettings>("seo", seoFilePath, defaultSettings);
}

export async function saveSeoSettings(settings: SeoSettings): Promise<boolean> {
  return saveData<SeoSettings>("seo", seoFilePath, settings);
}

// --- BLOG POSTS HELPERS ---
export async function getPosts(): Promise<BlogPost[]> {
  return getData<BlogPost[]>("posts", dbFilePath, []);
}

export async function savePosts(posts: BlogPost[]): Promise<boolean> {
  return saveData<BlogPost[]>("posts", dbFilePath, posts);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function incrementPostViews(slug: string): Promise<number | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;

  posts[index].views += 1;
  const success = await savePosts(posts);
  return success ? posts[index].views : null;
}

export async function savePost(postData: Partial<BlogPost> & { slug: string; title: string }): Promise<BlogPost | null> {
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === postData.slug);
  const now = new Date().toISOString();

  if (index !== -1) {
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
      metaTitle: postData.metaTitle || postData.title,
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

export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getPosts();
  const filtered = posts.filter((p) => p.slug !== slug);
  if (posts.length === filtered.length) return false;
  return await savePosts(filtered);
}

// --- PROFILE HELPERS ---
export async function getProfile(): Promise<ProfileData> {
  const defaultProfile: ProfileData = {
    about: { text: "" },
    education: [],
    certifications: [],
    skills: [],
    tools: [],
    contact: { email: "", phone: "", linkedinUrl: "", linkedinName: "", location: "" }
  };
  return getData<ProfileData>("profile", profileFilePath, defaultProfile);
}

export async function saveProfile(profile: ProfileData): Promise<boolean> {
  return saveData<ProfileData>("profile", profileFilePath, profile);
}

// --- CASE STUDIES HELPERS ---
export async function getCaseStudies(): Promise<CaseStudyData[]> {
  return getData<CaseStudyData[]>("caseStudies", caseStudiesFilePath, []);
}

export async function saveCaseStudies(caseStudies: CaseStudyData[]): Promise<boolean> {
  return saveData<CaseStudyData[]>("caseStudies", caseStudiesFilePath, caseStudies);
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

// --- INSTAGRAM HELPERS ---
export async function getInstagramPosts(): Promise<InstagramPostData[]> {
  return getData<InstagramPostData[]>("instagram", instagramFilePath, []);
}

export async function saveInstagramPosts(posts: InstagramPostData[]): Promise<boolean> {
  return saveData<InstagramPostData[]>("instagram", instagramFilePath, posts);
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

// --- LINKEDIN HELPERS ---
export async function getLinkedInPosts(): Promise<LinkedInPostData[]> {
  return getData<LinkedInPostData[]>("linkedin", linkedinFilePath, []);
}

export async function saveLinkedInPosts(posts: LinkedInPostData[]): Promise<boolean> {
  return saveData<LinkedInPostData[]>("linkedin", linkedinFilePath, posts);
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

// --- DATABASE IMAGE STORAGE HELPERS ---
export async function saveImageToDb(filename: string, mimeType: string, base64Data: string): Promise<boolean> {
  const p = getPool();
  if (!p) return false;
  
  try {
    await ensureDb();
    const payload = JSON.stringify({ mimeType, data: base64Data });
    await p.query(
      "INSERT INTO portfolio_data (key, value, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
      [`img-${filename}`, payload]
    );
    return true;
  } catch (error) {
    console.error(`Failed to save image ${filename} to database:`, error);
    return false;
  }
}

export async function getImageFromDb(filename: string): Promise<{ mimeType: string; data: string } | null> {
  const p = getPool();
  if (!p) return null;

  try {
    await ensureDb();
    const res = await p.query("SELECT value FROM portfolio_data WHERE key = $1", [`img-${filename}`]);
    if (res.rows.length > 0) {
      return JSON.parse(res.rows[0].value) as { mimeType: string; data: string };
    }
  } catch (error) {
    console.error(`Failed to fetch image ${filename} from database:`, error);
  }
  return null;
}
