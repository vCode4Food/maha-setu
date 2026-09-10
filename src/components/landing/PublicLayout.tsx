import { Outlet, useLocation } from 'react-router-dom';
import { PublicFooter, PublicHeader } from './PublicNavigation';

/** A deliberately light shell for public informational pages and mock sign-in. */
export function PublicLayout() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <>
      <PublicHeader />
      <main className={isLogin ? 'public-main public-main-login' : 'public-main'}>
        <Outlet />
      </main>
      {!isLogin && <PublicFooter />}
    </>
  );
}
