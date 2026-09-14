import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";

const root = process.cwd();
if (!fs.existsSync(path.join(root, "content", "db.public.json"))) {
  console.error("请先执行 npm run build:public 生成公开内容快照");
  process.exit(1);
}

const env = {
  ...process.env,
  NEXT_PUBLIC_CONTENT_MODE: "public",
  NEXT_OUTPUT: "export",
};

const result = spawnSync("npx", ["next", "build"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 0);
