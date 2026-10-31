# tvbox-eo（EdgeOne 移植版）

TVBox 源聚合器（blogshare/tvbox-source-aggregator）的腾讯云 EdgeOne Makers 移植版。
业务代码与 Cloudflare 版完全相同，只换了入口和存储适配：

- `src/eo-entry.ts` — 边缘函数入口，导出 `onRequest`，KV 走全局变量 `TVBOX_KV`
- `src/storage/eo-kv.ts` — EdgeOne KV 适配（实现原项目的 Storage 接口）
- `edge-functions/[[path]].js` — esbuild 打包产物（420KB），部署时实际运行的文件

## 部署（EdgeOne Makers 控制台）

1. 创建项目并关联本仓库（或上传代码），构建设置保持默认，输出目录不用填
2. 开通 KV 存储 → 创建命名空间 → 在项目里绑定，变量名必须填 `TVBOX_KV`
3. 项目环境变量：
   - `ADMIN_TOKEN`：管理后台密码（与 CF 版保持一致即可）
   - `WORKER_BASE_URL`：`https://eo.172518.xyz`
4. 绑定自定义域名 `eo.172518.xyz`（全球可用区（不含中国大陆），CNAME 接入），
   然后在 Cloudflare DNS 里给 `eo` 加一条 CNAME 到 EdgeOne 分配的目标
5. 部署完成后，用管理密码调用一次 `POST /refresh` 触发首次聚合；
   之后的每小时聚合由外部定时任务调用 `POST /refresh` 触发

## 重新打包

改了 `src/` 下任何代码后，在原项目依赖下执行：

```bash
npm install --ignore-scripts
./node_modules/.bin/esbuild src/eo-entry.ts --bundle --format=esm --platform=neutral \
  --target=es2022 --alias:fs=./src/stubs/node-fs.js --alias:path=./src/stubs/node-path.js \
  --outfile="edge-functions/[[path]].js"
```
