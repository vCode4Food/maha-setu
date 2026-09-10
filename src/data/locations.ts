export type ServiceLocationType =
  | 'employment'
  | 'skill_development'
  | 'education'
  | 'government_service'
  | 'citizen_facilitation';

export interface ServiceLocation {
  id: string;
  name: string;
  type: ServiceLocationType;
  typeLabel: string;
  city: string;
  distance: string;
  distanceKm: number;
  address: string;
  lat: number;
  lng: number;
  openToday: boolean;
  hours: string;
  phone?: string;
  illustrative?: boolean;
}

/** Mock centre — Pune, Maharashtra */
export const mapCenter = { lat: 18.5204, lng: 73.8567 };

export const nearbyLocations: ServiceLocation[] = [
  {
    id: 'loc-employment-pune',
    name: 'Employment Support Centre',
    type: 'employment',
    typeLabel: 'Employment Office',
    city: 'Pune',
    distance: '1.8 km',
    distanceKm: 1.8,
    address: 'Shivajinagar, Pune, Maharashtra 411005',
    lat: 18.5314,
    lng: 73.8446,
    openToday: true,
    hours: '10:00 AM – 5:00 PM',
    phone: '020-2553-xxxx',
    illustrative: true,
  },
  {
    id: 'loc-skill-pune',
    name: 'Skill Development Centre',
    type: 'skill_development',
    typeLabel: 'Skill Development Centre',
    city: 'Pune',
    distance: '2.4 km',
    distanceKm: 2.4,
    address: 'FC Road, Pune, Maharashtra 411004',
    lat: 18.5158,
    lng: 73.8412,
    openToday: true,
    hours: '9:00 AM – 6:00 PM',
    illustrative: true,
  },
  {
    id: 'loc-education-pune',
    name: 'Education Office',
    type: 'education',
    typeLabel: 'Education Office',
    city: 'Pune',
    distance: '3.1 km',
    distanceKm: 3.1,
    address: 'Deccan Gymkhana, Pune, Maharashtra 411004',
    lat: 18.5089,
    lng: 73.8321,
    openToday: true,
    hours: '10:00 AM – 4:30 PM',
    illustrative: true,
  },
  {
    id: 'loc-cfc-pune',
    name: 'Citizen Facilitation Centre',
    type: 'citizen_facilitation',
    typeLabel: 'Citizen Facilitation Centre',
    city: 'Pune',
    distance: '3.6 km',
    distanceKm: 3.6,
    address: 'Aundh, Pune, Maharashtra 411007',
    lat: 18.559,
    lng: 73.807,
    openToday: true,
    hours: '10:00 AM – 5:30 PM',
    illustrative: true,
  },
  {
    id: 'loc-govt-pune',
    name: 'Government Service Centre',
    type: 'government_service',
    typeLabel: 'Government Service Centre',
    city: 'Pune',
    distance: '4.2 km',
    distanceKm: 4.2,
    address: 'Camp Area, Pune, Maharashtra 411001',
    lat: 18.5074,
    lng: 73.8765,
    openToday: false,
    hours: 'Closed today · Opens Wed 10:00 AM',
    illustrative: true,
  },
  {
    id: 'loc-cfc-mumbai',
    name: 'Citizen Facilitation Centre',
    type: 'citizen_facilitation',
    typeLabel: 'Citizen Facilitation Centre',
    city: 'Mumbai',
    distance: '—',
    distanceKm: 120,
    address: 'Bandra East, Mumbai, Maharashtra 400051',
    lat: 19.0596,
    lng: 72.8656,
    openToday: true,
    hours: '10:00 AM – 5:00 PM',
    illustrative: true,
  },
  {
    id: 'loc-emp-nagpur',
    name: 'Employment Office',
    type: 'employment',
    typeLabel: 'Employment Office',
    city: 'Nagpur',
    distance: '—',
    distanceKm: 700,
    address: 'Civil Lines, Nagpur, Maharashtra 440001',
    lat: 21.1458,
    lng: 79.0882,
    openToday: true,
    hours: '10:00 AM – 5:00 PM',
    illustrative: true,
  },
  {
    id: 'loc-edu-nashik',
    name: 'Education Office',
    type: 'education',
    typeLabel: 'Education Office',
    city: 'Nashik',
    distance: '—',
    distanceKm: 160,
    address: 'College Road, Nashik, Maharashtra 422005',
    lat: 19.9975,
    lng: 73.7898,
    openToday: true,
    hours: '10:00 AM – 4:30 PM',
    illustrative: true,
  },
  {
    id: 'loc-skill-thane',
    name: 'Skill Development Centre',
    type: 'skill_development',
    typeLabel: 'Skill Development Centre',
    city: 'Thane',
    distance: '—',
    distanceKm: 110,
    address: 'Naupada, Thane, Maharashtra 400602',
    lat: 19.2183,
    lng: 72.9781,
    openToday: true,
    hours: '9:30 AM – 6:00 PM',
    illustrative: true,
  },
  {
    id: 'loc-govt-csm',
    name: 'Government Service Centre',
    type: 'government_service',
    typeLabel: 'Government Service Centre',
    city: 'Chhatrapati Sambhajinagar',
    distance: '—',
    distanceKm: 230,
    address: 'CIDCO, Chhatrapati Sambhajinagar, Maharashtra 431003',
    lat: 19.8762,
    lng: 75.3433,
    openToday: true,
    hours: '10:00 AM – 5:00 PM',
    illustrative: true,
  },
];

export function getLocationById(id: string): ServiceLocation | undefined {
  return nearbyLocations.find((l) => l.id === id);
}

export const maharashtraCities = [
  'Pune',
  'Mumbai',
  'Nagpur',
  'Nashik',
  'Thane',
  'Chhatrapati Sambhajinagar',
] as const;
