export type Role = 'citizen' | 'official' | 'business' | 'department_admin' | 'super_admin'

export type Lang = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu' | 'kn'

export interface User {
  id: string
  name: string
  role: Role
  /** citizen-only */
  mahaId?: string
  /** masked, demo only */
  aadhaarMasked?: string
  location?: string
  avatar?: string
  designation?: string
  departmentId?: string
  businessName?: string
  gstin?: string
}

export type HealthStatus = 'connected' | 'healthy' | 'syncing' | 'warning' | 'offline'

export interface Department {
  id: string
  name: string
  shortName: string
  domain: string
  servicesCount: number
  status: HealthStatus
  lastSync: string
  responseMs: number
  requests24h: number
  dataExchanged: string
  color: string
  description: string
}

export type ServiceCategory =
  | 'Health' | 'Education' | 'Agriculture' | 'Transport' | 'Revenue'
  | 'Employment' | 'Social Welfare' | 'Business' | 'Housing' | 'Utilities'
  | 'Identity' | 'Certificates' | 'Women & Child' | 'Senior Citizens'
  | 'Disability' | 'Emergency Services'

export type ServiceMode = 'online' | 'offline' | 'hybrid'
export type ServiceStatus = 'active' | 'disabled' | 'maintenance'

export interface Service {
  id: string
  name: string
  departmentId: string
  category: ServiceCategory
  description: string
  mode: ServiceMode
  status: ServiceStatus
  fee: number
  slaDays: number
  processingTime: string
  eligibility: string[]
  documents: string[]
  steps: string[]
  popularity: number
  version: string
  icon?: string
  relatedSchemes?: string[]
  relatedServices?: string[]
}

export interface Scheme {
  id: string
  name: string
  departmentId: string
  category: ServiceCategory
  benefit: string
  benefitAmount: string
  description: string
  eligibility: string[]
  documents: string[]
  deadline: string
  applicationMode: 'online' | 'offline' | 'assisted'
  status: 'open' | 'closing-soon' | 'ongoing'
  linkedServiceId?: string
  image?: string
}

export type ApplicationStatus =
  | 'draft' | 'submitted' | 'under_review' | 'action_required'
  | 'processing' | 'approved' | 'rejected' | 'completed'

export type WorkflowStage =
  | 'Submitted' | 'Document Verification' | 'Department Processing'
  | 'Officer Review' | 'Approval' | 'Completed'

export interface ApplicationEvent {
  stage: WorkflowStage
  status: 'done' | 'active' | 'pending' | 'failed'
  time?: string
  note?: string
  actor?: string
}

export interface Application {
  id: string
  citizenId: string
  citizenName?: string
  serviceId: string
  serviceName: string
  departmentId: string
  status: ApplicationStatus
  submittedAt: string
  expectedCompletion: string
  assignedOfficer?: string
  currentStage: WorkflowStage
  events: ApplicationEvent[]
  actionRequired?: string
  documents: { name: string; fromVault: boolean; verified: boolean }[]
  fee: number
  priority: 'normal' | 'high' | 'low'
  district: string
  remarks?: { author: string; role: 'citizen' | 'official' | 'system'; text: string; time: string }[]
}

export type DocStatus = 'verified' | 'pending' | 'expired' | 'action_required'

export interface CitizenDocument {
  id: string
  name: string
  category: 'Identity' | 'Education' | 'Certificates' | 'Income' | 'Property' | 'Business' | 'Health' | 'Other'
  issuer: string
  issuedDate: string
  expiryDate?: string
  status: DocStatus
  usedBy?: string[]
  sizeKb?: number
}

/* ---------------- Authentication & session (simulated) ---------------- */
export type UserRole = Role

export interface DemoAccount {
  mahaId: string
  password: string
  role: Role
  name: string
  maskedMobile: string
  email: string
}

export interface AuthSession {
  sessionId: string
  mahaId: string
  userId: string
  role: Role
  loginAt: string
  lastActivity: number
  expiresAt: number
}

export interface OTPChallenge {
  otp: string
  mahaId: string
  purpose: 'login' | 'recovery-maha-id' | 'reset-password' | 'register'
  expiresAt: number
  attemptsLeft: number
  resendIn: number
}

export interface RegistrationData {
  fullName: string
  mobile: string
  email: string
  dob: string
  state: string
  district: string
}

export type ConsentStatus = 'active' | 'revoked' | 'denied' | 'expired' | 'pending'

export interface Consent {
  id: string
  departmentId: string
  dataRequested: string
  purpose: string
  date: string
  status: 'active' | 'revoked' | 'denied' | 'expired' | 'pending'
  scope: string
}

export type GrievanceStatus = 'submitted' | 'assigned' | 'under_review' | 'responded' | 'resolved' | 'escalated'

export interface Grievance {
  id: string
  citizenId: string
  citizenName?: string
  category: string
  departmentId: string
  subject: string
  description: string
  location: string
  status: GrievanceStatus
  slaHours: number
  createdAt: string
  assignee?: string
  timeline: { label: string; time?: string; note?: string; done: boolean }[]
  attachments?: number
  response?: string
}

export type NotifType = 'application' | 'document' | 'scheme' | 'grievance' | 'department' | 'security' | 'payment' | 'system'

export interface Notif {
  id: string
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
  audience: Role[]
  link?: string
}

export interface Business {
  id: string
  name: string
  legalName: string
  gstin: string
  cin: string
  type: 'Private Limited' | 'LLP' | 'Partnership' | 'Proprietorship'
  registeredOn: string
  status: 'active' | 'under_review' | 'pending'
  complianceScore: number
  sector: string
  address: string
  licences: BusinessLicence[]
}

export interface BusinessLicence {
  id: string
  name: string
  authority: string
  expires: string
  status: 'valid' | 'expiring' | 'expired' | 'renewal_in_progress'
  applicationId?: string
}

export interface LifeEventStep {
  title: string
  detail: string
  serviceIds?: string[]
}

export interface LifeEvent {
  id: string
  title: string
  tagline: string
  icon: string
  image?: string
  needs: string[]
  services: string[]
  documents: string[]
  departments: string[]
  timelineWeeks: string
  journey: LifeEventStep[]
}

export interface OrchestrationStep {
  id: string
  seq: number
  departmentId: string
  departmentName: string
  title: string
  detail: string
  status: 'pending' | 'processing' | 'completed' | 'warning'
  requestId?: string
  timestamp?: string
  response?: string
}

export interface OrchestrationFlow {
  id: string
  applicationId?: string
  title: string
  citizen: string
  startedAt: string
  steps: OrchestrationStep[]
}

export interface AuditLogEntry {
  id: string
  at: number
  kind: '404' | 'route_denied'
  path: string
  role: string | null
  userId: string | null
}

export interface AuditLog {
  id: string
  time: string
  actor: string
  role: string
  action: string
  entity: string
  status: 'success' | 'pending' | 'warning' | 'denied'
}

export interface NewsItem {
  id: string
  title: string
  departmentId: string
  date: string
  category: 'Announcement' | 'Scheme Update' | 'Notice' | 'Local Update' | 'Breaking'
  excerpt: string
  body: string
  gist?: { who: string; get: string; need: string; apply: string; deadline: string; department: string }
}

export interface ServiceCenter {
  id: string
  name: string
  type: 'CSC' | 'District Office' | 'Hospital' | 'Transport Office' | 'Municipal Ward Office' | 'Business Support Center'
  city: string
  district: string
  state: string
  distanceKm: number
  open: string
  close: string
  phone: string
  services: string[]
}

export interface DistrictStat {
  id: string
  name: string
  /** SVG polygon points for stylized map */
  path: string
  populationServed: string
  services: number
  applications: number
  departments: number
  pending: number
  centers: number
  load: number
}

export interface ChatMessage {
  id: string
  from: 'user' | 'bot'
  text: string
  chips?: string[]
  link?: { label: string; to: string }
}

export interface Toast {
  id: string
  kind: 'success' | 'info' | 'warning' | 'error'
  title: string
  body?: string
}
