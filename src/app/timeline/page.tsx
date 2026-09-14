import type { Metadata } from "next";
import { getPublicTimeline } from "@/lib/content";
import { VisibilityBadge } from "@/components/VisibilityBadge";

export const metadata: Metadata = { title: "时间线" };

const kindLabel: Record<string, string> = {
  project: "项目",
  job: "工作",
  study: "学习",
  award: "获奖",
  milestone: "里程碑",
};

export default function TimelinePage() {
  const items = getPublicTimeline().filter((t) => t.visibility !== "private");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header className="animate-riseIn">
        <p className="chapter-num">Timeline</p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
          成长时间线
        </h1>
      </header>
      <ol className="relative space-y-8 border-l border-slateink/40 pl-8">
        {items.map((t, i) => (
          <li key={t.id} className="relative animate-riseIn" style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="absolute -left-[1.7rem] top-1.5 h-2.5 w-2.5 rotate-45 border border-slateink bg-paper" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="chapter-num">{t.date}</span>
              <span className="text-slateink-mute">· {kindLabel[t.kind] ?? t.kind}</span>
              <VisibilityBadge value={t.visibility} />
            </div>
            <h2 className="mt-1.5 font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-slateink">{t.description}</p>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-slateink-soft">暂无公开时间线节点。</p>}
      </ol>
    </div>
  );
}
