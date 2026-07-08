/** 把后端返回的 ISO 时间转换成中文日期。 */
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

/** 把逗号分隔的标签输入转换为数组，并自动清理空白标签。 */
export function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}
