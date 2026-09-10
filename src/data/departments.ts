import type { Department } from '../types';

export const departments: Department[] = [
  {
    id: 'education',
    name: 'Education',
    description:
      'Access education-related government services, scholarships, certificates and assistance in one place.',
  },
  {
    id: 'employability',
    name: 'Employability',
    description:
      'Register for employment, explore career services, and find skill development opportunities in Maharashtra.',
  },
];

export const getDepartmentById = (id: string) =>
  departments.find((d) => d.id === id);
