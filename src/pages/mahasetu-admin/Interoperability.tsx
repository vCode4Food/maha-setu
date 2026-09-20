import { Card, CardHeader, StatCard, StatusBadge } from '@/components/ui/primitives'
import { NetworkViz } from '@/components/interoperability/NetworkViz'
import { OrchestrationPanel } from '@/features/interoperability/OrchestrationPanel'
import { departments } from '@/data/departments'
import { useApp } from '@/context/AppContext'
import { Network, Zap, Server, Activity } from 'lucide-react'

export default function AdminInteroperability() {
  const { orchFlow } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Interoperability Center</h1>
        <p className="text-slate-500 mt-1.5">The heart of MahaSetu — department connections, live orchestrated flows and message traffic.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Departments connected" value={`${departments.length}/36`} icon={<Network className="w-5 h-5" />} tone="primary" />
        <StatCard label="Interop requests (24h)" value="4.2 L" icon={<Zap className="w-5 h-5" />} tone="saffron" />
        <StatCard label="Success rate" value="99.2%" icon={<Activity className="w-5 h-5" />} tone="green" progress={99} />
        <StatCard label="Avg response time" value="268 ms" icon={<Server className="w-5 h-5" />} tone="slate" />
      </div>

      <Card>
        <CardHeader title="Live network" subtitle="Citizen → MahaSetu → Departments → Outcome. Click any department for connection details." />
        <div className="px-4 pb-6"><NetworkViz /></div>
      </Card>

      <Card>
        <CardHeader title="Service orchestration — live flow" subtitle={orchFlow.title} />
        <div className="px-5 pb-6"><OrchestrationPanel /></div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader title="Connector directory" subtitle="All department connectors with request volume and health" />
        <div className="px-5 sm:px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2.5 font-medium">Department</th><th className="pb-2.5 font-medium">Requests 24h</th><th className="pb-2.5 font-medium">Response</th>
                <th className="pb-2.5 font-medium">Data exchanged</th><th className="pb-2.5 font-medium">Last sync</th><th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 font-medium text-slate-900">{d.name}</td>
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
    </div>
  )
}
