"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ContentDB, Visibility } from "@/lib/types";
import { OrnateCorners } from "@/components/Ornate";

type Section =
  | "overview"
  | "profile"
  | "skills"
  | "projects"
  | "tools"
  | "timeline"
  | "notes"
  | "media"
  | "experiences"
  | "resume";

const sections: { id: Section; label: string }[] = [
  { id: "overview", label: "总览" },
  { id: "profile", label: "个人" },
  { id: "skills", label: "技能" },
  { id: "projects", label: "项目" },
  { id: "tools", label: "工具" },
  { id: "timeline", label: "时间线" },
  { id: "notes", label: "笔记" },
  { id: "media", label: "媒体" },
  { id: "experiences", label: "经历" },
  { id: "resume", label: "简历" },
];

type Column = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "boolean" | "tags" | "lines" | "select";
  options?: { value: string; label: string }[];
};

type AnyItem = Record<string, any> & { id: string; visibility: Visibility; tags: string[] };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [db, setDb] = useState<ContentDB | null>(null);
  const [section, setSection] = useState<Section>("overview");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/content");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setDb(data);
    setAuthed(true);
  }, []);

  useEffect(() => {
    load().catch(() => setAuthed(false));
  }, [load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setMessage("登录失败 · 默认密码 admin123");
        return;
      }
      setMessage("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setDb(null);
  }

  async function save(next: ContentDB) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      setDb(data);
      flash("已保存");
    } finally {
      setBusy(false);
    }
  }

  async function removeItem(collection: string, id: string) {
    if (!confirm("确认删除该项？")) return;
    setBusy(true);
    try {
      await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection, id }),
      });
      await load();
      flash("已删除");
    } finally {
      setBusy(false);
    }
  }

  function flash(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(""), 2200);
  }

  if (!authed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
        <div className="plate plate-corners relative animate-riseIn p-8">
          <OrnateCorners />
          <p className="chapter-num">Admin</p>
          <h1 className="mt-2 font-display text-xl font-bold uppercase tracking-wide2 text-slateink-deep">
            本地管理后台
          </h1>
          <p className="mt-2 text-sm text-slateink">内容默认私密，改为 public 后才会出现在公开站。</p>
          <form onSubmit={login} className="mt-6 space-y-4">
            <label className="block">
              <span className="field-label">管理密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="admin123"
              />
            </label>
            <button disabled={busy} className="btn-tale btn-tale-fill w-full">
              {busy ? "验证中…" : "进入后台"}
            </button>
            {message && <p className="text-sm text-blush-deep">{message}</p>}
          </form>
        </div>
      </div>
    );
  }

  if (!db) return <p className="text-sm text-slateink-soft">加载中…</p>;

  const stats = {
    projects: db.projects.length,
    publicProjects: db.projects.filter((p) => p.visibility === "public").length,
    skills: db.skills.length,
    notes: db.notes.length,
    media: db.media.length,
    timeline: db.timeline.length,
  };

  return (
    <div className="space-y-8">
      <div className="section-rule flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chapter-num">Control Room</p>
          <h1 className="mt-1 font-display text-xl font-bold uppercase tracking-wide2 text-slateink-deep">
            管理后台
          </h1>
          <p className="mt-1 text-sm text-slateink">新建内容默认 private</p>
        </div>
        <div className="flex items-center gap-3">
          {message && <span className="chapter-num text-sage-deep">{message}</span>}
          <Link href="/" className="btn-tale !px-3 !py-1.5 !text-[0.6rem]">
            查看站点
          </Link>
          <button onClick={logout} className="btn-tale !px-3 !py-1.5 !text-[0.6rem]">
            退出
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`font-display px-3.5 py-1.5 text-[0.62rem] font-semibold uppercase tracking-wide2 transition-all duration-300 ${
              section === s.id
                ? "border border-slateink bg-slateink text-paper"
                : "border border-slateink/40 text-slateink hover:border-slateink hover:text-slateink-deep"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "overview" && (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="项目" value={`${stats.publicProjects}/${stats.projects}`} hint="公开/总" />
          <Stat label="技能" value={String(stats.skills)} />
          <Stat label="笔记" value={String(stats.notes)} />
          <Stat label="媒体" value={String(stats.media)} />
          <Stat label="时间线" value={String(stats.timeline)} />
          <Stat label="默认可见性" value="private" />
        </div>
      )}

      {section === "profile" && (
        <Card title="个人描述">
          <Field label="姓名" value={db.profile.name} onChange={(v) => setDb({ ...db, profile: { ...db.profile, name: v } })} />
          <Field label="头衔" value={db.profile.title} onChange={(v) => setDb({ ...db, profile: { ...db.profile, title: v } })} />
          <Field label="城市" value={db.profile.location} onChange={(v) => setDb({ ...db, profile: { ...db.profile, location: v } })} />
          <Field label="邮箱" value={db.profile.email} onChange={(v) => setDb({ ...db, profile: { ...db.profile, email: v } })} />
          <Area label="简介" value={db.profile.bio} onChange={(v) => setDb({ ...db, profile: { ...db.profile, bio: v } })} />
          <VisSelect value={db.profile.visibility} onChange={(v) => setDb({ ...db, profile: { ...db.profile, visibility: v } })} />
          <SaveBar busy={busy} onSave={() => save(db)} />
        </Card>
      )}

      {section === "skills" && (
        <CollectionEditor
          title="技能"
          items={db.skills}
          busy={busy}
          query={query}
          setQuery={setQuery}
          onSave={save}
          db={db}
          collection="skills"
          createDefault={() => ({ name: "新技能", category: "编程语言", level: 3, description: "", projectIds: [] })}
          columns={[
            { key: "name", label: "名称" },
            { key: "category", label: "分类" },
            { key: "level", label: "等级 1-5", type: "number" },
            { key: "description", label: "说明" },
          ]}
          onRemove={(id) => removeItem("skills", id)}
        />
      )}

      {section === "projects" && (
        <CollectionEditor
          title="项目"
          items={db.projects}
          busy={busy}
          query={query}
          setQuery={setQuery}
          onSave={save}
          db={db}
          collection="projects"
          createDefault={() => ({
            title: "新项目",
            slug: `project-${Date.now()}`,
            summary: "",
            role: "独立开发",
            status: "in-progress" as const,
            featured: false,
            stack: [],
            metrics: [],
            body: "## 背景\n\n## 做法\n- 代码片段\n- 截图\n\n## 结果\n",
            cover: "",
            mediaIds: [],
          })}
          columns={[
            { key: "title", label: "标题" },
            { key: "slug", label: "slug" },
            { key: "summary", label: "摘要" },
            { key: "role", label: "角色" },
            {
              key: "status",
              label: "状态",
              type: "select",
              options: [
                { value: "planning", label: "规划中" },
                { value: "in-progress", label: "进行中" },
                { value: "done", label: "已完成" },
                { value: "archived", label: "已归档" },
              ],
            },
            { key: "featured", label: "精选", type: "boolean" },
            { key: "stack", label: "技术栈（逗号分隔）", type: "tags" },
            { key: "body", label: "正文 Markdown", type: "textarea" },
          ]}
          onRemove={(id) => removeItem("projects", id)}
        />
      )}

      {section === "tools" && (
        <CollectionEditor
          title="工具"
          items={db.tools}
          busy={busy}
          query={query}
          setQuery={setQuery}
          onSave={save}
          db={db}
          collection="tools"
          createDefault={() => ({ name: "新工具", category: "开发环境", level: 3, scenes: "", link: "" })}
          columns={[
            { key: "name", label: "名称" },
            { key: "category", label: "分类" },
            { key: "level", label: "等级", type: "number" },
            { key: "scenes", label: "使用场景" },
            { key: "link", label: "链接" },
          ]}
          onRemove={(id) => removeItem("tools", id)}
        />
      )}

      {section === "timeline" && (
        <CollectionEditor
          title="时间线"
          items={db.timeline}
          busy={busy}
          query={query}
          setQuery={setQuery}
          onSave={save}
          db={db}
          collection="timeline"
          createDefault={() => ({
            date: new Date().toISOString().slice(0, 7),
            title: "新节点",
            kind: "milestone" as const,
            description: "",
            relatedIds: [],
          })}
          columns={[
            { key: "date", label: "日期 YYYY-MM" },
            { key: "title", label: "标题" },
            {
              key: "kind",
              label: "类型",
              type: "select",
              options: [
                { value: "project", label: "项目" },
                { value: "job", label: "工作" },
                { value: "study", label: "学习" },
                { value: "award", label: "获奖" },
                { value: "milestone", label: "里程碑" },
              ],
            },
            { key: "description", label: "描述" },
          ]}
          onRemove={(id) => removeItem("timeline", id)}
        />
      )}

      {section === "notes" && (
        <CollectionEditor
          title="技术笔记"
          items={db.notes}
          busy={busy}
          query={query}
          setQuery={setQuery}
          onSave={save}
          db={db}
          collection="notes"
          createDefault={() => ({
            title: "新笔记",
            slug: `note-${Date.now()}`,
            excerpt: "",
            body: "",
            kind: "post" as const,
          })}
          columns={[
            { key: "title", label: "标题" },
            { key: "slug", label: "slug" },
            { key: "excerpt", label: "摘要" },
            {
              key: "kind",
              label: "类型",
              type: "select",
              options: [
                { value: "post", label: "文章" },
                { value: "log", label: "日志" },
                { value: "interview", label: "面试" },
              ],
            },
            { key: "body", label: "正文 Markdown", type: "textarea" },
          ]}
          onRemove={(id) => removeItem("notes", id)}
        />
      )}

      {section === "media" && (
        <MediaAdmin
          db={db}
          query={query}
          setQuery={setQuery}
          onSave={save}
          onRemove={(id) => removeItem("media", id)}
          onUploaded={load}
        />
      )}

      {section === "experiences" && (
        <CollectionEditor
          title="经历"
          items={db.experiences}
          busy={busy}
          query={query}
          setQuery={setQuery}
          onSave={save}
          db={db}
          collection="experiences"
          createDefault={() => ({
            type: "work" as const,
            org: "组织",
            title: "岗位/专业",
            start: "",
            end: "",
            bullets: [],
          })}
          columns={[
            {
              key: "type",
              label: "类型",
              type: "select",
              options: [
                { value: "edu", label: "教育" },
                { value: "work", label: "工作" },
                { value: "oss", label: "开源" },
                { value: "award", label: "获奖" },
                { value: "cert", label: "证书" },
              ],
            },
            { key: "org", label: "组织" },
            { key: "title", label: "标题" },
            { key: "start", label: "开始" },
            { key: "end", label: "结束" },
            { key: "bullets", label: "要点（每行一条）", type: "lines" },
          ]}
          onRemove={(id) => removeItem("experiences", id)}
        />
      )}

      {section === "resume" && (
        <Card title="在线简历">
          <Field label="求职一句话" value={db.resume.headline} onChange={(v) => setDb({ ...db, resume: { ...db.resume, headline: v } })} />
          <Area label="摘要" value={db.resume.summary} onChange={(v) => setDb({ ...db, resume: { ...db.resume, summary: v } })} />
          <Area
            label="亮点（每行一条）"
            value={db.resume.highlights.join("\n")}
            onChange={(v) =>
              setDb({
                ...db,
                resume: { ...db.resume, highlights: v.split("\n").map((s) => s.trim()).filter(Boolean) },
              })
            }
          />
          <Field
            label="技能组（逗号分隔）"
            value={db.resume.skillGroups.join(", ")}
            onChange={(v) =>
              setDb({
                ...db,
                resume: {
                  ...db.resume,
                  skillGroups: v.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
                },
              })
            }
          />
          <VisSelect value={db.resume.visibility} onChange={(v) => setDb({ ...db, resume: { ...db.resume, visibility: v } })} />
          <SaveBar busy={busy} onSave={() => save(db)} />
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="plate plate-corners p-4">
      <div className="chapter-num">{label}</div>
      <div className="mt-1.5 font-display text-lg font-bold text-slateink-deep">{value}</div>
      {hint && <div className="mt-1 text-[0.65rem] text-slateink-mute">{hint}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="plate plate-corners relative space-y-4 p-6">
      <h2 className="section-rule font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="field-input" />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={5} className="field-input" />
    </label>
  );
}

function VisSelect({ value, onChange }: { value: Visibility; onChange: (v: Visibility) => void }) {
  return (
    <label className="block">
      <span className="field-label">可见性（默认 private）</span>
      <select value={value} onChange={(e) => onChange(e.target.value as Visibility)} className="field-input">
        <option value="private">private 私密</option>
        <option value="unlisted">unlisted 知道链接可访问</option>
        <option value="public">public 公开</option>
      </select>
    </label>
  );
}

function SaveBar({ busy, onSave }: { busy: boolean; onSave: () => void }) {
  return (
    <div className="pt-1">
      <button disabled={busy} onClick={onSave} className="btn-tale btn-tale-fill">
        {busy ? "保存中…" : "保存"}
      </button>
    </div>
  );
}

function CollectionEditor({
  title,
  items,
  db,
  collection,
  columns,
  createDefault,
  onSave,
  onRemove,
  busy,
  query,
  setQuery,
}: {
  title: string;
  items: AnyItem[];
  db: ContentDB;
  collection: keyof ContentDB;
  columns: Column[];
  createDefault: () => Record<string, any>;
  onSave: (db: ContentDB) => Promise<void>;
  onRemove: (id: string) => void;
  busy: boolean;
  query: string;
  setQuery: (v: string) => void;
}) {
  const [draft, setDraft] = useState<AnyItem[]>(items);
  useEffect(() => setDraft(items), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return draft;
    return draft.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }, [draft, query]);

  function patchById(id: string, patch: Partial<AnyItem>) {
    setDraft((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function add() {
    const now = new Date().toISOString();
    const item: AnyItem = {
      id: `tmp_${Date.now()}`,
      visibility: "private",
      tags: [],
      createdAt: now,
      updatedAt: now,
      ...createDefault(),
    };
    setDraft((prev) => [item, ...prev]);
  }

  return (
    <Card title={title}>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索…"
          className="field-input max-w-xs"
        />
        <button onClick={add} className="btn-tale !px-3 !py-1.5 !text-[0.6rem]">
          + 新建（默认私密）
        </button>
        <button
          disabled={busy}
          onClick={async () => {
            await onSave({ ...db, [collection]: draft } as ContentDB);
          }}
          className="btn-tale btn-tale-fill !px-3 !py-1.5 !text-[0.6rem]"
        >
          保存全部修改
        </button>
      </div>

      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="border border-slateink/30 bg-paper-warm/40 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="font-mono text-[0.68rem] text-slateink-mute">ID: {item.id}</div>
              <div className="flex items-center gap-2">
                <select
                  value={item.visibility}
                  onChange={(e) => patchById(item.id, { visibility: e.target.value as Visibility })}
                  className="field-input !w-auto !py-1 text-xs"
                >
                  <option value="private">private</option>
                  <option value="unlisted">unlisted</option>
                  <option value="public">public</option>
                </select>
                <button
                  onClick={() => onRemove(item.id)}
                  className="border border-blush-deep/40 px-2 py-1 text-xs text-blush-deep hover:border-blush-deep"
                >
                  删除
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {columns.map((col) => (
                <div key={col.key} className={col.type === "textarea" ? "md:col-span-2" : ""}>
                  {col.type === "boolean" ? (
                    <label className="flex items-center gap-2 text-sm text-slateink-deep">
                      <input
                        type="checkbox"
                        checked={Boolean(item[col.key])}
                        onChange={(e) => patchById(item.id, { [col.key]: e.target.checked } as Partial<AnyItem>)}
                      />
                      <span className="field-label !mb-0">{col.label}</span>
                    </label>
                  ) : col.type === "select" ? (
                    <label className="block">
                      <span className="field-label">{col.label}</span>
                      <select
                        value={String(item[col.key] ?? "")}
                        onChange={(e) => patchById(item.id, { [col.key]: e.target.value } as Partial<AnyItem>)}
                        className="field-input"
                      >
                        {col.options?.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : col.type === "textarea" ? (
                    <Area
                      label={col.label}
                      value={String(item[col.key] ?? "")}
                      onChange={(v) => patchById(item.id, { [col.key]: v } as Partial<AnyItem>)}
                    />
                  ) : col.type === "number" ? (
                    <label className="block">
                      <span className="field-label">{col.label}</span>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={Number(item[col.key] ?? 1)}
                        onChange={(e) =>
                          patchById(item.id, { [col.key]: Number(e.target.value) } as Partial<AnyItem>)
                        }
                        className="field-input"
                      />
                    </label>
                  ) : col.type === "tags" ? (
                    <Field
                      label={col.label}
                      value={Array.isArray(item[col.key]) ? (item[col.key] as string[]).join(", ") : ""}
                      onChange={(v) =>
                        patchById(item.id, {
                          [col.key]: v.split(/[,，]/).map((s) => s.trim()).filter(Boolean),
                        } as Partial<AnyItem>)
                      }
                    />
                  ) : col.type === "lines" ? (
                    <Area
                      label={col.label}
                      value={Array.isArray(item[col.key]) ? (item[col.key] as string[]).join("\n") : ""}
                      onChange={(v) =>
                        patchById(item.id, {
                          [col.key]: v.split("\n").map((s) => s.trim()).filter(Boolean),
                        } as Partial<AnyItem>)
                      }
                    />
                  ) : (
                    <Field
                      label={col.label}
                      value={String(item[col.key] ?? "")}
                      onChange={(v) => patchById(item.id, { [col.key]: v } as Partial<AnyItem>)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MediaAdmin({
  db,
  query,
  setQuery,
  onSave,
  onRemove,
  onUploaded,
}: {
  db: ContentDB;
  query: string;
  setQuery: (v: string) => void;
  onSave: (db: ContentDB) => Promise<void>;
  onRemove: (id: string) => void;
  onUploaded: () => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title || file.name);
      fd.append("description", description);
      fd.append("tags", tags);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        setNote("上传失败");
        return;
      }
      setNote("已上传（默认 private）");
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      await onUploaded();
    } finally {
      setUploading(false);
    }
  }

  const filtered = db.media.filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return JSON.stringify(m).toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <Card title="上传媒体（图片 / 视频 / 代码 / 蓝图截图）">
        <form onSubmit={upload} className="grid gap-3 md:grid-cols-2">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-slateink file:mr-3 file:border file:border-slateink/50 file:bg-transparent file:px-3 file:py-1.5 file:text-[0.62rem] file:font-semibold file:uppercase file:tracking-wide2 file:text-slateink-deep"
            accept="image/*,video/*,.cpp,.h,.hpp,.cc,.c,.txt,.md,.json,.usf,.ush"
          />
          <Field label="标题" value={title} onChange={setTitle} />
          <Field label="描述" value={description} onChange={setDescription} />
          <Field label="标签（逗号分隔）" value={tags} onChange={setTags} />
          <div className="md:col-span-2">
            <button disabled={uploading || !file} className="btn-tale btn-tale-fill">
              {uploading ? "上传中…" : "上传（默认 private）"}
            </button>
            {note && <span className="ml-3 text-sm text-sage-deep">{note}</span>}
          </div>
        </form>
        <p className="text-xs text-slateink-mute">代码与蓝图：上传源码文件或截图。视频支持本地 mp4 / webm。</p>
      </Card>

      <Card title={`媒体列表（${db.media.length}）`}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索媒体…"
          className="field-input max-w-xs"
        />
        <div className="space-y-3">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="flex flex-wrap items-center justify-between gap-3 border border-slateink/30 bg-paper-warm/40 p-4"
            >
              <div>
                <div className="font-display text-sm font-semibold text-slateink-deep">{m.title}</div>
                <div className="text-xs text-slateink-mute">
                  {m.kind} · {m.path || "（无文件）"} · {(m.size / 1024).toFixed(1)}KB
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={m.visibility}
                  onChange={(e) => {
                    const next = {
                      ...db,
                      media: db.media.map((x) =>
                        x.id === m.id ? { ...x, visibility: e.target.value as Visibility } : x
                      ),
                    };
                    onSave(next);
                  }}
                  className="field-input !w-auto !py-1 text-xs"
                >
                  <option value="private">private</option>
                  <option value="unlisted">unlisted</option>
                  <option value="public">public</option>
                </select>
                <button
                  onClick={() => onRemove(m.id)}
                  className="border border-blush-deep/40 px-2 py-1 text-xs text-blush-deep hover:border-blush-deep"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
