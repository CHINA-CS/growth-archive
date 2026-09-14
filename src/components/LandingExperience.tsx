"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  name: string;
  title: string;
  bio: string;
  featured: { id: string; title: string; summary: string; slug: string; stack: string[] }[];
};

/**
 * 全屏沉浸式入口：灰蓝 loader → 奶油纸 landing 三栏插画框 → 章节引导
 * 视觉素材直接使用 2019.makemepulse 同源边框/纸纹/按钮切图
 */
export function LandingExperience({ name, title, bio, featured }: Props) {
  const [phase, setPhase] = useState<"loader" | "landing" | "entered">("loader");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 2200);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setPhase("landing"), 280);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "loader") {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#6b7288] bg-[url('/mm/background_blue_pattern.jpg')] bg-repeat">
        <div className="relative flex h-[280px] w-2 flex-col justify-end overflow-hidden opacity-90">
          <div
            className="w-full origin-bottom bg-[#f4efe4] transition-transform duration-100"
            style={{ height: `${progress * 100}%` }}
          />
          <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
        </div>
        <p className="absolute bottom-10 right-10 flex items-center gap-3 font-display text-[11px] font-semibold uppercase tracking-wide2 text-[#f4efe4]">
          <span className="flex h-3 items-end gap-[2px]" aria-hidden>
            {[3, 8, 5, 10].map((h, i) => (
              <span key={i} className="w-[2px] bg-[#f4efe4]" style={{ height: h }} />
            ))}
          </span>
          Best experienced on desktop
        </p>
      </div>
    );
  }

  if (phase === "landing") {
    return (
      <div className="relative min-h-[calc(100vh-0px)] w-full overflow-hidden bg-paper bg-[url('/mm/background_white_pattern.jpg')] bg-repeat">
        {/* 三栏构图：左右饰框 + 中央主图 + 底部字标 */}
        <div className="relative mx-auto flex min-h-[100vh] w-full max-w-[1180px] items-center justify-center px-4 py-10">
          <div className="relative grid w-full grid-cols-1 gap-3 lg:grid-cols-[18%_58%_18%] lg:gap-0">
            {/* 左栏 */}
            <div className="relative hidden min-h-[520px] lg:block">
              <div
                className="absolute inset-0 bg-[url('/mm/left-block-borders.png')] bg-cover bg-center"
                style={{ filter: "none" }}
              />
              <div className="absolute inset-[6%] overflow-hidden">
                <div className="h-full w-full bg-[linear-gradient(180deg,#8a94b0_0%,#6d7a96_45%,#5d6d8c_100%)] opacity-90" />
                <div className="absolute inset-0 bg-[url('/mm/left-tex-bg.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-[url('/mm/left-tex-fg.png')] bg-cover bg-center opacity-55 mix-blend-multiply" />
              </div>
            </div>

            {/* 中央主块 */}
            <div className="relative z-10 min-h-[420px] lg:min-h-[560px]">
              {/* 主插画：用 center-block 切图 + 拱形遮罩感 */}
              <div className="relative mx-auto h-full w-full overflow-hidden border-[1.5px] border-[#5b6a8a]">
                <div className="absolute inset-0 bg-[url('/mm/center-block_img.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(240,212,208,0.2),rgba(168,192,212,0.12)_40%,rgba(91,106,138,0.25))]" />
                {/* 左右角饰 */}
                <div className="absolute left-0 top-[12%] h-[62%] w-[7%] bg-[url('/mm/center-corner-left.png')] bg-contain bg-left bg-no-repeat" />
                <div className="absolute right-0 top-[12%] h-[62%] w-[7%] bg-[url('/mm/center-corner-right.png')] bg-contain bg-right bg-no-repeat" />
                {/* 竖条 */}
                <div className="absolute left-[8%] top-[18%] h-[58%] w-[1.2%] bg-[url('/mm/center-bar-left.png')] bg-contain bg-no-repeat" />
                <div className="absolute right-[8%] top-[18%] h-[58%] w-[1.2%] bg-[url('/mm/center-bar-right.png')] bg-contain bg-no-repeat" />

                {/* 中央内容浮层 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                  <div className="relative z-10 flex h-28 w-20 items-center justify-center md:h-36 md:w-28">
                    <svg viewBox="0 0 80 120" className="h-full w-full drop-shadow-sm" aria-hidden>
                      <defs>
                        <linearGradient id="cry" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#cfe0ee" stopOpacity="0.95" />
                          <stop offset="55%" stopColor="#a8c4d8" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#8aa8c4" stopOpacity="0.7" />
                        </linearGradient>
                      </defs>
                      <path d="M40 4 L58 36 L52 108 L28 108 L22 36 Z" fill="url(#cry)" stroke="#3d4a68" strokeWidth="1.2" />
                      <path d="M40 4 L40 108" stroke="#f4efe4" strokeWidth="0.8" opacity="0.5" />
                      <path d="M28 48 L52 42" stroke="#f4efe4" strokeWidth="0.6" opacity="0.35" />
                    </svg>
                  </div>
                  {/* 底部加深，保证中文名对比度 */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(61,74,104,0.5)_40%,rgba(45,58,82,0.7))]" />
                  <div className="relative z-10 mt-auto w-full pb-10">
                    <p className="chapter-num mb-2 !text-[#f4efe4]/80">A Personal Growth Tale</p>
                    <h1 className="display-xl mx-auto max-w-[16ch] text-[#f8f4ec] drop-shadow-[0_2px_10px_rgba(20,30,50,0.5)]">
                      {name || "Growth"}
                    </h1>
                    <p className="mt-3 display-sm !text-[#ebe4d4] drop-shadow-[0_1px_6px_rgba(20,30,50,0.45)]">
                      {title}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                      <button type="button" onClick={() => setPhase("entered")} className="btn-xp">
                        <span className="btn-xp__l" />
                        <span className="btn-xp__m">Enter</span>
                        <span className="btn-xp__r" />
                      </button>
                      <Link href="/resume" className="btn-xp btn-xp--ghost">
                        <span className="btn-xp__l" />
                        <span className="btn-xp__m">Resume</span>
                        <span className="btn-xp__r" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右栏 */}
            <div className="relative hidden min-h-[520px] lg:block">
              <div className="absolute inset-0 bg-[url('/mm/right-block-borders.png')] bg-cover bg-center" />
              <div className="absolute inset-[8%] overflow-hidden">
                <div className="h-full w-full bg-[url('/mm/right-tex-bg.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-[url('/mm/right-tex-fg.png')] bg-cover bg-center opacity-55 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>

        {/* 底部植物角标 */}
        <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-28 bg-[url('/mm/bottom-left-borders.png')] bg-contain bg-left-bottom bg-no-repeat opacity-80" />
        <div className="pointer-events-none absolute bottom-4 right-4 h-16 w-28 bg-[url('/mm/bottom-right-borders.png')] bg-contain bg-right-bottom bg-no-repeat opacity-80" />

        {/* 音频提示位：改为滚动提示 */}
        <p className="absolute bottom-8 right-10 font-display text-[10px] font-semibold uppercase tracking-wide2 text-slateink">
          Click Enter to explore
        </p>
      </div>
    );
  }

  // entered：章节式内容，全宽叙事而非 PPT 卡片墙
  return (
    <div className="space-y-0">
      <section className="relative border-b border-slateink/20 bg-paper bg-[url('/mm/background_white_pattern.jpg')] bg-repeat py-16">
        <div className="mx-auto max-w-3xl px-6">
          <p className="chapter-num">Chapter 01 — Intro</p>
          <h2 className="mt-2 display-lg text-slateink-deep">{name}</h2>
          <p className="mt-4 text-[13px] leading-8 text-slateink">{bio}</p>
          <div className="mt-8 flex gap-3">
            <Link href="/projects" className="btn-xp">
              <span className="btn-xp__l" />
              <span className="btn-xp__m">Works</span>
              <span className="btn-xp__r" />
            </Link>
            <Link href="/about" className="btn-tale">
              About
            </Link>
          </div>
        </div>
        {/* 叙事竖线 */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-slateink/20 lg:block" />
      </section>

      <section className="relative border-b border-slateink/20 bg-[#6b7288] bg-[url('/mm/background_blue_pattern.jpg')] bg-repeat py-20">
        <div className="mx-auto max-w-4xl px-6">
          <p className="chapter-num !text-[#ebe4d4]/70">Chapter 02 — Selected Works</p>
          <h2 className="mt-2 display-lg text-[#f4efe4]">精选作品</h2>
          <div className="mt-10 space-y-6">
            {featured.length === 0 && (
              <p className="text-sm text-[#ebe4d4]">暂无公开项目。到后台创建并设为 public。</p>
            )}
            {featured.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group block border border-[#f4efe4]/25 bg-[#f4efe4]/5 px-6 py-5 transition-colors hover:bg-[#f4efe4]/10"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="display-md text-[#f4efe4]">{p.title}</h3>
                  <span className="chapter-num !text-[#ebe4d4]/60">View →</span>
                </div>
                <p className="mt-2 max-w-2xl text-[12px] leading-6 text-[#ebe4d4]/85">{p.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.stack.slice(0, 5).map((s) => (
                    <span key={s} className="chip !border-[#f4efe4]/35 !text-[#f4efe4] !bg-transparent">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-paper bg-[url('/mm/background_white_pattern.jpg')] bg-repeat py-20">
        <div className="mx-auto grid max-w-4xl gap-10 px-6 md:grid-cols-3">
          {[
            { href: "/skills", label: "Skills", desc: "技能与证明" },
            { href: "/timeline", label: "Timeline", desc: "成长节点" },
            { href: "/blog", label: "Notes", desc: "技术笔记" },
            { href: "/tools", label: "Toolkit", desc: "工具箱" },
            { href: "/resume", label: "Resume", desc: "在线简历" },
            { href: "/admin", label: "Admin", desc: "本地后台" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border border-slateink/40 bg-paper-card/60 px-5 py-6 transition-all hover:-translate-y-0.5 hover:border-slateink hover:shadow-plate"
            >
              <p className="chapter-num">{item.label}</p>
              <p className="mt-2 text-[12px] text-slateink">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
