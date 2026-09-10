import { useCallback, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header, Footer } from '../navigation/Header';
import { BurgerMenu } from '../navigation/BurgerMenu';
import { Chatbot } from '../chatbot/Chatbot';
import { LoadingScreen } from './LoadingScreen';
import { useApp } from '../../context/AppContext';


export function Layout() {
  const location = useLocation();
  const { toast } = useApp();
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [booted, setBooted] = useState(() => sessionStorage.getItem('mahasetu_booted') === '1');

  const finishBoot = useCallback(() => {
    sessionStorage.setItem('mahasetu_booted', '1');
    setBooted(true);
  }, []);

  if (!booted) {
    return <LoadingScreen onDone={finishBoot} />;
  }

  return (
    <>
      <Header activePath={location.pathname} onMenuToggle={() => setBurgerOpen((o) => !o)} />
      <main className="page page-transition" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <BurgerMenu open={burgerOpen} onToggle={() => setBurgerOpen((o) => !o)} />
      <Chatbot />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
