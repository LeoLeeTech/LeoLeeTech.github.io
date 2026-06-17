-- 开启外键约束，这样删除文章时才能自动删除对应评论和标签关系。
PRAGMA foreign_keys = ON;

-- articles：文章主表。
-- username 只是作者名，不对应登录用户，因为 Simple World 没有账号系统。
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

-- tags：标签表。name 唯一，避免出现重复标签。
CREATE TABLE IF NOT EXISTS tags (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE
);

-- article_tags：文章和标签的中间表。
-- 一篇文章可以有多个标签，一个标签也可以属于多篇文章。
CREATE TABLE IF NOT EXISTS article_tags (
	article_id INTEGER NOT NULL,
	tag_id INTEGER NOT NULL,
	PRIMARY KEY (article_id, tag_id),
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
	FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- comments：评论表。评论必须属于某一篇文章。
CREATE TABLE IF NOT EXISTS comments (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	article_id INTEGER NOT NULL,
	username TEXT NOT NULL,
	body TEXT NOT NULL,
	created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
);

-- 索引能让常用查询更快，例如按创建时间排序、按作者过滤。
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_username ON articles(username);
CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
