import type { Metadata } from "next";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { loadContent } from "@/lib/content";
import { AmbientCanvas } from "@/components/AmbientCanvas";
import { SiteCursor } from "@/components/SiteCursor";

/** Gotham 开源近似：Montserrat（几何无衬线） */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

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
    <html lang="zh-CN" className={montserrat.variable}>
      <body className="min-h-screen">
        <AmbientCanvas />
        <SiteCursor />
        <div className="relative z-10">
          <header className="absolute inset-x-0 top-0 z-30 border-b border-slateink/10 bg-transparent">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
              <Link href="/" className="group flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center border border-slateink/70 text-[9px] font-bold tracking-wider text-slateink-deep transition-colors group-hover:bg-slateink group-hover:text-paper">
                  GA
                </span>
                <span className="display-sm text-slateink-deep">Growth Archive</span>
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
          <main className="min-h-[70vh] [&>*:not(:first-child)]:mx-auto [&>*:not(:first-child)]:max-w-6xl [&>*:not(:first-child)]:px-6 [&>*:not(:first-child)]:py-12">
            {children}
          </main>
          <footer className="border-t border-slateink/20 py-8 text-center">
            <p className="chapter-num !tracking-wide3">
              Personal growth archive · Defaults to private
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
