import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { PrintButton } from "@/components/PrintButton";
import { OrnateCorners, DoubleRule } from "@/components/Ornate";

export const metadata: Metadata = { title: "简历" };

export default function ResumePage() {
  const { profile, resume, projects, skills, experiences } = loadContent();
  const linkedProjects = projects.filter(
    (p) => resume.projectIds.includes(p.id) && p.visibility !== "private"
  );
  const publicSkills = skills.filter((s) => s.visibility !== "private");
  const publicExp = experiences.filter((e) => e.visibility !== "private");

  return (
    <div className="mx-auto max-w-3xl space-y-10 print:max-w-none">
      <div className="flex items-start justify-between gap-4 print-hide">
        <div>
          <p className="chapter-num">Resume</p>
          <h1 className="mt-1 font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
            在线简历
          </h1>
          <p className="mt-1 text-sm text-slateink">与站内数据同步；可用浏览器打印为 PDF。</p>
        </div>
        <PrintButton />
      </div>

      <header className="plate plate-corners relative p-8">
        <OrnateCorners />
        <h2 className="font-display text-xl font-bold uppercase tracking-wide2 text-slateink-deep">
          {profile.name}
        </h2>
        <p className="mt-1 chapter-num">{resume.headline}</p>
        <p className="mt-2 text-sm text-slateink-mute">
          {[profile.location, profile.email].filter(Boolean).join(" · ")}
        </p>
        <DoubleRule className="my-5" />
        <p className="leading-7 text-slateink-deep">{resume.summary}</p>
        {resume.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-sm text-slateink">
            {resume.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-slateink-soft">—</span>
                {h}
              </li>
            ))}
          </ul>
        )}
      </header>

      <section>
        <h3 className="section-rule mb-4 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
          技能
        </h3>
        <div className="flex flex-wrap gap-2">
          {(resume.skillGroups.length ? resume.skillGroups : publicSkills.map((s) => s.name)).map(
            (g) => (
              <span key={g} className="chip">
                {g}
              </span>
            )
          )}
        </div>
      </section>

      <section>
        <h3 className="section-rule mb-4 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
          项目
        </h3>
        <div className="space-y-4">
          {(linkedProjects.length ? linkedProjects : publicProjectsFallback(projects)).map((p) => (
            <article key={p.id} className="plate p-5">
              <h4 className="font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
                {p.title}
              </h4>
              <p className="mt-1 chapter-num">
                {p.role} · {p.stack.join(" / ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-slateink">{p.summary}</p>
            </article>
          ))}
        </div>
      </section>

      {publicExp.length > 0 && (
        <section>
          <h3 className="section-rule mb-4 font-display text-sm font-bold uppercase tracking-wide2 text-slateink-deep">
            经历
          </h3>
          <div className="space-y-3">
            {publicExp.map((e) => (
              <div key={e.id} className="text-sm">
                <div className="font-display font-semibold uppercase tracking-wide text-slateink-deep">
                  {e.org} · {e.title}
                </div>
                <div className="chapter-num">
                  {e.start} – {e.end || "至今"}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function publicProjectsFallback(projects: ReturnType<typeof loadContent>["projects"]) {
  return projects.filter((p) => p.visibility === "public" && p.featured).slice(0, 3);
}
