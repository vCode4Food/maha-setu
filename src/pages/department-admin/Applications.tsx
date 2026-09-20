import { useState } from 'react'
import { Search, ClipboardList } from 'lucide-react'
import { Card, EmptyState, Tabs, StatusBadge, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function DeptApplications() {
  const { applications } = useApp()
  const deptApps = applications.filter((a) => a.departmentId === 'revenue')
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')

  const tabs = [
    { id: 'all', label: 'All', count: deptApps.length },
    { id: 'open', label: 'Open', count: deptApps.filter((a) => !['approved', 'completed', 'rejected'].includes(a.status)).length },
    { id: 'done', label: 'Closed', count: deptApps.filter((a) => ['approved', 'completed', 'rejected'].includes(a.status)).length },
  ]

  const filtered = deptApps.filter((a) => {
    if (tab === 'open' && ['approved', 'completed', 'rejected'].includes(a.status)) return false
    if (tab === 'done' && !['approved', 'completed', 'rejected'].includes(a.status)) return false
    if (q && !(a.id.toLowerCase().includes(q.toLowerCase()) || a.citizenName?.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Applications</h1>
        <p className="text-slate-500 mt-1.5">All cases touching the Revenue Department — including those coordinated cross-departmentally.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID or citizen…" className={`${inputCls} pl-9`} aria-label="Search" />
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-canvas"><tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Application</th><th className="px-5 py-3 font-medium">Citizen</th>
              <th className="px-5 py-3 font-medium">Stage</th><th className="px-5 py-3 font-medium">Expected</th><th className="px-5 py-3 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5"><div className="font-medium text-slate-900">{a.serviceName}</div><div className="text-xs text-slate-400">{a.id}</div></td>
                  <td className="px-5 py-3.5 text-slate-600">{a.citizenName}</td>
                  <td className="px-5 py-3.5 text-slate-600">{a.currentStage}</td>
                  <td className="px-5 py-3.5 text-slate-500">{a.expectedCompletion}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<ClipboardList className="w-6 h-6" />} title="Nothing matches" />}
      </Card>
    </div>
  )
}
