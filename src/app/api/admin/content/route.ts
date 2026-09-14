import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { nowIso, readDB, uid, writeDB } from "@/lib/db";
import type { ContentDB } from "@/lib/types";

const COLLECTIONS = [
  "skills",
  "projects",
  "tools",
  "experiences",
  "timeline",
  "notes",
  "media",
] as const;

type Collection = (typeof COLLECTIONS)[number];

function ensureItem(item: Record<string, unknown>, prefix: string) {
  const now = nowIso();
  return {
    ...item,
    id: (item.id as string) || uid(prefix),
    visibility: item.visibility || "private",
    tags: Array.isArray(item.tags) ? item.tags : [],
    createdAt: (item.createdAt as string) || now,
    updatedAt: now,
  };
}

const prefixMap: Record<Collection, string> = {
  skills: "skill",
  projects: "proj",
  tools: "tool",
  experiences: "exp",
  timeline: "tl",
  notes: "note",
  media: "media",
};

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  return NextResponse.json(readDB());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const body = await req.json();
  const db = readDB();

  if (body.profile) {
    db.profile = { ...db.profile, ...body.profile, updatedAt: nowIso() };
  }
  if (body.resume) {
    db.resume = { ...db.resume, ...body.resume, updatedAt: nowIso() };
  }

  for (const col of COLLECTIONS) {
    if (!Array.isArray(body[col])) continue;
    const mapped = body[col].map((item: Record<string, unknown>) =>
      ensureItem(item, prefixMap[col])
    );
    // 按集合写入，避免 TS 对联合数组的交叉推断
    (db as unknown as Record<string, unknown>)[col] = mapped;
  }

  writeDB(db);
  return NextResponse.json(db);
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { collection, id } = await req.json();
  if (!COLLECTIONS.includes(collection)) {
    return NextResponse.json({ error: "无效集合" }, { status: 400 });
  }
  const db = readDB();
  const col = collection as Collection;
  const list = (db as unknown as Record<string, { id: string }[]>)[col] || [];
  (db as unknown as Record<string, { id: string }[]>)[col] = list.filter((item) => item.id !== id);
  writeDB(db);
  return NextResponse.json({ ok: true });
}
