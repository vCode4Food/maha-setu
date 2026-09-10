import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardCheck,
  Search,
  FileText,
  MapPin,
  Landmark,
  LifeBuoy,
  GraduationCap,
  Briefcase,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SearchBar } from '../../components/search/SearchBar';
import { ServiceCard } from '../../components/services/ServiceCard';
import { ApplicationCard } from '../../components/applications/ApplicationCard';
import { NearbyMap } from '../../components/map/NearbyMap';
import { Button } from '../../components/common';
import { ImageCarousel } from '../../components/home/ImageCarousel';
import { GovernmentUpdates } from '../../components/home/GovernmentUpdates';
import { images } from '../../data/images';
import {
  getRecommendedServices,
  getActiveApplicationsCount,
} from '../../services/dataService';
import { t } from '../../utils/i18n';

function SafeImage({ src, fallback, alt, className }: { src: string; fallback: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        const img = e.currentTarget;
        if (img.src !== fallback) img.src = fallback;
      }}
    />
  );
}

const quickActions = [
  { label: 'quick.findService', to: '/search', icon: Search }, { label: 'quick.trackApplication', to: '/applications', icon: ClipboardCheck }, { label: 'quick.documents', to: '/documents', icon: FileText }, { label: 'quick.nearby', to: '/#nearby-map', icon: MapPin }, { label: 'quick.schemes', to: '/updates', icon: Landmark }, { label: 'quick.help', to: '/help', icon: LifeBuoy },
];

const recommendedDepartments = [
  {
    to: '/education',
    title: 'department.education.name',
    description: 'department.education.description',
    meta: 'home.educationCount',
    icon: GraduationCap,
  },
  {
    to: '/employability',
    title: 'department.employability.name',
    description: 'department.employability.description',
    meta: 'home.employabilityCount',
    icon: Briefcase,
  },
];

export function HomePage() {
  const { profile, applications, documents, language } = useApp();
  const location = useLocation();
  const recommended = getRecommendedServices().slice(0, 3);
  const recentApps = applications.slice(0, 2);
  const activeApps = getActiveApplicationsCount();

  useEffect(() => {
    if (location.hash === '#nearby-map') {
      requestAnimationFrame(() => {
        document.getElementById('nearby-map')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [location.hash]);

  const activities = ['one', 'two', 'three'].map((id) => ({ text: t(`activity.${id}.text`, language), time: t(`activity.${id}.time`, language) }));

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="hero-greeting">{t('hero.welcome', language, { name: profile.firstName })}</p>
            <h1 className="hero-title">{t('hero.title', language)}</h1>
            <p className="hero-subtitle">{t('hero.subtitle', language)}</p>
            <div className="hero-actions">
              <Link to="/search">
                <Button variant="primary">
                  {t('hero.explore', language)} <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/applications">
                <Button variant="secondary">
                  <ClipboardCheck size={16} /> {t('hero.track', language)}
                </Button>
              </Link>
            </div>
            <SearchBar large />
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap">
              <SafeImage
                src={images.welcomeMap.primary}
                fallback={images.welcomeMap.fallback}
                alt={t(images.welcomeMap.altKey, language)}
                className="hero-image"
              />
              <div className="hero-image-overlay" />
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="quick-actions-strip">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.to} to={action.to} className="quick-action-card">
                <span className="quick-action-icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <span className="quick-action-label">{t(action.label, language)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">{t('home.servicesForYou', language)}</h2>
        </div>
        <div className="dept-recommend-grid">
          {recommendedDepartments.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="dept-recommend-card">
                <span className="dept-recommend-icon">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
                <h3>{t(item.title, language)}</h3>
                <p>{t(item.description, language)}</p>
                <span className="dept-recommend-meta">{t(item.meta, language)}</span>
                <span className="dept-recommend-action">
                  {t('hero.explore', language)} <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="service-cards-grid" style={{ marginTop: 'var(--space-6)' }}>
          {recommended.map((service) => (
            <ServiceCard key={service.id} service={service} variant="rich" />
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <h2 className="section-title">{t('home.focus', language)}</h2>
          <p className="section-subtitle">{t('home.focusSubtitle', language)}</p>
        </div>
        <ImageCarousel />
      </section>

      <section className="section container">
        <GovernmentUpdates compact />
      </section>

      <section className="section container">
        <div className="editorial-block">
          <div className="editorial-image">
            <SafeImage
              src={images.atalSetu.primary}
              fallback={images.atalSetu.fallback}
              alt={t(images.atalSetu.altKey, language)}
              className="editorial-img"
            />
          </div>
          <div className="editorial-content">
            <span className="editorial-eyebrow">{t('home.connectedEyebrow', language)}</span>
            <h2 className="editorial-title">{t('home.connectedTitle', language)}</h2>
            <p className="editorial-text">{t('home.connectedBody', language)}</p>
            <Link to="/search">
              <Button variant="primary">
                {t('hero.explore', language)} <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <NearbyMap compact />
      </section>

      {recentApps.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">{t('home.continue', language)}</h2>
            <Link to="/applications" className="section-link">
              {t('home.viewAll', language)}
            </Link>
          </div>
          <div className="grid-2">
            {recentApps.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        </section>
      )}

      <section className="section container">
        <div className="home-dual-col">
          <div className="home-summary-card">
            <h3 className="home-summary-title">{t('home.applications', language)}</h3>
            <div className="home-summary-stat">
              <span className="home-summary-value">{activeApps}</span>
              <span className="home-summary-label">{t('home.activeApplications', language)}</span>
            </div>
            <div className="home-summary-stat">
              <span className="home-summary-value">{documents.length}</span>
              <span className="home-summary-label">{t('home.documentsVault', language)}</span>
            </div>
            <Link to="/applications">
              <Button variant="secondary" size="sm">
                <ClipboardCheck size={14} /> {t('home.viewApplications', language)}
              </Button>
            </Link>
          </div>

          <div className="home-activity-card">
            <h3 className="home-summary-title">{t('home.recentActivity', language)}</h3>
            <div className="activity-list">
              {activities.map((activity, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" />
                  <div>
                    <div className="activity-text">{activity.text}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="help-cta-block">
          <div className="help-cta-content">
            <h2 className="help-cta-title">{t('home.needGuidance', language)}</h2>
            <p className="help-cta-text">{t('home.guidanceBody', language)}</p>
          </div>
          <Button variant="accent" onClick={() => document.querySelector<HTMLButtonElement>('.chatbot-fab')?.click()}>
            <MessageCircle size={16} /> {t('home.ask', language)}
          </Button>
        </div>
      </section>
    </div>
  );
}
