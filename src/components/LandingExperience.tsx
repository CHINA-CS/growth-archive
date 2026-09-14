"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { TreeLoader } from "@/components/TreeLoader";

const CrystalWorld = dynamic(
  () => import("@/components/CrystalWorld").then((m) => m.CrystalWorld),
  { ssr: false, loading: () => null }
);

type Props = {
  name: string;
  title: string;
  bio: string;
  featured: { id: string; title: string; summary: string; slug: string; stack: string[] }[];
};

type Phase = "loader" | "portal" | "hero";

/**
 * 流程对齐 2019.makemepulse 实测：
 * 树 loader（灰蓝纸）→ 奶油大圆展开 + 字标 → 圆形 Enter → WebGL 晶体叙事
 */
export function LandingExperience({ name, title, bio, featured }: Props) {
  const [phase, setPhase] = useState<Phase>("loader");
  const [progress, setProgress] = useState(0);
  const [circleIn, setCircleIn] = useState(false);
  const [markIn, setMarkIn] = useState(false);
  const [enterIn, setEnterIn] = useState(false);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 2200);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("portal"), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // portal：圆展开 → 字标 → Enter
  useEffect(() => {
    if (phase !== "portal") return;
    const t1 = setTimeout(() => setCircleIn(true), 40);
    const t2 = setTimeout(() => setMarkIn(true), 700);
    const t3 = setTimeout(() => setEnterIn(true), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase]);

  if (phase === "loader") {
    return (
      <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#6b7288] bg-[url('/mm/background_blue_pattern.jpg')] bg-repeat">
        <TreeLoader progress={progress} />
        <p className="absolute bottom-10 right-10 font-display text-[11px] font-semibold uppercase tracking-wide2 text-[#f4efe4]">
          Best experienced with sound
        </p>
      </div>
    );
  }

  if (phase === "portal") {
    return (
      <div className="fixed inset-0 z-[90] overflow-hidden bg-[#6b7288] bg-[url('/mm/background_blue_pattern.jpg')] bg-repeat">
        {/* 奶油大圆：从中心 scale 展开 */}
        <div
          className="absolute left-1/2 top-1/2 h-[min(92vw,78vh)] w-[min(92vw,78vh)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f3eee3] bg-[url('/mm/background_white_pattern.jpg')] bg-repeat transition-transform duration-[1100ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]"
          style={{
            transform: `translate(-50%, -50%) scale(${circleIn ? 1 : 0.08})`,
            boxShadow: "0 20px 60px rgba(20,30,50,0.18)",
          }}
        />

        {/* 字标 */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
            markIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <p className="chapter-num mb-3 text-[#5b6a8a]">A Personal Growth Tale</p>
          <h1 className="display-xl max-w-[12ch] text-center text-[#5b6a8a]">{name}</h1>
          <p className="mt-3 display-sm text-[#7d8aa3]">{title}</p>
        </div>

        {/* 圆形 Enter —— 对齐原站 circle cursor CTA */}
        <button
          type="button"
          onClick={() => setPhase("hero")}
          className={`absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#3d4a68] bg-[#f3eee3]/90 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#3d4a68] transition-all duration-500 hover:scale-110 hover:bg-[#ebe4d4] ${
            enterIn ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
          }`}
          aria-label="Enter experience"
        >
          Enter
        </button>

        <p className="absolute bottom-10 right-10 font-display text-[11px] font-semibold uppercase tracking-wide2 text-[#ebe4d4]">
          Best experienced with sound
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <CrystalWorld />

      <div className="relative z-10">
        <section className="relative flex min-h-[100vh] flex-col items-center justify-end px-6 pb-[12vh] pt-16 text-center">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,rgba(45,58,82,0.55)_45%,rgba(40,52,74,0.72))]" />
          <div className="relative z-10 flex flex-col items-center">
            <p className="chapter-num mb-3 text-[#f4efe4]/85 drop-shadow-[0_1px_6px_rgba(20,30,50,0.55)]">
              Nomadic Growth · A Personal Tale
            </p>
            <h1 className="display-xl max-w-[14ch] text-[#f8f4ec] drop-shadow-[0_4px_24px_rgba(20,30,50,0.55)]">
              {name}
            </h1>
            <p className="mt-3 display-sm text-[#ebe4d4] drop-shadow-[0_2px_10px_rgba(20,30,50,0.5)]">
              {title}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a href="#chapter-works" className="btn-xp">
                <span className="btn-xp__l" />
                <span className="btn-xp__m">Explore</span>
                <span className="btn-xp__r" />
              </a>
              <Link href="/resume" className="btn-xp btn-xp--ghost">
                <span className="btn-xp__l" />
                <span className="btn-xp__m">Resume</span>
                <span className="btn-xp__r" />
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-[6vh] z-10 flex justify-center">
            <span className="h-10 w-px bg-[#f4efe4]/40" />
          </div>
        </section>

        <section
          id="chapter-works"
          className="relative border-y border-slateink/15 bg-paper/90 py-20"
        >
          <div className="mx-auto max-w-4xl px-6">
            <div className="section-rule mb-8">
              <p className="chapter-num">Chapter 01</p>
              <h2 className="mt-1 display-lg text-slateink-deep">Selected Works</h2>
            </div>
            <div className="space-y-5">
              {featured.length === 0 && (
                <p className="text-[13px] text-slateink">
                  暂无公开项目。到{" "}
                  <Link href="/admin" className="underline">
                    后台
                  </Link>{" "}
                  创建并设为 public。
                </p>
              )}
              {featured.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group flex flex-col gap-2 border border-slateink/35 bg-paper-card/75 px-6 py-5 transition-all hover:-translate-y-0.5 hover:border-slateink hover:bg-paper-card hover:shadow-plate"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="display-md text-slateink-deep">{p.title}</h3>
                    <span className="chapter-num opacity-70">Open →</span>
                  </div>
                  <p className="max-w-2xl text-[12.5px] leading-6 text-slateink">{p.summary}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {p.stack.slice(0, 5).map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/projects" className="btn-tale">
                All works
              </Link>
            </div>
          </div>
        </section>

        <section className="relative border-b border-slateink/15 bg-paper/90 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <div className="section-rule mb-6">
              <p className="chapter-num">Chapter 02</p>
              <h2 className="mt-1 display-lg text-slateink-deep">About the traveler</h2>
            </div>
            <p className="text-[13px] leading-8 text-slateink">{bio}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn-tale">
                About
              </Link>
              <Link href="/skills" className="btn-tale">
                Skills
              </Link>
              <Link href="/timeline" className="btn-tale">
                Timeline
              </Link>
            </div>
          </div>
        </section>

        <section className="relative bg-paper/92 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="section-rule mb-8">
              <p className="chapter-num">Chapter 03</p>
              <h2 className="mt-1 display-lg text-slateink-deep">Continue the journey</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { href: "/tools", label: "Toolkit", desc: "日常工具与场景" },
                { href: "/blog", label: "Notes", desc: "技术笔记 / 学习日志" },
                { href: "/resume", label: "Resume", desc: "在线简历导出" },
                { href: "/projects", label: "Projects", desc: "全部项目" },
                { href: "/skills", label: "Skills", desc: "技能与证明" },
                { href: "/admin", label: "Admin", desc: "本地管理后台" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border border-slateink/35 bg-paper-card/70 px-5 py-5 transition-all hover:-translate-y-0.5 hover:border-slateink hover:shadow-plate"
                >
                  <p className="chapter-num">{item.label}</p>
                  <p className="mt-2 text-[12px] text-slateink">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
