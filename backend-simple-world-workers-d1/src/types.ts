// 这个文件只放类型定义。
// 类型就像“数据说明书”：告诉 TypeScript 每个对象应该有哪些字段。

export type Author = {
	username: string;
	avatarInitial: string;
};

export type Article = {
	slug: string;
	title: string;
	description: string;
	body?: string;
	tagList: string[];
	createdAt: string;
	updatedAt: string;
	author: Author;
};

export type Comment = {
	id: number;
	createdAt: string;
	updatedAt: string;
	body: string;
	author: Author;
};

export type ArticleInput = {
	username: string;
	title: string;
	description: string;
	body: string;
	tagList?: string[];
};

export type CommentInput = {
	username: string;
	body: string;
};

export type ArticleRow = {
	id: number;
	slug: string;
	username: string;
	title: string;
	description: string;
	body: string;
	created_at: string;
	updated_at: string;
	tag_names: string | null;
};

export type ArticleIdRow = {
	id: number;
};

export type CountRow = {
	count: number;
};

export type CommentRow = {
	id: number;
	username: string;
	body: string;
	created_at: string;
	updated_at: string;
};

export type TagRow = {
	id: number;
	name: string;
};

export type ArticleListParams = {
	tag: string | null;
	authorName: string | null;
	limit: number;
	offset: number;
};

export type ArticlePayload = {
	article?: Partial<ArticleInput>;
};

export type CommentPayload = {
	comment?: Partial<CommentInput>;
};
