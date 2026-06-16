---
title: CORS
sidebar_position: 4
---

## 后端处理 [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) 时的注意事项

如果后端运行在与前端不同的主机或端口上，请确保同时处理 `OPTIONS` 请求，并返回正确的 `Access-Control-Allow-Origin` 和 `Access-Control-Allow-Headers`（例如 `Content-Type`）。
