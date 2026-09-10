export type DepartmentId = 'education' | 'employability';

export type Language = 'en' | 'hi' | 'mr';

<<<<<<< HEAD
=======
export const ROLES = {
  USER: 'USER',
  DEPARTMENT_OFFICER: 'DEPARTMENT_OFFICER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];
export type AuthMethod = 'MAHA_ID' | 'AADHAAR';

export interface AuthUser {
  id: string;
  name: string;
  mobile: string;
  district: string;
  preferredLanguage: Language;
  authMethod: AuthMethod;
  role: UserRole;
  department?: string;
}

>>>>>>> 824b4f9 (Landing + RBAC)
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_verification'
  | 'department_review'
  | 'approved'
  | 'rejected'
  | 'action_required';

export type DocumentStatus = 'verified' | 'available' | 'pending' | 'expired';

export interface Department {
  id: DepartmentId;
  name: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  department: DepartmentId;
  description: string;
  shortDescription: string;
  whoCanApply: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  process: string[];
  estimatedTime: string;
  importantInfo?: string;
  keywords: string[];
  popular?: boolean;
}

export interface TimelineStep {
  id: string;
  label: string;
  description?: string;
  date?: string;
  completed: boolean;
  current: boolean;
}

export interface Application {
  id: string;
  serviceId: string;
  serviceTitle: string;
  status: ApplicationStatus;
  submittedAt?: string;
  updatedAt: string;
  referenceNumber: string;
  timeline: TimelineStep[];
  progress?: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  updatedAt: string;
  fileName?: string;
}

export interface CitizenProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  mobile: string;
  aadhaar: string;
  education: string;
  institution?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  language: Language;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
  };
}

export type NewsCategory = 'SCHEME' | 'POLICY' | 'CITIZEN UPDATE' | 'PRICE UPDATE' | 'ANNOUNCEMENT';

export interface NewsItem {
  id: string;
  title: string;
  category: NewsCategory;
  date: string;
  shortDescription: string;
  image: string;
  imageAlt: string;
  source: string;
  importance: 'high' | 'medium' | 'low';
  keywords: string[];
}

export interface CarouselSlide {
  id: string;
  image: string;
  fallback: string;
  alt: string;
  label: string;
  caption: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface EligibilityAnswers {
  currentlyStudying?: boolean;
  educationLevel?: string;
  annualIncome?: string;
  location?: string;
  age?: string;
  employmentStatus?: string;
}

export interface EligibilityResult {
  eligible: boolean;
  confidence: 'high' | 'medium' | 'low';
  reasons: { text: string; met: boolean }[];
  summary: string;
}

export interface ApplicationFormData {
  personalDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    mobile: string;
    aadhaar: string;
  };
  eligibilityDetails: {
    educationLevel: string;
    institution: string;
    annualIncome: string;
    category: string;
  };
  selectedDocuments: string[];
  additionalNotes: string;
}

export interface DraftApplication {
  serviceId: string;
  currentStep: number;
  formData: ApplicationFormData;
  eligibilityAnswers?: EligibilityAnswers;
  savedAt: string;
}
