import { MessageSquareWarning } from 'lucide-react'
import { Card, CardHeader, EmptyState, StatusBadge } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function DeptGrievances() {
  const { grievances } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Grievances</h1>
        <p className="text-slate-500 mt-1.5">Grievances routed to the Revenue Department with SLA status.</p>
      </div>
      <Card>
        <CardHeader title="Routed to Revenue" subtitle="Respond before SLA breach to keep the department scorecard green" />
        <div className="px-5 sm:px-6 pb-6 space-y-3">
          {grievances.map((g) => (
            <div key={g.id} className="rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-medium text-slate-900 text-sm">{g.subject}</span>
                  <StatusBadge status={g.status} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{g.id} · {g.citizenName} · {g.location}</div>
              </div>
              <div className="w-40">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1"><span>SLA {g.slaHours}h</span><span>{g.status === 'resolved' ? '100%' : '60%'}</span></div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${g.status === 'resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: g.status === 'resolved' ? '100%' : '60%' }} /></div>
              </div>
            </div>
          ))}
          {grievances.length === 0 && <EmptyState icon={<MessageSquareWarning className="w-6 h-6" />} title="No grievances" />}
        </div>
      </Card>
    </div>
  )
}
