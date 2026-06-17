type TagListProps = {
  tags: string[];
  outlined?: boolean;
};

/** 文章列表、详情页和编辑页都可以复用同一套标签展示。 */
export function TagList({ tags, outlined = false }: TagListProps) {
  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li className={outlined ? 'tag tag-outline' : 'tag'} key={tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
