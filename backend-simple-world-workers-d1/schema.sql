-- 苹果社区最小数据库初始化脚本。
-- 设计目标：
-- 1. 建表和假数据写在同一个文件里，方便新手直接执行。
-- 2. 默认不删除、不更新已有远端数据，避免误覆盖线上内容。
-- 3. 使用 CREATE TABLE IF NOT EXISTS、INSERT OR IGNORE 和 NOT EXISTS，让脚本重复执行也更安全。

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS articles (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	slug TEXT NOT NULL UNIQUE,
	username TEXT NOT NULL,
	title TEXT NOT NULL,
	description TEXT NOT NULL,
	body TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS tags (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS article_tags (
	article_id INTEGER NOT NULL,
	tag_id INTEGER NOT NULL,
	PRIMARY KEY (article_id, tag_id),
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
	FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	article_id INTEGER NOT NULL,
	username TEXT NOT NULL,
	body TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_username ON articles(username);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

INSERT OR IGNORE INTO articles (slug, username, title, description, body, created_at, updated_at)
VALUES
	(
		'ru-he-xie-di-yi-pian-ji-shu-wen-zhang',
		'小李',
		'如何写好第一篇技术文章',
		'把学习过程写下来，就是最好的开始。',
		'很多人觉得技术文章必须非常高级，其实不一定。

你可以先从一次踩坑、一个小工具、一个读书笔记开始。苹果社区希望让写作这件事变得更轻松。',
		'2026-01-20T08:00:00.000Z',
		'2026-01-20T08:00:00.000Z'
	),
	(
		'wo-de-qian-duan-xue-xi-lu-xian',
		'阿明',
		'我的前端学习路线',
		'从 HTML、CSS 到 React，记录一条适合新手的路线。',
		'刚开始学前端时，不要急着追所有新技术。

先把 HTML、CSS、JavaScript 的基础练扎实，再开始学习 React 和工程化工具。',
		'2026-01-21T08:00:00.000Z',
		'2026-01-21T08:00:00.000Z'
	),
	(
		'ping-guo-she-qu-shi-yong-shuo-ming',
		'Leo',
		'苹果社区使用说明',
		'一个轻量的中文文章与评论社区。',
		'苹果社区不需要注册账号。

发布文章或评论时，只需要填写一个用户名。头像会自动使用用户名首字母。',
		'2026-01-22T08:00:00.000Z',
		'2026-01-22T08:00:00.000Z'
	);

INSERT OR IGNORE INTO tags (name)
VALUES
	('技术'),
	('前端'),
	('React'),
	('学习'),
	('社区');

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('技术', '学习')
WHERE articles.slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang';

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('前端', 'React', '学习')
WHERE articles.slug = 'wo-de-qian-duan-xue-xi-lu-xian';

INSERT OR IGNORE INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('社区', '技术')
WHERE articles.slug = 'ping-guo-she-qu-shi-yong-shuo-ming';

INSERT INTO comments (article_id, username, body, created_at, updated_at)
SELECT id, '小王', '这个社区的规则很简单，适合新手练习。', '2026-01-23T08:00:00.000Z', '2026-01-23T08:00:00.000Z'
FROM articles
WHERE slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang'
	AND NOT EXISTS (
		SELECT 1
		FROM comments
		WHERE comments.article_id = articles.id
			AND comments.username = '小王'
			AND comments.body = '这个社区的规则很简单，适合新手练习。'
	);

INSERT INTO comments (article_id, username, body, created_at, updated_at)
SELECT id, '小周', '不用登录就能评论，联调起来很方便。', '2026-01-24T08:00:00.000Z', '2026-01-24T08:00:00.000Z'
FROM articles
WHERE slug = 'wo-de-qian-duan-xue-xi-lu-xian'
	AND NOT EXISTS (
		SELECT 1
		FROM comments
		WHERE comments.article_id = articles.id
			AND comments.username = '小周'
			AND comments.body = '不用登录就能评论，联调起来很方便。'
	);
