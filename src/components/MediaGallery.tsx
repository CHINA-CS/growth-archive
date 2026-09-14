import type { MediaItem } from "@/lib/types";
import { OrnateCorners } from "@/components/Ornate";

export function MediaGallery({ items }: { items: MediaItem[] }) {
  if (!items.length) {
    return <p className="text-sm text-slateink-soft">暂无关联素材。</p>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((m) => (
        <article key={m.id} className="plate plate-hover plate-corners relative overflow-hidden">
          <MediaPreview item={m} />
          <div className="p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-slateink-deep">
              {m.title}
            </h3>
            <p className="mt-1 text-sm text-slateink">{m.description}</p>
            {m.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function MediaPreview({ item }: { item: MediaItem }) {
  if (item.kind === "image" || item.kind === "blueprint") {
    if (!item.path) {
      return (
        <div className="flex h-40 items-center justify-center border-b border-slateink/25 bg-[linear-gradient(160deg,rgba(168,192,212,0.35),rgba(228,184,180,0.25))]">
          <span className="chapter-num">Screenshot</span>
        </div>
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/media/${item.path}`} alt={item.title} className="h-48 w-full object-cover" />
    );
  }

  if (item.kind === "video") {
    return (
      <video controls className="h-48 w-full bg-slateink-deep object-cover" src={`/media/${item.path}`}>
        您的浏览器不支持视频播放
      </video>
    );
  }

  if (item.kind === "code") {
    return (
      <div className="border-b border-slateink/25 bg-paper-deep/60 px-5 py-4">
        <div className="chapter-num">
          {item.language || "code"} · {item.path}
        </div>
        <a href={`/media/${item.path}`} className="nav-link mt-2 inline-block">
          查看 / 下载代码
        </a>
      </div>
    );
  }

  return (
    <div className="flex h-24 items-center justify-center border-b border-slateink/25 bg-paper-warm/50 px-4 text-sm text-slateink">
      附件：{item.title}
    </div>
  );
}
