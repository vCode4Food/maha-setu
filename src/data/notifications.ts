import type { Notification } from '../types';

export const defaultNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Application update',
    message: 'Your scholarship application has moved to verification.',
    type: 'info',
    read: false,
    createdAt: '2026-09-05T14:20:00',
    link: '/applications/app-001',
  },
  {
    id: 'notif-002',
    title: 'Registration submitted',
    message: 'Your employment registration was successfully submitted.',
    type: 'success',
    read: false,
    createdAt: '2026-09-01T09:15:00',
    link: '/applications/app-002',
  },
  {
    id: 'notif-003',
    title: 'Document update needed',
    message: 'Your income certificate may need to be updated before the next application cycle.',
    type: 'warning',
    read: true,
    createdAt: '2026-08-28T08:00:00',
    link: '/documents',
  },
  {
    id: 'notif-004',
    title: 'New service recommendation',
    message: 'Based on your profile, Skill Development & Training may be relevant for you.',
    type: 'info',
    read: true,
    createdAt: '2026-08-25T10:30:00',
    link: '/services/skill-development-training',
  },
  {
    id: 'notif-005',
    title: 'Training approved',
    message: 'Your Skill Development & Training application has been approved.',
    type: 'success',
    read: true,
    createdAt: '2026-08-20T16:45:00',
    link: '/applications/app-003',
  },
];
