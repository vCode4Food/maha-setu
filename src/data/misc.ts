import type { Business, LifeEvent, NewsItem, ServiceCenter, DistrictStat, AuditLog, ChatMessage, OrchestrationFlow } from '@/types'

export const initialBusiness: Business = {
  id: 'biz-002', name: 'Sahyadri AgroTech', legalName: 'Sahyadri AgroTech Pvt. Ltd.',
  gstin: '27AABCS1429P1ZQ', cin: 'U01100PN2021PTC214455', type: 'Private Limited',
  registeredOn: '18 Mar 2021', status: 'active', complianceScore: 82, sector: 'Food Processing',
  address: 'Plot 14, MIDC Satpur, Nashik, Maharashtra 422007',
  licences: [
    { id: 'bl-1', name: 'FSSAI Food Safety Licence', authority: 'Food Safety & Standards Authority', expires: '14 Dec 2026', status: 'expiring' },
    { id: 'bl-2', name: 'Factory Licence', authority: 'Directorate of Industrial Safety & Health', expires: '30 Jun 2027', status: 'valid' },
    { id: 'bl-3', name: 'Trade Licence', authority: 'Nashik Municipal Corporation', expires: '08 Oct 2026', status: 'expiring' },
    { id: 'bl-4', name: 'GST Registration', authority: 'Finance & Taxation Dept', expires: '—', status: 'valid' },
  ],
}

export const initialLifeEvents: LifeEvent[] = [
  {
    id: 'starting-business', title: 'I am starting a business', tagline: 'Registration, licences and schemes in one guided journey',
    icon: 'Store', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&q=70&auto=format',
    needs: ['Company / proprietorship registration', 'Trade licence from your municipal body', 'Tax registrations (GST)', 'Local approvals & labour compliance'],
    services: ['business-registration', 'trade-licence', 'gst-registration', 'shramik-card', 'job-matching'],
    documents: ['PAN Card', 'Address proof', 'Rental deed / ownership proof', 'Photograph', 'Bank passbook'],
    departments: ['business', 'municipal', 'finance', 'labour'],
    timelineWeeks: '3–5 weeks typical',
    journey: [
      { title: 'Identify needs', detail: 'MahaSetu maps your goal to 5 registrations, licences and compliances across 4 departments.' },
      { title: 'Prepare documents', detail: 'Upload once to the vault — every service reuses the same set.' },
      { title: 'Apply & coordinate', detail: 'One application. MahaSetu orchestrates municipal, tax and labour checks in parallel.' },
      { title: 'Track & receive', detail: 'Track everything on one timeline; certificates land in your vault.' },
    ],
  },
  {
    id: 'had-baby', title: 'I had a baby', tagline: 'From birth registration to benefits, gently guided',
    icon: 'Baby', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=70&auto=format',
    needs: ['Birth registration with the municipal registrar', 'Birth certificate', 'Immunisation schedule', 'Child welfare benefits'],
    services: ['birth-certificate', 'immunisation', 'school-admission'],
    documents: ['Hospital discharge summary', 'Parent Maha ID', 'Address proof'],
    departments: ['revenue', 'health', 'education'],
    timelineWeeks: '1–3 weeks typical',
    journey: [
      { title: 'Register the birth', detail: 'Hospital notifies the registrar; you confirm details online.' },
      { title: 'Claim the certificate', detail: 'Digital birth certificate is issued straight to your vault.' },
      { title: 'Health & benefits', detail: 'Immunisation slots and child welfare schemes are surfaced automatically.' },
    ],
  },
  {
    id: 'getting-married', title: 'I am getting married', tagline: 'Registration and record updates, without the queues',
    icon: 'Heart', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45e?w=1200&q=70&auto=format',
    needs: ['Marriage registration', 'Name / address updates across records', 'Joint benefits enrolment'],
    services: ['income-certificate', 'water-connection'],
    documents: ['Marriage proof', 'Maha ID (both partners)', 'Address proof', 'Photographs'],
    departments: ['revenue', 'municipal', 'health'],
    timelineWeeks: '2–4 weeks typical',
    journey: [
      { title: 'Register the marriage', detail: 'Book a registrar slot; witnesses verified via Maha ID.' },
      { title: 'Update records', detail: 'One consent updates address across revenue, municipal and health records.' },
      { title: 'Family benefits', detail: 'Joint household schemes surfaced based on new family profile.' },
    ],
  },
  {
    id: 'looking-job', title: 'I am looking for a job', tagline: 'Employment registration to welfare cards',
    icon: 'Briefcase', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=70&auto=format',
    needs: ['Employment exchange registration', 'Skill-matched job alerts', 'Worker welfare card'],
    services: ['job-matching', 'shramik-card'],
    documents: ['Education certificates', 'Maha ID', 'Bank passbook'],
    departments: ['labour'],
    timelineWeeks: '1–2 weeks typical',
    journey: [
      { title: 'Register skills', detail: 'Employment exchange profile with verified education records from your vault.' },
      { title: 'Get matched', detail: 'Skill-matched openings and notifications.' },
      { title: 'Welfare coverage', detail: 'Shramik card unlocks welfare board benefits once employed.' },
    ],
  },
  {
    id: 'student', title: 'I am a student', tagline: 'Scholarships, admissions and certificates',
    icon: 'GraduationCap', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=70&auto=format',
    needs: ['Scholarship applications', 'Admission support', 'Bonafide and migration certificates'],
    services: ['scholarship', 'school-admission', 'caste-certificate'],
    documents: ['Marksheets', 'Income certificate', 'Caste certificate (if applicable)'],
    departments: ['education', 'social', 'revenue'],
    timelineWeeks: 'Varies by scheme',
    journey: [
      { title: 'Check eligibility', detail: 'MahaSetu pre-checks scholarship eligibility from your marks and income records.' },
      { title: 'Apply once', detail: 'Income fetched via consent — no repeated visits to the talathi.' },
      { title: 'Track disbursement', detail: 'Scholarship credit tracked to your bank account.' },
    ],
  },
  {
    id: 'farmer', title: 'I am a farmer', tagline: 'Land records to subsidies, one field view',
    icon: 'Wheat', image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=70&auto=format',
    needs: ['Land record access (7/12)', 'Crop subsidies and insurance', 'Solar pump and equipment support'],
    services: ['farmer-scheme', 'land-record-copy', 'income-certificate'],
    documents: ['7/12 land record', 'Aadhaar (masked)', 'Bank passbook'],
    departments: ['agriculture', 'revenue'],
    timelineWeeks: '2–3 weeks typical',
    journey: [
      { title: 'Link the farm', detail: '7/12 records fetched from the revenue archive with consent.' },
      { title: 'Match schemes', detail: 'Subsidies matched by crop, district and land size.' },
      { title: 'Receive support', detail: 'Subsidies credited or equipment sanctioned.' },
    ],
  },
  {
    id: 'moving', title: 'I am moving homes', tagline: 'Address updates across every department at once',
    icon: 'Home', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=70&auto=format',
    needs: ['Address change across departments', 'Ration card update', 'School transfer support'],
    services: ['property-tax', 'water-connection', 'school-admission'],
    documents: ['New address proof', 'Rent agreement / ownership proof', 'Maha ID'],
    departments: ['revenue', 'municipal', 'education'],
    timelineWeeks: '1–2 weeks typical',
    journey: [
      { title: 'Update once', detail: 'One address change request propagates to linked departments via consent.' },
      { title: 'Local services', detail: 'Property tax, water and school records migrate to the new locality.' },
    ],
  },
  {
    id: 'senior-citizen', title: 'I am a senior citizen', tagline: 'Pension, cards and care with dignity',
    icon: 'Armchair', image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=1200&q=70&auto=format',
    needs: ['Senior citizen card', 'Old age pension', 'Health cover enrolment'],
    services: ['senior-card', 'old-age-pension', 'ayushman-card'],
    documents: ['Age proof', 'Aadhaar (masked)', 'Bank passbook'],
    departments: ['social', 'health'],
    timelineWeeks: '2–3 weeks typical',
    journey: [
      { title: 'Verify age automatically', detail: 'Birth records verified from the civil registry — no affidavits.' },
      { title: 'Pension & cover', detail: 'Pension application plus health assurance enrolment together.' },
    ],
  },
  {
    id: 'healthcare', title: 'I need healthcare', tagline: 'Coverage, appointments and records',
    icon: 'HeartPulse', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=70&auto=format',
    needs: ['Health assurance card', 'Hospital appointments', 'Medical certificates'],
    services: ['ayushman-card', 'immunisation', 'divyang-certificate'],
    documents: ['Aadhaar (masked)', 'Ration card', 'Income certificate'],
    departments: ['health'],
    timelineWeeks: '1–2 weeks typical',
    journey: [
      { title: 'Check coverage', detail: 'Family eligibility for health assurance checked instantly.' },
      { title: 'Book care', detail: 'Appointments at empanelled hospitals with digital tokens.' },
    ],
  },
  {
    id: 'financial-assistance', title: 'I need financial assistance', tagline: 'Every scheme you qualify for, surfaced honestly',
    icon: 'HandCoins', image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=70&auto=format',
    needs: ['Pension schemes', 'Welfare board benefits', 'Emergency support'],
    services: ['old-age-pension', 'widow-pension', 'shramik-card'],
    documents: ['Income certificate', 'Bank passbook', 'Maha ID'],
    departments: ['social', 'labour'],
    timelineWeeks: 'Varies by scheme',
    journey: [
      { title: 'Match schemes', detail: 'Eligibility engine checks income, age and category bands.' },
      { title: 'Apply', detail: 'Documents pulled from vault; applications tracked together.' },
    ],
  },
]

export const initialNews: NewsItem[] = [
  {
    id: 'news-1', title: 'MahaSetu crosses 2.4 crore verified citizen profiles', departmentId: 'revenue', date: '18 Sep 2026',
    category: 'Breaking', excerpt: 'The unified identity layer now covers 82% of the adult population.',
    body: 'The MahaSetu identity layer has completed verification of 2.4 crore citizen profiles, enabling paperless service delivery across 36 connected departments. Officials report average processing time for certificates has fallen from 21 days to 6 days since interoperability went live in January.',
    gist: { who: 'All citizens with a Maha ID', get: 'Faster certificate processing (avg 6 days)', need: 'Aadhaar-linked Maha ID', apply: 'Automatic — no action needed', deadline: '—', department: 'Revenue & Land Records' },
  },
  {
    id: 'news-2', title: 'Scholarship window closes 30 September', departmentId: 'education', date: '16 Sep 2026',
    category: 'Scheme Update', excerpt: 'Post-matric and merit scholarships accept applications until month end.',
    body: 'Students applying for post-matric and merit scholarships must submit applications by 30 September. Income certificates are now fetched automatically via MahaSetu consent — students no longer need to visit the tehsil office for verification.',
    gist: { who: 'Students in recognised institutions', get: 'Tuition reimbursement & maintenance allowance', need: 'Income certificate, marksheets, bank passbook', apply: 'Apply via MahaSetu → Scholarships', deadline: '30 Sep 2026', department: 'Education Department' },
  },
  {
    id: 'news-3', title: 'Property tax: 5% early-bird rebate until 15 October', departmentId: 'municipal', date: '14 Sep 2026',
    category: 'Announcement', excerpt: 'Pay annual property tax early and save with the municipal rebate.',
    body: 'Municipal corporations across the state announced a 5% rebate on annual property tax paid in full before 15 October. Receipts are archived automatically to the MahaSetu vault and can be reused for water and building applications.',
    gist: { who: 'Property owners in municipal areas', get: '5% rebate on annual property tax', need: 'Property assessment number', apply: 'MahaSetu → Property Tax Payment', deadline: '15 Oct 2026', department: 'Municipal Administration' },
  },
  {
    id: 'news-4', title: 'Saur Krushi Yojana: new monthly review cycle', departmentId: 'agriculture', date: '12 Sep 2026',
    category: 'Scheme Update', excerpt: 'Solar pump subsidy applications now reviewed on the 1st of every month.',
    body: 'The Agriculture Department moved solar pump subsidy applications to a monthly review cycle. Farmers applying before month end receive eligibility confirmation within 10 working days of the review date.',
    gist: { who: 'Farmers with 7/12 land records', get: 'Up to 95% subsidy on solar pumps', need: '7/12 record, Aadhaar, bank passbook', apply: 'MahaSetu → Farmer Scheme Application', deadline: 'Rolling monthly', department: 'Agriculture Department' },
  },
  {
    id: 'news-5', title: 'Monsoon readiness: flood helplines integrated with MahaSetu', departmentId: 'health', date: '10 Sep 2026',
    category: 'Local Update', excerpt: 'District emergency registries now sync with response teams in 14 districts.',
    body: 'District collectors in 14 flood-prone districts integrated emergency support registries with MahaSetu. Households that pre-registered medical needs receive priority dispatch coordination during monsoon emergencies.',
    gist: { who: 'Households in flood-prone districts', get: 'Priority emergency response coordination', need: 'Registered Maha ID household', apply: 'MahaSetu → Emergency Support Registry', deadline: '—', department: 'Health & Family Welfare' },
  },
  {
    id: 'news-6', title: 'Business single-window clears 10,000th registration', departmentId: 'business', date: '8 Sep 2026',
    category: 'Announcement', excerpt: 'Average business registration time drops to 8 working days.',
    body: 'The MahaEase single-window on MahaSetu processed its 10,000th business registration. Municipal, tax and labour clearances that earlier took 6 separate applications are now coordinated by the platform in parallel, cutting average registration time from 45 to 8 working days.',
    gist: { who: 'New entrepreneurs and MSMEs', get: 'Registration in ~8 working days', need: 'PAN, address proof, rental deed', apply: 'MahaSetu → Business Registration', deadline: '—', department: 'Business Services (MahaEase)' },
  },
]

export const serviceCenters: ServiceCenter[] = [
  { id: 'c1', name: 'MahaSetu Seva Kendra — Kothrud', type: 'CSC', city: 'Pune', district: 'Pune', state: 'Maharashtra', distanceKm: 1.2, open: '08:00', close: '20:00', phone: '020 2530 1100', services: ['Certificates', 'Pension', 'Bill payments'] },
  { id: 'c2', name: 'District Collectorate', type: 'District Office', city: 'Pune', district: 'Pune', state: 'Maharashtra', distanceKm: 4.8, open: '10:00', close: '17:30', phone: '020 2600 0000', services: ['Revenue', 'Election', 'Land records'] },
  { id: 'c3', name: 'Yerawada RTO', type: 'Transport Office', city: 'Pune', district: 'Pune', state: 'Maharashtra', distanceKm: 7.1, open: '09:30', close: '18:00', phone: '020 2700 1500', services: ['Licences', 'Vehicle RC', 'Permits'] },
  { id: 'c4', name: 'Sassoon General Hospital', type: 'Hospital', city: 'Pune', district: 'Pune', state: 'Maharashtra', distanceKm: 5.5, open: '24×7', close: '—', phone: '020 2612 8000', services: ['Health schemes', 'Certificates', 'Emergency'] },
  { id: 'c5', name: 'Ward Office — Warje', type: 'Municipal Ward Office', city: 'Pune', district: 'Pune', state: 'Maharashtra', distanceKm: 6.3, open: '10:00', close: '17:00', phone: '020 2530 9000', services: ['Trade licence', 'Property tax', 'Water'] },
  { id: 'c6', name: 'MIDC Business Facilitation Cell', type: 'Business Support Center', city: 'Pune', district: 'Pune', state: 'Maharashtra', distanceKm: 9.0, open: '10:00', close: '17:00', phone: '020 2747 0000', services: ['Business registration', 'Compliance'] },
  { id: 'c7', name: 'MahaSetu Seva Kendra — Fort', type: 'CSC', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', distanceKm: 0.9, open: '08:00', close: '20:00', phone: '022 2266 3400', services: ['Certificates', 'Pension', 'RTI'] },
  { id: 'c8', name: 'Ward Office — Churchgate', type: 'Municipal Ward Office', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', distanceKm: 1.6, open: '10:00', close: '17:00', phone: '022 2262 1200', services: ['Property tax', 'Trade licence', 'Water'] },
  { id: 'c9', name: 'MahaSetu Seva Kendra — Thane West', type: 'CSC', city: 'Thane', district: 'Thane', state: 'Maharashtra', distanceKm: 1.1, open: '08:00', close: '20:00', phone: '022 2533 7700', services: ['Certificates', 'Bill payments', 'Pension'] },
  { id: 'c10', name: 'District Collectorate — Thane', type: 'District Office', city: 'Thane', district: 'Thane', state: 'Maharashtra', distanceKm: 2.4, open: '10:00', close: '17:30', phone: '022 2534 8100', services: ['Revenue', 'Land records', 'Election'] },
  { id: 'c11', name: 'MahaSetu Seva Kendra — Nashik Road', type: 'CSC', city: 'Nashik', district: 'Nashik', state: 'Maharashtra', distanceKm: 1.4, open: '08:00', close: '20:00', phone: '0253 246 5500', services: ['Certificates', 'Pension', 'Licences'] },
  { id: 'c12', name: 'Nashik RTO', type: 'Transport Office', city: 'Nashik', district: 'Nashik', state: 'Maharashtra', distanceKm: 3.2, open: '09:30', close: '18:00', phone: '0253 281 0200', services: ['Licences', 'Vehicle RC', 'Permits'] },
  { id: 'c13', name: 'MahaSetu Seva Kendra — Osmanpura', type: 'CSC', city: 'Chh. Sambhajinagar', district: 'Chh. Sambhajinagar', state: 'Maharashtra', distanceKm: 1.8, open: '08:30', close: '20:00', phone: '0240 234 6600', services: ['Certificates', 'Bill payments', 'Pension'] },
  { id: 'c14', name: 'District Collectorate — Chh. Sambhajinagar', type: 'District Office', city: 'Chh. Sambhajinagar', district: 'Chh. Sambhajinagar', state: 'Maharashtra', distanceKm: 2.6, open: '10:00', close: '17:30', phone: '0240 233 4400', services: ['Revenue', 'Land records', 'Election'] },
  { id: 'c15', name: 'MahaSetu Seva Kendra — Rajarampuri', type: 'CSC', city: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', distanceKm: 1.2, open: '08:00', close: '20:00', phone: '0231 269 2200', services: ['Certificates', 'Pension', 'Bill payments'] },
  { id: 'c16', name: 'Kolhapur RTO', type: 'Transport Office', city: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', distanceKm: 2.9, open: '09:30', close: '18:00', phone: '0231 265 0300', services: ['Licences', 'Vehicle RC', 'Permits'] },
  { id: 'c17', name: 'MahaSetu Seva Kendra — Rajapeth', type: 'CSC', city: 'Amravati', district: 'Amravati', state: 'Maharashtra', distanceKm: 1.5, open: '08:00', close: '20:00', phone: '0721 266 3300', services: ['Certificates', 'Bill payments', 'RTI'] },
  { id: 'c18', name: 'District Collectorate — Amravati', type: 'District Office', city: 'Amravati', district: 'Amravati', state: 'Maharashtra', distanceKm: 2.2, open: '10:00', close: '17:30', phone: '0721 267 1100', services: ['Revenue', 'Land records', 'Election'] },
  { id: 'c19', name: 'MahaSetu Seva Kendra — Civil Lines', type: 'CSC', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', distanceKm: 1.0, open: '08:00', close: '20:00', phone: '0712 256 4400', services: ['Certificates', 'Pension', 'Health schemes'] },
  { id: 'c20', name: 'Nagpur RTO', type: 'Transport Office', city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', distanceKm: 3.8, open: '09:30', close: '18:00', phone: '0712 264 0500', services: ['Licences', 'Vehicle RC', 'Permits'] },
]

export const districtStats: DistrictStat[] = [
  { id: 'mumbai-city', name: 'Mumbai City', path: 'M60,178 L108,166 L118,196 L92,214 L64,204 Z', populationServed: '31 L', services: 128, applications: 96200, departments: 34, pending: 4120, centers: 210, load: 94 },
  { id: 'thane', name: 'Thane', path: 'M96,118 L172,104 L192,148 L148,178 L104,168 Z', populationServed: '1.2 Cr', services: 96, applications: 78400, departments: 30, pending: 3480, centers: 186, load: 86 },
  { id: 'pune', name: 'Pune', path: 'M158,218 L252,206 L276,262 L226,308 L162,286 Z', populationServed: '1.1 Cr', services: 118, applications: 88600, departments: 35, pending: 3960, centers: 224, load: 91 },
  { id: 'nashik', name: 'Nashik', path: 'M124,142 L196,120 L214,172 L172,206 L128,192 Z', populationServed: '68 L', services: 84, applications: 52300, departments: 28, pending: 2410, centers: 152, load: 78 },
  { id: 'chhatrapati-sambhajinagar', name: 'Chh. Sambhajinagar', path: 'M228,168 L308,158 L326,210 L272,244 L234,220 Z', populationServed: '47 L', services: 72, applications: 41700, departments: 26, pending: 1980, centers: 128, load: 72 },
  { id: 'kolhapur', name: 'Kolhapur', path: 'M118,304 L196,292 L212,344 L156,376 L114,348 Z', populationServed: '41 L', services: 66, applications: 36400, departments: 24, pending: 1640, centers: 112, load: 69 },
  { id: 'amravati', name: 'Amravati', path: 'M388,128 L470,118 L492,168 L436,204 L392,178 Z', populationServed: '25 L', services: 54, applications: 29800, departments: 22, pending: 1240, centers: 96, load: 63 },
  { id: 'nagpur', name: 'Nagpur', path: 'M452,196 L528,190 L546,244 L492,282 L450,248 Z', populationServed: '36 L', services: 78, applications: 44500, departments: 27, pending: 2110, centers: 138, load: 75 },
]

export const initialAuditLogs: AuditLog[] = [
  { id: 'a1', time: '18 Sep, 10:42 AM', actor: 'Meera Deshpande', role: 'Official · Revenue', action: 'Opened application for officer review', entity: 'MS-2026-004821', status: 'success' },
  { id: 'a2', time: '18 Sep, 10:39 AM', actor: 'Revenue Department', role: 'System · Connector', action: 'Requested income certificate for verification', entity: 'MS-2026-004798', status: 'success' },
  { id: 'a3', time: '18 Sep, 10:36 AM', actor: 'Aarav Sharma', role: 'Citizen', action: 'Granted consent to Education Dept', entity: 'CON-002', status: 'success' },
  { id: 'a4', time: '18 Sep, 10:30 AM', actor: 'MahaSetu Engine', role: 'System · Orchestrator', action: 'Initiated cross-department service request', entity: 'MS-2026-004821', status: 'success' },
  { id: 'a5', time: '18 Sep, 10:22 AM', actor: 'Kavita Patil', role: 'Business', action: 'Submitted FSSAI renewal application', entity: 'MS-2026-004849', status: 'success' },
  { id: 'a6', time: '18 Sep, 10:05 AM', actor: 'Housing Connector', role: 'System · Connector', action: 'Department response delayed', entity: 'HSG-API-3', status: 'warning' },
  { id: 'a7', time: '18 Sep, 09:58 AM', actor: 'Rohan Bhosale', role: 'Citizen', action: 'Downloaded certified land record', entity: 'MS-2026-004851', status: 'success' },
  { id: 'a8', time: '18 Sep, 09:41 AM', actor: 'Unknown session', role: '—', action: 'Failed admin console login (rate-limited)', entity: 'AUTH-GW', status: 'denied' },
]

export const orchFlowSeed: OrchestrationFlow = {
  id: 'orch-1', applicationId: 'MS-2026-004821', title: 'Business Registration — coordinated pipeline',
  citizen: 'Aarav Sharma', startedAt: '15 Sep 2026, 02:30 PM',
  steps: [
    { id: 's1', seq: 1, departmentId: 'revenue', departmentName: 'Revenue & Land Records', title: 'Identity & address verification', detail: 'Aadhaar-linked Maha ID checked; address validated with utility records.', status: 'completed', requestId: 'REQ-88101', timestamp: '15 Sep, 02:32 PM', response: '200 OK · 210ms' },
    { id: 's2', seq: 2, departmentId: 'municipal', departmentName: 'Municipal Administration', title: 'Zoning & premises check', detail: 'Premises at Baner Road verified as commercial-permitted zone.', status: 'completed', requestId: 'REQ-88102', timestamp: '15 Sep, 02:41 PM', response: '200 OK · 260ms' },
    { id: 's3', seq: 3, departmentId: 'finance', departmentName: 'Finance & Taxation', title: 'Tax registration pre-clearance', detail: 'PAN validated; no outstanding dues found.', status: 'completed', requestId: 'REQ-88103', timestamp: '15 Sep, 02:55 PM', response: '200 OK · 190ms' },
    { id: 's4', seq: 4, departmentId: 'labour', departmentName: 'Labour & Employment', title: 'Labour compliance requirement', detail: 'Shops & Establishments registration flagged as required post-incorporation.', status: 'processing', requestId: 'REQ-88104' },
    { id: 's5', seq: 5, departmentId: 'business', departmentName: 'Business Services (MahaEase)', title: 'Final approval & certificate', detail: 'Certificate generation pending labour response.', status: 'pending' },
  ],
}

export const chatSeed: ChatMessage[] = [
  { id: 'c0', from: 'bot', text: 'Namaste 🙏 I am MahaSetu Sahayak — your guide to every government service. Ask me about schemes, documents, applications or life events.' },
]
