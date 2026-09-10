import { BarChart3, ClipboardList, FileWarning, Landmark, ShieldCheck, UsersRound, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { NearbyMap } from '../../components/map/NearbyMap';
import { GovernmentUpdates } from '../../components/home/GovernmentUpdates';

const officerMetrics = [
  ['24', 'rbac.officer.pending'], ['11', 'rbac.officer.review'], ['8', 'rbac.officer.resolved'], ['3', 'rbac.officer.escalated'],
];
const adminMetrics = [
  ['42', 'rbac.admin.departments'], ['1,248', 'rbac.admin.users'], ['86', 'rbac.admin.services'], ['99.2%', 'rbac.admin.uptime'],
];

function DashboardHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="page-header role-page-header"><p className="landing-eyebrow">{eyebrow}</p><h1 className="page-title">{title}</h1><p className="page-subtitle">{body}</p></div>;
}

function Metrics({ metrics }: { metrics: string[][] }) {
  const { language } = useApp();
  return <div className="role-metrics">{metrics.map(([value, label]) => <article className="role-metric-card" key={label}><strong>{value}</strong><span>{t(label, language)}</span></article>)}</div>;
}

export function DepartmentDashboard() {
  const { language, authUser } = useApp();
  return <div className="container role-dashboard"><DashboardHeader eyebrow={t('rbac.officer.eyebrow', language)} title={t('rbac.officer.title', language, { name: authUser?.name ?? '' })} body={t('rbac.officer.body', language, { department: authUser?.department ?? '' })} /><Metrics metrics={officerMetrics} /><div className="role-action-grid"><article><ClipboardList /><h2>{t('rbac.officer.queue', language)}</h2><p>{t('rbac.officer.queue.body', language)}</p><button className="btn btn-primary">{t('rbac.officer.openQueue', language)} <ArrowRight size={16} /></button></article><article><FileWarning /><h2>{t('rbac.officer.grievances', language)}</h2><p>{t('rbac.officer.grievances.body', language)}</p><button className="btn btn-secondary">{t('rbac.officer.viewGrievances', language)} <ArrowRight size={16} /></button></article><article><BarChart3 /><h2>{t('rbac.officer.reports', language)}</h2><p>{t('rbac.officer.reports.body', language)}</p><button className="btn btn-secondary">{t('rbac.officer.viewReports', language)} <ArrowRight size={16} /></button></article></div><section className="section"><NearbyMap compact titleKey="rbac.officer.map.title" subtitleKey="rbac.officer.map.body" /></section><section className="section"><GovernmentUpdates compact /></section></div>;
}

export function AdminDashboard() {
  const { language, authUser } = useApp();
  return <div className="container role-dashboard"><DashboardHeader eyebrow={t('rbac.admin.eyebrow', language)} title={t('rbac.admin.title', language, { name: authUser?.name ?? '' })} body={t('rbac.admin.body', language)} /><Metrics metrics={adminMetrics} /><div className="role-action-grid"><article><UsersRound /><h2>{t('rbac.admin.usersTitle', language)}</h2><p>{t('rbac.admin.usersBody', language)}</p><button className="btn btn-primary">{t('rbac.admin.manageUsers', language)} <ArrowRight size={16} /></button></article><article><Landmark /><h2>{t('rbac.admin.deptTitle', language)}</h2><p>{t('rbac.admin.deptBody', language)}</p><button className="btn btn-secondary">{t('rbac.admin.manageDepartments', language)} <ArrowRight size={16} /></button></article><article><ShieldCheck /><h2>{t('rbac.admin.activityTitle', language)}</h2><p>{t('rbac.admin.activityBody', language)}</p><button className="btn btn-secondary">{t('rbac.admin.viewActivity', language)} <ArrowRight size={16} /></button></article></div><section className="section"><GovernmentUpdates compact /></section></div>;
}
