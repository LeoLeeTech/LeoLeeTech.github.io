/**
 * 这个小项目暂时不使用 react-router。
 * Route 就是当前页面的状态，Navigate 是所有页面共用的跳转函数类型。
 */
export type Route =
  | { name: 'home' }
  | { name: 'editor'; slug?: string }
  | { name: 'article'; slug: string };

export type Navigate = (route: Route) => void;

/** 把页面状态转换成浏览器地址。 */
export function routeToPath(route: Route) {
  if (route.name === 'article') {
    return `/articles/${encodeURIComponent(route.slug)}`;
  }

  if (route.name === 'editor') {
    return route.slug
      ? `/editor/${encodeURIComponent(route.slug)}`
      : '/editor';
  }

  return '/';
}

/**
 * 根据浏览器地址恢复页面状态。
 * 用户刷新页面或使用浏览器回退时，都会经过这个函数。
 */
export function pathToRoute(pathname: string): Route {
  const articleMatch = pathname.match(/^\/articles\/([^/]+)\/?$/);
  if (articleMatch) {
    return { name: 'article', slug: decodeURIComponent(articleMatch[1]) };
  }

  const editorMatch = pathname.match(/^\/editor\/([^/]+)\/?$/);
  if (editorMatch) {
    return { name: 'editor', slug: decodeURIComponent(editorMatch[1]) };
  }

  if (pathname === '/editor' || pathname === '/editor/') {
    return { name: 'editor' };
  }

  return { name: 'home' };
}
