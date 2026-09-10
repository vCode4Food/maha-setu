import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { language } = useApp();
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hold = reduce ? 400 : 1300;
    const fade = reduce ? 150 : 350;
    const t1 = window.setTimeout(() => setPhase('out'), hold);
    const t2 = window.setTimeout(onDone, hold + fade);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`loading-screen ${phase === 'out' ? 'loading-screen-exit' : ''}`} role="status" aria-live="polite">
      <div className="loading-orbits" aria-hidden="true">
        <span className="loading-node loading-node-1" />
        <span className="loading-node loading-node-2" />
        <span className="loading-node loading-node-3" />
        <span className="loading-bridge" />
      </div>
      <img src="/mahasetu-logo.jpg" alt="MahaSetu" className="loading-logo" width={112} height={112} />
      <p className="loading-title">{t('loading.connecting', language)}</p>
      <p className="loading-subtitle">{t('loading.empowering', language)}</p>
    </div>
  );
}
