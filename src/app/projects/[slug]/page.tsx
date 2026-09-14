import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublicProjects, loadContent } from "@/lib/content";
import { Badge } from "@/components/Badge";
import { Markdown } from "@/components/Markdown";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { MediaGallery } from "@/components/MediaGallery";
import { OrnateCorners, DoubleRule } from "@/components/Ornate";

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
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="animate-riseIn space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="chapter-num">Project</p>
            <h1 className="mt-1 font-display text-2xl font-bold uppercase leading-tight tracking-wide2 text-slateink-deep">
              {project.title}
            </h1>
          </div>
          <VisibilityBadge value={project.visibility} />
        </div>
        <p className="text-slateink">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
        <div className="grid gap-3 pt-1 sm:grid-cols-3">
          <Meta label="角色" value={project.role} />
          <Meta label="状态" value={project.status} />
          <Meta label="标签" value={project.tags.join("、") || "—"} />
        </div>
        {project.metrics.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {project.metrics.map((m) => (
              <div key={m.label} className="plate px-4 py-3">
                <div className="chapter-num">{m.label}</div>
                <div className="mt-1 font-display text-sm font-semibold text-slateink-deep">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>

      <section>
        <h2 className="section-rule mb-4 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
          说明
        </h2>
        <div className="plate plate-corners relative p-6 md:p-8">
          <OrnateCorners />
          <Markdown>{project.body || "（暂无正文）"}</Markdown>
        </div>
      </section>

      <section>
        <h2 className="section-rule mb-4 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
          素材
        </h2>
        <MediaGallery items={related} />
      </section>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="plate px-4 py-3">
      <div className="chapter-num">{label}</div>
      <div className="mt-1 text-sm text-slateink-deep">{value || "—"}</div>
    </div>
  );
}
