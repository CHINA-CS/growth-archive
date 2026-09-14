import type { Metadata } from "next";
import { getPublicSkills } from "@/lib/content";
import { ContentShell, EmptyNote, PageHeader } from "@/components/PageChrome";

export const metadata: Metadata = { title: "技能" };

export default function SkillsPage() {
  const skills = getPublicSkills().filter((s) => s.visibility !== "private");
  const byCategory = skills.reduce<Record<string, typeof skills>>((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <ContentShell>
      <PageHeader
        eyebrow="Skills"
        title="技能"
        lead="按类别列出掌握程度；关联项目可在作品页查看证明材料。"
      />

      {skills.length === 0 ? (
        <EmptyNote>暂无公开技能。</EmptyNote>
      ) : (
        <div className="space-y-14">
          {Object.entries(byCategory).map(([cat, list]) => (
            <section key={cat}>
              <div className="mb-5 flex items-baseline gap-4">
                <h2 className="display-md !tracking-[0.18em] text-slateink-deep">{cat}</h2>
                <span className="chapter-num">{String(list.length).padStart(2, "0")}</span>
              </div>
              <ul className="border-t border-slateink/20">
                {list.map((s) => (
                  <li
                    key={s.id}
                    className="grid grid-cols-1 gap-3 border-b border-slateink/15 py-6 md:grid-cols-[1fr_auto] md:items-center md:gap-8"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-[15px] font-bold uppercase tracking-[0.14em] text-slateink-deep">
                        {s.name}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-[12.5px] leading-6 text-slateink">
                        {s.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 md:justify-end">
                      <span className="font-display text-[11px] tracking-wide2 text-slateink-mute">
                        LV.{s.level}
                      </span>
                      <div className="flex gap-1" aria-label={`熟练度 ${s.level}/5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-3.5 w-1.5 ${
                              i < s.level ? "bg-slateink" : "bg-slateink/15"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </ContentShell>
  );
}
