import { useState } from 'react';
import './App.css';
import { SiteHeader } from './components/layout/SiteHeader';
import { ArticlePage } from './pages/ArticlePage';
import { EditorPage } from './pages/EditorPage';
import { HomePage } from './pages/HomePage';
import type { Route } from './types/navigation';

/**
 * 应用的最外层组件只负责两件事：保存当前页面、渲染对应页面。
 * 具体的数据请求和表单交互放在 pages 目录中，避免 App.tsx 越写越大。
 */
function App() {
  const [route, setRoute] = useState<Route>({ name: 'home' });

  return (
    <>
      <SiteHeader route={route} onNavigate={setRoute} />
      {route.name === 'home' && <HomePage onNavigate={setRoute} />}
      {route.name === 'editor' && (
        <EditorPage
          key={route.slug ?? 'new-article'}
          slug={route.slug}
          onNavigate={setRoute}
        />
      )}
      {route.name === 'article' && (
        <ArticlePage key={route.slug} slug={route.slug} onNavigate={setRoute} />
      )}
    </>
  );
}

export default App;
