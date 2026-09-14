import type { Metadata } from "next";
import { getPublicSkills } from "@/lib/content";
import { Badge } from "@/components/Badge";

export const metadata: Metadata = { title: "技能" };

export default function SkillsPage() {
  const skills = getPublicSkills().filter((s) => s.visibility !== "private");
  const byCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <header className="animate-riseIn">
        <p className="chapter-num">Skills</p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
          技能
        </h1>
      </header>
      {Object.entries(byCategory).map(([cat, list]) => (
        <section key={cat}>
          <h2 className="section-rule mb-4 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
            {cat}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {list.map((s) => (
              <div key={s.id} className="plate plate-hover plate-corners p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
                    {s.name}
                  </h3>
                  <span className="chapter-num">
                    {"◆".repeat(s.level)}
                    <span className="text-slateink-mute">{"◇".repeat(Math.max(0, 5 - s.level))}</span>
                  </span>
                </div>
                <p className="mt-2 text-sm text-slateink">{s.description}</p>
                {s.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      {skills.length === 0 && <p className="text-sm text-slateink-soft">暂无公开技能。</p>}
    </div>
  );
}
