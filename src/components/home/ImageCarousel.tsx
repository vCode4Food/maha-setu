import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { carouselSlides } from '../../data/images';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

function SafeImage({ src, fallback, alt }: { src: string; fallback: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="carousel-image"
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== fallback) img.src = fallback;
      }}
    />
  );
}

export function ImageCarousel() {
  const { language } = useApp();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % carouselSlides.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + carouselSlides.length) % carouselSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [paused, next]);

  const slide = carouselSlides[index];

  return (
    <section
      className="image-carousel"
      aria-roledescription="carousel"
      aria-label={`${t('home.focus', language)} — MahaSetu`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStart.current == null) return;
        const delta = e.changedTouches[0].clientX - touchStart.current;
        if (delta > 40) prev();
        if (delta < -40) next();
        touchStart.current = null;
      }}
    >
      <div className="carousel-frame">
        <SafeImage src={slide.image} fallback={slide.fallback} alt={t(slide.altKey, language)} />
        <div className="carousel-overlay">
          <span className="carousel-label">{t(slide.labelKey, language)}</span>
          <p className="carousel-caption">{t(slide.captionKey, language)}</p>
        </div>
        <button type="button" className="carousel-nav carousel-prev" onClick={prev} aria-label={t('updates.previous', language)}>
          <ChevronLeft size={20} />
        </button>
        <button type="button" className="carousel-nav carousel-next" onClick={next} aria-label={t('updates.next', language)}>
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="carousel-dots" role="tablist" aria-label={t('home.focus', language)}>
        {carouselSlides.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={t(item.labelKey, language)}
          />
        ))}
      </div>
    </section>
  );
}
