import type { Notif } from '@/types'

export const initialNotifications: Notif[] = [
  { id: 'n1', type: 'application', title: 'Officer review started', body: 'Your Business Registration (MS-2026-004821) is now with the Sub-Divisional Officer.', time: '25 min ago', read: false, audience: ['citizen'], link: '/citizen/applications/MS-2026-004821' },
  { id: 'n2', type: 'document', title: 'Document needs your attention', body: 'Self-declaration of income was flagged as illegible in MS-2026-004798. Please re-upload.', time: '2 hours ago', read: false, audience: ['citizen'], link: '/citizen/applications/MS-2026-004798' },
  { id: 'n3', type: 'scheme', title: 'New scheme matches your profile', body: 'Maha Nurture Merit Scholarship closes 30 Sep — check your eligibility.', time: 'Yesterday', read: false, audience: ['citizen'], link: '/citizen/schemes' },
  { id: 'n4', type: 'grievance', title: 'Grievance assigned', body: 'GRV-2026-00231 assigned to Sub-Divisional Officer, Revenue. SLA: 72 hours.', time: 'Yesterday', read: true, audience: ['citizen'], link: '/citizen/grievances' },
  { id: 'n5', type: 'payment', title: 'Receipt archived', body: '₹600 paid for Driving Licence Renewal. Receipt added to your vault.', time: '3 Sep', read: true, audience: ['citizen'], link: '/citizen/documents' },
  { id: 'n6', type: 'application', title: 'Certificate delivered to vault', body: 'Driving Licence renewed successfully — MS-2026-004654 completed.', time: '3 Sep', read: true, audience: ['citizen'], link: '/citizen/applications/MS-2026-004654' },
  { id: 'n7', type: 'security', title: 'Consent granted', body: 'You allowed Education Department to verify enrolment status (single use).', time: '2 Sep', read: true, audience: ['citizen'], link: '/citizen/consent' },
]

export const officialSeedNotifications: Notif[] = [
  { id: 'o1', type: 'application', title: 'High priority case assigned', body: 'MS-2026-004821 (Business Registration) assigned to you for officer review.', time: '25 min ago', read: false, audience: ['official'], link: '/official/applications/MS-2026-004821' },
  { id: 'o2', type: 'grievance', title: 'Grievance within SLA', body: 'GRV-2026-00231 is at 60% of its 72-hour SLA.', time: '1 hour ago', read: false, audience: ['official'], link: '/official/grievances' },
  { id: 'o3', type: 'department', title: 'Department notice', body: 'Revenue Dept: New stamp duty circular effective 20 Sep — see reports.', time: 'Yesterday', read: true, audience: ['official'] },
]
