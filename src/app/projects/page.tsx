import type { Metadata } from "next";
import Link from "next/link";
import { getPublicProjects } from "@/lib/content";
import { Badge } from "@/components/Badge";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { OrnateCorners } from "@/components/Ornate";

export const metadata: Metadata = { title: "项目" };

const statusLabel: Record<string, string> = {
  planning: "规划中",
  "in-progress": "进行中",
  done: "已完成",
  archived: "已归档",
};

export default function ProjectsPage() {
  const projects = getPublicProjects().filter((p) => p.visibility !== "private");

  return (
    <div className="space-y-8">
      <header className="animate-riseIn">
        <p className="chapter-num">Works</p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
          项目
        </h1>
        <p className="mt-2 text-sm text-slateink">以代码 + 截图沉淀的作品与实验。</p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="plate plate-hover plate-corners animate-riseIn p-6"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <span className="chapter-num">Case</span>
              <VisibilityBadge value={p.visibility} />
            </div>
            <h2 className="font-display text-base font-bold uppercase tracking-wide text-slateink-deep">
              {p.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slateink">{p.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 chapter-num">
              <span>{p.role}</span>
              <span>·</span>
              <span>{statusLabel[p.status] ?? p.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-slateink-soft">还没有公开项目。</p>
        )}
      </div>
    </div>
  );
}
