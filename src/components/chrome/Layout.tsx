import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout() {
  const { pathname } = useLocation();
  useScrollReveal([pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
