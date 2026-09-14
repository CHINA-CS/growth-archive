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

/**
 * 全屏 3D 叙事：loader → WebGL 晶体 hero → 章节内容
 * 3D 为主视觉，2D 只做纸感编辑层
 */
export function LandingExperience({ name, title, bio, featured }: Props) {
  const [phase, setPhase] = useState<"loader" | "hero">("loader");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 2400);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("hero"), 220);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

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

  return (
    <div className="relative">
      {/* 固定全屏 3D 世界 */}
      <CrystalWorld />

      {/* 浮层内容：与 3D 分层，保证可读 */}
      <div className="relative z-10">
        {/* Hero：晶体占上半，标题压在水面暗带 — 对齐原站字标位置 */}
        <section className="relative flex min-h-[100vh] flex-col items-center justify-end px-6 pb-[12vh] pt-16 text-center">
          {/* 底部压暗，保证字标对比 */}
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

        {/* Chapter 01 — Works */}
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
                  暂无公开项目。到 <Link href="/admin" className="underline">后台</Link> 创建并设为 public。
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

        {/* Chapter 02 — Intro */}
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

        {/* Chapter 03 — Index */}
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
