import { Building2, Hash, MapPin, CalendarDays, BadgeCheck, FileCheck } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { initialBusiness } from '@/data/misc'

export default function BusinessProfile() {
  const biz = initialBusiness

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Business Profile</h1>
        <p className="text-slate-500 mt-1.5">Your verified entity record on MahaSetu — reused by every department.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <span className="w-16 h-16 rounded-2xl bg-primary-900 text-white text-xl font-bold flex items-center justify-center">SA</span>
          <div className="flex-1 min-w-[240px]">
            <h2 className="text-xl font-bold text-slate-900">{biz.legalName}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" />Nashik, Maharashtra</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-emerald-500" />Verified entity</span>
              <StatusBadge status={biz.status} />
            </div>
          </div>
          <button className="rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">Edit profile</button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Registration & identifiers" />
        <div className="px-5 sm:px-6 pb-6 grid sm:grid-cols-2 gap-3">
          {[
            { icon: Building2, k: 'Entity type', v: biz.type },
            { icon: Hash, k: 'CIN', v: biz.cin },
            { icon: Hash, k: 'GSTIN', v: biz.gstin },
            { icon: CalendarDays, k: 'Registered on', v: biz.registeredOn },
            { icon: Building2, k: 'Sector', v: biz.sector },
            { icon: MapPin, k: 'Registered address', v: biz.address },
          ].map((r) => (
            <div key={r.k} className="rounded-xl border border-slate-200 p-4 flex items-start gap-3">
              <r.icon className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0"><div className="text-xs text-slate-400">{r.k}</div><div className="text-sm font-medium text-slate-800 break-all">{r.v}</div></div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-canvas flex gap-3.5">
        <FileCheck className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">Company identifiers are fictional demo data. In production, MahaSetu would verify them once against MCA / GSTN records and reuse them across every department through the interoperability layer.</p>
      </Card>
    </div>
  )
}
