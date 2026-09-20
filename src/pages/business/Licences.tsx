import { useState } from 'react'
import { ShieldAlert, RefreshCw } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { initialBusiness } from '@/data/misc'

export default function BusinessLicences() {
  const biz = initialBusiness
  const { pushToast } = useApp()
  const [renewing, setRenewing] = useState<string | null>(null)

  const startRenewal = (id: string, name: string) => {
    setRenewing(id)
    window.setTimeout(() => {
      setRenewing(null)
      pushToast({ kind: 'success', title: 'Renewal application submitted', body: `${name} — tracked under a new application ID (demo).` })
    }, 900)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Licences</h1>
        <p className="text-slate-500 mt-1.5">Every licence and registration with expiry tracking and one-tap renewals.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5"><div className="text-sm text-slate-500">Valid</div><div className="text-2xl font-bold text-emerald-600 mt-1">{biz.licences.filter((l) => l.status === 'valid').length}</div></Card>
        <Card className="p-5"><div className="text-sm text-slate-500">Expiring ≤ 90 days</div><div className="text-2xl font-bold text-amber-600 mt-1">{biz.licences.filter((l) => l.status === 'expiring').length}</div></Card>
        <Card className="p-5"><div className="text-sm text-slate-500">Renewal in progress</div><div className="text-2xl font-bold text-sky-600 mt-1">{biz.licences.filter((l) => l.status === 'renewal_in_progress').length}</div></Card>
      </div>

      <Card>
        <CardHeader title="All licences" subtitle="Renewals are pre-filled from your business profile" />
        <div className="px-5 sm:px-6 pb-6 space-y-3">
          {biz.licences.map((l) => (
            <div key={l.id} className="rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-medium text-slate-900">{l.name}</span>
                  <StatusBadge status={l.status} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{l.authority} · expires {l.expires}</div>
              </div>
              {(l.status === 'expiring' || l.status === 'expired') && (
                <button onClick={() => startRenewal(l.id, l.name)} className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white text-sm font-medium px-4 py-2 hover:bg-primary-800 disabled:opacity-50" disabled={renewing === l.id}>
                  <RefreshCw className={`w-3.5 h-3.5 ${renewing === l.id ? 'animate-spin' : ''}`} /> {renewing === l.id ? 'Filing…' : 'Renew now'}
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-canvas flex gap-3.5">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-slate-900 text-sm">FSSAI renewal window</div>
          <p className="text-sm text-slate-600 mt-1">File between 15 Sep and 14 Nov to renew without a validity gap. MahaSetu drafts the renewal from your vault — no fresh document uploads needed.</p>
        </div>
      </Card>
    </div>
  )
}
