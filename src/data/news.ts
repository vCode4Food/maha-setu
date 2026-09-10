import type { NewsItem } from '../types';
import { images } from './images';

/** Demonstration content for the SIH prototype — not live government news. */
export const NEWS_DISCLAIMER =
  'Demonstration content for this prototype. These items illustrate how public updates could appear on MahaSetu.';

export const newsItems: NewsItem[] = [
  {
    id: 'news-scholarship-window',
    title: 'Post-matric scholarship window illustrated for students',
    category: 'SCHEME',
    date: '2026-09-02',
    shortDescription:
      'Sample update showing how education support schemes could be announced in one citizen feed.',
    image: images.education.primary,
    imageAlt: images.education.altKey,
    source: 'MahaSetu prototype',
    importance: 'high',
    keywords: ['scholarship', 'education', 'student', 'scheme'],
  },
  {
    id: 'news-skill-mission',
    title: 'Skill development enrolment drive for young job-seekers',
    category: 'ANNOUNCEMENT',
    date: '2026-08-28',
    shortDescription:
      'Prototype announcement for training seats, certification pathways, and placement support.',
    image: images.skillTraining.primary,
    imageAlt: images.skillTraining.altKey,
    source: 'MahaSetu prototype',
    importance: 'high',
    keywords: ['skill', 'training', 'employment', 'job'],
  },
  {
    id: 'news-employment-exchange',
    title: 'Employment registration made simpler through a unified profile',
    category: 'POLICY',
    date: '2026-08-21',
    shortDescription:
      'Illustrative policy note on connecting employment exchanges with a single citizen profile.',
    image: images.employability.primary,
    imageAlt: images.employability.altKey,
    source: 'MahaSetu prototype',
    importance: 'medium',
    keywords: ['employment', 'job', 'registration', 'policy'],
  },
  {
    id: 'news-digital-services',
    title: 'Citizen facilitation centres to offer assisted digital services',
    category: 'CITIZEN UPDATE',
    date: '2026-08-14',
    shortDescription:
      'Sample citizen update describing in-person help for people applying online.',
    image: images.citizens.primary,
    imageAlt: images.citizens.altKey,
    source: 'MahaSetu prototype',
    importance: 'medium',
    keywords: ['citizen', 'centre', 'digital', 'help'],
  },
  {
    id: 'news-lpg-illustrative',
    title: 'Illustrative household fuel subsidy reminder',
    category: 'PRICE UPDATE',
    date: '2026-08-08',
    shortDescription:
      'Placeholder price-update card showing how subsidy or tariff notices could be surfaced.',
    image: images.government.primary,
    imageAlt: images.government.altKey,
    source: 'MahaSetu prototype',
    importance: 'low',
    keywords: ['price', 'subsidy', 'citizen'],
  },
  {
    id: 'news-education-support',
    title: 'Education support schemes grouped for Maharashtra students',
    category: 'SCHEME',
    date: '2026-07-30',
    shortDescription:
      'Demonstration of how certificates, benefits, and scholarships can appear together.',
    image: images.hero.primary,
    imageAlt: images.hero.altKey,
    source: 'MahaSetu prototype',
    importance: 'medium',
    keywords: ['education', 'scheme', 'certificate', 'student'],
  },
];

export function getNewsById(id: string) {
  return newsItems.find((item) => item.id === id);
}

export function searchNews(query: string): NewsItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return newsItems.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q) || q.includes(k))
  );
}
