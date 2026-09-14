import Link from "next/link";
import { ContentShell, PageHeader } from "@/components/PageChrome";

export default function NotFound() {
  return (
    <ContentShell>
      <PageHeader
        eyebrow="Lost"
        title="这里暂时没有内容"
        lead="页面不存在，或该内容当前为私密。"
      />
      <Link href="/" className="btn-tale">
        返回首页
      </Link>
    </ContentShell>
  );
}
