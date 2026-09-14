import type { Metadata } from "next";
import { getPublicProjects } from "@/lib/content";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { ContentShell, EmptyNote, IndexRow, PageHeader } from "@/components/PageChrome";

export const metadata: Metadata = { title: "项目" };

const statusLabel: Record<string, string> = {
  planning: "规划中",
  "in-progress": "进行中",
  done: "已完成",
  archived: "已归档",
};

export default function ProjectsPage() {
  const projects = getPublicProjects().filter((p) => p.visibility !== "private");

  return (
    <ContentShell wide>
      <PageHeader
        eyebrow="Works"
        title="项目"
        lead="以代码与截图沉淀的可验证作品。默认私密，公开后进入此列表。"
      />

      {projects.length === 0 ? (
        <EmptyNote>
          还没有公开项目。到 <span className="font-medium">后台</span> 创建，并把可见性改为 public。
        </EmptyNote>
      ) : (
        <div className="border-t border-slateink/20">
          {projects.map((p, i) => (
            <IndexRow
              key={p.id}
              index={i + 1}
              href={`/projects/${p.slug}`}
              title={p.title}
              meta={`${p.role} · ${statusLabel[p.status] ?? p.status}`}
              excerpt={p.summary}
              tags={p.stack}
              trailing={<VisibilityBadge value={p.visibility} />}
            />
          ))}
        </div>
      )}
    </ContentShell>
  );
}
