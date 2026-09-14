import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { OrnateCorners, DoubleRule } from "@/components/Ornate";

export const metadata: Metadata = { title: "关于" };

export default function AboutPage() {
  const { profile, experiences } = loadContent();
  const visibleExp = experiences.filter((e) => e.visibility !== "private");

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header className="animate-riseIn">
        <p className="chapter-num">About</p>
        <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
          关于我
        </h1>
        <p className="mt-2 text-sm text-slateink">
          {profile.title}
          {profile.location ? ` · ${profile.location}` : ""}
        </p>
      </header>
      <div className="plate plate-corners relative p-6">
        <OrnateCorners />
        <p className="leading-7 text-slateink-deep">{profile.bio}</p>
        <DoubleRule className="my-5" />
        <div className="flex flex-wrap gap-3">
          {profile.links.map((l) => (
            <a key={l.url} href={l.url} className="btn-tale !px-4 !py-2 !text-[0.62rem]" target={l.url.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {l.label}
            </a>
          ))}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="btn-tale !px-4 !py-2 !text-[0.62rem]">
              {profile.email}
            </a>
          )}
        </div>
      </div>

      {visibleExp.length > 0 && (
        <section>
          <h2 className="section-rule mb-5 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
            经历
          </h2>
          <div className="space-y-4">
            {visibleExp.map((e) => (
              <article key={e.id} className="plate plate-hover plate-corners p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
                    {e.org} · {e.title}
                  </h3>
                  <span className="chapter-num">
                    {e.start} – {e.end || "至今"}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-slateink">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-slateink-soft">—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
