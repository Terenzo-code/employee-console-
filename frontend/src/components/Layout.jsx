import { Outlet } from 'react-router-dom';
import Nav from './Nav';

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="titlebar">
        <div className="dots">
          <span className="dot red" />
          <span className="dot amber" />
          <span className="dot green" />
        </div>
        <span className="path">~<span className="sep">/</span>employee-console</span>
      </div>
      <Nav />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
