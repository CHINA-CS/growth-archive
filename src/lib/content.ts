import { publicView, readDB } from "./db";
import type {
  ContentDB,
  Experience,
  MediaItem,
  Note,
  Project,
  Skill,
  TimelineItem,
  Tool,
} from "./types";

/**
 * 公开站使用的视图：始终隐藏 private。
 * 全量（含私密）只通过管理后台 API 的 readDB 获取。
 */
export function loadContent(): ContentDB {
  const db = readDB();
  return {
    profile: db.profile.visibility === "private"
      ? { ...db.profile, bio: "（个人描述当前为私密）", email: "", links: [] }
      : db.profile,
    skills: publicView(db.skills, "public"),
    projects: publicView(db.projects, "public"),
    tools: publicView(db.tools, "public"),
    experiences: publicView(db.experiences, "public"),
    timeline: publicView(db.timeline, "public"),
    notes: publicView(db.notes, "public"),
    media: publicView(db.media, "public"),
    resume: db.resume.visibility === "private"
      ? { ...db.resume, summary: "（简历摘要当前为私密）", highlights: [] }
      : db.resume,
  };
}

export function getPublicProjects(): Project[] {
  return loadContent().projects
    .slice()
    .sort((a, b) => (a.featured === b.featured ? b.updatedAt.localeCompare(a.updatedAt) : Number(b.featured) - Number(a.featured)));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return loadContent().projects.find((p) => p.slug === slug);
}

export function getPublicSkills(): Skill[] {
  return loadContent().skills;
}

export function getPublicTools(): Tool[] {
  return loadContent().tools;
}

export function getPublicTimeline(): TimelineItem[] {
  return loadContent().timeline.slice().sort((a, b) => b.date.localeCompare(a.date));
}

export function getPublicNotes(): Note[] {
  return loadContent().notes.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getNoteBySlug(slug: string): Note | undefined {
  return loadContent().notes.find((n) => n.slug === slug);
}

export function getPublicExperiences(): Experience[] {
  return loadContent().experiences.slice().sort((a, b) => b.start.localeCompare(a.start));
}

export function getPublicMedia(): MediaItem[] {
  return loadContent().media;
}

export function getMediaById(id: string): MediaItem | undefined {
  return loadContent().media.find((m) => m.id === id);
}

export function getFeaturedProjects(limit = 3): Project[] {
  return getPublicProjects().filter((p) => p.visibility === "public").slice(0, limit);
}
