import type { Metadata } from "next";
import { loadContent } from "@/lib/content";
import { PrintButton } from "@/components/PrintButton";
import { ContentShell, PageHeader } from "@/components/PageChrome";

export const metadata: Metadata = { title: "简历" };

export default function ResumePage() {
  const { profile, resume, projects, skills, experiences } = loadContent();
  const linkedProjects = projects.filter(
    (p) => resume.projectIds.includes(p.id) && p.visibility !== "private"
  );
  const publicSkills = skills.filter((s) => s.visibility !== "private");
  const publicExp = experiences.filter((e) => e.visibility !== "private");
  const shown = linkedProjects.length
    ? linkedProjects
    : projects.filter((p) => p.visibility === "public" && p.featured).slice(0, 3);

  return (
    <ContentShell wide>
      <div className="print-hide">
        <PageHeader
          eyebrow="Resume"
          title="在线简历"
          lead="与站内数据同步；使用浏览器打印导出 PDF。"
          action={<PrintButton />}
        />
      </div>

      {/* 简历正文：单栏编辑稿，打印友好 */}
      <article className="mx-auto max-w-3xl space-y-12 print:max-w-none print:space-y-8">
        <header className="border-b border-slateink/40 pb-6">
          <h2 className="display-lg text-slateink-deep print:!text-black">{profile.name}</h2>
          <p className="mt-2 font-display text-[13px] font-bold uppercase tracking-[0.18em] text-slateink">
            {resume.headline}
          </p>
          <p className="mt-2 text-[12px] text-slateink-mute print:!text-gray-600">
            {[profile.location, profile.email].filter(Boolean).join(" · ")}
          </p>
        </header>

        <section>
          <h3 className="section-rule mb-4 font-display text-[12px] font-bold uppercase tracking-[0.22em] text-slateink-deep">
            Summary
          </h3>
          <p className="text-[13px] leading-7 text-slateink-deep print:!text-black">{resume.summary}</p>
          {resume.highlights.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-[12.5px] text-slateink print:!text-gray-800">
              {resume.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span>—</span>
                  {h}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="section-rule mb-4 font-display text-[12px] font-bold uppercase tracking-[0.22em] text-slateink-deep">
            Skills
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
          <h3 className="section-rule mb-4 font-display text-[12px] font-bold uppercase tracking-[0.22em] text-slateink-deep">
            Selected Projects
          </h3>
          <div className="space-y-6">
            {shown.map((p) => (
              <div key={p.id} className="border-l-2 border-slateink/30 pl-5">
                <h4 className="font-display text-[14px] font-bold uppercase tracking-[0.1em] text-slateink-deep print:!text-black">
                  {p.title}
                </h4>
                <p className="mt-1 chapter-num">
                  {p.role} · {p.stack.join(" / ")}
                </p>
                <p className="mt-2 text-[12.5px] leading-6 text-slateink print:!text-gray-800">
                  {p.summary}
                </p>
              </div>
            ))}
          </div>
        </section>

        {publicExp.length > 0 && (
          <section>
            <h3 className="section-rule mb-4 font-display text-[12px] font-bold uppercase tracking-[0.22em] text-slateink-deep">
              Experience
            </h3>
            <div className="space-y-4">
              {publicExp.map((e) => (
                <div key={e.id} className="grid gap-1 md:grid-cols-[8rem_1fr]">
                  <div className="chapter-num">
                    {e.start} – {e.end || "至今"}
                  </div>
                  <div>
                    <div className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-slateink-deep print:!text-black">
                      {e.org} · {e.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </ContentShell>
  );
}
