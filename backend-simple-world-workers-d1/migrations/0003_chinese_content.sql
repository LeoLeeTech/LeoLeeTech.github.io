-- 把早期英文演示数据升级为面向中文社区的内容。
-- 这个 migration 是幂等的：已经是中文数据时，再执行也不会重复插入文章。

UPDATE articles
SET
	slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang',
	username = '小李',
	title = '如何写好第一篇技术文章',
	description = '把学习过程写下来，就是最好的开始。',
	body = '很多人觉得技术文章必须非常高级，其实不一定。

你可以先从一次踩坑、一个小工具、一个读书笔记开始。苹果社区希望让写作这件事变得更轻松。'
WHERE slug IN ('how-to-build-webapps-that-scale', 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang');

UPDATE articles
SET
	slug = 'wo-de-qian-duan-xue-xi-lu-xian',
	username = '阿明',
	title = '我的前端学习路线',
	description = '从 HTML、CSS 到 React，记录一条适合新手的路线。',
	body = '刚开始学前端时，不要急着追所有新技术。

先把 HTML、CSS、JavaScript 的基础练扎实，再开始学习 React 和工程化工具。'
WHERE slug IN ('the-song-you', 'wo-de-qian-duan-xue-xi-lu-xian');

UPDATE articles
SET
	slug = 'ping-guo-she-qu-shi-yong-shuo-ming',
	username = 'Leo',
	title = '苹果社区使用说明',
	description = '一个轻量的中文文章与评论社区。',
	body = '苹果社区不需要注册账号。

发布文章或评论时，只需要填写一个用户名。头像会自动使用用户名首字母。'
WHERE slug IN ('simple-world-notes', 'ping-guo-she-qu-shi-yong-shuo-ming');

INSERT OR IGNORE INTO tags (name)
VALUES
	('技术'),
	('前端'),
	('React'),
	('学习'),
	('社区');

DELETE FROM article_tags
WHERE article_id IN (
	SELECT id
	FROM articles
	WHERE slug IN (
		'ru-he-xie-di-yi-pian-ji-shu-wen-zhang',
		'wo-de-qian-duan-xue-xi-lu-xian',
		'ping-guo-she-qu-shi-yong-shuo-ming'
	)
);

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

UPDATE comments
SET username = '小王',
	body = '这个社区的规则很简单，适合新手练习。'
WHERE article_id = (
	SELECT id
	FROM articles
	WHERE slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang'
)
AND id = (
	SELECT MIN(id)
	FROM comments
	WHERE article_id = (
		SELECT id
		FROM articles
		WHERE slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang'
	)
);

UPDATE comments
SET username = '小周',
	body = '不用登录就能评论，联调起来很方便。'
WHERE article_id = (
	SELECT id
	FROM articles
	WHERE slug = 'wo-de-qian-duan-xue-xi-lu-xian'
)
AND id = (
	SELECT MIN(id)
	FROM comments
	WHERE article_id = (
		SELECT id
		FROM articles
		WHERE slug = 'wo-de-qian-duan-xue-xi-lu-xian'
	)
);

DELETE FROM tags
WHERE name IN ('react', 'workers', 'd1', 'simple-world', 'demo')
AND id NOT IN (
	SELECT tag_id
	FROM article_tags
);
