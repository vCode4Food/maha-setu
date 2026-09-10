import type { CitizenProfile } from '../types';

export const defaultProfile: CitizenProfile = {
  firstName: 'Aarav',
  lastName: 'Sharma',
  dateOfBirth: '2005-05-14',
  gender: 'Male',
  email: 'aarav.sharma@email.com',
  mobile: '9876543210',
  aadhaar: 'XXXX-XXXX-4321',
  education: '12th Standard (Completed)',
  institution: 'Maharashtra State Board School, Pune',
  address: '42, Shivaji Nagar',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411005',
  language: 'en',
  accessibility: {
    highContrast: false,
    largeText: false,
  },
};
