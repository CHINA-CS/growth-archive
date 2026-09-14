import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { loadContent } from "@/lib/content";
import { AmbientCanvas } from "@/components/AmbientCanvas";
import { SiteCursor } from "@/components/SiteCursor";

export function generateMetadata(): Metadata {
  const { profile } = loadContent();
  return {
    title: {
      default: `${profile.name} · ${profile.title}`,
      template: `%s · ${profile.name}`,
    },
    description: profile.bio,
  };
}

const nav = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/skills", label: "技能" },
  { href: "/tools", label: "工具" },
  { href: "/timeline", label: "时间线" },
  { href: "/blog", label: "笔记" },
  { href: "/resume", label: "简历" },
  { href: "/about", label: "关于" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <AmbientCanvas />
        <SiteCursor />
        <div className="relative z-10">
          <header className="sticky top-0 z-40 border-b border-slateink/25 bg-paper/85 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
              <Link href="/" className="group flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center border border-slateink text-[0.55rem] font-bold tracking-wider text-slateink-deep transition-colors group-hover:bg-slateink group-hover:text-paper">
                  GA
                </span>
                <span className="font-display text-[0.7rem] font-bold uppercase tracking-wide3 text-slateink-deep">
                  Growth Archive
                </span>
              </Link>
              <nav className="hidden flex-wrap items-center gap-x-5 gap-y-1 md:flex">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link href="/admin" className="nav-link">
                Admin
              </Link>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-12">{children}</main>
          <footer className="border-t border-slateink/20 py-10 text-center">
            <p className="font-display text-[0.62rem] font-semibold uppercase tracking-wide3 text-slateink-mute">
              Personal growth archive · Defaults to private
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
