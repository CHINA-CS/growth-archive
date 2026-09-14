import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteBySlug, getPublicNotes } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { ContentShell, PageHeader } from "@/components/PageChrome";

export function generateStaticParams() {
  return getPublicNotes()
    .filter((n) => n.visibility !== "private")
    .map((n) => ({ slug: n.slug }));
}

export function generateMetadata(): Metadata {
  return { title: "笔记" };
}

export default async function NoteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note || note.visibility === "private") notFound();

  return (
    <ContentShell>
      <PageHeader
        eyebrow="Note"
        title={note.title}
        lead={note.excerpt}
        action={<VisibilityBadge value={note.visibility} />}
      />
      <p className="chapter-num mb-8">
        {new Date(note.updatedAt).toLocaleDateString("zh-CN")}
      </p>
      <div className="max-w-[68ch] border-t border-slateink/20 pt-8">
        <Markdown>{note.body}</Markdown>
      </div>
    </ContentShell>
  );
}
