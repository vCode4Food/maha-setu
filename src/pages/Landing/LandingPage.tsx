import { Link } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, FileText, HeartHandshake, Landmark, MapPinned, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t, localizeNews, localeByLanguage } from '../../utils/i18n';
import { images, maharashtraCarouselSlides } from '../../data/images';
import { newsItems } from '../../data/news';
import { NearbyMap } from '../../components/map/NearbyMap';
import { ImageCarousel } from '../../components/home/ImageCarousel';

function ImageWithFallback({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={className} onError={(event) => { if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback; }} />;
}

const accessItems = [
  { icon: Landmark, title: 'landing.access.services', body: 'landing.access.services.body' },
  { icon: FileText, title: 'landing.access.documents', body: 'landing.access.documents.body' },
  { icon: HeartHandshake, title: 'landing.access.welfare', body: 'landing.access.welfare.body' },
  { icon: BriefcaseBusiness, title: 'landing.access.skills', body: 'landing.access.skills.body' },
  { icon: UsersRound, title: 'landing.access.support', body: 'landing.access.support.body' },
];

const reasons = [
  { icon: Sparkles, title: 'landing.why.one', body: 'landing.why.one.body' },
  { icon: MapPinned, title: 'landing.why.two', body: 'landing.why.two.body' },
  { icon: ShieldCheck, title: 'landing.why.three', body: 'landing.why.three.body' },
  { icon: UsersRound, title: 'landing.why.four', body: 'landing.why.four.body' },
];

export function LandingPage() {
  const { language } = useApp();
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="container landing-hero-grid">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow">{t('landing.eyebrow', language)}</p>
            <h1>{t('landing.hero.title', language)}</h1>
            <p>{t('landing.hero.body', language)}</p>
            <div className="landing-hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">{t('landing.getStarted', language)} <ArrowRight size={18} /></Link>
              <a href="#services" className="btn btn-secondary btn-lg">{t('landing.exploreServices', language)}</a>
            </div>
            <p className="landing-demo-note">{t('landing.prototype', language)}</p>
          </div>
          <div className="landing-hero-art">
            <ImageWithFallback src={images.atalSetu.primary} fallback={images.atalSetu.fallback} alt={t(images.atalSetu.altKey, language)} />
            <div className="landing-hero-art-overlay" />
            <div className="landing-hero-stat"><span>1</span>{t('landing.hero.stat', language)}</div>
          </div>
        </div>
      </section>

      <section id="services" className="landing-section container">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">{t('landing.access.eyebrow', language)}</p>
          <h2>{t('landing.access.title', language)}</h2>
          <p>{t('landing.access.body', language)}</p>
        </div>
        <div className="landing-access-grid">
          {accessItems.map((item) => {
            const Icon = item.icon;
            return <Link to="/login" className="landing-access-card" key={item.title}>
              <span><Icon size={24} strokeWidth={1.7} /></span><h3>{t(item.title, language)}</h3><p>{t(item.body, language)}</p><ArrowRight size={17} aria-hidden="true" />
            </Link>;
          })}
        </div>
      </section>

      <section id="explore" className="landing-explore">
        <div className="container">
          <div className="landing-section-heading landing-section-heading-inline">
            <div><p className="landing-eyebrow">{t('landing.explore.eyebrow', language)}</p><h2>{t('landing.explore.title', language)}</h2></div>
            <p>{t('landing.explore.body', language)}</p>
          </div>
          <NearbyMap compact titleKey="landing.explore.mapTitle" subtitleKey="landing.explore.mapBody" />
        </div>
      </section>

      <section id="news" className="landing-section container">
        <div className="landing-section-heading landing-section-heading-inline">
          <div><p className="landing-eyebrow">{t('landing.news.eyebrow', language)}</p><h2>{t('landing.news.title', language)}</h2></div>
          <p>{t('landing.news.body', language)}</p>
        </div>
        <div className="landing-news-grid">
          {newsItems.slice(0, 3).map((item) => {
            const localized = localizeNews(item, language);
            return <article className="landing-news-card" key={item.id}>
              <ImageWithFallback src={item.image} fallback="/images/impact-fallback.svg" alt={t(item.imageAlt, language)} />
              <div><span>{localized.category}</span><time dateTime={item.date}>{new Date(item.date).toLocaleDateString(localeByLanguage[language], { day: 'numeric', month: 'short', year: 'numeric' })}</time><h3>{localized.title}</h3><p>{localized.shortDescription}</p><Link to="/login">{t('landing.readMore', language)} <ArrowRight size={15} /></Link></div>
            </article>;
          })}
        </div>
      </section>

      <section className="landing-culture"><div className="container"><div className="landing-section-heading"><p className="landing-eyebrow">{t('landing.culture.eyebrow', language)}</p><h2>{t('landing.culture.title', language)}</h2><p>{t('landing.culture.body', language)}</p></div><ImageCarousel slides={maharashtraCarouselSlides} ariaLabelKey="landing.culture.title" /></div></section>

      <section className="landing-section container">
        <div className="landing-section-heading"><p className="landing-eyebrow">{t('landing.why.eyebrow', language)}</p><h2>{t('landing.why.title', language)}</h2></div>
        <div className="landing-why-grid">{reasons.map((reason) => { const Icon = reason.icon; return <article key={reason.title}><span><Icon size={22} /></span><h3>{t(reason.title, language)}</h3><p>{t(reason.body, language)}</p></article>; })}</div>
      </section>

      <section className="container landing-final-cta"><div><p className="landing-eyebrow">{t('landing.cta.eyebrow', language)}</p><h2>{t('landing.cta.title', language)}</h2><p>{t('landing.cta.body', language)}</p></div><Link to="/login" className="btn btn-accent btn-lg">{t('landing.getStarted', language)} <ArrowRight size={18} /></Link></section>
    </div>
  );
}
