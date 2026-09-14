/** 仿 2019.makemepulse 的纯 SVG 饰角/边线，不依赖图片 */
export function OrnateCorners({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* 四角短线 */}
      <g stroke="#5b6a8a" strokeWidth="0.6" fill="none" opacity="0.75">
        <path d="M3 10 V3 H12" />
        <path d="M97 10 V3 H88" />
        <path d="M3 90 V97 H12" />
        <path d="M97 90 V97 H88" />
        {/* 角内小点 */}
        <circle cx="6" cy="6" r="0.8" fill="#5b6a8a" stroke="none" />
        <circle cx="94" cy="6" r="0.8" fill="#5b6a8a" stroke="none" />
        <circle cx="6" cy="94" r="0.8" fill="#5b6a8a" stroke="none" />
        <circle cx="94" cy="94" r="0.8" fill="#5b6a8a" stroke="none" />
      </g>
      {/* 顶底中点小饰 */}
      <g stroke="#5b6a8a" strokeWidth="0.5" fill="none" opacity="0.45">
        <path d="M46 3 H54" />
        <path d="M46 97 H54" />
      </g>
    </svg>
  );
}

/** 横向双线分隔 */
export function DoubleRule({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-1 ${className}`} aria-hidden>
      <div className="h-px w-full bg-slateink/60" />
      <div className="h-px w-full bg-slateink/20" />
    </div>
  );
}

/** 侧栏虚线轨（仿 landing 左右装饰条） */
export function SideRail({ side = "left" }: { side?: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-8 bottom-8 w-3 ${
        side === "left" ? "left-0" : "right-0"
      }`}
    >
      <div className="mx-auto h-full w-px bg-[repeating-linear-gradient(180deg,rgba(91,106,138,0.55)_0_5px,transparent_5px_10px)]" />
    </div>
  );
}
