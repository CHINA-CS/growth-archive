import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAdmin } from "@/lib/auth";
import { getMediaDirs, nowIso, readDB, uid, writeDB } from "@/lib/db";
import type { MediaKind } from "@/lib/types";

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "bin";
}

function guessKind(name: string, mime: string): MediaKind {
  if (mime.startsWith("image/")) {
    return name.toLowerCase().includes("blueprint") ? "blueprint" : "image";
  }
  if (mime.startsWith("video/")) return "video";
  if (
    mime.startsWith("text/") ||
    ["cpp", "h", "hpp", "cc", "c", "cs", "py", "js", "ts", "json", "md", "ini", "usf", "ush"].includes(
      extOf(name)
    )
  ) {
    return "code";
  }
  return "file";
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const title = String(form.get("title") || "未命名素材");
  const description = String(form.get("description") || "");
  const language = String(form.get("language") || "");
  const relatedProjectId = String(form.get("relatedProjectId") || "");
  const tagsRaw = String(form.get("tags") || "");
  const tags = tagsRaw
    .split(/[,，\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "缺少文件" }, { status: 400 });
  }

  const { MEDIA_DIR } = getMediaDirs();
  const safeName = `${Date.now()}_${file.name.replace(/[^\w.\-]+/g, "_")}`;
  const relPath = path.join("uploads", safeName);
  const absPath = path.join(MEDIA_DIR, relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(absPath, buf);

  const db = readDB();
  const item = {
    id: uid("media"),
    visibility: "private" as const,
    tags,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    kind: guessKind(file.name, file.type || "application/octet-stream"),
    title,
    description,
    path: relPath.replace(/\\/g, "/"),
    mime: file.type || "application/octet-stream",
    size: file.size,
    language: language || undefined,
    relatedProjectId: relatedProjectId || undefined,
  };
  db.media.unshift(item);
  writeDB(db);

  // 开发模式下同步到 public/media，便于预览（公开构建脚本会再过滤）
  const { PUBLIC_MEDIA_DIR } = getMediaDirs();
  const pubAbs = path.join(PUBLIC_MEDIA_DIR, item.path);
  fs.mkdirSync(path.dirname(pubAbs), { recursive: true });
  fs.copyFileSync(absPath, pubAbs);

  return NextResponse.json(item);
}
