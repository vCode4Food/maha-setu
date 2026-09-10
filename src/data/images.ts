import maharashtraMap from '../assets/mahasetu/maharashtra-map.jpeg';
import atalSetu from '../assets/mahasetu/atal-setu.jpeg';

/**
 * Curated Maharashtra-specific editorial photos.
 * Wikimedia Commons (Special:FilePath) for landmarks; Unsplash for people/activity
 * scenes. Each asset is unique and mapped to a section.
 */

const wiki = (file: string, width = 1400) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const unsplash = (id: string, width = 1100) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const images = {
  // Page-specific replacements. These are intentionally separate from shared
  // image entries so no carousel, update card, or other surface is affected.
  welcomeMap: {
    primary: maharashtraMap,
    fallback: '/images/hero-fallback.svg',
    altKey: 'image.maharashtraMap',
  },
  atalSetu: {
    primary: atalSetu,
    fallback: '/images/impact-fallback.svg',
    altKey: 'image.atalSetu',
  },
  hero: {
    primary: unsplash('photo-1607748851687-ba9a10438621', 1400),
    fallback: '/images/hero-fallback.svg',
    altKey: 'image.hero',
  },
  impact: {
    primary: wiki('Marine_Drive_Mumbai.jpg', 1100),
    fallback: '/images/impact-fallback.svg',
    altKey: 'image.impact',
  },
  education: {
    primary: unsplash('photo-1580582932707-520aed937b7b', 1000),
    fallback: '/images/education-fallback.svg',
    altKey: 'image.education',
  },
  employability: {
    primary: unsplash('photo-1595658658481-d53d3f999875', 1000),
    fallback: '/images/employability-fallback.svg',
    altKey: 'image.employability',
  },
  skillTraining: {
    primary: unsplash('photo-1581092160562-40aa08e78837', 1000),
    fallback: '/images/skill-fallback.svg',
    altKey: 'image.skills',
  },
  citizens: {
    primary: unsplash('photo-1529253355930-ddbe423a2ac7', 1000),
    fallback: '/images/hero-fallback.svg',
    altKey: 'image.citizens',
  },
  government: {
    primary: wiki('Mumbai_03-2016_30_Gateway_of_India.jpg'),
    fallback: '/images/impact-fallback.svg',
    altKey: 'image.government',
  },
  infrastructure: {
    primary: wiki('Bandra–Worli_Sea_Link.jpg'),
    fallback: '/images/impact-fallback.svg',
    altKey: 'image.infrastructure',
  },
  civic: {
    primary: wiki('Chhatrapati_Shivaji_Maharaj_Terminus.jpg'),
    fallback: '/images/impact-fallback.svg',
    altKey: 'image.civic',
  },
  agriculture: {
    primary: unsplash('photo-1464226184884-fa280b87c399', 1000),
    fallback: '/images/impact-fallback.svg',
    altKey: 'image.agriculture',
  },
  transport: {
    primary: unsplash('photo-1514222709107-a180c68d72b4', 1000),
    fallback: '/images/impact-fallback.svg',
    altKey: 'image.transport',
  },
  students: {
    primary: unsplash('photo-1427504494785-3a9ca7044f45', 1000),
    fallback: '/images/education-fallback.svg',
    altKey: 'image.students',
  },
  documents: {
    primary: unsplash('photo-1454165804606-c3d57bc86b40', 1000),
    fallback: '/images/hero-fallback.svg',
    altKey: 'image.documents',
  },
  healthcare: {
    primary: unsplash('photo-1576091160550-2173dba999ef', 1000),
    fallback: '/images/hero-fallback.svg',
    altKey: 'image.healthcare',
  },
  assessment: {
    primary: unsplash('photo-1606326608606-aa0b62935f2b', 1000),
    fallback: '/images/skill-fallback.svg',
    altKey: 'image.assessment',
  },
} as const;

export const carouselSlides = [
  {
    id: 'slide-education',
    image: images.education.primary,
    fallback: images.education.fallback,
    altKey: images.education.altKey,
    labelKey: 'department.education.name',
    captionKey: 'carousel.education',
  },
  {
    id: 'slide-skills',
    image: images.skillTraining.primary,
    fallback: images.skillTraining.fallback,
    altKey: images.skillTraining.altKey,
    labelKey: 'carousel.skills',
    captionKey: 'carousel.skillsCaption',
  },
  {
    id: 'slide-digital',
    image: images.infrastructure.primary,
    fallback: images.infrastructure.fallback,
    altKey: images.infrastructure.altKey,
    labelKey: 'carousel.digital',
    captionKey: 'carousel.digitalCaption',
  },
  {
    id: 'slide-support',
    image: images.citizens.primary,
    fallback: images.citizens.fallback,
    altKey: images.citizens.altKey,
    labelKey: 'carousel.support',
    captionKey: 'carousel.supportCaption',
  },
];


export const maharashtraCarouselSlides = [
  { id: 'mh-mumbai', image: images.atalSetu.primary, fallback: images.atalSetu.fallback, altKey: images.atalSetu.altKey, labelKey: 'landing.culture.mumbai', captionKey: 'landing.culture.mumbai.body' },
  { id: 'mh-konkan', image: images.impact.primary, fallback: images.impact.fallback, altKey: images.impact.altKey, labelKey: 'landing.culture.konkan', captionKey: 'landing.culture.konkan.body' },
  { id: 'mh-heritage', image: images.civic.primary, fallback: images.civic.fallback, altKey: images.civic.altKey, labelKey: 'landing.culture.heritage', captionKey: 'landing.culture.heritage.body' },
  { id: 'mh-sahyadri', image: images.infrastructure.primary, fallback: images.infrastructure.fallback, altKey: images.infrastructure.altKey, labelKey: 'landing.culture.sahyadri', captionKey: 'landing.culture.sahyadri.body' },
] as const;


export const CAROUSEL_INTERVAL_MS = 92_000;

export type ImageKey = keyof typeof images;
