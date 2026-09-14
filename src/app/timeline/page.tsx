import type { Metadata } from "next";
import { getPublicTimeline } from "@/lib/content";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { ContentShell, EmptyNote, PageHeader } from "@/components/PageChrome";

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
    <ContentShell>
      <PageHeader
        eyebrow="Timeline"
        title="成长时间线"
        lead="按时间倒序的关键节点。"
      />

      {items.length === 0 ? (
        <EmptyNote>暂无公开时间线节点。</EmptyNote>
      ) : (
        <ol className="relative">
          {/* 主轴 */}
          <div className="absolute bottom-2 left-[3.25rem] top-2 w-px bg-slateink/25 md:left-[5.5rem]" />
          {items.map((t, i) => (
            <li
              key={t.id}
              className="relative grid grid-cols-[3.5rem_1fr] gap-x-5 py-6 md:grid-cols-[6rem_1fr] md:gap-x-8"
            >
              <div className="relative pt-0.5 text-right">
                <div className="font-display text-[12px] font-bold uppercase tracking-wide2 text-slateink-deep">
                  {t.date}
                </div>
                <div className="mt-1 chapter-num !text-[9px]">
                  {kindLabel[t.kind] ?? t.kind}
                </div>
              </div>
              <div className="relative pb-2 pl-6 md:pl-8">
                {/* 节点钉 */}
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rotate-45 border border-slateink bg-paper" />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.12em] text-slateink-deep">
                    {t.title}
                  </h2>
                  <VisibilityBadge value={t.visibility} />
                </div>
                <p className="mt-2 max-w-2xl text-[12.5px] leading-6 text-slateink">
                  {t.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </ContentShell>
  );
}
