import type { Metadata } from "next";
import { getPublicTools } from "@/lib/content";

export const metadata: Metadata = { title: "工具" };

export default function ToolsPage() {
  const tools = getPublicTools().filter((t) => t.visibility !== "private");

  return (
    <div className="space-y-8">
      <header className="animate-riseIn">
        <p className="chapter-num">Toolkit</p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
          工具箱
        </h1>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((t) => (
          <div key={t.id} className="plate plate-hover plate-corners p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
                {t.name}
              </h2>
              <span className="chapter-num">{t.category}</span>
            </div>
            <p className="mt-2 text-sm text-slateink">{t.scenes}</p>
            <div className="mt-4 flex items-center justify-between chapter-num">
              <span>
                {"◆".repeat(t.level)}
                <span className="text-slateink-mute">{"◇".repeat(Math.max(0, 5 - t.level))}</span>
              </span>
              {t.link && (
                <a href={t.link} className="nav-link" target="_blank" rel="noreferrer">
                  Link
                </a>
              )}
            </div>
          </div>
        ))}
        {tools.length === 0 && <p className="text-sm text-slateink-soft">暂无公开工具。</p>}
      </div>
    </div>
  );
}
