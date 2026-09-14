/**
 * 构建公开静态站：
 * 1. 过滤 content/db.json 中 private 条目到 content/db.public.json
 * 2. 同步已公开媒体到 public/media
 * 3. 由 next build 使用 NEXT_PUBLIC_CONTENT_MODE=public 与 NEXT_OUTPUT=export
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const src = path.join(ROOT, "content", "db.json");
const outPublic = path.join(ROOT, "content", "db.public.json");
const mediaDir = path.join(ROOT, "content", "media");
const publicMedia = path.join(ROOT, "public", "media");

if (!fs.existsSync(src)) {
  console.error("缺少 content/db.json，请先运行 npm run seed 或使用后台保存内容");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(src, "utf-8"));
const keep = (item) => item && item.visibility !== "private";

const filtered = {
  profile: db.profile,
  skills: (db.skills || []).filter(keep),
  projects: (db.projects || []).filter(keep),
  tools: (db.tools || []).filter(keep),
  experiences: (db.experiences || []).filter(keep),
  timeline: (db.timeline || []).filter(keep),
  notes: (db.notes || []).filter(keep),
  media: (db.media || []).filter(keep),
  resume: db.resume,
};

fs.writeFileSync(outPublic, JSON.stringify(filtered, null, 2), "utf-8");

// 备份原 db 并切换（构建后由 next.config 或 CI 恢复亦可；此处写临时环境）
// 使用 PUBLIC_BUILD=1 时 content.ts 优先读 db.public.json
fs.mkdirSync(publicMedia, { recursive: true });
for (const m of filtered.media) {
  if (!m.path) continue;
  const from = path.join(mediaDir, m.path);
  const to = path.join(publicMedia, m.path);
  if (fs.existsSync(from)) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

console.log("Public content snapshot ready:", outPublic);
