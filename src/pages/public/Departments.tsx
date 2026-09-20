import { useState } from 'react'
import { Search, Clock, Activity } from 'lucide-react'
import { departments } from '@/data/departments'
import { Card, StatusBadge, EmptyState } from '@/components/ui/primitives'
import { Breadcrumb } from '@/components/ui/widgets'
import { inputCls } from '@/components/ui/primitives'

export default function Departments() {
  const [q, setQ] = useState('')
  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(q.toLowerCase()) || d.domain.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Departments' }]} />
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-4">Department Directory</h1>
      <p className="text-slate-500 mt-2 max-w-2xl">Every department on the MahaSetu network — with live connection status, response health and services offered. Departments coordinate through MahaSetu so you never visit two offices for one work.</p>

      <div className="mt-8 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search departments…" className={`${inputCls} pl-9`} aria-label="Search departments" />
      </div>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <Card key={d.id} className="p-5 hover:shadow-glow hover:border-primary-200 transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: d.color }}>
                  {d.shortName.slice(0, 1)}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-[15px]">{d.name}</h3>
                  <p className="text-xs text-slate-400">{d.domain}</p>
                </div>
              </div>
              <StatusBadge status={d.status} />
            </div>
            <p className="text-sm text-slate-500 mt-3">{d.description}</p>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="rounded-xl bg-canvas py-2">
                <div className="font-bold text-slate-900 text-sm">{d.servicesCount}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Services</div>
              </div>
              <div className="rounded-xl bg-canvas py-2">
                <div className="font-bold text-slate-900 text-sm">{(d.requests24h / 1000).toFixed(1)}k</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Req / 24h</div>
              </div>
              <div className="rounded-xl bg-canvas py-2">
                <div className="font-bold text-slate-900 text-sm">{d.responseMs}ms</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Response</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
              <Clock className="w-3.5 h-3.5" /> Last sync {d.lastSync} · <Activity className="w-3.5 h-3.5 ml-1" /> {d.dataExchanged} exchanged
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="mt-6"><EmptyState icon={<Search className="w-6 h-6" />} title="No departments match" /></Card>
      )}
    </div>
  )
}
