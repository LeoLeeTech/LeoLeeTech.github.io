import type { Navigate, Route } from '../../types/navigation';

type SiteHeaderProps = {
  route: Route;
  onNavigate: Navigate;
};

/** 网站顶部公共导航，只负责显示入口和发出跳转事件。 */
export function SiteHeader({ route, onNavigate }: SiteHeaderProps) {
  const isHome = route.name === 'home';
  const isEditor = route.name === 'editor';

  return (
    <nav className="navbar">
      <button
        className="brand"
        type="button"
        onClick={() => onNavigate({ name: 'home' })}
      >
        简单论坛
      </button>
      <div className="nav-links">
        <button
          className={isHome ? 'nav-link active' : 'nav-link'}
          type="button"
          onClick={() => onNavigate({ name: 'home' })}
        >
          首页
        </button>
        <button
          className={isEditor ? 'nav-link active' : 'nav-link'}
          type="button"
          onClick={() => onNavigate({ name: 'editor' })}
        >
          发布文章
        </button>
      </div>
    </nav>
  );
}
