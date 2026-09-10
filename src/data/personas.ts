import { ROLES, type AuthUser, type UserRole } from '../types';

export interface DemoPersona extends Omit<AuthUser, 'authMethod'> {
  titleKey: string;
  accessKeys: string[];
}

export const demoPersonas: DemoPersona[] = [
  {
    id: 'demo-citizen-001', name: 'Arav Sharma', mobile: '9876543210', district: 'Pune', preferredLanguage: 'en', role: ROLES.USER,
    titleKey: 'role.citizen', accessKeys: ['persona.citizen.access.one', 'persona.citizen.access.two', 'persona.citizen.access.three'],
  },
  {
    id: 'demo-officer-001', name: 'Priya Kulkarni', mobile: '9876543211', district: 'Pune', preferredLanguage: 'en', role: ROLES.DEPARTMENT_OFFICER, department: 'Revenue Department',
    titleKey: 'role.officer', accessKeys: ['persona.officer.access.one', 'persona.officer.access.two', 'persona.officer.access.three'],
  },
  {
    id: 'demo-admin-001', name: 'Maharashtra Administrator', mobile: '9876543212', district: 'Maharashtra', preferredLanguage: 'en', role: ROLES.ADMIN,
    titleKey: 'role.admin', accessKeys: ['persona.admin.access.one', 'persona.admin.access.two', 'persona.admin.access.three'],
  },
];

export function getPersona(id: string) {
  return demoPersonas.find((persona) => persona.id === id);
}

export function dashboardPathForRole(role: UserRole) {
  if (role === ROLES.DEPARTMENT_OFFICER) return '/department';
  if (role === ROLES.ADMIN) return '/admin';
  return '/dashboard';
}
