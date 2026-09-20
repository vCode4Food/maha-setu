import { Gauge, CircleCheck, CircleAlert, CircleDollarSign } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { initialBusiness } from '@/data/misc'

const OBLIGATIONS = [
  { id: 'o1', name: 'File GST return GSTR-3B (Aug)', due: '20 Sep 2026', status: 'submitted', authority: 'Finance & Taxation' },
  { id: 'o2', name: 'Renew FSSAI licence', due: '14 Dec 2026', status: 'expiring', authority: 'Food Safety (via MahaSetu)' },
  { id: 'o3', name: 'Renew Trade Licence', due: '08 Oct 2026', status: 'expiring', authority: 'Nashik Municipal Corporation' },
  { id: 'o4', name: 'PF monthly remittance (Aug)', due: '15 Sep 2026', status: 'completed', authority: 'Labour & Employment' },
  { id: 'o5', name: 'Factory licence annual return', due: '30 Jun 2027', status: 'valid', authority: 'Industrial Safety & Health' },
  { id: 'o6', name: 'Professional tax (all partners)', due: '30 Sep 2026', status: 'valid', authority: 'Finance & Taxation' },
]

export default function BusinessCompliance() {
  const biz = initialBusiness
  const score = biz.complianceScore

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Compliance</h1>
        <p className="text-slate-500 mt-1.5">Every obligation in one calendar — what's filed, what's due, what's at risk.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-5">
          <Gauge className="w-10 h-10 text-primary-700" />
          <div>
            <div className="text-sm text-slate-500">Compliance health</div>
            <div className="text-3xl font-bold text-slate-900">{score}<span className="text-base text-slate-400">/100</span></div>
            <div className="text-xs text-slate-400 mt-0.5">{score > 75 ? 'Good — renewals tracked' : 'Action needed on renewals'}</div>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-5">
          <CircleCheck className="w-10 h-10 text-emerald-500" />
          <div><div className="text-sm text-slate-500">On-track obligations</div><div className="text-3xl font-bold text-slate-900">{OBLIGATIONS.filter((o) => o.status !== 'expiring').length}</div><div className="text-xs text-slate-400 mt-0.5">of {OBLIGATIONS.length} total</div></div>
        </Card>
        <Card className="p-6 flex items-center gap-5">
          <CircleDollarSign className="w-10 h-10 text-saffron-500" />
          <div><div className="text-sm text-slate-500">Late-fee risk if missed</div><div className="text-3xl font-bold text-slate-900">₹5.4k</div><div className="text-xs text-slate-400 mt-0.5">across 2 renewals</div></div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Obligation calendar" subtitle="Simulated compliance calendar for FY 2026–27" />
        <div className="px-5 sm:px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2.5 font-medium">Obligation</th><th className="pb-2.5 font-medium">Authority</th><th className="pb-2.5 font-medium">Due</th><th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {OBLIGATIONS.map((o) => (
                <tr key={o.id}>
                  <td className="py-3.5 font-medium text-slate-800">{o.name}</td>
                  <td className="py-3.5 text-slate-500">{o.authority}</td>
                  <td className="py-3.5 text-slate-600">{o.due}</td>
                  <td className="py-3.5"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-canvas flex gap-3.5">
        <CircleAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">Compliance data is simulated for demonstration. In production this view would reconcile directly with department records via consented interoperability.</p>
      </Card>
    </div>
  )
}
