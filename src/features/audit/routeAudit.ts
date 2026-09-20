import type { AuditLogEntry } from '@/types'

/**
 * Session-scoped log of client-side routing anomalies (404s, RBAC denials).
 *
 * Deliberately sessionStorage (not localStorage): it resets with the tab like a
 * real session-scoped server-side tail would, and never persists personal or
 * browsing data across sessions.
 */
const KEY = 'mahasetu.routeAudit'
const MAX_ENTRIES = 200

function read(): AuditLogEntry[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(entries: AuditLogEntry[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)))
  } catch {
    /* storage full or unavailable — audit capture must never break routing */
  }
}

let seq = 0

/** Record a routing anomaly. Safe to call from anywhere, never throws. */
export function recordRouteEvent(kind: AuditLogEntry['kind'], path: string, role: string | null, userId: string | null) {
  const entry: AuditLogEntry = {
    id: `RA-${Date.now().toString(36)}-${++seq}`,
    at: Date.now(),
    kind,
    path,
    role,
    userId,
  }
  write([...read(), entry])
  return entry
}

/** Newest first, for rendering. */
export function getRouteEvents(): AuditLogEntry[] {
  return [...read()].reverse()
}

export function clearRouteEvents() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
