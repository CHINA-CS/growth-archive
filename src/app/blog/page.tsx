import type { Metadata } from "next";
import Link from "next/link";
import { getPublicNotes } from "@/lib/content";
import { Badge } from "@/components/Badge";
import { VisibilityBadge } from "@/components/VisibilityBadge";

export const metadata: Metadata = { title: "笔记" };

const kindLabel: Record<string, string> = {
  post: "文章",
  log: "日志",
  interview: "面试",
};

export default function BlogPage() {
  const notes = getPublicNotes().filter((n) => n.visibility !== "private");

  return (
    <div className="space-y-8">
      <header className="animate-riseIn">
        <p className="chapter-num">Notes</p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
          技术笔记
        </h1>
      </header>
      <div className="space-y-4">
        {notes.map((n, i) => (
          <Link
            key={n.id}
            href={`/blog/${n.slug}`}
            className="plate plate-hover plate-corners block animate-riseIn p-6"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-base font-bold uppercase tracking-wide text-slateink-deep">
                {n.title}
              </h2>
              <Badge>{kindLabel[n.kind] ?? n.kind}</Badge>
              <VisibilityBadge value={n.visibility} />
            </div>
            <p className="mt-2 text-sm text-slateink">{n.excerpt}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {n.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </Link>
        ))}
        {notes.length === 0 && <p className="text-sm text-slateink-soft">暂无公开笔记。</p>}
      </div>
    </div>
  );
}
