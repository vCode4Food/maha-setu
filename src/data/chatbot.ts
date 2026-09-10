export interface ChatAction {
  id: string;
  label: string;
  type: 'navigate' | 'prompt' | 'scroll';
  target?: string;
  prompt?: string;
}

export interface ChatIntent {
  id: string;
  patterns: string[];
  response: string;
  actions?: ChatAction[];
  followUp?: string;
}

export const quickPrompts = [
  'chat.find',
  'chat.car',
  'chat.address',
  'chat.track',
];

export const chatIntents: ChatIntent[] = [
  {
    id: 'car',
    patterns: [
      'bought a new car',
      'new car',
      'purchase vehicle',
      'vehicle registration',
      'bought a car',
      'new vehicle',
    ],
    response:
      "Congratulations. Purchasing a vehicle usually means several government records need to stay in sync.\n\nCheck these next steps:\n1. Vehicle registration and ownership transfer\n2. Insurance records\n3. Driving and transport-related documents\n4. Address or contact details, if they have changed\n5. Applicable tax or permit obligations\n\nDo not drive without valid registration and insurance requirements, and do not ignore ownership-transfer timelines.\n\nThis prototype cannot complete transport filings yet. I can still guide you to documents, nearby centres, and related MahaSetu services.",
    actions: [
      { id: 'car-docs', label: 'Review documents', type: 'navigate', target: '/documents' },
      { id: 'car-nearby', label: 'Nearby service centres', type: 'scroll', target: 'nearby-map' },
      { id: 'car-profile', label: 'Update contact details', type: 'navigate', target: '/profile' },
    ],
  },
  {
    id: 'address',
    patterns: [
      'moved to a new address',
      'new address',
      'changed address',
      'change of address',
      'relocation',
      'moved house',
      'moving house',
    ],
    response:
      "A change of address often affects more than one record.\n\nTypical next steps:\n1. Update your MahaSetu profile location\n2. Review domicile and identity documents\n3. Check whether local service eligibility has changed\n4. Notify departments connected to active applications\n\nStart with your profile, then confirm documents in your vault.",
    actions: [
      { id: 'addr-profile', label: 'Update my profile', type: 'navigate', target: '/profile' },
      { id: 'addr-docs', label: 'View my documents', type: 'navigate', target: '/documents' },
    ],
  },
  {
    id: 'job',
    patterns: [
      'started a new job',
      'new job',
      'got employed',
      'looking for a job',
      'find a job',
      'want a job',
      'starting a new job',
    ],
    response:
      "Whether you are starting work or searching, MahaSetu can keep employment services in one place.\n\nFor job-seekers:\n• Employment Registration\n• Job & Career Services\n• Skill Development & Training\n\nIf you have already started a job, update your profile so notifications and documents stay accurate.",
    actions: [
      { id: 'job-search', label: 'Find job services', type: 'navigate', target: '/search?q=job' },
      { id: 'job-register', label: 'Employment Registration', type: 'navigate', target: '/services/employment-registration' },
      { id: 'job-dept', label: 'Employability services', type: 'navigate', target: '/employability' },
    ],
  },
  {
    id: 'admission',
    patterns: ['student admission', 'new admission', 'got admission', 'college admission'],
    response:
      "A new admission is a good time to check education services together.\n\nYou may want to:\n• Review scholarship assistance\n• Confirm education certificates in your vault\n• Explore student benefits and support schemes\n• Keep your institution details updated on your profile",
    actions: [
      { id: 'adm-edu', label: 'Education services', type: 'navigate', target: '/education' },
      { id: 'adm-sch', label: 'Scholarship Assistance', type: 'navigate', target: '/services/scholarship-assistance' },
    ],
  },
  {
    id: 'scholarship',
    patterns: ['scholarship', 'education support', 'financial aid', 'student support', 'need a scholarship'],
    response:
      "Scholarship Assistance is designed for eligible students pursuing recognised courses in Maharashtra.\n\nYou can check likely eligibility first, then apply with documents already in your vault.",
    actions: [
      { id: 'sch-service', label: 'Scholarship Assistance', type: 'navigate', target: '/services/scholarship-assistance' },
      { id: 'sch-elig', label: 'Check eligibility', type: 'navigate', target: '/services/scholarship-assistance/eligibility' },
    ],
  },
  {
    id: 'lost-document',
    patterns: ['lost document', 'lost my document', 'lost certificate', 'duplicate certificate', 'certificate missing'],
    response:
      "If a document is missing, start with what is already verified in your vault, then request assistance for duplicates.\n\nEducation Certificate Assistance can help with verification and duplicate requests. Keep identity proof ready.",
    actions: [
      { id: 'lost-docs', label: 'My Documents', type: 'navigate', target: '/documents' },
      { id: 'lost-cert', label: 'Certificate assistance', type: 'navigate', target: '/services/education-certificate-assistance' },
    ],
  },
  {
    id: 'child',
    patterns: ['birth of child', 'new baby', 'had a baby', 'newborn'],
    response:
      "The birth of a child may require several records over time: identity, address, and later education-related services.\n\nThis prototype focuses on education and employability. I can still help you keep your profile and documents current, and find a nearby citizen facilitation centre.",
    actions: [
      { id: 'child-profile', label: 'Update profile', type: 'navigate', target: '/profile' },
      { id: 'child-nearby', label: 'Nearby centres', type: 'scroll', target: 'nearby-map' },
    ],
  },
  {
    id: 'retirement',
    patterns: ['retirement', 'retired', 'pension'],
    response:
      "Retirement often involves updating contact details and reviewing documents used across departments.\n\nEmployability services in this prototype are aimed at active job-seekers. For records, start with your profile and document vault, then visit a nearby government service centre if you need in-person help.",
    actions: [
      { id: 'ret-docs', label: 'My Documents', type: 'navigate', target: '/documents' },
      { id: 'ret-help', label: 'Help & Support', type: 'navigate', target: '/help' },
    ],
  },
  {
    id: 'skill',
    patterns: ['skill training', 'skill development', 'learn skills', 'training program'],
    response:
      "Skill programmes on MahaSetu sit across education and employability.\n\n• Skill Development Program (Education)\n• Skill Development & Training (Employability)\n\nBoth are prototype pathways for certification and job-readiness.",
    actions: [
      { id: 'skill-edu', label: 'Education skills program', type: 'navigate', target: '/services/education-skill-development' },
      { id: 'skill-emp', label: 'Employability training', type: 'navigate', target: '/services/skill-development-training' },
    ],
  },
  {
    id: 'degree',
    patterns: ['finished my degree', 'completed degree', 'graduated', 'finished college'],
    response:
      "Completing a degree is a natural point to connect education records with employability services.\n\nConsider updating certificates, exploring job assistance, and checking skill programmes for career readiness.",
    actions: [
      { id: 'deg-jobs', label: 'Find job services', type: 'navigate', target: '/search?q=job' },
      { id: 'deg-docs', label: 'Update documents', type: 'navigate', target: '/documents' },
    ],
  },
  {
    id: 'certificate',
    patterns: ['lost my certificate', 'education certificate'],
    response:
      "Education Certificate Assistance covers duplicate requests, verification, and transcript-related help through a single application flow.",
    actions: [
      { id: 'cert-service', label: 'Certificate Assistance', type: 'navigate', target: '/services/education-certificate-assistance' },
    ],
  },
  {
    id: 'business',
    patterns: ['start a business', 'starting business', 'new business', 'entrepreneur'],
    response:
      "Business registrations are not fully modelled in this prototype. You can still update your profile, explore skill programmes, and locate a nearby government service centre.",
    actions: [
      { id: 'biz-nearby', label: 'Find nearby service centre', type: 'scroll', target: 'nearby-map' },
      { id: 'biz-help', label: 'Help & Support', type: 'navigate', target: '/help' },
    ],
  },
  {
    id: 'married',
    patterns: ['got married', 'marriage', 'married recently'],
    response:
      "Marriage may require updates to name, address, or beneficiary details.\n\nReview your profile and documents first so later applications stay consistent.",
    actions: [
      { id: 'mar-profile', label: 'Update profile', type: 'navigate', target: '/profile' },
      { id: 'mar-docs', label: 'View documents', type: 'navigate', target: '/documents' },
    ],
  },
  {
    id: 'mobile',
    patterns: ['changed my mobile', 'new mobile number', 'mobile number', 'phone number'],
    response:
      "Update your mobile number on your MahaSetu profile so application alerts reach you. This prototype does not write to actual government databases.",
    actions: [
      { id: 'mob-profile', label: 'Update mobile number', type: 'navigate', target: '/profile' },
    ],
  },
  {
    id: 'track',
    patterns: ['track application', 'track my application', 'application status', 'my application', 'check status'],
    response:
      "My Applications shows reference numbers, status badges, and a timeline from submission through decision.",
    actions: [
      { id: 'track-apps', label: 'My Applications', type: 'navigate', target: '/applications' },
    ],
  },
  {
    id: 'documents',
    patterns: ['documents', 'what documents', 'required documents', 'my documents'],
    response:
      "Your document vault is meant for reuse across applications — identity, education, domicile, income, and more.\n\nWhen you apply, you can select items already stored here.",
    actions: [
      { id: 'doc-vault', label: 'My Documents', type: 'navigate', target: '/documents' },
    ],
  },
  {
    id: 'eligibility',
    patterns: ['eligibility', 'eligible', 'am i eligible', 'check eligibility'],
    response:
      "Each service has a short eligibility check before a full application. Search for a service, then choose Check eligibility.",
    actions: [
      { id: 'elig-search', label: 'Search services', type: 'navigate', target: '/search' },
      { id: 'elig-sch', label: 'Scholarship eligibility', type: 'navigate', target: '/services/scholarship-assistance/eligibility' },
    ],
  },
  {
    id: 'find-service',
    patterns: ['find a service', 'find service', 'discover', 'what services', 'help me find'],
    response:
      "Tell MahaSetu what you need — not which department.\n\nTry searches such as scholarship, job, or skill training, or open Education and Employability from the menu.",
    actions: [
      { id: 'find-search', label: 'Search services', type: 'navigate', target: '/search' },
      { id: 'find-edu', label: 'Education', type: 'navigate', target: '/education' },
      { id: 'find-emp', label: 'Employability', type: 'navigate', target: '/employability' },
    ],
  },
  {
    id: 'greeting',
    patterns: ['hello', 'hi', 'hey', 'help', 'start'],
    response:
      "Hello. I am MahaSetu Assistant — a guide for this citizen portal.\n\nI can help you find services, check eligibility, review documents, track applications, and walk through life events such as a new job or a new address.",
    actions: [
      { id: 'greet-search', label: 'Find a service', type: 'navigate', target: '/search' },
      { id: 'greet-apps', label: 'Track application', type: 'navigate', target: '/applications' },
    ],
  },
];

export const defaultResponse =
  "I can guide you through MahaSetu services.\n\nTry asking about scholarships, jobs, documents, tracking an application, or a life event such as buying a vehicle or changing address.";
