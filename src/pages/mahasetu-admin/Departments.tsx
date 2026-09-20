import { Search } from 'lucide-react'
import { Card, CardHeader, StatusBadge, inputCls } from '@/components/ui/primitives'
import { departments } from '@/data/departments'
import { useApp } from '@/context/AppContext'

export default function AdminDepartments() {
  const { pushToast } = useApp()
  void pushToast

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Departments</h1>
        <p className="text-slate-500 mt-1.5">Connected departments with connector health, contracts and data-exchange volume.</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="All connected departments" subtitle={`${departments.length} of 36 connectors shown (demo subset)`} />
        <div className="px-5 sm:px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2.5 font-medium">Department</th><th className="pb-2.5 font-medium">Services</th><th className="pb-2.5 font-medium">Requests 24h</th>
                <th className="pb-2.5 font-medium">Avg response</th><th className="pb-2.5 font-medium">Data exchanged</th><th className="pb-2.5 font-medium">Last sync</th><th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                      <div><div className="font-medium text-slate-900">{d.name}</div><div className="text-xs text-slate-400">{d.domain}</div></div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-600">{d.servicesCount}</td>
                  <td className="py-3.5 text-slate-600">{d.requests24h.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 text-slate-600">{d.responseMs} ms</td>
                  <td className="py-3.5 text-slate-600">{d.dataExchanged}</td>
                  <td className="py-3.5 text-slate-500">{d.lastSync}</td>
                  <td className="py-3.5"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      void Search
    </div>
  )
}
