import { Link, useLocation, useParams } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { ServiceList } from '../../components/services/ServiceCard';
import { getServicesByDepartment, getDepartments } from '../../services/dataService';
import { images } from '../../data/images';
import type { DepartmentId } from '../../types';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';

function resolveDepartmentId(pathname: string, param?: string): DepartmentId | undefined {
  if (pathname === '/education' || param === 'education') return 'education';
  if (pathname === '/employability' || param === 'employability') return 'employability';
  if (param === 'education' || param === 'employability') return param;
  return undefined;
}

export function ServicesPage() {
  const { language } = useApp();
  const location = useLocation();
  const { departmentId } = useParams<{ departmentId: string }>();
  const id = resolveDepartmentId(location.pathname, departmentId);
  const departments = getDepartments();
  const department = departments.find((d) => d.id === id);
  const services = id ? getServicesByDepartment(id) : [];

  if (!department || !id) {
    return (
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">{t('nav.services', language)}</h1>
          <p className="page-subtitle">{t('department.notFound', language)}</p>
        </div>
        <Link to="/">{t('department.returnHome', language)}</Link>
      </div>
    );
  }

  const heroImage = id === 'education' ? images.education : images.employability;
  const Icon = id === 'education' ? GraduationCap : Briefcase;

  return (
    <div className="department-page">
      <section className="department-hero">
        <div className="container department-hero-grid">
          <div>
            <span className="editorial-eyebrow">
              <Icon size={16} aria-hidden="true" /> {t(`department.${id}.name`, language)}
            </span>
            <h1 className="page-title department-hero-title">{t('department.services', language, { department: t(`department.${id}.name`, language) })}</h1>
            <p className="page-subtitle">{t(`department.${id}.description`, language)}</p>
          </div>
          <div className="department-hero-visual">
            <img
              src={heroImage.primary}
              alt={t(heroImage.altKey, language)}
              className="department-hero-image"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src !== heroImage.fallback) img.src = heroImage.fallback;
              }}
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{t('department.available', language)}</h2>
          <Link to="/search" className="section-link">
            {t('department.searchAll', language)} <ArrowRight size={14} />
          </Link>
        </div>
        <ServiceList services={services} />
      </div>
    </div>
  );
}
