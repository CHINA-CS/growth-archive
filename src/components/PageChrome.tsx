import Link from "next/link";
import type { ReactNode } from "react";

/** 内页统一壳：纸纹底 + 编辑栅格 + 顶栏留白 */
export function ContentShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="min-h-screen bg-paper bg-[url('/mm/background_white_pattern.jpg')] bg-repeat pt-20">
      <div className={`mx-auto px-6 pb-24 ${wide ? "max-w-6xl" : "max-w-5xl"}`}>{children}</div>
    </div>
  );
}

/** 编辑式页头：眉题 + 大标题 + 双线 + 副文案 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-12 animate-riseIn md:mb-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="chapter-num">{eyebrow}</p>
          <h1 className="mt-3 display-xl !tracking-[0.16em] text-slateink-deep">{title}</h1>
        </div>
        {action}
      </div>
      <div className="mt-6 space-y-[3px]" aria-hidden>
        <div className="h-px w-full bg-slateink/55" />
        <div className="h-px w-full bg-slateink/20" />
      </div>
      {lead && <p className="mt-6 max-w-2xl text-[13px] leading-7 text-slateink">{lead}</p>}
    </header>
  );
}

/** 列表行：大序号 + 标题栏，替代小卡片网格 */
export function IndexRow({
  index,
  href,
  title,
  meta,
  excerpt,
  tags,
  trailing,
}: {
  index: number;
  href?: string;
  title: string;
  meta?: string;
  excerpt?: string;
  tags?: string[];
  trailing?: ReactNode;
}) {
  const inner = (
    <div className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-b border-slateink/20 px-1 py-7 transition-colors hover:bg-paper-card/70 md:grid-cols-[4rem_1fr_auto] md:items-start">
      <span className="font-display text-2xl font-bold leading-none tracking-tight text-slateink/25 transition-colors group-hover:text-slateink/50 md:text-3xl">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="display-md !tracking-[0.12em] text-slateink-deep">{title}</h2>
          {meta && <span className="chapter-num !tracking-[0.2em]">{meta}</span>}
        </div>
        {excerpt && (
          <p className="mt-2 max-w-2xl text-[12.5px] leading-6 text-slateink">{excerpt}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="col-start-2 md:col-start-3 md:pt-1">{trailing}</div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-slateink">
        {inner}
      </Link>
    );
  }
  return inner;
}

/** 侧栏元数据块（详情页） */
export function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slateink/15 py-3">
      <div className="chapter-num !text-[9px]">{label}</div>
      <div className="mt-1 text-[12.5px] leading-5 text-slateink-deep">{value || "—"}</div>
    </div>
  );
}

/** 空状态 */
export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <div className="border border-dashed border-slateink/30 px-6 py-12 text-center">
      <p className="text-[13px] text-slateink">{children}</p>
    </div>
  );
}

/** 返回链接 */
export function BackLink({ href = "/", label = "返回首页" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="nav-link mb-8 inline-block">
      ← {label}
    </Link>
  );
}
