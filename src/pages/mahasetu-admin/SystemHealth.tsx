import { useEffect, useState } from 'react'
import { Activity, Server, RefreshCw } from 'lucide-react'
import { Card, CardHeader, StatCard, StatusBadge } from '@/components/ui/primitives'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

type Svc = { id: string; name: string; status: 'healthy' | 'warning' | 'offline'; latency: number; rpm: number; success: number; lastSync: string; errorRate: number }

const seed: Svc[] = [
  { id: 'gw', name: 'API Gateway', status: 'healthy', latency: 118, rpm: 42100, success: 99.98, lastSync: 'just now', errorRate: 0.02 },
  { id: 'id', name: 'Identity Layer', status: 'healthy', latency: 95, rpm: 18400, success: 99.95, lastSync: 'just now', errorRate: 0.05 },
  { id: 'reg', name: 'Service Registry', status: 'healthy', latency: 62, rpm: 9200, success: 100, lastSync: '1 min ago', errorRate: 0 },
  { id: 'vault', name: 'Document Vault', status: 'healthy', latency: 143, rpm: 26800, success: 99.91, lastSync: 'just now', errorRate: 0.09 },
  { id: 'notif', name: 'Notification Engine', status: 'healthy', latency: 77, rpm: 51200, success: 99.97, lastSync: 'just now', errorRate: 0.03 },
  { id: 'wf', name: 'Workflow Engine', status: 'healthy', latency: 210, rpm: 15600, success: 99.86, lastSync: 'just now', errorRate: 0.14 },
  { id: 'analytics', name: 'Analytics Pipeline', status: 'warning', latency: 640, rpm: 4100, success: 98.9, lastSync: '4 min ago', errorRate: 1.1 },
  { id: 'conn', name: 'Department Connectors', status: 'warning', latency: 380, rpm: 22400, success: 99.2, lastSync: '1 min ago', errorRate: 0.8 },
]

const latencyHistory = Array.from({ length: 24 }, (_, i) => ({
  h: `${String(i).padStart(2, '0')}:00`,
  gateway: 100 + Math.round(40 * Math.sin(i / 3) + 10 * Math.sin(i)),
  interop: 240 + Math.round(90 * Math.sin(i / 4) + 20 * Math.sin(i / 2)),
}))

export default function AdminSystemHealth() {
  const [svcs, setSvcs] = useState<Svc[]>(seed)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const t = window.setInterval(() => {
      setSvcs((prev) => prev.map((s) => ({ ...s, latency: Math.max(40, s.latency + Math.round((Math.random() - 0.5) * 20)), rpm: Math.max(100, s.rpm + Math.round((Math.random() - 0.5) * s.rpm * 0.06)) })))
    }, 3000)
    return () => window.clearInterval(t)
  }, [])

  const refresh = () => {
    setRefreshing(true)
    window.setTimeout(() => { setSvcs((prev) => prev.map((s) => ({ ...s, latency: Math.max(40, s.latency + Math.round((Math.random() - 0.5) * 30)) }))); setRefreshing(false) }, 700)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">System Health</h1>
          <p className="text-slate-500 mt-1.5">Frontend simulation of platform monitoring — metrics refresh live for demonstration.</p>
        </div>
        <button onClick={refresh} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh probes
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Overall status" value="Operational" sub="6 of 8 systems fully healthy" icon={<Activity className="w-5 h-5" />} tone="green" />
        <StatCard label="Total requests/min" value={svcs.reduce((s, x) => s + x.rpm, 0).toLocaleString('en-IN')} icon={<Server className="w-5 h-5" />} tone="primary" />
        <StatCard label="Avg latency" value={`${Math.round(svcs.reduce((s, x) => s + x.latency, 0) / svcs.length)} ms`} tone="primary" />
        <StatCard label="Error rate" value="0.09%" sub="rolling 1h" tone="saffron" />
      </div>

      <Card>
        <CardHeader title="Platform latency (24h)" subtitle="Gateway vs interoperability layer, milliseconds" />
        <div className="px-5 pb-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="h" tickLine={false} axisLine={false} interval={3} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="gateway" stroke="#2b5799" strokeWidth={2.5} dot={false} name="API Gateway" />
              <Line type="monotone" dataKey="interop" stroke="#f97316" strokeWidth={2} dot={false} name="Interop layer" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {svcs.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${s.status === 'healthy' ? 'bg-emerald-500' : s.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{s.name}</div>
                  <div className="text-xs text-slate-400">Last sync {s.lastSync}</div>
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div className="rounded-xl bg-canvas py-2.5"><div className="text-sm font-bold text-slate-900">{s.latency}ms</div><div className="text-[10px] text-slate-400 uppercase">Latency</div></div>
              <div className="rounded-xl bg-canvas py-2.5"><div className="text-sm font-bold text-slate-900">{(s.rpm / 1000).toFixed(1)}k</div><div className="text-[10px] text-slate-400 uppercase">Req/min</div></div>
              <div className="rounded-xl bg-canvas py-2.5"><div className="text-sm font-bold text-slate-900">{s.success}%</div><div className="text-[10px] text-slate-400 uppercase">Success</div></div>
              <div className="rounded-xl bg-canvas py-2.5"><div className="text-sm font-bold text-slate-900">{s.errorRate}%</div><div className="text-[10px] text-slate-400 uppercase">Errors</div></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
