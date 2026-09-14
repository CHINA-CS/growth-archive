import type { Visibility } from "@/lib/types";

const map: Record<Visibility, { label: string; className: string }> = {
  public: { label: "公开", className: "vis-public" },
  unlisted: { label: "不公开列出", className: "vis-unlisted" },
  private: { label: "私密", className: "vis-private" },
};

export function VisibilityBadge({ value }: { value: Visibility }) {
  const item = map[value] ?? map.private;
  return <span className={`vis-badge ${item.className}`}>{item.label}</span>;
}
