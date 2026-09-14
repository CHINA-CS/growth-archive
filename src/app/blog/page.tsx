import type { Metadata } from "next";
import { getPublicNotes } from "@/lib/content";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { ContentShell, EmptyNote, IndexRow, PageHeader } from "@/components/PageChrome";

export const metadata: Metadata = { title: "笔记" };

const kindLabel: Record<string, string> = {
  post: "文章",
  log: "日志",
  interview: "面试",
};

export default function BlogPage() {
  const notes = getPublicNotes().filter((n) => n.visibility !== "private");

  return (
    <ContentShell>
      <PageHeader
        eyebrow="Notes"
        title="技术笔记"
        lead="公开文章与可私密的学习记录。默认 private。"
      />

      {notes.length === 0 ? (
        <EmptyNote>暂无公开笔记。</EmptyNote>
      ) : (
        <div className="border-t border-slateink/20">
          {notes.map((n, i) => (
            <IndexRow
              key={n.id}
              index={i + 1}
              href={`/blog/${n.slug}`}
              title={n.title}
              meta={`${kindLabel[n.kind] ?? n.kind} · ${new Date(n.updatedAt).toLocaleDateString("zh-CN")}`}
              excerpt={n.excerpt}
              tags={n.tags}
              trailing={<VisibilityBadge value={n.visibility} />}
            />
          ))}
        </div>
      )}
    </ContentShell>
  );
}
