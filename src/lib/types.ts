export type Visibility = "public" | "unlisted" | "private";

export type MediaKind = "image" | "video" | "code" | "blueprint" | "file";

export interface BaseEntity {
  id: string;
  visibility: Visibility;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Profile extends BaseEntity {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  location: string;
  email: string;
  links: { label: string; url: string }[];
}

export interface Skill extends BaseEntity {
  name: string;
  category: string;
  level: number; // 1-5
  description: string;
  projectIds: string[];
}

export interface Project extends BaseEntity {
  title: string;
  slug: string;
  summary: string;
  role: string;
  status: "planning" | "in-progress" | "done" | "archived";
  featured: boolean;
  stack: string[];
  metrics: { label: string; value: string }[];
  body: string;
  cover: string;
  mediaIds: string[];
}

export interface Tool extends BaseEntity {
  name: string;
  category: string;
  level: number;
  scenes: string;
  link: string;
}

export interface Experience extends BaseEntity {
  type: "edu" | "work" | "oss" | "award" | "cert";
  org: string;
  title: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface TimelineItem extends BaseEntity {
  date: string;
  title: string;
  kind: "project" | "job" | "study" | "award" | "milestone";
  description: string;
  relatedIds: string[];
}

export interface Note extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  kind: "post" | "log" | "interview";
}

export interface MediaItem extends BaseEntity {
  kind: MediaKind;
  title: string;
  description: string;
  path: string;
  mime: string;
  size: number;
  language?: string;
  relatedProjectId?: string;
}

export interface ResumeData extends BaseEntity {
  headline: string;
  summary: string;
  highlights: string[];
  skillGroups: string[];
  projectIds: string[];
}

export interface ContentDB {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  tools: Tool[];
  experiences: Experience[];
  timeline: TimelineItem[];
  notes: Note[];
  media: MediaItem[];
  resume: ResumeData;
}

export const DEFAULT_VISIBILITY: Visibility = "private";
