import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import type {
  Application, Grievance, CitizenDocument, Consent, Notif, Role, Toast,
  ServiceStatus, OrchestrationFlow, ChatMessage, Service,
} from '@/types'
import { initialApplications, appIdSeq } from '@/data/applications'
import { initialDocuments, initialConsents, initialGrievances } from '@/data/citizen'
import { initialNotifications, officialSeedNotifications } from '@/data/notifications'
import { orchFlowSeed } from '@/data/misc'
import { chatSeed } from '@/data/misc'
import { serviceById, services as allServices } from '@/data/services'
import { departments as allDepartments, departmentById } from '@/data/departments'
import { schemes as allSchemes, schemeById } from '@/data/schemes'

type Ctx = ReturnType<typeof useAppState>
const Ctx = createContext<Ctx | null>(null)

/*
 * Demo reliability: mutating state is mirrored to sessionStorage so an
 * accidental page refresh mid-presentation keeps the story intact.
 * A new tab/session starts fresh with seed data. "Reset demo data"
 * (resetDemo) clears everything back to seed.
 */
const PERSIST_KEYS = ['applications', 'documents', 'consents', 'grievances', 'notifications'] as const
const persistKey = (k: string) => `mahasetu-${k}`

function loadPersisted<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(persistKey(key))
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function clearPersisted() {
  try {
    PERSIST_KEYS.forEach((k) => sessionStorage.removeItem(persistKey(k)))
  } catch { /* ignore */ }
}

function useAppState() {
  /* Portal role mirrors the authenticated session's account role (RBAC:
     the Maha ID determines the portal, never a free picker). */
  const { user } = useAuth()
  const [role, setRole] = useState<Role>(user?.role ?? 'citizen')
  useEffect(() => { setRole(user?.role ?? 'citizen') }, [user?.role])
  const [applications, setApplications] = useState<Application[]>(() => loadPersisted('applications', initialApplications))
  const [documents, setDocuments] = useState<CitizenDocument[]>(() => loadPersisted('documents', initialDocuments))
  const [consents, setConsents] = useState<Consent[]>(() => loadPersisted('consents', initialConsents))
  const [grievances, setGrievances] = useState<Grievance[]>(() => loadPersisted('grievances', initialGrievances))
  const [notifications, setNotifications] = useState<Notif[]>(() => loadPersisted('notifications', [...initialNotifications, ...officialSeedNotifications]))
  const [serviceStates, setServiceStates] = useState<Record<string, ServiceStatus>>(() =>
    Object.fromEntries(allServices.map((s) => [s.id, s.status])),
  )
  const [orchFlow, setOrchFlow] = useState<OrchestrationFlow>(orchFlowSeed)
  const [chat, setChat] = useState<ChatMessage[]>(chatSeed)
  const [toasts, setToasts] = useState<Toast[]>([])

  /* ---------------- toasts ---------------- */
  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `t${Date.now()}${Math.random()}`
    setToasts((prev) => [...prev, { ...t, id }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 4200)
  }, [])
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id))
  }, [])

  /* ---------------- helpers ---------------- */
  const nowTime = useCallback(
    () => new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true }),
    [],
  )

  const addNotif = useCallback((n: Omit<Notif, 'id' | 'time' | 'read'>) => {
    setNotifications((prev) => [{ ...n, id: `n${Date.now()}`, time: 'Just now', read: false }, ...prev])
  }, [])

  const markNotifRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])
  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  /* ---------------- applications ---------------- */
  const submitApplication = useCallback((serviceId: string, citizenId: string, citizenName: string, docs: string[]) => {
    const svc = serviceById(serviceId)
    if (!svc) return null
    const seq = appIdSeq.next++
    const id = `MS-2026-00${seq}`
    const submitted = new Date()
    const expected = new Date(submitted.getTime() + svc.slaDays * 86400000)
    const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    const now = () => submitted.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
    const app: Application = {
      id, citizenId, citizenName, serviceId, serviceName: svc.name, departmentId: svc.departmentId,
      status: 'submitted', submittedAt: now(), expectedCompletion: fmt(expected),
      currentStage: 'Submitted', fee: svc.fee, priority: 'normal', district: 'Pune',
      events: [{ stage: 'Submitted', status: 'done', time: now(), actor: citizenName, note: `${docs.length} document(s) attached from vault` }],
      documents: docs.map((d) => ({ name: d, fromVault: true, verified: false })),
      remarks: [{ author: 'MahaSetu Engine', role: 'system', text: 'Application received. Department coordination will begin automatically.', time: now() }],
    }
    setApplications((prev) => [app, ...prev])
    addNotif({ type: 'application', title: 'Application submitted', body: `${svc.name} (${id}) received. Expected completion ${fmt(expected)}.`, audience: ['citizen'], link: `/citizen/applications/${id}` })
    pushToast({ kind: 'success', title: 'Application submitted', body: `${svc.name} — ${id}` })
    return app
  }, [addNotif, pushToast])

  const setAppStatus = useCallback((appId: string, status: Application['status'], opts?: { stage?: Application['currentStage']; note?: string; actor?: string; actionRequired?: string }) => {
    setApplications((prev) => prev.map((a) => {
      if (a.id !== appId) return a
      const events = a.events.map((e) => (e.stage === a.currentStage && e.status === 'active' ? { ...e, status: 'done' as const, time: nowTime(), note: opts?.note ?? e.note } : e))
      const nextStage = opts?.stage ?? a.currentStage
      const activeExists = events.some((e) => e.stage === nextStage && e.status === 'active')
      const newEvents = activeExists ? events : events.map((e) => (e.stage === nextStage && e.status === 'pending' ? { ...e, status: 'active' as const } : e))
      return { ...a, status, currentStage: nextStage, events: newEvents, actionRequired: opts?.actionRequired, assignedOfficer: opts?.actor ?? a.assignedOfficer }
    }))
  }, [])

  const addRemark = useCallback((appId: string, author: string, appRole: 'citizen' | 'official' | 'system', text: string) => {
    setApplications((prev) => prev.map((a) => (a.id === appId
      ? { ...a, remarks: [...(a.remarks ?? []), { author, role: appRole, text, time: nowTime() }] }
      : a)))
  }, [])

  /* ---------------- documents ---------------- */
  const uploadDocument = useCallback((doc: Omit<CitizenDocument, 'id'>) => {
    const full: CitizenDocument = { ...doc, id: `doc-${Date.now()}` }
    setDocuments((prev) => [full, ...prev])
    addNotif({ type: 'document', title: 'Document added to vault', body: `${doc.name} is now available for reuse across services.`, audience: ['citizen'], link: '/citizen/documents' })
    pushToast({ kind: 'success', title: 'Document uploaded', body: doc.name })
  }, [addNotif, pushToast])

  const updateDocStatus = useCallback((docId: string, status: CitizenDocument['status']) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, status } : d)))
  }, [])

  /* ---------------- consents ---------------- */
  const setConsentStatus = useCallback((id: string, status: Consent['status']) => {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    const c = consents.find((x) => x.id === id)
    if (c) {
      pushToast({ kind: status === 'active' ? 'success' : 'info', title: `Consent ${status}`, body: c.purpose })
      addNotif({ type: 'security', title: `Consent ${status}`, body: `${departmentById(c.departmentId)?.shortName ?? 'Department'} — ${c.purpose}`, audience: ['citizen'], link: '/citizen/consent' })
    }
  }, [consents, pushToast, addNotif])

  /* ---------------- grievances ---------------- */
  const addGrievance = useCallback((g: Omit<Grievance, 'id' | 'timeline' | 'status' | 'createdAt' | 'slaHours'>) => {
    const id = `GRV-2026-${String(240 + grievances.length).padStart(5, '0')}`
    const full: Grievance = {
      ...g, id, status: 'assigned', slaHours: 72, createdAt: nowTime(),
      timeline: [
        { label: 'Submitted', time: nowTime(), done: true },
        { label: `Assigned to Revenue Dept officer`, time: nowTime(), done: true, note: 'Auto-routed by MahaSetu to the responsible department' },
        { label: 'Under Review', done: false },
        { label: 'Response', done: false },
        { label: 'Resolved', done: false },
      ],
    }
    setGrievances((prev) => [full, ...prev])
    addNotif({ type: 'grievance', title: 'Grievance registered', body: `${id} assigned to ${departmentById(g.departmentId)?.shortName ?? 'department'}. SLA 72 hours.`, audience: ['citizen'], link: '/citizen/grievances' })
    pushToast({ kind: 'success', title: 'Grievance registered', body: `${id} — routed automatically` })
    return full
  }, [grievances.length, addNotif, pushToast])

  const setGrievanceStatus = useCallback((id: string, status: Grievance['status'], response?: string) => {
    setGrievances((prev) => prev.map((g) => {
      if (g.id !== id) return g
      const timeline = g.timeline.map((t) => (!t.done ? { ...t, done: true, time: nowTime() } : t))
      if (status !== 'resolved' && response) {
        const idx = timeline.findIndex((t) => t.label === 'Response' && !t.time)
        if (idx >= 0) timeline[idx] = { ...timeline[idx], done: true, time: nowTime(), note: response }
      }
      return { ...g, status, response: response ?? g.response, timeline }
    }))
  }, [])

  /* ---------------- services (admin) ---------------- */
  const setServiceStatus = useCallback((serviceId: string, status: ServiceStatus) => {
    setServiceStates((prev) => ({ ...prev, [serviceId]: status }))
    const svc = serviceById(serviceId)
    if (svc) pushToast({ kind: status === 'active' ? 'success' : 'warning', title: `Service ${status === 'active' ? 'enabled' : status}`, body: svc.name })
  }, [pushToast])

  /* ---------------- orchestration ---------------- */
  const simulateOrchestration = useCallback((flowId: string) => {
    setOrchFlow((prev) => {
      if (prev.id !== flowId) return prev
      const idx = prev.steps.findIndex((s) => s.status === 'pending' || s.status === 'processing')
      if (idx === -1) return prev
      const steps = [...prev.steps]
      const step = { ...steps[idx] }
      if (step.status === 'pending') {
        steps[idx] = { ...step, status: 'processing', requestId: step.requestId ?? `REQ-${Math.floor(88100 + Math.random() * 900)}` }
        return { ...prev, steps }
      }
      // processing -> completed
      steps[idx] = {
        ...step, status: 'completed',
        timestamp: nowTime(),
        response: `200 OK · ${Math.floor(160 + Math.random() * 200)}ms`,
      }
      return { ...prev, steps }
    })
  }, [])

  const isOrchComplete = useCallback((flowId: string) => {
    const f = orchFlow.id === flowId ? orchFlow : null
    return f ? f.steps.every((s) => s.status === 'completed') : false
  }, [orchFlow])

  /* ---------------- chat ---------------- */
  const pushChat = useCallback((m: Omit<ChatMessage, 'id'>) => {
    setChat((prev) => [...prev, { ...m, id: `c${Date.now()}${Math.random()}` }])
  }, [])
  const resetChat = useCallback(() => setChat(chatSeed), [])

  /* ---------------- persistence ---------------- */
  useEffect(() => {
    try {
      sessionStorage.setItem(persistKey('applications'), JSON.stringify(applications))
      sessionStorage.setItem(persistKey('documents'), JSON.stringify(documents))
      sessionStorage.setItem(persistKey('consents'), JSON.stringify(consents))
      sessionStorage.setItem(persistKey('grievances'), JSON.stringify(grievances))
      sessionStorage.setItem(persistKey('notifications'), JSON.stringify(notifications))
    } catch { /* storage unavailable — demo continues without persistence */ }
  }, [applications, documents, consents, grievances, notifications])

  const resetDemo = useCallback(() => {
    clearPersisted()
    setApplications(initialApplications)
    setDocuments(initialDocuments)
    setConsents(initialConsents)
    setGrievances(initialGrievances)
    setNotifications([...initialNotifications, ...officialSeedNotifications])
    setServiceStates(Object.fromEntries(allServices.map((s) => [s.id, s.status])))
    setOrchFlow(orchFlowSeed)
    setChat(chatSeed)
    pushToast({ kind: 'info', title: 'Demo data reset', body: 'All state restored to the original seed.' })
  }, [pushToast])

  /* ---------------- derived selectors ---------------- */
  const appsFor = useCallback((citizenId: string) => applications.filter((a) => a.citizenId === citizenId), [applications])
  const getApplication = useCallback((id: string) => applications.find((a) => a.id === id), [applications])
  const activeService = useCallback((id: string) => serviceStates[id] ?? 'active', [serviceStates])
  const serviceWithState = useCallback((id: string): Service | undefined => {
    const s = serviceById(id)
    return s ? { ...s, status: serviceStates[id] ?? s.status } : undefined
  }, [serviceStates])
  const allServicesWithState = useMemo(
    () => allServices.map((s) => ({ ...s, status: serviceStates[s.id] ?? s.status })),
    [serviceStates],
  )

  /* PERF: memoized context value — the provider re-renders for auth ticks and
     toasts, but consumers must not re-render unless the data they read changed. */
  return useMemo(() => ({
    // state
    role, setRole, applications, documents, consents, grievances, notifications,
    serviceStates, allServicesWithState, orchFlow, chat, toasts,
    // actions
    pushToast, dismissToast, addNotif, markNotifRead, markAllRead,
    submitApplication, setAppStatus, addRemark, uploadDocument, updateDocStatus,
    setConsentStatus, addGrievance, setGrievanceStatus, setServiceStatus,
    simulateOrchestration, isOrchComplete, pushChat, resetChat, resetDemo,
    // selectors
    appsFor, getApplication, activeService, serviceWithState,
    // data access passthroughs
    departments: allDepartments, departmentById, schemes: allSchemes, schemeById,
    nowTime,
  }), [role, applications, documents, consents, grievances, notifications, serviceStates, allServicesWithState, orchFlow, chat, toasts, pushToast, dismissToast, addNotif, markNotifRead, markAllRead, submitApplication, setAppStatus, addRemark, uploadDocument, updateDocStatus, setConsentStatus, addGrievance, setGrievanceStatus, setServiceStatus, simulateOrchestration, isOrchComplete, pushChat, resetChat, resetDemo, appsFor, getApplication, activeService, serviceWithState, nowTime])
}

export function AppProvider({ children }: { children: ReactNode }) {
  const value = useAppState()
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
