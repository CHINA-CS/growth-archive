import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { ContentShell, EmptyNote, PageHeader } from "@/components/PageChrome";

export const metadata: Metadata = { title: "关于" };

export default function AboutPage() {
  const { profile, experiences } = loadContent();
  const visibleExp = experiences.filter((e) => e.visibility !== "private");

  return (
    <ContentShell>
      <PageHeader
        eyebrow="About"
        title="关于我"
        lead={[profile.title, profile.location].filter(Boolean).join(" · ")}
      />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <div className="max-w-[60ch] text-[13.5px] leading-8 text-slateink-deep">
            {profile.bio}
          </div>
          {(profile.links.length > 0 || profile.email) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {profile.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  className="btn-tale !px-4 !py-2 !text-[10px]"
                  target={l.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              ))}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="btn-tale !px-4 !py-2 !text-[10px]">
                  Email
                </a>
              )}
            </div>
          )}
        </div>

        <aside>
          <h2 className="section-rule mb-5 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
            经历
          </h2>
          {visibleExp.length === 0 ? (
            <EmptyNote>暂无公开经历。</EmptyNote>
          ) : (
            <ul className="space-y-6">
              {visibleExp.map((e) => (
                <li key={e.id} className="border-b border-slateink/15 pb-5">
                  <div className="chapter-num">
                    {e.start} – {e.end || "至今"}
                  </div>
                  <h3 className="mt-1 font-display text-[14px] font-bold uppercase tracking-[0.1em] text-slateink-deep">
                    {e.org}
                  </h3>
                  <p className="text-[12.5px] text-slateink">{e.title}</p>
                  {e.bullets.length > 0 && (
                    <ul className="mt-2 space-y-1 text-[12px] text-slateink">
                      {e.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-slateink-soft">—</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </ContentShell>
  );
}
