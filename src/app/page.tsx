import Link from "next/link";
import { getFeaturedProjects, loadContent } from "@/lib/content";
import { Badge } from "@/components/Badge";
import { VisibilityBadge } from "@/components/VisibilityBadge";
import { OrnateCorners, DoubleRule, SideRail } from "@/components/Ornate";

export default function HomePage() {
  const { profile, skills, resume, timeline, notes } = loadContent();
  const featured = getFeaturedProjects(3);
  const recentTimeline = timeline.filter((t) => t.visibility !== "private").slice(0, 4);
  const recentNotes = notes.filter((n) => n.visibility !== "private").slice(0, 3);
  const publicSkills = skills.filter((s) => s.visibility !== "private");

  return (
    <div className="space-y-16">
      {/* Hero：仿 Nomadic Tribe 三栏饰框构图 */}
      <section className="animate-riseIn">
        <div className="grid gap-4 lg:grid-cols-[180px_1fr_180px]">
          {/* 左饰栏 */}
          <aside className="plate plate-corners plate-rail relative hidden min-h-[420px] flex-col justify-between p-5 lg:flex">
            <SideRail side="left" />
            <OrnateCorners />
            <p className="chapter-num">Chapter 01</p>
            <div className="space-y-3">
              <div className="h-16 w-full border border-slateink/30 bg-[linear-gradient(160deg,rgba(168,192,212,0.45),rgba(127,163,146,0.35))]" />
              <div className="h-10 w-full border border-slateink/30 bg-[linear-gradient(160deg,rgba(228,184,180,0.4),rgba(240,212,208,0.3))]" />
              <div className="h-8 w-full border border-slateink/25 bg-paper-warm/60" />
            </div>
            <p className="font-display text-[0.58rem] uppercase tracking-wide2 text-slateink-mute">
              Archive / Private by default
            </p>
          </aside>

          {/* 中央主饰框 */}
          <div className="plate plate-corners relative overflow-hidden px-6 py-10 md:px-12 md:py-14">
            <OrnateCorners />
            <div className="relative mx-auto max-w-2xl text-center">
              <div className="arch-frame mx-auto mb-8 flex h-28 w-40 items-center justify-center md:h-36 md:w-52">
                <span className="font-display text-xs font-bold uppercase tracking-wide3 text-slateink-deep">
                  {profile.name.slice(0, 1) || "我"}
                </span>
              </div>
              <p className="chapter-num mb-4">A Personal Growth Tale</p>
              <h1 className="font-display text-3xl font-bold uppercase leading-tight tracking-wide2 text-slateink-deep md:text-4xl">
                {profile.name}
              </h1>
              <p className="mt-2 font-display text-sm font-semibold uppercase tracking-wide3 text-slateink">
                {profile.title}
              </p>
              <DoubleRule className="mx-auto my-6 max-w-xs" />
              <p className="mx-auto max-w-xl text-[15px] leading-7 text-slateink">{profile.bio}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/projects" className="btn-tale btn-tale-fill">
                  查看项目
                </Link>
                <Link href="/resume" className="btn-tale">
                  在线简历
                </Link>
              </div>
            </div>
          </div>

          {/* 右饰栏 */}
          <aside className="plate plate-corners plate-rail relative hidden min-h-[420px] flex-col justify-between p-5 lg:flex">
            <SideRail side="right" />
            <OrnateCorners />
            <p className="chapter-num text-right">Index</p>
            <ul className="space-y-2 text-right font-display text-[0.62rem] uppercase tracking-wide2 text-slateink">
              <li>Projects</li>
              <li>Skills</li>
              <li>Timeline</li>
              <li>Notes</li>
              <li>Resume</li>
            </ul>
            <p className="text-right text-[0.62rem] text-slateink-mute">Scroll to explore</p>
          </aside>
        </div>
      </section>

      <SectionTitle label="Selected Works" title="精选作品" href="/projects" />

      <section className="grid gap-5 md:grid-cols-3">
        {featured.length === 0 && (
          <p className="text-sm text-slateink-soft">暂无公开项目。可到后台创建并设为公开。</p>
        )}
        {featured.map((p, i) => (
          <Link
            key={p.id}
            href={`/projects/${p.slug}`}
            className="plate plate-hover plate-corners animate-riseIn group p-6"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="chapter-num">Work</span>
              <VisibilityBadge value={p.visibility} />
            </div>
            <h3 className="font-display text-base font-bold uppercase tracking-wide text-slateink-deep transition-colors group-hover:text-slateink">
              {p.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slateink">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.stack.slice(0, 4).map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="animate-riseIn">
          <SectionTitle label="Skills" title="技能摘要" />
          <ul className="mt-5 space-y-3">
            {publicSkills.slice(0, 6).map((s) => (
              <li key={s.id} className="plate plate-hover px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
                    {s.name}
                  </span>
                  <span className="chapter-num">
                    {"◆".repeat(s.level)}
                    <span className="text-slateink-mute">{"◇".repeat(Math.max(0, 5 - s.level))}</span>
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slateink">{s.description}</p>
              </li>
            ))}
            {publicSkills.length === 0 && (
              <p className="text-sm text-slateink-soft">暂无公开技能。</p>
            )}
          </ul>
        </div>
        <div className="animate-riseIn" style={{ animationDelay: "0.08s" }}>
          <SectionTitle label="Timeline" title="最近动态" />
          <ol className="relative mt-5 space-y-5 border-l border-slateink/40 pl-6">
            {recentTimeline.map((t) => (
              <li key={t.id} className="relative">
                <span className="absolute -left-[1.55rem] top-1.5 h-2 w-2 rotate-45 border border-slateink bg-paper" />
                <div className="chapter-num">{t.date}</div>
                <div className="mt-0.5 font-display text-sm font-semibold text-slateink-deep">
                  {t.title}
                </div>
                <div className="text-sm text-slateink">{t.description}</div>
              </li>
            ))}
            {recentTimeline.length === 0 && (
              <p className="text-sm text-slateink-soft">暂无公开时间线。</p>
            )}
          </ol>
        </div>
      </section>

      <section>
        <SectionTitle label="Notes" title="技术笔记" href="/blog" />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {recentNotes.map((n, i) => (
            <Link
              key={n.id}
              href={`/blog/${n.slug}`}
              className="plate plate-hover plate-corners animate-riseIn p-5"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="chapter-num">Read</span>
              <h3 className="mt-2 font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
                {n.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-slateink">{n.excerpt}</p>
            </Link>
          ))}
          {recentNotes.length === 0 && (
            <p className="text-sm text-slateink-soft">暂无公开笔记。</p>
          )}
        </div>
      </section>

      <section className="plate plate-corners relative animate-riseIn p-8 md:p-10">
        <OrnateCorners />
        <div className="grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div>
            <p className="chapter-num">Resume</p>
            <h2 className="mt-2 font-display text-xl font-bold uppercase tracking-wide2 text-slateink-deep">
              {resume.headline}
            </h2>
            <DoubleRule className="my-4 max-w-[120px]" />
          </div>
          <div>
            <p className="text-sm leading-7 text-slateink">{resume.summary}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-slateink">
              {resume.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-slateink-soft">—</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({
  label,
  title,
  href,
}: {
  label: string;
  title: string;
  href?: string;
}) {
  return (
    <div className="section-rule flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="chapter-num">{label}</p>
        <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-wide2 text-slateink-deep">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="nav-link">
          View all →
        </Link>
      )}
    </div>
  );
}
