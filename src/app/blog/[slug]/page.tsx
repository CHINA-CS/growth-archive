import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNoteBySlug, getPublicNotes } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { OrnateCorners } from "@/components/Ornate";

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
    <article className="mx-auto max-w-2xl space-y-8">
      <header className="animate-riseIn space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="chapter-num">Note</p>
            <h1 className="mt-1 font-display text-2xl font-bold uppercase leading-tight tracking-wide2 text-slateink-deep">
              {note.title}
            </h1>
          </div>
          <VisibilityBadge value={note.visibility} />
        </div>
        <p className="chapter-num">{new Date(note.updatedAt).toLocaleDateString("zh-CN")}</p>
        <p className="text-slateink">{note.excerpt}</p>
      </header>
      <div className="plate plate-corners relative p-6 md:p-8">
        <OrnateCorners />
        <Markdown>{note.body}</Markdown>
      </div>
    </article>
  );
}
