-- 初始化一些文章数据，方便本地启动后立刻看到页面效果。
INSERT INTO articles (slug, username, title, description, body, created_at, updated_at)
VALUES
	(
		'ru-he-xie-di-yi-pian-ji-shu-wen-zhang',
		'小李',
		'如何写好第一篇技术文章',
		'把学习过程写下来，就是最好的开始。',
		'很多人觉得技术文章必须非常高级，其实不一定。

你可以先从一次踩坑、一个小工具、一个读书笔记开始。苹果社区希望让写作这件事变得更轻松。',
		'2016-01-20T08:00:00.000Z',
		'2016-01-20T08:00:00.000Z'
	),
	(
		'wo-de-qian-duan-xue-xi-lu-xian',
		'阿明',
		'我的前端学习路线',
		'从 HTML、CSS 到 React，记录一条适合新手的路线。',
		'刚开始学前端时，不要急着追所有新技术。

先把 HTML、CSS、JavaScript 的基础练扎实，再开始学习 React 和工程化工具。',
		'2016-01-21T08:00:00.000Z',
		'2016-01-21T08:00:00.000Z'
	),
	(
		'ping-guo-she-qu-shi-yong-shuo-ming',
		'Leo',
		'苹果社区使用说明',
		'一个轻量的中文文章与评论社区。',
		'苹果社区不需要注册账号。

发布文章或评论时，只需要填写一个用户名。头像会自动使用用户名首字母。',
		'2016-01-22T08:00:00.000Z',
		'2016-01-22T08:00:00.000Z'
	);

-- 初始化标签。
INSERT INTO tags (name)
VALUES
	('技术'),
	('前端'),
	('React'),
	('学习'),
	('社区');

-- 给第一篇文章绑定标签。
INSERT INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('技术', '学习')
WHERE articles.slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang';

-- 给第二篇文章绑定标签。
INSERT INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('前端', 'React', '学习')
WHERE articles.slug = 'wo-de-qian-duan-xue-xi-lu-xian';

-- 给第三篇文章绑定标签。
INSERT INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('社区', '技术')
WHERE articles.slug = 'ping-guo-she-qu-shi-yong-shuo-ming';

-- 初始化评论数据。
INSERT INTO comments (article_id, username, body, created_at, updated_at)
SELECT id, '小王', '这个社区的规则很简单，适合新手练习。', '2016-01-23T08:00:00.000Z', '2016-01-23T08:00:00.000Z'
FROM articles
WHERE slug = 'ru-he-xie-di-yi-pian-ji-shu-wen-zhang';

INSERT INTO comments (article_id, username, body, created_at, updated_at)
SELECT id, '小周', '不用登录就能评论，联调起来很方便。', '2016-01-24T08:00:00.000Z', '2016-01-24T08:00:00.000Z'
FROM articles
WHERE slug = 'wo-de-qian-duan-xue-xi-lu-xian';
