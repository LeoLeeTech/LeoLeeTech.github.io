## 技术栈

- Cloudflare Workers：运行后端接口
- D1：Cloudflare 提供的 SQLite 数据库
- TypeScript：给 Worker 代码添加类型提示，减少低级错误

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

schema.sql      # 建表语句和初始化假数据，全部写在这一个文件里
wrangler.jsonc  # Cloudflare Worker 和 D1 绑定配置
```

## 为什么现在默认连接远程 D1？

Cloudflare Wrangler 为了保护线上数据，`wrangler dev` 默认使用本地 D1。这样本地调试时即使误删数据，也不会影响远端数据库。

这个项目现在按你的需求改成了默认连接远程 D1：

- `package.json` 里的 `npm run dev` 和 `npm start` 都执行 `wrangler dev --remote`
- `wrangler.jsonc` 里的 D1 绑定也设置了 `"remote": true`

也就是说，本地启动 Worker 后，前端新增、编辑、删除文章和评论，都会直接写入 Cloudflare 远程 D1。

## 安装依赖

```bash
npm install
```

如果修改过 `wrangler.jsonc` 中的绑定，重新生成类型：

```bash
npx wrangler types
```

## 初始化数据库

这个项目不使用 migrations，只保留一个最基础的 SQL 文件：`schema.sql`。

初始化远程 D1：

```bash
npm run db:init:remote
```

初始化本地 D1：

```bash
npm run db:init:local
```

`schema.sql` 默认使用 `CREATE TABLE IF NOT EXISTS`、`INSERT OR IGNORE` 和 `NOT EXISTS`，所以重复执行时不会主动删除、清空、更新已有数据，也不会重复插入内置评论。

## 启动项目

默认连接远程 D1：

```bash
npm run dev -- --port 8787
```

如果你临时想使用本地 D1，执行下面这个命令。它会通过 `--local` 关闭远程绑定：

```bash
npm run dev:local -- --port 8787
```

本地后端地址：

```txt
http://127.0.0.1:8787
```

API 前缀：

```txt
http://127.0.0.1:8787/api
```

## 什么操作会覆盖远端？

只要命令里带了 `--remote`，或者启动的是远程绑定模式，本地操作就会直接作用到 Cloudflare 远程 D1。

会修改远端数据的典型情况：

- 执行 `wrangler d1 execute simple-world-db --remote --file ./某个.sql`
- 这个 SQL 文件里包含 `DROP TABLE`、`DELETE`、`UPDATE`、`INSERT` 等写入语句
- 使用 `npm run dev` 启动后，在页面上新增、编辑、删除文章或评论
- 通过 curl、Postman 或前端调用 `POST`、`PUT`、`DELETE` 接口

之前远端内容会被改，是因为执行过远程 D1 SQL，并且旧 SQL 里有 `UPDATE`、`DELETE` 这类会改已有数据的语句。D1 会忠实执行这些 SQL，所以看起来就像“覆盖了远端”。

## 怎么避免覆盖远端？

- 日常练习优先用 `npm run dev:local`，让数据写到本地 D1
- 不要对远程 D1 执行包含 `DROP TABLE`、`DELETE`、`UPDATE` 的 SQL
- 初始化脚本尽量使用 `CREATE TABLE IF NOT EXISTS` 和 `INSERT OR IGNORE`
- 真要清空远端前，先在 Cloudflare 控制台或 Wrangler 中确认数据库和命令

## 类型检查和测试

类型检查：

```bash
npm run typecheck
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
remote        = true
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
