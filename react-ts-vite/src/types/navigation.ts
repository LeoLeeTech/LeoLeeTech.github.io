/**
 * 这个小项目暂时不使用 react-router。
 * Route 就是当前页面的状态，Navigate 是所有页面共用的跳转函数类型。
 */
export type Route =
  | { name: 'home' }
  | { name: 'editor'; slug?: string }
  | { name: 'article'; slug: string };

export type Navigate = (route: Route) => void;
