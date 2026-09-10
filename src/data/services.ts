import type { Service } from '../types';

export const services: Service[] = [
  {
    id: 'scholarship-assistance',
    title: 'Scholarship Assistance',
    category: 'Education Support',
    department: 'education',
    description:
      'Financial assistance for eligible students pursuing higher education after matriculation. MahaSetu helps you discover, verify eligibility, and apply for post-matric scholarships through a single unified process.',
    shortDescription:
      'Financial assistance for eligible students pursuing higher education.',
    whoCanApply:
      'Students enrolled in recognized post-matric courses whose family income falls within scheme limits.',
    eligibility: [
      'Currently enrolled in a recognized post-matric institution',
      'Annual family income below ₹2.5 lakh',
      'Resident of Maharashtra',
      'Minimum 50% marks in previous examination',
    ],
    benefits: [
      'Tuition fee reimbursement up to scheme limits',
      'Maintenance allowance for hostellers and day scholars',
      'Single application across eligible scholarship schemes',
    ],
    documents: [
      'Income Certificate',
      'Domicile Certificate',
      'Education Certificate',
      'Aadhaar Card',
      'Bank Passbook',
    ],
    process: [
      'Check your eligibility with guided questions',
      'Complete application with pre-filled profile data',
      'Attach required documents from your MahaSetu vault',
      'Submit and track status in one place',
    ],
    estimatedTime: '7–14 working days',
    importantInfo:
      'Applications are processed by the concerned education department. MahaSetu coordinates verification across departments on your behalf.',
    keywords: ['scholarship', 'education', 'student', 'financial', 'post-matric', 'fees'],
    popular: true,
  },
  {
    id: 'student-education-support',
    title: 'Education Support Schemes',
    category: 'Education Support',
    department: 'education',
    description:
      'Access guidance and support for education-related queries including admissions, fee concessions, and student welfare schemes available to Maharashtra residents.',
    shortDescription:
      'Guidance and support for education-related queries and welfare schemes.',
    whoCanApply: 'Students and parents seeking education support services in Maharashtra.',
    eligibility: [
      'Resident of Maharashtra',
      'Enrolled or seeking enrollment in recognized institutions',
    ],
    benefits: [
      'Centralized access to education welfare schemes',
      'Guided support for admissions and concessions',
      'Document reuse across applications',
    ],
    documents: ['Education Certificate', 'Domicile Certificate', 'Income Certificate'],
    process: [
      'Describe your education support need',
      'Review matched schemes and guidance',
      'Apply with pre-filled information',
    ],
    estimatedTime: '5–10 working days',
    keywords: ['education', 'student', 'support', 'admission', 'welfare'],
    popular: true,
  },
  {
    id: 'education-skill-development',
    title: 'Skill Development Program',
    category: 'Education & Skills',
    department: 'education',
    description:
      'Enroll in government-affiliated skill development programs to enhance employability while pursuing or after completing education.',
    shortDescription:
      'Government-affiliated skill programs for students and young learners.',
    whoCanApply: 'Students and young adults aged 18–35 seeking skill enhancement.',
    eligibility: [
      'Age between 18 and 35 years',
      'Minimum 10th standard pass',
      'Resident of Maharashtra',
    ],
    benefits: [
      'Industry-relevant training programs',
      'Certification upon completion',
      'Placement assistance through partner networks',
    ],
    documents: ['Education Certificate', 'Aadhaar Card', 'Domicile Certificate'],
    process: [
      'Select preferred skill domain',
      'Verify eligibility criteria',
      'Register and choose training center',
    ],
    estimatedTime: '3–7 working days',
    keywords: ['skill', 'training', 'development', 'education', 'certification'],
  },
  {
    id: 'education-certificate-assistance',
    title: 'Student Certificate Services',
    category: 'Certificates',
    department: 'education',
    description:
      'Request assistance for education certificate verification, duplicate certificates, and transcript-related services through a unified application.',
    shortDescription:
      'Certificate verification and duplicate certificate assistance.',
    whoCanApply: 'Students and alumni requiring education certificate services.',
    eligibility: [
      'Valid education records from recognized institutions',
      'Identity verification completed',
    ],
    benefits: [
      'Streamlined certificate request process',
      'Status tracking until delivery',
      'Digital verification support',
    ],
    documents: ['Education Certificate', 'Aadhaar Card', 'Identity Proof'],
    process: [
      'Specify certificate type and purpose',
      'Upload supporting documents',
      'Track verification and dispatch',
    ],
    estimatedTime: '10–15 working days',
    keywords: ['certificate', 'education', 'verification', 'transcript', 'duplicate'],
  },
  {
    id: 'student-benefits',
    title: 'Student Benefits',
    category: 'Education Support',
    department: 'education',
    description:
      'Discover student welfare benefits available to Maharashtra residents, including concessions and support linked to education records.',
    shortDescription:
      'Student welfare benefits and concessions in one guided flow.',
    whoCanApply: 'Students enrolled in recognised institutions in Maharashtra.',
    eligibility: [
      'Resident of Maharashtra',
      'Currently enrolled in a recognised institution',
      'Valid identity and education records',
    ],
    benefits: [
      'Single view of applicable student benefits',
      'Reuse of vault documents',
      'Status tracking after submission',
    ],
    documents: ['Education Certificate', 'Domicile Certificate', 'Aadhaar Card', 'Income Certificate'],
    process: [
      'Review applicable benefit categories',
      'Confirm eligibility with guided questions',
      'Submit with documents from your vault',
    ],
    estimatedTime: '7–12 working days',
    keywords: ['student', 'benefits', 'education', 'welfare', 'concession'],
  },
  {
    id: 'job-opportunity-assistance',
    title: 'Job & Career Services',
    category: 'Employment',
    department: 'employability',
    description:
      'Discover job opportunities matched to your skills and profile. MahaSetu connects you with government employment exchanges and partner employers without navigating multiple portals.',
    shortDescription:
      'Discover and apply for job opportunities matched to your profile.',
    whoCanApply: 'Job seekers aged 18–45 registered or willing to register on MahaSetu.',
    eligibility: [
      'Age between 18 and 45 years',
      'Valid identity and address proof',
      'Minimum educational qualification as per job category',
    ],
    benefits: [
      'Curated job listings from government exchanges',
      'Skill-based job matching',
      'Interview scheduling assistance',
    ],
    documents: ['Aadhaar Card', 'Education Certificate', 'Resume', 'Domicile Certificate'],
    process: [
      'Complete employability profile',
      'Browse matched opportunities',
      'Apply directly through MahaSetu',
    ],
    estimatedTime: '3–5 working days',
    keywords: ['job', 'employment', 'work', 'career', 'hiring', 'opportunity'],
    popular: true,
  },
  {
    id: 'skill-development-training',
    title: 'Skill Development & Training',
    category: 'Skills & Training',
    department: 'employability',
    description:
      'Access employability-focused skill training programs designed to improve job readiness and connect you with industry opportunities.',
    shortDescription:
      'Employability-focused skill training for job readiness.',
    whoCanApply: 'Unemployed and underemployed individuals seeking skill enhancement.',
    eligibility: [
      'Age between 18 and 45 years',
      'Willing to undergo full-time or part-time training',
      'Resident of Maharashtra',
    ],
    benefits: [
      'NSDC-aligned training programs',
      'Industry certification',
      'Post-training placement support',
    ],
    documents: ['Aadhaar Card', 'Education Certificate', 'Income Certificate'],
    process: [
      'Select training domain',
      'Choose nearest training center',
      'Complete registration and enrollment',
    ],
    estimatedTime: '5–7 working days',
    keywords: ['skill', 'training', 'employability', 'job', 'certification'],
    popular: true,
  },
  {
    id: 'employment-registration',
    title: 'Employment Registration',
    category: 'Employment',
    department: 'employability',
    description:
      'Register with the employment exchange through MahaSetu. Your profile becomes discoverable by employers and eligible for government employment schemes.',
    shortDescription:
      'Register with the employment exchange through a unified profile.',
    whoCanApply: 'All job seekers above 18 years of age.',
    eligibility: [
      'Age 18 years or above',
      'Valid Aadhaar and address proof',
      'Resident of Maharashtra',
    ],
    benefits: [
      'Official employment exchange registration',
      'Access to government job notifications',
      'Skill assessment and counseling',
    ],
    documents: ['Aadhaar Card', 'Education Certificate', 'Domicile Certificate', 'Photograph'],
    process: [
      'Complete registration form with pre-filled data',
      'Upload photograph and documents',
      'Receive registration number upon approval',
    ],
    estimatedTime: '7–10 working days',
    keywords: ['employment', 'registration', 'exchange', 'job', 'register'],
  },
  {
    id: 'career-support',
    title: 'Employment Assistance',
    category: 'Career Guidance',
    department: 'employability',
    description:
      'Access career counseling, resume building assistance, and interview preparation resources to improve your employability outcomes.',
    shortDescription:
      'Career counseling, resume help, and interview preparation.',
    whoCanApply: 'Job seekers and career changers seeking professional guidance.',
    eligibility: [
      'Registered on MahaSetu',
      'Seeking career guidance or transition support',
    ],
    benefits: [
      'One-on-one career counseling sessions',
      'Resume and cover letter assistance',
      'Mock interview preparation',
    ],
    documents: ['Education Certificate', 'Resume'],
    process: [
      'Book a counseling session',
      'Complete career assessment',
      'Receive personalized action plan',
    ],
    estimatedTime: '2–3 working days',
    keywords: ['career', 'counseling', 'resume', 'interview', 'guidance'],
  },
];
