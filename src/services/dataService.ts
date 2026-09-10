import { services } from '../data/services';
import { departments } from '../data/departments';
import { searchNews } from '../data/news';
import { defaultApplications } from '../data/applications';
import { defaultDocuments } from '../data/documents';
import { defaultProfile } from '../data/profile';
import { defaultNotifications } from '../data/notifications';
import { localeByLanguage, localizeNews, localizeService, t } from '../utils/i18n';
import type {
  Application,
  ApplicationStatus,
  CitizenProfile,
  DepartmentId,
  Document,
  EligibilityAnswers,
  EligibilityResult,
  Notification,
  Service,
  TimelineStep,
} from '../types';

const STORAGE_KEYS = {
  applications: 'mahasetu_applications',
  documents: 'mahasetu_documents',
  profile: 'mahasetu_profile',
  notifications: 'mahasetu_notifications',
  draft: 'mahasetu_draft',
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getServices(): Service[] {
  return services;
}

export function getServiceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getServicesByDepartment(departmentId: DepartmentId): Service[] {
  return services.filter((s) => s.department === departmentId);
}

export function getPopularServices(): Service[] {
  return services.filter((s) => s.popular);
}

export function getRecommendedServices(): Service[] {
  return [
    getServiceById('scholarship-assistance')!,
    getServiceById('skill-development-training')!,
    getServiceById('student-education-support')!,
  ].filter(Boolean);
}

export interface SearchResult extends Service {
  relevanceReason: string;
  score: number;
}

export function searchServices(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const intentMap: Record<string, { keywords: string[]; reason: string }> = {
    scholarship: { keywords: ['scholarship', 'financial', 'student', 'education', 'fees'], reason: 'Matches your search for financial education support' },
    job: { keywords: ['job', 'employment', 'work', 'career', 'hiring', 'opportunity'], reason: 'Relevant for finding employment opportunities' },
    skill: { keywords: ['skill', 'training', 'development', 'certification'], reason: 'Related to skill development and training' },
    education: { keywords: ['education', 'student', 'admission', 'certificate'], reason: 'Education-related service match' },
    employ: { keywords: ['employ', 'register', 'counseling', 'resume'], reason: 'Employability service match' },
  };

  const results: SearchResult[] = [];

  for (const service of services) {
    let score = 0;
    let reason = 'Matches your search query';

    if (service.title.toLowerCase().includes(q)) score += 10;
    if (service.shortDescription.toLowerCase().includes(q)) score += 5;
    if (service.category.toLowerCase().includes(q)) score += 4;
    if (service.keywords.some((k) => k.includes(q) || q.includes(k))) score += 6;

    for (const [, intent] of Object.entries(intentMap)) {
      if (intent.keywords.some((k) => q.includes(k))) {
        if (service.keywords.some((sk) => intent.keywords.includes(sk))) {
          score += 8;
          reason = intent.reason;
        }
      }
    }

    const naturalPhrases: [RegExp, string, number][] = [
      [/scholarship|financial aid|need.*education/i, 'scholarship', 12],
      [/job|employment|find work|looking for.*job/i, 'job', 12],
      [/skill|training|learn/i, 'skill', 10],
      [/certificate|document/i, 'education', 8],
    ];

    for (const [pattern, intentKey, bonus] of naturalPhrases) {
      if (pattern.test(q)) {
        const intent = intentMap[intentKey];
        if (intent && service.keywords.some((sk) => intent.keywords.includes(sk))) {
          score += bonus;
          reason = intent.reason;
        }
      }
    }

    if (score > 0) {
      results.push({ ...service, relevanceReason: reason, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

export type UnifiedSearchKind = 'service' | 'department' | 'update' | 'help';

export interface UnifiedSearchResult {
  id: string;
  kind: UnifiedSearchKind;
  title: string;
  description: string;
  to: string;
}

export function searchAll(query: string, language: import('../types').Language = 'en'): UnifiedSearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: UnifiedSearchResult[] = searchServices(query).map((raw) => {
    const s = localizeService(raw, language);
    return ({ id: s.id,
    kind: 'service' as const,
    title: s.title,
    description: s.shortDescription,
    to: `/services/${s.id}`, });
  });

  for (const dept of departments) {
    if (
      dept.name.toLowerCase().includes(q) ||
      dept.description.toLowerCase().includes(q) ||
      q.includes(dept.id)
    ) {
      results.push({
        id: dept.id,
        kind: 'department',
        title: t(`department.${dept.id}.name`, language),
        description: t(`department.${dept.id}.description`, language),
        to: `/${dept.id}`,
      });
    }
  }

  for (const rawItem of searchNews(query)) {
    const item = localizeNews(rawItem, language);
    results.push({
      id: item.id,
      kind: 'update',
      title: item.title,
      description: item.shortDescription,
      to: '/updates',
    });
  }

  const helpIndex: UnifiedSearchResult[] = [
    { id: 'help-main', kind: 'help', title: t('help.title', language), description: t('help.faqBody', language), to: '/help' },
    { id: 'help-about', kind: 'help', title: t('about.title', language), description: t('brand.tagline', language), to: '/about' },
  ];
  for (const item of helpIndex) {
    if (item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || q.includes('help')) {
      results.push(item);
    }
  }

  return results;
}

export function getDepartments() {
  return departments;
}

export function getApplications(): Application[] {
  return loadFromStorage(STORAGE_KEYS.applications, defaultApplications);
}

export function getApplicationById(id: string): Application | undefined {
  return getApplications().find((a) => a.id === id);
}

export function addApplication(application: Application): Application {
  const apps = getApplications();
  apps.unshift(application);
  saveToStorage(STORAGE_KEYS.applications, apps);
  return application;
}

export function getDocuments(): Document[] {
  return loadFromStorage(STORAGE_KEYS.documents, defaultDocuments);
}

export function addDocument(doc: Document): Document {
  const docs = getDocuments();
  docs.unshift(doc);
  saveToStorage(STORAGE_KEYS.documents, docs);
  return doc;
}

export function removeDocument(id: string): void {
  const docs = getDocuments().filter((d) => d.id !== id);
  saveToStorage(STORAGE_KEYS.documents, docs);
}

export function getProfile(): CitizenProfile {
  return loadFromStorage(STORAGE_KEYS.profile, defaultProfile);
}

export function updateProfile(updates: Partial<CitizenProfile>): CitizenProfile {
  const profile = { ...getProfile(), ...updates };
  saveToStorage(STORAGE_KEYS.profile, profile);
  return profile;
}

export function getNotifications(): Notification[] {
  return loadFromStorage(STORAGE_KEYS.notifications, defaultNotifications);
}

export function markNotificationRead(id: string): void {
  const notifications = getNotifications().map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  saveToStorage(STORAGE_KEYS.notifications, notifications);
}

export function markAllNotificationsRead(): void {
  const notifications = getNotifications().map((n) => ({ ...n, read: true }));
  saveToStorage(STORAGE_KEYS.notifications, notifications);
}

export function addNotification(notification: Notification): void {
  const notifications = [notification, ...getNotifications()];
  saveToStorage(STORAGE_KEYS.notifications, notifications);
}

export function checkEligibility(
  serviceId: string,
  answers: EligibilityAnswers,
  language: import('../types').Language = 'en'
): EligibilityResult {
  const service = getServiceById(serviceId);
  if (!service) {
    return {
      eligible: false,
      confidence: 'low',
      reasons: [{ text: t('department.notFound', language), met: false }],
      summary: t('search.noResults', language),
    };
  }

  const reasons: { text: string; met: boolean }[] = [];

  if (service.department === 'education') {
    const studyingMet = answers.currentlyStudying === true;
    reasons.push({
      text: t('eligibility.studyingYes', language),
      met: studyingMet,
    });

    const educationMet =
      answers.educationLevel === '12th' ||
      answers.educationLevel === 'Graduate' ||
      answers.educationLevel === 'Post Graduate';
    reasons.push({
      text: t('service.eligibility', language),
      met: educationMet,
    });

    const incomeMet =
      answers.annualIncome === 'below-1L' ||
      answers.annualIncome === '1L-2.5L';
    reasons.push({
      text: t('eligibility.income', language),
      met: incomeMet,
    });

    const locationMet = answers.location === 'maharashtra';
    reasons.push({
      text: t('eligibility.location', language),
      met: locationMet,
    });
  } else {
    const ageMet =
      answers.age === '18-25' ||
      answers.age === '26-35' ||
      answers.age === '36-45';
    reasons.push({
      text: t('eligibility.age', language),
      met: ageMet,
    });

    const locationMet = answers.location === 'maharashtra';
    reasons.push({
      text: t('eligibility.location', language),
      met: locationMet,
    });

    const employmentMet =
      answers.employmentStatus === 'unemployed' ||
      answers.employmentStatus === 'underemployed' ||
      answers.employmentStatus === 'student';
    reasons.push({
      text: t('eligibility.employment', language),
      met: employmentMet,
    });

    const educationMet =
      answers.educationLevel === '10th' ||
      answers.educationLevel === '12th' ||
      answers.educationLevel === 'Graduate' ||
      answers.educationLevel === 'Post Graduate';
    reasons.push({
      text: t('service.eligibility', language),
      met: educationMet,
    });
  }

  const metCount = reasons.filter((r) => r.met).length;
  const eligible = metCount >= reasons.length - 1;
  const confidence: EligibilityResult['confidence'] =
    metCount === reasons.length ? 'high' : metCount >= reasons.length - 1 ? 'medium' : 'low';

  return {
    eligible,
    confidence,
    reasons,
    summary: eligible
      ? t('eligibility.eligible', language)
      : t('eligibility.notEligible', language),
  };
}

export function createApplicationFromSubmission(
  serviceId: string,
  serviceTitle: string
): Application {
  const now = new Date();
  const id = `app-${Date.now()}`;
  const refNum = `MS-2026-${serviceId.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900000 + 100000)}`;

  const timeline: TimelineStep[] = [
    {
      id: 't1',
      label: 'Application Submitted',
      description: 'Your application was successfully submitted.',
      date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      completed: true,
      current: true,
    },
    {
      id: 't2',
      label: 'Information Verified',
      description: 'Personal and eligibility details will be verified.',
      completed: false,
      current: false,
    },
    {
      id: 't3',
      label: 'Department Review',
      description: 'Application under department review.',
      completed: false,
      current: false,
    },
    {
      id: 't4',
      label: 'Approved',
      description: 'Final approval and service delivery.',
      completed: false,
      current: false,
    },
  ];

  return {
    id,
    serviceId,
    serviceTitle,
    status: 'submitted' as ApplicationStatus,
    submittedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    referenceNumber: refNum,
    progress: 25,
    timeline,
  };
}

export function getDraftApplication(serviceId: string) {
  try {
    const drafts = JSON.parse(localStorage.getItem('mahasetu_drafts') || '{}');
    return drafts[serviceId] || null;
  } catch {
    return null;
  }
}

export function saveDraftApplication(serviceId: string, draft: unknown): void {
  try {
    const drafts = JSON.parse(localStorage.getItem('mahasetu_drafts') || '{}');
    drafts[serviceId] = draft;
    localStorage.setItem('mahasetu_drafts', JSON.stringify(drafts));
  } catch {
    /* ignore */
  }
}

export function clearDraftApplication(serviceId: string): void {
  try {
    const drafts = JSON.parse(localStorage.getItem('mahasetu_drafts') || '{}');
    delete drafts[serviceId];
    localStorage.setItem('mahasetu_drafts', JSON.stringify(drafts));
  } catch {
    /* ignore */
  }
}

export function formatDate(dateStr: string, language: import('../types').Language = 'en'): string {
  return new Date(dateStr).toLocaleDateString(localeByLanguage[language], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getActiveApplicationsCount(): number {
  return getApplications().filter(
    (a) => !['approved', 'rejected'].includes(a.status)
  ).length;
}

export function getActionRequiredCount(): number {
  return getApplications().filter((a) => a.status === 'action_required').length;
}
