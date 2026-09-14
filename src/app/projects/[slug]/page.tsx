import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublicProjects, loadContent } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { MediaGallery } from "@/components/MediaGallery";
import { ContentShell, MetaBlock, PageHeader } from "@/components/PageChrome";

export function generateStaticParams() {
  return getPublicProjects()
    .filter((p) => p.visibility !== "private")
    .map((p) => ({ slug: p.slug }));
}

export function generateMetadata(): Metadata {
  return { title: "项目详情" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || project.visibility === "private") notFound();

  const { media } = loadContent();
  const related = media.filter((m) => project.mediaIds.includes(m.id) && m.visibility !== "private");

  return (
    <ContentShell wide>
      <PageHeader
        eyebrow="Case study"
        title={project.title}
        lead={project.summary}
        action={<VisibilityBadge value={project.visibility} />}
      />

      <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
        {/* 左侧元数据轨 */}
        <aside className="space-y-0 lg:sticky lg:top-24 lg:self-start">
          <MetaBlock label="Role" value={project.role} />
          <MetaBlock label="Status" value={project.status} />
          <MetaBlock label="Stack" value={project.stack.join(" / ") || "—"} />
          <MetaBlock label="Tags" value={project.tags.join("、") || "—"} />
          {project.metrics.length > 0 && (
            <div className="pt-5">
              <p className="chapter-num mb-3">Metrics</p>
              <ul className="space-y-3">
                {project.metrics.map((m) => (
                  <li key={m.label}>
                    <div className="text-[11px] uppercase tracking-wide2 text-slateink-mute">
                      {m.label}
                    </div>
                    <div className="mt-0.5 font-display text-[13px] font-semibold text-slateink-deep">
                      {m.value}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* 正文 */}
        <div className="min-w-0 space-y-12">
          {project.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover}
              alt={project.title}
              className="w-full border border-slateink/30"
            />
          )}

          <section>
            <h2 className="section-rule mb-5 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
              说明
            </h2>
            <div className="max-w-[68ch]">
              <Markdown>{project.body || "（暂无正文）"}</Markdown>
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="section-rule mb-5 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
                素材 · Code & Screens
              </h2>
              <MediaGallery items={related} />
            </section>
          )}
        </div>
      </div>
    </ContentShell>
  );
}
