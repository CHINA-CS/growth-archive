import fs from "fs";
import path from "path";
import type { ContentDB, Visibility } from "./types";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const DB_PATH = path.join(CONTENT_DIR, "db.json");
const PUBLIC_DB_PATH = path.join(CONTENT_DIR, "db.public.json");
const MEDIA_DIR = path.join(CONTENT_DIR, "media");
const PUBLIC_MEDIA_DIR = path.join(ROOT, "public", "media");

function ensureDirs() {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });
}

function emptyDB(): ContentDB {
  const now = new Date().toISOString();
  return {
    profile: {
      id: "profile",
      visibility: "public",
      tags: [],
      createdAt: now,
      updatedAt: now,
      name: "你的名字",
      title: "技术成长记录者",
      avatar: "",
      bio: "在这里写一段介绍：技术方向、做过什么、正在学什么。",
      location: "",
      email: "",
      links: [],
    },
    skills: [],
    projects: [],
    tools: [],
    experiences: [],
    timeline: [],
    notes: [],
    media: [],
    resume: {
      id: "resume",
      visibility: "public",
      tags: [],
      createdAt: now,
      updatedAt: now,
      headline: "目标岗位一句话",
      summary: "3–5 句简历摘要，突出可验证的能力与成果。",
      highlights: [],
      skillGroups: [],
      projectIds: [],
    },
  };
}

function resolveDbPath(): string {
  if (process.env.NEXT_PUBLIC_CONTENT_MODE === "public" && fs.existsSync(PUBLIC_DB_PATH)) {
    return PUBLIC_DB_PATH;
  }
  return DB_PATH;
}

export function readDB(): ContentDB {
  ensureDirs();
  const dbPath = resolveDbPath();
  if (!fs.existsSync(dbPath)) {
    const db = emptyDB();
    if (dbPath === DB_PATH) writeDB(db);
    return db;
  }
  const raw = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(raw) as ContentDB;
}

export function writeDB(db: ContentDB) {
  ensureDirs();
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tmp, DB_PATH);
}

export function getMediaDirs() {
  ensureDirs();
  return { MEDIA_DIR, PUBLIC_MEDIA_DIR };
}

export function getDbPath() {
  ensureDirs();
  return DB_PATH;
}

export function isVisible(item: { visibility: Visibility }, mode: "public" | "all" = "public") {
  if (mode === "all") return true;
  return item.visibility === "public" || item.visibility === "unlisted";
}

export function publicView<T extends { visibility: Visibility }>(
  items: T[],
  mode: "public" | "all" = "public"
): T[] {
  return mode === "all" ? items : items.filter((i) => isVisible(i, mode));
}

export function nowIso() {
  return new Date().toISOString();
}

export function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export type ContentMode = "all" | "public";

export function getContentMode(): ContentMode {
  return process.env.NEXT_PUBLIC_CONTENT_MODE === "public" ? "public" : "all";
}
