# 个人技术成长记录站

本地优先的作品集 / 成长档案：可视化后台维护内容，默认私密，公开构建只包含 public/unlisted。

## 快速开始

```powershell
cd portfolio
npm install
npm run seed      # 写入示例内容（可选）
npm run dev       # http://localhost:3000
```

- 公开站：http://localhost:3000  
- 管理后台：http://localhost:3000/admin  
- 默认管理密码：`admin123`（可用环境变量 `ADMIN_PASSWORD` 修改）

## 内容与权限

- 所有新建内容默认 **private**
- 仅 `public` / `unlisted` 会进入公开构建
- 媒体上传到 `content/media/uploads/`，并同步到 `public/media/` 供本地预览

## 公开静态导出

```powershell
npm run build:public
# 产物在 out/（需在 package.json 中配合 NEXT_OUTPUT=export，见 next.config.mjs）
```

生成 `content/db.public.json`（已过滤 private）并复制公开媒体。

若要完整静态导出：

```powershell
$env:NEXT_PUBLIC_CONTENT_MODE="public"
$env:NEXT_OUTPUT="export"
npm run build
# 得到 out/
```

## 目录

- `content/db.json` — 全量内容（含私密）
- `content/media/` — 原始上传文件
- `src/app` — 页面与 API
- `网站计划书.md` — 上级目录中的需求计划
