"use client";

/**
 * 极简树加载器：主干 + 若干枝，自下而上按 progress 填充
 * 风格对齐纸纹站：奶油线条、灰蓝底
 */
export function TreeLoader({ progress }: { progress: number }) {
  // 0→1，剪裁窗口从底向上
  const fill = Math.min(1, Math.max(0, progress));
  const clipId = "tree-fill-clip";

  return (
    <div className="relative flex flex-col items-center gap-6">
      <svg
        viewBox="0 0 120 200"
        className="h-[240px] w-auto"
        aria-label="加载中"
        role="img"
      >
        <defs>
          {/* 自下而上的填充裁切 */}
          <clipPath id={clipId}>
            <rect x="0" y={200 - fill * 200} width="120" height={fill * 200 + 0.5} />
          </clipPath>
        </defs>

        {/* 底稿：淡线轮廓 */}
        <g
          fill="none"
          stroke="rgba(244,239,228,0.28)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <TreePaths />
        </g>

        {/* 填充层：奶油白，随 progress 从底部长出 */}
        <g
          fill="none"
          stroke="#f4efe4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={`url(#${clipId})`}
        >
          <TreePaths />
        </g>

        {/* 根部小土丘 */}
        <path
          d="M40 188 Q60 180 80 188"
          fill="none"
          stroke="rgba(244,239,228,0.45)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>

      <p className="font-display text-[10px] font-bold uppercase tracking-wide3 text-[#ebe4d4]/80">
        {Math.round(fill * 100)}%
      </p>
    </div>
  );
}

function TreePaths() {
  return (
    <>
      {/* 主干 */}
      <path d="M60 185 V70" />
      {/* 主干微微弯曲 */}
      <path d="M60 140 Q58 120 60 100" opacity="0.001" />
      {/* 左下大枝 */}
      <path d="M60 160 Q42 148 28 128" />
      {/* 右下大枝 */}
      <path d="M60 150 Q78 138 94 120" />
      {/* 左中枝 */}
      <path d="M60 128 Q46 116 34 98" />
      <path d="M40 108 Q32 100 26 96" />
      {/* 右中枝 */}
      <path d="M60 118 Q74 106 88 90" />
      <path d="M82 98 Q90 92 96 90" />
      {/* 左上枝 */}
      <path d="M60 100 Q50 88 42 72" />
      <path d="M46 78 Q40 72 36 68" />
      {/* 右上枝 */}
      <path d="M60 92 Q72 80 82 66" />
      <path d="M76 72 Q82 66 86 64" />
      {/* 顶梢 */}
      <path d="M60 70 Q58 58 62 48" />
      <path d="M62 48 Q64 42 60 36" />
      <path d="M62 52 Q70 46 74 40" />
      <path d="M58 58 Q50 52 46 46" />
      {/* 细梢点 */}
      <path d="M28 128 L24 122" />
      <path d="M94 120 L98 114" />
      <path d="M34 98 L30 94" />
      <path d="M88 90 L92 86" />
    </>
  );
}
