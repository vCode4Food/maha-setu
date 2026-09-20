import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, CheckCircle2, Info, AlertTriangle, XCircle, X, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/AppContext'

/* ---------------- Toasts ---------------- */
export function ToastStack() {
  const { toasts, dismissToast } = useApp()
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
  }
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)]" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="bg-white rounded-xl shadow-pop border border-slate-200 p-4 flex gap-3 items-start animate-fadeUp">
          {icons[t.kind]}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-slate-900">{t.title}</div>
            {t.body && <div className="text-sm text-slate-500 mt-0.5">{t.body}</div>}
          </div>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Gist card ---------------- */
export interface GistData { who: string; get: string; need: string; apply: string; deadline: string; department: string }

export function GistCard({ data, title, compact }: { data: GistData; title?: string; compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const rows = [
    { k: 'Who is eligible?', v: data.who },
    { k: 'What do you get?', v: data.get },
    { k: 'What do you need?', v: data.need },
    { k: 'How do you apply?', v: data.apply },
    { k: 'Deadline', v: data.deadline },
    { k: 'Department', v: data.department },
  ]
  return (
    <div className="rounded-2xl border border-primary-100 bg-primary-50/60 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-primary-600 shrink-0" />
          <span className="text-sm font-semibold text-primary-900">Gist</span>
          <span className="text-xs text-primary-700/70 hidden sm:inline">— plain-language summary</span>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-xs font-medium text-primary-700 hover:text-primary-900 inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary-100/70"
          aria-expanded={open}
        >
          {open ? 'Hide' : 'Show'} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {open && (
        <div className={`px-4 pb-4 grid ${compact ? 'sm:grid-cols-2' : ''} gap-x-6 gap-y-2.5 border-t border-primary-100 pt-3`}>
          {title && <div className={`text-sm text-slate-600 ${compact ? 'sm:col-span-2' : ''}`}>{title}</div>}
          {rows.map((r) => (
            <div key={r.k}>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-primary-700/70">{r.k}</div>
              <div className="text-sm text-slate-700 mt-0.5">{r.v}</div>
            </div>
          ))}
          <div className={`text-[11px] text-slate-400 ${compact ? 'sm:col-span-2' : ''}`}>
            Generated on-device from the notification text — prototype simulation.
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------------- Timeline ---------------- */
export function Timeline({ events }: {
  events: { stage: string; status: 'done' | 'active' | 'pending' | 'failed'; time?: string; note?: string; actor?: string }[]
}) {
  return (
    <ol className="relative">
      {events.map((e, i) => (
        <li key={e.stage + i} className="relative pl-8 pb-6 last:pb-0">
          {i < events.length - 1 && (
            <span className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${e.status === 'done' ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
          <span className={`absolute left-0 top-0.5 w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 ${
            e.status === 'done' ? 'bg-emerald-500 border-emerald-500' :
            e.status === 'active' ? 'bg-white border-primary-600' :
            e.status === 'failed' ? 'bg-rose-500 border-rose-500' : 'bg-white border-slate-300'}`}>
            {e.status === 'active' && <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />}
          </span>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={`font-medium text-sm ${e.status === 'pending' ? 'text-slate-400' : 'text-slate-900'}`}>{e.stage}</span>
            {e.time && <span className="text-xs text-slate-400">{e.time}</span>}
            {e.actor && <span className="text-xs text-slate-400">· {e.actor}</span>}
          </div>
          {e.note && <p className="text-sm text-slate-500 mt-1">{e.note}</p>}
        </li>
      ))}
    </ol>
  )
}

/* ---------------- Animated counter ---------------- */
export function Counter({ to, suffix = '', duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    /* Reduced motion: skip the animation entirely, show the final value. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(to); return }
    let raf: number
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return <>{val.toLocaleString('en-IN')}{suffix}</>
}

/* ---------------- Notification bell ---------------- */
export function NotificationBell() {
  const { notifications, markNotifRead, markAllRead } = useApp()
  const [open, setOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600"
        aria-label={`Notifications (${unread} unread)`}
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-saffron-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-[min(92vw,380px)] bg-white rounded-2xl shadow-pop border border-slate-200 z-[70] overflow-hidden animate-fadeUp">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-semibold text-slate-900 text-sm">Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-800 font-medium">Mark all read</button>
              )}
            </div>
            <div className="max-h-[380px] overflow-y-auto scrollbar-thin divide-y divide-slate-100">
              {notifications.slice(0, 12).map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markNotifRead(n.id); setOpen(false); if (n.link) window.location.hash = '' }}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3 ${!n.read ? 'bg-primary-50/40' : ''}`}
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-slate-200' : 'bg-saffron-500'}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900 truncate">{n.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</span>
                    <span className="block text-[11px] text-slate-400 mt-1">{n.time}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

/* ---------------- Service / Scheme cards ---------------- */
export function ServiceCard({ id, name, department, category, fee, processing, mode, to, icon }: {
  id?: string; name: string; department: string; category: string; fee: string; processing: string; mode: string; to: string; icon?: ReactNode
}) {
  void id
  return (
    <Link to={to} className="group block bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 hover:shadow-glow hover:border-primary-200 transition-all">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
          {icon ?? <Sparkles className="w-5 h-5" />}
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{mode}</span>
      </div>
      <h3 className="font-semibold text-slate-900 mt-3 group-hover:text-primary-800 transition-colors">{name}</h3>
      <p className="text-xs text-slate-500 mt-1">{department} · {category}</p>
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        <span>{fee}</span><span className="text-slate-300">•</span><span>{processing}</span>
      </div>
    </Link>
  )
}

/* ---------------- Breadcrumb ---------------- */
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-slate-400 flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-300">/</span>}
          {it.to ? <Link to={it.to} className="hover:text-primary-700">{it.label}</Link> : <span className="text-slate-600 font-medium">{it.label}</span>}
        </span>
      ))}
    </nav>
  )
}
