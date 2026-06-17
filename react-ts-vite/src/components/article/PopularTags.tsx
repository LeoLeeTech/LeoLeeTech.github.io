type PopularTagsProps = {
  tags: string[];
  selectedTag?: string;
  onSelect: (tag: string) => void;
};

/** 首页右侧的热门标签筛选区域。 */
export function PopularTags({ tags, selectedTag, onSelect }: PopularTagsProps) {
  return (
    <aside className="sidebar">
      <p>热门标签</p>
      <div className="tag-list sidebar-tags">
        {tags.map((tag) => (
          <button
            className={selectedTag === tag ? 'tag active' : 'tag'}
            type="button"
            key={tag}
            onClick={() => onSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </aside>
  );
}
