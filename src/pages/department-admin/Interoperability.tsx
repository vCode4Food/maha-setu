import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { NetworkViz } from '@/components/interoperability/NetworkViz'
import { OrchestrationPanel } from '@/features/interoperability/OrchestrationPanel'
import { departments, departmentById } from '@/data/departments'
import { useApp } from '@/context/AppContext'

export default function DeptInteroperability() {
  const { orchFlow } = useApp()
  const self = departmentById('revenue')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Interoperability</h1>
        <p className="text-slate-500 mt-1.5">How Revenue connects to the rest of government — requests in, responses out.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5"><div className="text-sm text-slate-500">Requests handled (24h)</div><div className="text-2xl font-bold text-slate-900 mt-1">{self?.requests24h.toLocaleString('en-IN')}</div><div className="text-xs text-slate-400 mt-1">{self?.dataExchanged} exchanged</div></Card>
        <Card className="p-5"><div className="text-sm text-slate-500">Avg response</div><div className="text-2xl font-bold text-slate-900 mt-1">{self?.responseMs} ms</div><div className="text-xs text-slate-400 mt-1">API connector v2.8</div></Card>
        <Card className="p-5"><div className="text-sm text-slate-500">Connection status</div><div className="mt-2"><StatusBadge status={self?.status ?? 'connected'} /></div><div className="text-xs text-slate-400 mt-2">Last sync {self?.lastSync}</div></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader title="MahaSetu network" subtitle="Your department's position in the interoperability layer" />
          <div className="px-4 pb-5"><NetworkViz /></div>
        </Card>
        <Card>
          <CardHeader title="Partner departments" subtitle="Frequent counterparties to Revenue requests" />
          <div className="px-5 pb-5 space-y-2.5 max-h-[380px] overflow-y-auto scrollbar-thin">
            {departments.filter((d) => d.id !== 'revenue').map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate">{d.name}</div>
                  <div className="text-xs text-slate-400">{Math.floor(d.requests24h / 40)} shared requests/day · {d.responseMs}ms</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Live coordinated flow" subtitle={orchFlow.title} />
        <div className="px-5 pb-6"><OrchestrationPanel /></div>
      </Card>
    </div>
  )
}
