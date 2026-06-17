# Simple World 后端 Worker

这是 Simple World 的 Cloudflare Workers + D1 后端项目。

它提供文章、评论、标签接口，并把数据存到 Cloudflare D1 数据库中。

## 技术栈

- Cloudflare Workers：运行后端接口
- D1：Cloudflare 提供的 SQLite 数据库
- TypeScript：给 Worker、D1 查询和接口数据添加类型
- Wrangler：Cloudflare 官方开发和部署工具

## 项目结构

```txt
src/
  index.ts      # Worker 入口，只负责接收请求和兜底错误
  router.ts     # 路由层：判断 URL 应该调用哪个业务函数
  handlers.ts   # 业务层：处理文章、评论、标签逻辑
  db.ts         # 数据库层：集中编写 D1 SQL 查询
  http.ts       # HTTP 工具：JSON 响应、CORS、错误格式
  types.ts      # TypeScript 类型定义
  utils.ts      # 通用工具函数

migrations/
  0001_schema.sql # 建表 SQL
  0002_seed.sql   # 初始化假数据 SQL
```

## 本地启动

第一次启动前安装依赖：

```bash
npm install
```

如果修改过 `wrangler.jsonc` 中的绑定，重新生成类型：

```bash
npx wrangler types
```

应用本地 D1 数据库迁移：

```bash
npx wrangler d1 migrations apply simple-world-db --local
```

启动 Worker：

```bash
npm run dev -- --port 8787
```

本地后端地址：

```txt
http://127.0.0.1:8787
```

API 前缀：

```txt
http://127.0.0.1:8787/api
```

## 常用接口

```txt
GET    /api/articles
POST   /api/articles
GET    /api/articles/:slug
PUT    /api/articles/:slug
DELETE /api/articles/:slug

GET    /api/articles/:slug/comments
POST   /api/articles/:slug/comments
PUT    /api/articles/:slug/comments/:id
DELETE /api/articles/:slug/comments/:id

GET    /api/tags
```

## 本地调试

健康检查：

```bash
curl http://127.0.0.1:8787/
```

查看文章列表：

```bash
curl 'http://127.0.0.1:8787/api/articles?limit=10'
```

创建文章：

```bash
curl -X POST http://127.0.0.1:8787/api/articles \
  -H 'Content-Type: application/json' \
  -d '{"article":{"username":"leo","title":"Hello Worker","description":"D1 demo","body":"Hello Simple World","tagList":["workers","d1"]}}'
```

如果接口返回 500，优先检查：

- `src/handlers.ts`：业务逻辑是否抛错
- `src/db.ts`：SQL 是否写错
- `migrations/`：本地 D1 是否已经建表
- 终端中的 Wrangler 日志

## 类型检查和测试

类型检查：

```bash
npm run typecheck
```

运行测试：

```bash
npm test
```

部署前 dry-run：

```bash
npx wrangler deploy --dry-run
```

## 远程 D1 数据库

当前绑定的数据库：

```txt
database_name = simple-world-db
database_id   = a6d21a51-9192-4a97-a0c7-749bb7a3774e
binding       = DB
```

把迁移应用到远程 D1：

```bash
npx wrangler d1 migrations apply simple-world-db --remote
```

## 部署

登录 Cloudflare：

```bash
npx wrangler login
```

部署 Worker：

```bash
npm run deploy
```

部署完成后，把前端项目里的 `VITE_API_BASE_URL` 改成线上 Worker 地址：

```env
VITE_API_BASE_URL=https://你的-worker域名/api
```
