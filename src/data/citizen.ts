import type { Consent, Grievance, CitizenDocument } from '@/types'

export const initialDocuments: CitizenDocument[] = [
  { id: 'doc-001', name: 'Aadhaar Card (masked)', category: 'Identity', issuer: 'UIDAI (simulated)', issuedDate: '12 Mar 2019', status: 'verified', usedBy: ['Income Certificate', 'Driving Licence Renewal'], sizeKb: 240 },
  { id: 'doc-002', name: 'Maha ID Card', category: 'Identity', issuer: 'MahaSetu Identity Layer', issuedDate: '01 Jan 2026', status: 'verified', usedBy: ['All services'], sizeKb: 180 },
  { id: 'doc-003', name: 'Class X Marksheet', category: 'Education', issuer: 'Maharashtra State Board', issuedDate: '05 Jun 2018', status: 'verified', usedBy: ['Scholarship Application'], sizeKb: 890 },
  { id: 'doc-004', name: 'Class XII Marksheet', category: 'Education', issuer: 'Maharashtra State Board', issuedDate: '02 Jun 2020', status: 'verified', usedBy: ['Scholarship Application'], sizeKb: 910 },
  { id: 'doc-005', name: 'Income Certificate 2025', category: 'Income', issuer: 'Revenue Department', issuedDate: '14 Feb 2026', expiryDate: '13 Feb 2027', status: 'verified', usedBy: ['Scholarship Application', 'Old Age Pension'], sizeKb: 320 },
  { id: 'doc-006', name: 'Driving Licence', category: 'Identity', issuer: 'Transport Department', issuedDate: '03 Sep 2026', expiryDate: '02 Sep 2036', status: 'verified', usedBy: [], sizeKb: 410 },
  { id: 'doc-007', name: 'Property Tax Receipt', category: 'Property', issuer: 'Pune Municipal Corporation', issuedDate: '20 May 2026', status: 'verified', usedBy: [], sizeKb: 210 },
  { id: 'doc-008', name: 'Self-declaration of Income', category: 'Income', issuer: 'Self', issuedDate: '08 Sep 2026', status: 'action_required', usedBy: ['Income Certificate'], sizeKb: 130 },
  { id: 'doc-009', name: 'PAN Card', category: 'Identity', issuer: 'Income Tax Dept (simulated)', issuedDate: '22 Jul 2021', status: 'verified', usedBy: ['Business Registration'], sizeKb: 260 },
  { id: 'doc-010', name: 'Vaccination Record', category: 'Health', issuer: 'Health Department', issuedDate: '11 Aug 2024', status: 'verified', usedBy: [], sizeKb: 340 },
]

export const initialConsents: Consent[] = [
  { id: 'con-001', departmentId: 'revenue', dataRequested: 'Income certificate + last filed declaration', purpose: 'Scholarship eligibility verification', date: '03 Sep 2026', status: 'active', scope: 'Read-only · 30 days' },
  { id: 'con-002', departmentId: 'education', dataRequested: 'Enrolment status (Class XII marks)', purpose: 'Scholarship application MS-2026-004390', date: '02 Sep 2026', status: 'active', scope: 'Read-only · Single use' },
  { id: 'con-003', departmentId: 'transport', dataRequested: 'Address + age proof', purpose: 'Driving licence renewal', date: '28 Aug 2026', status: 'expired', scope: 'Read-only · Single use' },
  { id: 'con-004', departmentId: 'social', dataRequested: 'Age proof, income band', purpose: 'Old age pension eligibility', date: '16 Sep 2026', status: 'active', scope: 'Read-only · 60 days' },
  { id: 'con-005', departmentId: 'municipal', dataRequested: 'Property tax history', purpose: 'Water connection feasibility (withdrawn request)', date: '20 Jul 2026', status: 'denied', scope: '—' },
  { id: 'con-006', departmentId: 'health', dataRequested: 'Family member list + age proofs', purpose: 'Maha Arogya health cover enrolment — awaiting your approval', date: '19 Sep 2026', status: 'pending', scope: 'Read-only · 90 days' },
  { id: 'con-007', departmentId: 'agriculture', dataRequested: '7/12 land record + soil card', purpose: 'Saur Krushi solar pump subsidy — eligibility pre-check', date: '18 Sep 2026', status: 'pending', scope: 'Read-only · 30 days' },
]

export const initialGrievances: Grievance[] = [
  {
    id: 'GRV-2026-00231', citizenId: 'cit-001', citizenName: 'Aarav Sharma', category: 'Service Delay',
    departmentId: 'revenue', subject: 'Income certificate pending beyond SLA',
    description: 'My income certificate (MS-2026-004798) has crossed the 7-day SLA. The tehsil office says the file has not reached them yet.',
    location: 'Kothrud, Pune', status: 'assigned', slaHours: 72, createdAt: '15 Sep 2026, 09:20 AM',
    assignee: 'Meera Deshpande', attachments: 1,
    timeline: [
      { label: 'Submitted', time: '15 Sep, 09:20 AM', done: true },
      { label: 'Assigned to Sub-Divisional Officer', time: '15 Sep, 11:45 AM', done: true, note: 'Auto-routed by MahaSetu to Revenue Dept' },
      { label: 'Under Review', done: false },
      { label: 'Response', done: false },
      { label: 'Resolved', done: false },
    ],
  },
  {
    id: 'GRV-2026-00198', citizenId: 'cit-001', citizenName: 'Aarav Sharma', category: 'Wrong Information',
    departmentId: 'transport', subject: 'Licence renewal shows wrong RTO slot date',
    description: 'The appointment confirmation showed 2 Sep but the RTO system has 5 Sep. Please correct the record.',
    location: 'Hadapsar, Pune', status: 'resolved', slaHours: 96, createdAt: '1 Sep 2026, 05:50 PM',
    assignee: 'RTO Pune (East)', attachments: 0,
    response: 'Slot record corrected. Updated acknowledgement sent to your vault. Apologies for the inconvenience.',
    timeline: [
      { label: 'Submitted', time: '1 Sep, 05:50 PM', done: true },
      { label: 'Assigned to RTO Pune (East)', time: '2 Sep, 09:10 AM', done: true },
      { label: 'Under Review', time: '2 Sep, 04:30 PM', done: true },
      { label: 'Response', time: '3 Sep, 11:15 AM', done: true, note: 'Slot corrected by RTO office' },
      { label: 'Resolved', time: '3 Sep, 02:00 PM', done: true },
    ],
  },
]
