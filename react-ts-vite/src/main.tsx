import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// main.tsx 是 React 应用的真正入口。
// index.html 里有一个 <div id="root"></div>，这里把 App 组件挂载进去。
createRoot(document.getElementById('root')!).render(
  // StrictMode 是 React 的开发模式辅助工具，会帮助我们发现一些潜在问题。
  <StrictMode>
    <App />
  </StrictMode>,
)
