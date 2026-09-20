import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { NetworkViz } from '@/components/interoperability/NetworkViz'
import { OrchestrationPanel } from '@/features/interoperability/OrchestrationPanel'
import { departments } from '@/data/departments'
import { useApp } from '@/context/AppContext'

export default function OfficialInteroperability({ view }: { view?: 'official' | 'department_admin' | 'super_admin' }) {
  const { orchFlow } = useApp()
  void view

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Interoperability</h1>
        <p className="text-slate-500 mt-1.5">How your cases move across departments — and the health of each connection.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6 items-start">
        <Card>
          <CardHeader title="Department network" subtitle="Click a department for connection details" />
          <div className="px-4 pb-5"><NetworkViz /></div>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Connection health" />
            <div className="px-5 pb-5 space-y-2.5 max-h-[380px] overflow-y-auto scrollbar-thin">
              {departments.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{d.name}</div>
                    <div className="text-xs text-slate-400">Last sync {d.lastSync} · {d.responseMs}ms</div>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Live orchestration" subtitle={orchFlow.title} />
        <div className="px-5 pb-6"><OrchestrationPanel /></div>
      </Card>
    </div>
  )
}
