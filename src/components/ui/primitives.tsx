import type { ReactNode, HTMLAttributes } from 'react'
import { X } from 'lucide-react'

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white rounded-2.5xl border border-slate-200/80 shadow-card ${className}`} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 sm:px-6 pt-5 pb-3">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function SectionTitle({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="max-w-2xl">
        {eyebrow && <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">{eyebrow}</div>}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-slate-500 mt-2 leading-relaxed">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">{icon}</div>
      <h4 className="font-semibold text-slate-800">{title}</h4>
      {body && <p className="text-sm text-slate-500 mt-1 max-w-sm">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; wide?: boolean }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative bg-white w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-t-3xl sm:rounded-2.5xl shadow-pop max-h-[90vh] flex flex-col animate-fadeUp`}>
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-thin px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export function Drawer({ open, onClose, title, children, side = 'right' }: { open: boolean; onClose: () => void; title?: string; children: ReactNode; side?: 'left' | 'right' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
      <div className={`absolute top-0 bottom-0 ${side === 'right' ? 'right-0' : 'left-0'} w-full max-w-md bg-white shadow-pop flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-thin p-6 flex-1">{children}</div>
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    // applications
    draft: 'bg-slate-100 text-slate-600 border-slate-200', submitted: 'bg-sky-50 text-sky-700 border-sky-200',
    under_review: 'bg-indigo-50 text-indigo-700 border-indigo-200', processing: 'bg-sky-50 text-sky-700 border-sky-200',
    action_required: 'bg-amber-50 text-amber-700 border-amber-200', approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200', completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    // grievances
    assigned: 'bg-sky-50 text-sky-700 border-sky-200', responded: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200', escalated: 'bg-rose-50 text-rose-700 border-rose-200',
    // docs
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200', pending: 'bg-slate-100 text-slate-600 border-slate-200',
    expired: 'bg-rose-50 text-rose-700 border-rose-200',
    // services
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200', disabled: 'bg-slate-100 text-slate-500 border-slate-200',
    maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
    // consents
    'revoked': 'bg-rose-50 text-rose-700 border-rose-200', denied: 'bg-rose-50 text-rose-700 border-rose-200',
    // health
    connected: 'bg-emerald-50 text-emerald-700 border-emerald-200', healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    syncing: 'bg-sky-50 text-sky-700 border-sky-200', warning: 'bg-amber-50 text-amber-700 border-amber-200',
    offline: 'bg-rose-50 text-rose-700 border-rose-200',
    // misc
    valid: 'bg-emerald-50 text-emerald-700 border-emerald-200', expiring: 'bg-amber-50 text-amber-700 border-amber-200',
    'renewal_in_progress': 'bg-sky-50 text-sky-700 border-sky-200',
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200', 'closing-soon': 'bg-amber-50 text-amber-700 border-amber-200',
    ongoing: 'bg-sky-50 text-sky-700 border-sky-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    // route audit
    not_found: 'bg-sky-50 text-sky-700 border-sky-200', 'route_denied': 'bg-rose-50 text-rose-700 border-rose-200',
  }
  const label = status.replaceAll('_', ' ')
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </span>
  )
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-thin p-1 bg-slate-100 rounded-xl w-fit max-w-full">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-3.5 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${active === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          aria-pressed={active === t.id}
        >
          {t.label}
          {typeof t.count === 'number' && <span className="ml-1.5 text-xs text-slate-400">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function Field({ label, children, hint, required }: { label: string; children: ReactNode; hint?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="text-xs text-slate-400 mt-1 block">{hint}</span>}
    </label>
  )
}

export const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500'

export function StatCard({ label, value, sub, icon, tone = 'primary', progress }: {
  label: string; value: ReactNode; sub?: string; icon?: ReactNode
  tone?: 'primary' | 'saffron' | 'green' | 'rose' | 'slate'; progress?: number
}) {
  const tones: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700', saffron: 'bg-saffron-50 text-saffron-600',
    green: 'bg-emerald-50 text-emerald-700', rose: 'bg-rose-50 text-rose-600', slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</div>
          {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
        </div>
        {icon && <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>{icon}</div>}
      </div>
      {typeof progress === 'number' && (
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full bg-primary-600 transition-all duration-700" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
      )}
    </Card>
  )
}
