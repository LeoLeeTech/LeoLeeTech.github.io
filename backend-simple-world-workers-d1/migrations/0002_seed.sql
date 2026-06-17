INSERT INTO articles (slug, username, title, description, body, created_at, updated_at)
VALUES
	(
		'how-to-build-webapps-that-scale',
		'jake',
		'How to build webapps that scale',
		'This is the description for the post.',
		'Web development technologies have evolved at an incredible clip over the past few years.

Simple World keeps the demo focused: no accounts, no passwords, just articles and comments.',
		'2016-01-20T08:00:00.000Z',
		'2016-01-20T08:00:00.000Z'
	),
	(
		'the-song-you',
		'albert',
		'The song you',
		'This is a short note about sharing ideas.',
		'Simple tools are easier to learn.

That is why this version only asks for a username when someone writes.',
		'2016-01-21T08:00:00.000Z',
		'2016-01-21T08:00:00.000Z'
	),
	(
		'simple-world-notes',
		'leo',
		'Simple World notes',
		'A tiny publishing app without accounts or permission ceremony.',
		'Simple World only asks for a username when someone writes an article or comment.

The first letter becomes the avatar.',
		'2016-01-22T08:00:00.000Z',
		'2016-01-22T08:00:00.000Z'
	);

INSERT INTO tags (name)
VALUES
	('react'),
	('workers'),
	('d1'),
	('simple-world'),
	('demo');

INSERT INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('react', 'demo')
WHERE articles.slug = 'how-to-build-webapps-that-scale';

INSERT INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('simple-world', 'demo')
WHERE articles.slug = 'the-song-you';

INSERT INTO article_tags (article_id, tag_id)
SELECT articles.id, tags.id
FROM articles
JOIN tags ON tags.name IN ('simple-world', 'workers', 'd1')
WHERE articles.slug = 'simple-world-notes';

INSERT INTO comments (article_id, username, body, created_at, updated_at)
SELECT id, 'jacob', 'This keeps the demo focused. I like it.', '2016-01-23T08:00:00.000Z', '2016-01-23T08:00:00.000Z'
FROM articles
WHERE slug = 'how-to-build-webapps-that-scale';

INSERT INTO comments (article_id, username, body, created_at, updated_at)
SELECT id, 'nora', 'No login wall, just write.', '2016-01-24T08:00:00.000Z', '2016-01-24T08:00:00.000Z'
FROM articles
WHERE slug = 'the-song-you';
