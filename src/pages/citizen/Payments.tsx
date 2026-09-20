import { ReceiptIndianRupee, CheckCircle2, Clock3 } from 'lucide-react'
import { Card, CardHeader, StatusBadge, EmptyState } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'

const seedPayments = [
  { id: 'PAY-2026-77120', appId: 'MS-2026-004821', purpose: 'Business Registration fee', amount: 1000, date: '12 Sep 2026', status: 'completed' },
  { id: 'PAY-2026-76988', appId: 'MS-2026-004798', purpose: 'Income Certificate fee', amount: 30, date: '8 Sep 2026', status: 'completed' },
  { id: 'PAY-2026-75561', appId: 'MS-2026-004654', purpose: 'Driving Licence Renewal fee', amount: 600, date: '28 Aug 2026', status: 'completed' },
]

export default function CitizenPayments() {
  const { applications } = useApp()
  const { user } = useAuth()
  void applications, void user

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Payments</h1>
        <p className="text-slate-500 mt-1.5">All government fees in one place. Demo mode — no real money moves.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5"><div className="text-sm text-slate-500">Total paid (2026)</div><div className="text-2xl font-bold text-slate-900 mt-1">₹1,630</div></Card>
        <Card className="p-5 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><div><div className="text-xl font-bold">{seedPayments.length}</div><div className="text-xs text-slate-400">Successful</div></div></Card>
        <Card className="p-5 flex items-center gap-3"><Clock3 className="w-5 h-5 text-slate-400" /><div><div className="text-xl font-bold">0</div><div className="text-xs text-slate-400">Pending</div></div></Card>
      </div>

      <Card>
        <CardHeader title="Payment history" subtitle="Receipts are archived to your vault automatically" />
        <div className="px-5 sm:px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2.5 font-medium">Receipt</th><th className="pb-2.5 font-medium">For</th>
                <th className="pb-2.5 font-medium">Date</th><th className="pb-2.5 font-medium">Amount</th><th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {seedPayments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3.5 font-medium text-slate-800">{p.id}</td>
                  <td className="py-3.5 text-slate-600">{p.purpose}<span className="block text-xs text-slate-400">{p.appId}</span></td>
                  <td className="py-3.5 text-slate-500">{p.date}</td>
                  <td className="py-3.5 font-semibold text-slate-900">₹{p.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-10">
        <EmptyState icon={<ReceiptIndianRupee className="w-6 h-6" />} title="No pending payments" body="Fees are collected at application time. New charges will appear here." />
      </Card>
    </div>
  )
}
