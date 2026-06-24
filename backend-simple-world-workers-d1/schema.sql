-- 简单论坛最小数据库初始化脚本。
-- 设计目标：
-- 1. 建表和假数据写在同一个文件里，方便新手直接执行。
-- 2. 默认不删除、不更新已有远端数据，避免误覆盖线上内容。
-- 3. 使用 CREATE TABLE 、INSERT  和 NOT EXISTS，让脚本重复执行也更安全。
PRAGMA foreign_keys = ON;

CREATE TABLE
	articles (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		slug TEXT NOT NULL UNIQUE,
		username TEXT NOT NULL,
		title TEXT NOT NULL,
		body TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%fZ', 'now')),
		updated_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%fZ', 'now'))
	);

CREATE TABLE
	tags (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE
	);

CREATE TABLE
	article_tags (
		article_id INTEGER NOT NULL,
		tag_id INTEGER NOT NULL,
		PRIMARY KEY (article_id, tag_id),
		FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
		FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
	);

CREATE TABLE
	comments (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		article_id INTEGER NOT NULL,
		username TEXT NOT NULL,
		body TEXT NOT NULL,
		created_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%fZ', 'now')),
		updated_at TEXT NOT NULL DEFAULT (strftime ('%Y-%m-%dT%H:%M:%fZ', 'now')),
		FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
	);

CREATE INDEX idx_articles_created_at ON articles (created_at DESC);

CREATE INDEX idx_articles_username ON articles (username);

CREATE INDEX idx_comments_article_id ON comments (article_id);

CREATE INDEX idx_tags_name ON tags (name);

INSERT INTO
	articles (
		slug,
		username,
		title,
		body,
		created_at,
		updated_at
	)
VALUES
	(
		'ru-he-xie-di-yi-pian-ji-shu-wen-zhang',
		'小李',
		'如何写好第一篇技术文章',
		'很多人觉得技术文章必须非常高级，其实不一定。

你可以先从一次踩坑、一个小工具、一个读书笔记开始。简单论坛希望让写作这件事变得更轻松。',
		'2026-01-20T08:00:00.000Z',
		'2026-01-20T08:00:00.000Z'
	),
	(
		'wo-de-qian-duan-xue-xi-lu-xian',
		'阿明',
		'我的前端学习路线',
		'刚开始学前端时，不要急着追所有新技术。

先把 HTML、CSS、JavaScript 的基础练扎实，再开始学习 React 和工程化工具。',
		'2026-01-21T08:00:00.000Z',
		'2026-01-21T08:00:00.000Z'
	),
	(
		'ping-guo-she-qu-shi-yong-shuo-ming',
		'Leo',
		'简单论坛使用说明',
		'简单论坛不需要注册账号。

发布文章或评论时，只需要填写一个用户名。头像会自动使用用户名最后一个字。',
		'2026-01-22T08:00:00.000Z',
		'2026-01-22T08:00:00.000Z'
	),
	(
		'article-001',
		'小李',
		'如何写好第一篇技术文章',
		'写技术文章不需要完美，先完成比完美更重要。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-002',
		'小李',
		'学习编程的正确方式',
		'先理解整体，再深入细节。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-003',
		'小李',
		'为什么要记录学习过程',
		'记录可以帮助你复盘和提升。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-004',
		'小李',
		'Java 入门建议',
		'掌握语法只是第一步。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-005',
		'小李',
		'React 学习路径',
		'先学组件，再学状态管理。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-006',
		'小李',
		'前端开发核心认知',
		'DOM 和事件是核心。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-007',
		'小李',
		'后端开发入门',
		'关注数据和接口。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-008',
		'小李',
		'什么是好的代码',
		'代码是写给人看的。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-009',
		'小李',
		'如何提高编码效率',
		'工具很重要。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-010',
		'小李',
		'Git 基础使用',
		'学会 commit 和 branch。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-011',
		'小李',
		'理解 HTTP 协议',
		'前后端通信基础。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-012',
		'小李',
		'数据库入门',
		'表设计很重要。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-013',
		'小李',
		'SQL 基础语法',
		'CRUD 是核心。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-014',
		'小李',
		'为什么学习框架',
		'框架不是全部。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-015',
		'小李',
		'Spring Boot 简介',
		'约定优于配置。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-016',
		'小李',
		'REST API 设计',
		'保持一致性。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-017',
		'小李',
		'调试技巧总结',
		'日志很重要。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-018',
		'小李',
		'如何解决 bug',
		'一步一步排查。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-019',
		'小李',
		'代码重构原则',
		'不改变功能。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-020',
		'小李',
		'前端状态管理',
		'理解单向数据流。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-021',
		'小李',
		'异步编程理解',
		'避免回调地狱。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-022',
		'小李',
		'Node.js 基础',
		'服务端 JS 环境。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-023',
		'小李',
		'npm 使用技巧',
		'依赖管理核心。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-024',
		'小李',
		'pnpm 为什么更快',
		'节省空间。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-025',
		'小李',
		'TypeScript 入门',
		'减少运行错误。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-026',
		'小李',
		'设计系统思维',
		'组件复用。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-027',
		'小李',
		'前端性能优化',
		'减少请求。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-028',
		'小李',
		'浏览器缓存机制',
		'减少重复加载。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-029',
		'小李',
		'跨域问题解决',
		'理解浏览器限制。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-030',
		'小李',
		'安全基础',
		'防止攻击。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-031',
		'小李',
		'微服务概念',
		'独立部署。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-032',
		'小李',
		'Docker 入门',
		'环境一致性。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-033',
		'小李',
		'CI/CD 基础',
		'减少人工操作。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-034',
		'小李',
		'Linux 基础命令',
		'开发必备。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-035',
		'小李',
		'Shell 脚本',
		'提高效率。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-036',
		'小李',
		'接口测试',
		'验证 API。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-037',
		'小李',
		'单元测试',
		'保证质量。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-038',
		'小李',
		'代码规范',
		'统一风格。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-039',
		'小李',
		'日志系统设计',
		'记录关键点。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-040',
		'小李',
		'系统架构基础',
		'职责分离。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-041',
		'小李',
		'高并发基础',
		'理解并发。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-042',
		'小李',
		'锁机制',
		'避免冲突。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-043',
		'小李',
		'缓存设计',
		'提升性能。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-044',
		'小李',
		'消息队列',
		'解耦系统。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-045',
		'小李',
		'Elasticsearch 简介',
		'快速查询。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-046',
		'小李',
		'前端路由',
		'页面切换。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-047',
		'小李',
		'React Hooks',
		'简化状态。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-048',
		'小李',
		'Vue vs React',
		'选择框架。',
		'2026-06-17',
		'2026-06-17'
	),
	(
		'article-100',
		'小李',
		'总结与复盘',
		'不断优化自己。',
		'2026-06-17',
		'2026-06-17'
	);

INSERT INTO
	tags (name)
VALUES
	('技术'),
	('前端'),
	('React'),
	('学习'),
	('社区');

INSERT INTO
	article_tags (article_id, tag_id)
SELECT
	articles.id,
	tags.id
FROM
	articles
	JOIN tags ON tags.name IN ('技术', '学习')
WHERE
	articles.slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang';

INSERT INTO
	article_tags (article_id, tag_id)
SELECT
	articles.id,
	tags.id
FROM
	articles
	JOIN tags ON tags.name IN ('前端', 'React', '学习')
WHERE
	articles.slug = 'wo-de-qian-duan-xue-xi-lu-xian';

INSERT INTO
	article_tags (article_id, tag_id)
SELECT
	articles.id,
	tags.id
FROM
	articles
	JOIN tags ON tags.name IN ('社区', '技术')
WHERE
	articles.slug = 'ping-guo-she-qu-shi-yong-shuo-ming';

INSERT INTO
	comments (
		article_id,
		username,
		body,
		created_at,
		updated_at
	)
SELECT
	id,
	'小王',
	'这个社区的规则很简单，适合新手练习。',
	'2026-01-23T08:00:00.000Z',
	'2026-01-23T08:00:00.000Z'
FROM
	articles
WHERE
	slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang'
	AND NOT EXISTS (
		SELECT
			1
		FROM
			comments
		WHERE
			comments.article_id = articles.id
			AND comments.username = '小王'
			AND comments.body = '这个社区的规则很简单，适合新手练习。'
	);

INSERT INTO
	comments (
		article_id,
		username,
		body,
		created_at,
		updated_at
	)
SELECT
	id,
	'小周',
	'不用登录就能评论，联调起来很方便。',
	'2026-01-24T08:00:00.000Z',
	'2026-01-24T08:00:00.000Z'
FROM
	articles
WHERE
	slug = 'wo-de-qian-duan-xue-xi-lu-xian'
	AND NOT EXISTS (
		SELECT
			1
		FROM
			comments
		WHERE
			comments.article_id = articles.id
			AND comments.username = '小周'
			AND comments.body = '不用登录就能评论，联调起来很方便。'
	);

