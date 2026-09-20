import { useState } from 'react'
import { Search } from 'lucide-react'
import { Card, CardHeader, StatusBadge, inputCls, EmptyState } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function AdminRegistry() {
  const { allServicesWithState } = useApp()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('All')

  const depts = ['All', ...new Set(allServicesWithState.map((s) => s.departmentId))]
  const filtered = allServicesWithState.filter((s) => {
    if (dept !== 'All' && s.departmentId !== dept) return false
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Service Registry</h1>
        <p className="text-slate-500 mt-1.5">The central registry of every service indexed by MahaSetu — versions, SLAs and endpoint health.</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="Registered services" subtitle={`${filtered.length} services shown`} />
        <div className="px-5 sm:px-6 pb-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search registry…" className={`${inputCls} pl-9`} aria-label="Search registry" />
          </div>
          <select value={dept} onChange={(e) => setDept(e.target.value)} className={inputCls} aria-label="Filter by department">
            {depts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="px-5 sm:px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[840px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2.5 font-medium">Service ID</th><th className="pb-2.5 font-medium">Name</th><th className="pb-2.5 font-medium">Department</th>
                <th className="pb-2.5 font-medium">Version</th><th className="pb-2.5 font-medium">SLA</th><th className="pb-2.5 font-medium">Endpoint</th><th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 font-mono text-xs text-slate-500">svc.{s.id}</td>
                  <td className="py-3.5 font-medium text-slate-900">{s.name}</td>
                  <td className="py-3.5 text-slate-600">{s.departmentId}</td>
                  <td className="py-3.5 font-mono text-xs text-slate-500">v{s.version}</td>
                  <td className="py-3.5 text-slate-600">{s.slaDays}d</td>
                  <td className="py-3.5"><span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">200 OK</span></td>
                  <td className="py-3.5"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <EmptyState icon={<Search className="w-6 h-6" />} title="No registry entries match" />}
        </div>
      </Card>
    </div>
  )
}
