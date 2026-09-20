import { Users, Mail, Phone } from 'lucide-react'
import { Card, CardHeader, StatCard } from '@/components/ui/primitives'

const OFFICIALS = [
  { id: 'off-014', name: 'Meera Deshpande', role: 'Sub-Divisional Officer', desk: 'Pune City', load: 14, sla: 96 },
  { id: 'off-021', name: 'S. N. Jadhav', role: 'Circle Officer', desk: 'Haveli', load: 22, sla: 89 },
  { id: 'off-033', name: 'Priya Nair', role: 'Tehsildar', desk: 'Pune City', load: 9, sla: 97 },
  { id: 'off-042', name: 'A. B. Kadam', role: 'Verification Cell', desk: 'Central', load: 31, sla: 91 },
  { id: 'off-057', name: 'R. M. Gaikwad', role: 'Circle Officer', desk: 'Mulshi', load: 17, sla: 84 },
]

export default function DeptOfficials() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Officials</h1>
        <p className="text-slate-500 mt-1.5">Case assignment, workload balance and SLA performance per officer.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active officials" value={OFFICIALS.length} icon={<Users className="w-5 h-5" />} tone="primary" />
        <StatCard label="Avg caseload" value={Math.round(OFFICIALS.reduce((s, o) => s + o.load, 0) / OFFICIALS.length)} sub="cases per officer" tone="slate" />
        <StatCard label="Avg SLA compliance" value={`${Math.round(OFFICIALS.reduce((s, o) => s + o.sla, 0) / OFFICIALS.length)}%`} tone="green" progress={Math.round(OFFICIALS.reduce((s, o) => s + o.sla, 0) / OFFICIALS.length)} />
      </div>

      <Card>
        <CardHeader title="Officer roster" subtitle="Rebalancing is simulated in this demo" />
        <div className="px-5 sm:px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2.5 font-medium">Officer</th><th className="pb-2.5 font-medium">Role</th><th className="pb-2.5 font-medium">Desk</th><th className="pb-2.5 font-medium">Caseload</th><th className="pb-2.5 font-medium">SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {OFFICIALS.map((o) => (
                <tr key={o.id}>
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center">{o.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
                      <div>
                        <div className="font-medium text-slate-900">{o.name}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-2.5 mt-0.5"><Mail className="w-3 h-3" />{o.id}@gov.in <Phone className="w-3 h-3 ml-1.5" /> ext. {o.id.slice(-3)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600">{o.role}</td>
                  <td className="py-3.5 text-slate-600">{o.desk}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${o.load > 25 ? 'text-rose-600' : o.load > 15 ? 'text-amber-600' : 'text-emerald-600'}`}>{o.load}</span>
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${o.load > 25 ? 'bg-rose-500' : o.load > 15 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, o.load * 3)}%` }} /></div>
                    </div>
                  </td>
                  <td className="py-3.5 font-medium text-slate-700">{o.sla}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
