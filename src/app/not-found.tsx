import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-center">
      <p className="chapter-num">Lost</p>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide2 text-slateink-deep">
        这里暂时没有内容
      </h1>
      <p className="max-w-md text-sm text-slateink">页面不存在，或该内容当前为私密。</p>
      <Link href="/" className="btn-tale">
        返回首页
      </Link>
    </div>
  );
}
