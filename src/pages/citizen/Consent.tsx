import { ShieldCheck, Lock, Eye, Undo2, Ban, History, BadgeCheck, XCircle, FileCheck2 } from 'lucide-react'
import { Card, CardHeader, StatusBadge, EmptyState } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { departmentById } from '@/data/departments'
import type { Consent } from '@/types'

export default function CitizenConsent() {
  const { consents, setConsentStatus } = useApp()

  const pending = consents.filter((c) => c.status === 'pending')
  const active = consents.filter((c) => c.status === 'active')
  const past = consents.filter((c) => !['active', 'pending'].includes(c.status))

  const row = (c: Consent, activeList: boolean) => (
    <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
      <div className="flex items-start gap-3 min-w-0">
        <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><ShieldCheck className="w-5 h-5" /></span>
        <div className="min-w-0">
          <div className="font-medium text-slate-900 text-sm">{departmentById(c.departmentId)?.shortName}</div>
          <div className="text-sm text-slate-600 mt-0.5">{c.purpose}</div>
          <div className="text-xs text-slate-400 mt-1">Data: {c.dataRequested} · {c.scope} · Granted {c.date}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={c.status} />
        {c.status === 'pending' ? (
          <>
            <button onClick={() => setConsentStatus(c.id, 'active')} className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-600 text-white rounded-lg px-3 py-1.5 hover:bg-emerald-700">
              <BadgeCheck className="w-3.5 h-3.5" /> Allow
            </button>
            <button onClick={() => setConsentStatus(c.id, 'denied')} className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg px-3 py-1.5 hover:bg-rose-50">
              <XCircle className="w-3.5 h-3.5" /> Deny
            </button>
          </>
        ) : activeList ? (
          <>
            <button onClick={() => setConsentStatus(c.id, 'revoked')} className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 border border-rose-200 rounded-lg px-3 py-1.5 hover:bg-rose-50">
              <Undo2 className="w-3.5 h-3.5" /> Revoke
            </button>
          </>
        ) : (
          c.status === 'expired' && (
            <button onClick={() => setConsentStatus(c.id, 'active')} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700 border border-primary-200 rounded-lg px-3 py-1.5 hover:bg-primary-50">
              <History className="w-3.5 h-3.5" /> Renew
            </button>
          )
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Data Permissions</h1>
        <p className="text-slate-500 mt-1.5">Departments can only read specific vault items after you approve. Every access is logged and revocable.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="p-5 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShieldCheck className="w-5 h-5" /></span><div><div className="text-xl font-bold text-slate-900">{active.length}</div><div className="text-xs text-slate-400">Active consents</div></div></Card>
        <Card className="p-5 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center"><Eye className="w-5 h-5" /></span><div><div className="text-xl font-bold text-slate-900">Read-only</div><div className="text-xs text-slate-400">All grants</div></div></Card>
        <Card className="p-5 flex items-center gap-3"><span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Lock className="w-5 h-5" /></span><div><div className="text-xl font-bold text-slate-900">{pending.length}</div><div className="text-xs text-slate-400">Awaiting your approval</div></div></Card>
      </div>

      <Card className="border-amber-200 bg-amber-50/40">
        <CardHeader title="Pending requests" subtitle="Departments waiting for your approval — nothing is shared until you allow it" />
        <div className="px-5 sm:px-6 pb-6 space-y-3">
          {pending.map((c) => row(c, false))}
          {pending.length === 0 && <EmptyState icon={<FileCheck2 className="w-6 h-6" />} title="No pending requests" body="When a department requests your data it will appear here first." />}
        </div>
      </Card>

      <Card>
        <CardHeader title="Active permissions" subtitle="Departments currently allowed to read specific items" />
        <div className="px-5 sm:px-6 pb-6 space-y-3">
          {active.map((c) => row(c, true))}
          {active.length === 0 && <EmptyState icon={<Ban className="w-6 h-6" />} title="No active consents" body="Departments will request access when you apply for services." />}
        </div>
      </Card>

      <Card>
        <CardHeader title="Past & denied requests" />
        <div className="px-5 sm:px-6 pb-6 space-y-3">
          {past.map((c) => row(c, false))}
          {past.length === 0 && <EmptyState icon={<History className="w-6 h-6" />} title="Nothing here yet" />}
        </div>
      </Card>

      <Card className="p-6 bg-canvas">
        <h3 className="font-semibold text-slate-900 text-sm">How consent works (prototype representation)</h3>
        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm text-slate-600">
          <div className="rounded-xl bg-white border border-slate-200 p-3.5"><span className="font-medium text-slate-800 block mb-1">1 · Request</span>A department asks for a specific document or field — never your whole profile.</div>
          <div className="rounded-xl bg-white border border-slate-200 p-3.5"><span className="font-medium text-slate-800 block mb-1">2 · Scoped grant</span>You approve with a purpose and time limit. Access is read-only.</div>
          <div className="rounded-xl bg-white border border-slate-200 p-3.5"><span className="font-medium text-slate-800 block mb-1">3 · Audit & revoke</span>Every read is logged and visible to you. Revoke any time.</div>
        </div>
      </Card>
    </div>
  )
}
