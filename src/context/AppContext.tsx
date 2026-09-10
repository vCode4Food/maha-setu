import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  Application,
  CitizenProfile,
  Document,
  Language,
  Notification,
   AuthMethod,
  AuthUser,

} from '../types';


import { getPersona } from '../data/personas';
import { hasPermission as roleHasPermission, type Permission } from '../auth/rbac';

import {
  addApplication,
  addDocument,
  addNotification,
  getApplications,
  getDocuments,
  getNotifications,
  getProfile,
  markAllNotificationsRead,
  markNotificationRead,
  removeDocument,
  updateProfile,
} from '../services/dataService';
import { languageTags, t } from '../utils/i18n';

interface AppContextValue {
  profile: CitizenProfile;
  applications: Application[];
  documents: Document[];
  notifications: Notification[];
  language: Language;
  toast: string | null;

  isAuthenticated: boolean;
  authUser: AuthUser | null;

  updateProfileData: (updates: Partial<CitizenProfile>) => void;
  setLanguage: (lang: Language) => void;
  refreshApplications: () => void;
  submitApplication: (application: Application) => void;
  uploadDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
  readNotification: (id: string) => void;
  readAllNotifications: () => void;
  showToast: (message: string) => void;

  login: (personaId: string, method: AuthMethod) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;

  unreadCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CitizenProfile>(() => getProfile());
  const [applications, setApplications] = useState<Application[]>(() => getApplications());
  const [documents, setDocuments] = useState<Document[]>(() => getDocuments());
  const [notifications, setNotifications] = useState<Notification[]>(() => getNotifications());
  const [language, setLanguageState] = useState<Language>(() => getProfile().language);
  const [toast, setToast] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('mahasetu_mock_session'))
  );
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const session = localStorage.getItem('mahasetu_mock_session');
      return session ? (JSON.parse(session) as AuthUser) : null;
    } catch { return null; }
  });


  // Make the selected locale a document-level concern. This reaches portals,
  // overlays and third-party controls without adding font classes per component.
  useEffect(() => {
    document.documentElement.lang = languageTags[language];
    document.documentElement.dataset.language = language;
  }, [language]);

  const refreshApplications = useCallback(() => {
    setApplications(getApplications());
  }, []);

  const updateProfileData = useCallback((updates: Partial<CitizenProfile>) => {
    const updated = updateProfile(updates);
    setProfile(updated);
    if (updates.language) {
      setLanguageState(updates.language);
    }
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      updateProfile({ language: lang });
      setProfile((p) => ({ ...p, language: lang }));
    },
    []
  );

  const submitApplication = useCallback(
    (application: Application) => {
      addApplication(application);
      setApplications(getApplications());
      addNotification({
        id: `notif-${Date.now()}`,
        title: t('notification.applicationSubmitted', language),
        message: t('notification.applicationSubmittedMessage', language, { service: application.serviceTitle }),
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
        link: `/applications/${application.id}`,
      });
      setNotifications(getNotifications());
    },
    [language]
  );

  const uploadDocument = useCallback((doc: Document) => {
    addDocument(doc);
    setDocuments(getDocuments());
  }, []);

  const deleteDocument = useCallback((id: string) => {
    removeDocument(id);
    setDocuments(getDocuments());
  }, []);

  const readNotification = useCallback((id: string) => {
    markNotificationRead(id);
    setNotifications(getNotifications());
  }, []);

  const readAllNotifications = useCallback(() => {
    markAllNotificationsRead();
    setNotifications(getNotifications());
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
  }, []);


  const login = useCallback((personaId: string, method: AuthMethod) => {
    const persona = getPersona(personaId);
    if (!persona) return;
    const user: AuthUser = { ...persona, authMethod: method };
    localStorage.setItem('mahasetu_mock_session', JSON.stringify(user));
    localStorage.removeItem('mahasetu_mock_authenticated');
    setAuthUser(user);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mahasetu_mock_authenticated');
    localStorage.removeItem('mahasetu_mock_session');
    setAuthUser(null);
    setIsAuthenticated(false);
  }, []);


  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const hasPermission = useCallback((permission: Permission) => (
    authUser ? roleHasPermission(authUser.role, permission) : false
  ), [authUser]);


  const value = useMemo(
    () => ({
      profile,
      applications,
      documents,
      notifications,
      language,
      toast,
      isAuthenticated,
      authUser,
      updateProfileData,
      setLanguage,
      refreshApplications,
      submitApplication,
      uploadDocument,
      deleteDocument,
      readNotification,
      readAllNotifications,
      showToast,
      login,
      logout,
      hasPermission,
      unreadCount,
    }),
    [
      profile,
      applications,
      documents,
      notifications,
      language,
      toast,

      isAuthenticated,
      authUser,

      updateProfileData,
      setLanguage,
      refreshApplications,
      submitApplication,
      uploadDocument,
      deleteDocument,
      readNotification,
      readAllNotifications,
      showToast,

      login,
      logout,
      hasPermission,

      unreadCount,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
