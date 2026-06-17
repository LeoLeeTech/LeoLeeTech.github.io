import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { SiteHeader } from './components/layout/SiteHeader';
import { ArticlePage } from './pages/ArticlePage';
import { EditorPage } from './pages/EditorPage';
import { HomePage } from './pages/HomePage';
import {
  pathToRoute,
  routeToPath,
  type Navigate,
  type Route,
} from './types/navigation';

/**
 * 应用的最外层组件只负责两件事：保存当前页面、渲染对应页面。
 * 具体的数据请求和表单交互放在 pages 目录中，避免 App.tsx 越写越大。
 */
function App() {
  // 首次打开或刷新页面时，直接根据地址栏决定显示哪个页面。
  const [route, setRoute] = useState<Route>(() =>
    pathToRoute(window.location.pathname),
  );

  // 所有页面跳转都写入浏览器历史，因此地址栏会变化，也可以正常回退。
  const navigate = useCallback<Navigate>((nextRoute) => {
    const nextPath = routeToPath(nextRoute);
    window.history.pushState(null, '', nextPath);
    setRoute(nextRoute);
  }, []);

  useEffect(() => {
    // 浏览器前进或后退时不会触发 React 更新，需要监听 popstate 手动同步。
    const handleHistoryChange = () => {
      setRoute(pathToRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handleHistoryChange);
    return () => window.removeEventListener('popstate', handleHistoryChange);
  }, []);

  return (
    <>
      <SiteHeader route={route} onNavigate={navigate} />
      {route.name === 'home' && <HomePage onNavigate={navigate} />}
      {route.name === 'editor' && (
        <EditorPage
          key={route.slug ?? 'new-article'}
          slug={route.slug}
          onNavigate={navigate}
        />
      )}
      {route.name === 'article' && (
        <ArticlePage key={route.slug} slug={route.slug} onNavigate={navigate} />
      )}
    </>
  );
}

export default App;
