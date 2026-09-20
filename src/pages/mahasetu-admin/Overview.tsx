import { Link } from 'react-router-dom'
import {
  Users, Building2, Landmark, FileStack, Zap, Activity, MessageSquareWarning, Network,
  ArrowRight, ShieldCheck,
} from 'lucide-react'
import { Card, CardHeader, StatCard, StatusBadge } from '@/components/ui/primitives'
import { NetworkViz } from '@/components/interoperability/NetworkViz'
import { MahaMap } from '@/components/interoperability/MahaMap'
import { useApp } from '@/context/AppContext'
import { departments } from '@/data/departments'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts'

const appsOverTime = [
  { m: 'Jan', v: 820 }, { m: 'Feb', v: 940 }, { m: 'Mar', v: 1010 }, { m: 'Apr', v: 1150 },
  { m: 'May', v: 1090 }, { m: 'Jun', v: 1240 }, { m: 'Jul', v: 1320 }, { m: 'Aug', v: 1410 }, { m: 'Sep', v: 1520 },
]
const stateActivity = [
  { s: 'MH', v: 128400 }, { s: 'UP', v: 92600 }, { s: 'KA', v: 74800 }, { s: 'TN', v: 61200 },
  { s: 'GJ', v: 58700 }, { s: 'WB', v: 48300 }, { s: 'RJ', v: 43500 }, { s: 'DL', v: 41200 },
]
const satisfaction = [
  { name: 'Very satisfied', value: 58, color: '#16a34a' },
  { name: 'Satisfied', value: 27, color: '#2b5799' },
  { name: 'Neutral', value: 9, color: '#94a3b8' },
  { name: 'Poor', value: 6, color: '#f43f5e' },
]

export default function AdminOverview() {
  const { applications } = useApp()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">National Command Centre · MahaSetu Platform Administration</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">National Overview</h1>
        </div>
        <Link to="/admin/interoperability" className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800">
          <Network className="w-4 h-4" /> Interoperability Center
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        <StatCard label="Citizens" value="6.1 Cr+" icon={<Users className="w-5 h-5" />} tone="primary" />
        <StatCard label="Businesses" value="18.6 L" icon={<Building2 className="w-5 h-5" />} tone="primary" />
        <StatCard label="Departments" value="36" icon={<Landmark className="w-5 h-5" />} tone="slate" />
        <StatCard label="Active services" value="18,240" icon={<FileStack className="w-5 h-5" />} tone="saffron" />
        <StatCard label="Applications today" value={applications.length * 1 + 2418} icon={<Zap className="w-5 h-5" />} tone="green" />
        <StatCard label="Open grievances" value="3,190" icon={<MessageSquareWarning className="w-5 h-5" />} tone="saffron" />
        <StatCard label="Uptime (90d)" value="99.97%" icon={<Activity className="w-5 h-5" />} tone="green" />
        <StatCard label="Interop reqs/day" value="4.2 L" icon={<Network className="w-5 h-5" />} tone="primary" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader title="National Service Network" subtitle="Select a state to inspect simulated activity" />
          <div className="px-5 pb-6"><MahaMap /></div>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Interoperability traffic" subtitle="Department activity (24h, thousands of requests)" />
          <div className="px-5 pb-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={departments.slice(0, 8).map((d) => ({ s: d.shortName, v: Math.round(d.requests24h / 1000) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="s" width={95} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill="#2b5799" radius={[0, 6, 6, 0]} name="Requests (k)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Applications over time" subtitle="All departments, monthly" />
          <div className="px-5 pb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appsOverTime}>
                <defs><linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2b5799" stopOpacity={0.3} /><stop offset="100%" stopColor="#2b5799" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="v" stroke="#2b5799" fill="url(#ag1)" strokeWidth={2.5} name="Applications (k)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="State-wise activity" subtitle="Applications this year (thousands)" />
          <div className="px-5 pb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="s" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill="#f97316" radius={[6, 6, 0, 0]} name="Applications (k)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Citizen satisfaction" subtitle="Post-completion surveys (simulated)" />
          <div className="px-5 pb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={satisfaction} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {satisfaction.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Department connection status" subtitle="Live connector health across the platform" action={<Link to="/admin/system-health" className="text-sm font-medium text-primary-700 inline-flex items-center gap-1">System health <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="px-5 sm:px-6 pb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {departments.map((d) => (
            <div key={d.id} className="rounded-xl border border-slate-200 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-800 truncate">{d.shortName}</span>
                <StatusBadge status={d.status} />
              </div>
              <div className="text-xs text-slate-400 mt-1">{(d.requests24h / 1000).toFixed(1)}k req · {d.responseMs}ms · sync {d.lastSync}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-primary-950 border-primary-950 text-white flex flex-wrap items-center gap-4">
        <ShieldCheck className="w-6 h-6 text-emerald-400" />
        <div className="flex-1 min-w-[240px]">
          <div className="font-semibold">Platform governance note</div>
          <div className="text-sm text-white/70 mt-0.5">All metrics on this dashboard are simulated for demonstration. The prototype represents the proposed national interoperability architecture, not live government data.</div>
        </div>
      </Card>
    </div>
  )
}
