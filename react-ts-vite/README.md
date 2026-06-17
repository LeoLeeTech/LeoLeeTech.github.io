# 苹果社区前端

这是苹果社区的 React + TypeScript + Vite 前端项目。

它负责展示文章列表、文章详情、标签、评论，以及创建/编辑/删除文章和评论。

## 技术栈

- React：负责页面和交互
- TypeScript：给数据和函数添加类型，减少低级错误
- Vite：负责本地开发服务和打包

## 项目结构

```txt
src/
  api.ts       # 所有后端接口请求都在这里
  App.tsx      # 页面组件和主要交互逻辑
  App.css      # 页面样式
  index.css    # 全局基础样式
  main.tsx     # React 挂载入口
```

## 本地启动

第一次启动前先安装依赖：

```bash
npm install
```

启动前端：

```bash
npm run dev
```

默认访问地址一般是：

```txt
http://127.0.0.1:5173
```

如果端口被占用，Vite 会自动换一个端口，请看终端输出。

## 连接后端

前端默认请求本地 Worker 后端：

```txt
http://127.0.0.1:8787/api
```

如果你想改后端地址，可以复制环境变量示例文件：

```bash
cp .env.example .env.local
```

然后修改 `.env.local`：

```env
VITE_API_BASE_URL=http://127.0.0.1:8787/api
```

注意：Vite 的前端环境变量必须以 `VITE_` 开头。

## 前后端联调顺序

先启动后端：

```bash
cd ../backend-simple-world-workers-d1
npm run dev -- --port 8787
```

再启动前端：

```bash
cd ../react-ts-vite
npm run dev
```

然后打开前端页面，尝试：

- 查看文章列表
- 点击文章详情
- 创建文章
- 编辑文章
- 删除文章
- 添加、编辑、删除评论

## 本地调试

常用调试方式：

- 浏览器控制台：查看前端报错和网络请求
- Network 面板：确认请求是否打到 `http://127.0.0.1:8787/api`
- 后端终端：查看 Worker 是否收到请求
- `src/api.ts`：如果接口地址不对，优先检查这里

## 构建检查

运行类型检查和生产构建：

```bash
npm run build
```

运行 ESLint：

```bash
npm run lint
```

## 部署

前端是静态站点，可以部署到 Vercel、Netlify、Cloudflare Pages 等平台。

构建命令：

```bash
npm run build
```

构建产物目录：

```txt
dist
```

部署时记得配置生产后端地址：

```env
VITE_API_BASE_URL=https://你的-worker域名/api
```
