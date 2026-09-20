import { Link } from 'react-router-dom'
import {
  FileStack, Clock, CheckCircle2, AlertTriangle, Users, Network, ArrowRight, Gauge,
} from 'lucide-react'
import { Card, CardHeader, StatCard, StatusBadge } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from 'recharts'
import { departmentById } from '@/data/departments'

const inflow = [
  { w: 'W1', received: 210, disposed: 190 }, { w: 'W2', received: 245, disposed: 238 },
  { w: 'W3', received: 262, disposed: 250 }, { w: 'W4', received: 240, disposed: 255 },
  { w: 'W5', received: 271, disposed: 266 }, { w: 'W6', received: 288, disposed: 280 },
]
const serviceMix = [
  { s: 'Income Cert.', v: 420 }, { s: 'Caste Cert.', v: 310 }, { s: 'Land Record', v: 265 },
  { s: 'Domicile', v: 180 }, { s: 'Others', v: 210 },
]

export default function DeptAdminDashboard() {
  const { applications } = useApp()
  const deptApps = applications.filter((a) => a.departmentId === 'revenue')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Revenue & Land Records Department · Government of Maharashtra (simulated)</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Department Operations</h1>
        </div>
        <Link to="/department-admin/interoperability" className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800">
          <Network className="w-4 h-4" /> Interoperability
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard label="Total applications" value="1,385" sub="this month" icon={<FileStack className="w-5 h-5" />} tone="primary" />
        <StatCard label="Pending" value={deptApps.filter((a) => ['submitted', 'processing'].includes(a.status)).length + 82} icon={<Clock className="w-5 h-5" />} tone="slate" />
        <StatCard label="Completed" value="1,046" icon={<CheckCircle2 className="w-5 h-5" />} tone="green" />
        <StatCard label="Overdue" value="23" sub="SLA at risk" icon={<AlertTriangle className="w-5 h-5" />} tone="saffron" />
        <StatCard label="SLA performance" value="92%" icon={<Gauge className="w-5 h-5" />} tone="primary" progress={92} />
        <StatCard label="Officials active" value="48" icon={<Users className="w-5 h-5" />} tone="slate" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Inflow vs disposal" subtitle="Weekly volumes (simulated)" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inflow}>
                <defs>
                  <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2b5799" stopOpacity={0.25} /><stop offset="100%" stopColor="#2b5799" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} /><stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="received" stroke="#2b5799" fill="url(#dg1)" strokeWidth={2} name="Received" />
                <Area type="monotone" dataKey="disposed" stroke="#16a34a" fill="url(#dg2)" strokeWidth={2} name="Disposed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Service mix" subtitle="Applications by service, this month" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={serviceMix}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="s" width={90} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill="#2b5799" radius={[0, 6, 6, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Cases needing attention" subtitle="Overdue or high-priority files on the department's desk" action={<Link to="/department-admin/applications" className="text-sm font-medium text-primary-700">All applications <ArrowRight className="inline w-3.5 h-3.5" /></Link>} />
          <div className="px-5 sm:px-6 pb-5 space-y-3">
            {deptApps.filter((a) => a.status !== 'completed').slice(0, 4).map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-slate-900">{a.serviceName} · {a.citizenName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{a.id} · {a.currentStage} · expected {a.expectedCompletion}</div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Department health" />
          <div className="px-5 sm:px-6 pb-5 space-y-3">
            {[
              ['SLA compliance', '92%', 'bg-emerald-500'], ['Vault-verified usage', '71%', 'bg-primary-600'],
              ['Grievances resolved in SLA', '88%', 'bg-sky-500'], ['Interop success rate', '99.2%', 'bg-emerald-500'],
            ].map(([k, v, c]) => (
              <div key={k}>
                <div className="flex justify-between text-sm"><span className="text-slate-600">{k}</span><span className="font-semibold text-slate-900">{v}</span></div>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: v }} /></div>
              </div>
            ))}
            <div className="mt-4 rounded-xl bg-canvas p-3.5 text-sm text-slate-600">
              Connector status: <StatusBadge status={departmentById('revenue')?.status ?? 'connected'} /> · last sync {departmentById('revenue')?.lastSync}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
