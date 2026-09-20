import type { DemoAccount } from '@/types'

/*
 * PROTOTYPE DEMO CREDENTIALS — fictional accounts for demonstration only.
 * Never represent these as production credentials; passwords are shown on
 * the login screen purely so presenters can authenticate instantly.
 */
export const demoAccounts: DemoAccount[] = [
  { mahaId: 'MS-CIT-1001', password: 'Citizen@2026', role: 'citizen', name: 'Aarav Sharma', maskedMobile: '+91 98XXXXXX42', email: 'aarav.sharma@example.in' },
  { mahaId: 'MS-OFF-2001', password: 'Official@2026', role: 'official', name: 'Meera Deshpande', maskedMobile: '+91 90XXXXXX18', email: 'meera.deshpande@example.gov.in' },
  { mahaId: 'MS-BIZ-3001', password: 'Business@2026', role: 'business', name: 'Kavita Patil', maskedMobile: '+91 91XXXXXX77', email: 'kavita@sahyadriagro.in' },
  { mahaId: 'MS-DAD-4001', password: 'DeptAdmin@2026', role: 'department_admin', name: 'Rajesh Kulkarni', maskedMobile: '+91 93XXXXXX05', email: 'rajesh.kulkarni@example.gov.in' },
  { mahaId: 'MS-ADM-5001', password: 'SuperAdmin@2026', role: 'super_admin', name: 'Dr. Anand Iyer', maskedMobile: '+91 98XXXXXX01', email: 'anand.iyer@example.gov.in' },
]

export function accountByMahaId(id: string): DemoAccount | undefined {
  return demoAccounts.find((a) => a.mahaId.toLowerCase() === id.trim().toLowerCase())
}

/* Registered citizens persist in sessionStorage across the demo. */
export const REGISTERED_KEY = 'mahasetu-registered-accounts'

export interface RegisteredCitizen {
  mahaId: string
  password: string
  fullName: string
  mobile: string
  email: string
}

export function loadRegistered(): RegisteredCitizen[] {
  try {
    return JSON.parse(sessionStorage.getItem(REGISTERED_KEY) ?? '[]') as RegisteredCitizen[]
  } catch {
    return []
  }
}

export function saveRegistered(list: RegisteredCitizen[]) {
  try {
    sessionStorage.setItem(REGISTERED_KEY, JSON.stringify(list))
  } catch { /* storage unavailable */ }
}

/* ---------------- Mock DigiLocker document library (fetch-only) ---------------- */
export interface DigiLockerDoc {
  id: string
  name: string
  issuer: string
  category: 'Identity' | 'Certificates' | 'Income' | 'Property' | 'Business' | 'Health' | 'Education' | 'Other'
  issuedDate: string
  status: string
  maskedNumber: string
  verified: boolean
}

export const digilockerLibrary: DigiLockerDoc[] = [
  { id: 'dl-aadhaar', name: 'Aadhaar Card (masked)', issuer: 'UIDAI', category: 'Identity', issuedDate: '12 Mar 2019', status: 'Verified — Demo', maskedNumber: 'XXXX XXXX 4821', verified: true },
  { id: 'dl-pan', name: 'PAN Card', issuer: 'Income Tax Department', category: 'Identity', issuedDate: '04 Jul 2018', status: 'Verified — Demo', maskedNumber: 'ABCPX1234F', verified: true },
  { id: 'dl-income', name: 'Income Certificate', issuer: 'Tehsil Office, Pune', category: 'Income', issuedDate: '21 Jun 2026', status: 'Verified — Demo', maskedNumber: 'INC/2026/00871', verified: true },
  { id: 'dl-domicile', name: 'Domicile Certificate', issuer: 'Tehsil Office, Pune', category: 'Certificates', issuedDate: '21 Jun 2026', status: 'Verified — Demo', maskedNumber: 'DOM/2025/01142', verified: true },
  { id: 'dl-caste', name: 'Caste Certificate', issuer: 'Executive Magistrate, Pune', category: 'Certificates', issuedDate: '09 Feb 2020', status: 'Verified — Demo', maskedNumber: 'CST/2020/00338', verified: true },
  { id: 'dl-birth', name: 'Birth Certificate', issuer: 'Pune Municipal Corporation', category: 'Certificates', issuedDate: '14 Aug 2004', status: 'Verified — Demo', maskedNumber: 'PMC/BR/2004/117', verified: true },
  { id: 'dl-dl', name: 'Driving Licence', issuer: 'RTO Pune (MH-12)', category: 'Identity', issuedDate: '30 Nov 2022', status: 'Verified — Demo', maskedNumber: 'MH12 20210004821', verified: true },
  { id: 'dl-rc', name: 'Vehicle Registration Certificate', issuer: 'RTO Pune (MH-12)', category: 'Identity', issuedDate: '18 Jan 2021', status: 'Verified — Demo', maskedNumber: 'MH 12 AB 4821', verified: true },
  { id: 'dl-education', name: 'Education Certificate (HSC)', issuer: 'Maharashtra State Board', category: 'Education', issuedDate: '25 May 2022', status: 'Verified — Demo', maskedNumber: 'HSC/2022/SEAT-22871', verified: true },
  { id: 'dl-ration', name: 'Ration Card', issuer: 'Food & Civil Supplies, Maharashtra', category: 'Other', issuedDate: '02 Oct 2021', status: 'Verified — Demo', maskedNumber: 'RC/PUNE/271083', verified: true },
]
