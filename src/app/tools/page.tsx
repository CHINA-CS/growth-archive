import type { Metadata } from "next";
import { getPublicTools } from "@/lib/content";
import { ContentShell, EmptyNote, IndexRow, PageHeader } from "@/components/PageChrome";

export const metadata: Metadata = { title: "工具" };

export default function ToolsPage() {
  const tools = getPublicTools().filter((t) => t.visibility !== "private");

  return (
    <ContentShell>
      <PageHeader
        eyebrow="Toolkit"
        title="工具箱"
        lead="日常开发里真正用得上的工具，以及它们解决过的问题。"
      />

      {tools.length === 0 ? (
        <EmptyNote>暂无公开工具。</EmptyNote>
      ) : (
        <div className="border-t border-slateink/20">
          {tools.map((t, i) => (
            <IndexRow
              key={t.id}
              index={i + 1}
              title={t.name}
              meta={t.category}
              excerpt={t.scenes}
              trailing={
                <div className="flex items-center gap-3">
                  <span className="font-display text-[11px] tracking-wide2 text-slateink-mute">
                    LV.{t.level}
                  </span>
                  {t.link && (
                    <a
                      href={t.link}
                      className="nav-link"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  )}
                </div>
              }
            />
          ))}
        </div>
      )}
    </ContentShell>
  );
}
