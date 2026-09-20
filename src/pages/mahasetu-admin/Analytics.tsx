import { Download } from 'lucide-react'
import { Card, CardHeader, StatCard } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, LineChart, Line,
} from 'recharts'

const growth = [
  { q: 'Q1 2025', citizens: 0.9, businesses: 4.2 }, { q: 'Q2 2025', citizens: 1.3, businesses: 7.1 },
  { q: 'Q3 2025', citizens: 1.7, businesses: 9.8 }, { q: 'Q4 2025', citizens: 2.0, businesses: 13.5 },
  { q: 'Q1 2026', citizens: 2.2, businesses: 15.9 }, { q: 'Q2 2026', citizens: 2.4, businesses: 18.6 },
]
const deptUsage = [
  { d: 'Revenue', apps: 42 }, { d: 'Transport', apps: 31 }, { d: 'Health', apps: 28 },
  { d: 'Education', apps: 24 }, { d: 'Municipal', apps: 21 }, { d: 'Agriculture', apps: 17 },
]
const slaTrend = [
  { m: 'Apr', compliance: 88 }, { m: 'May', compliance: 89 }, { m: 'Jun', compliance: 91 },
  { m: 'Jul', compliance: 90 }, { m: 'Aug', compliance: 93 }, { m: 'Sep', compliance: 94 },
]

export default function AdminAnalytics() {
  const { pushToast } = useApp()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-slate-500 mt-1.5">National-scale adoption, usage and service-level trends (simulated).</p>
        </div>
        <button onClick={() => pushToast({ kind: 'success', title: 'Export queued', body: 'national-analytics-sep-2026.xlsx (demo)' })} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><Download className="w-4 h-4" /> Export</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Citizen adoption" value="82%" sub="of addressed adult population" tone="primary" progress={82} />
        <StatCard label="Digital processing" value="96%" sub="of completed applications" tone="green" progress={96} />
        <StatCard label="SLA compliance" value="94%" sub="across all departments" tone="saffron" progress={94} />
        <StatCard label="Avg satisfaction" value="4.3 / 5" sub="post-completion surveys" tone="primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Adoption growth" subtitle="Citizens (crore) and businesses (lakh)" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="q" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} />
                <Tooltip /><Legend />
                <Line type="monotone" dataKey="citizens" stroke="#2b5799" strokeWidth={2.5} name="Citizens (Cr)" />
                <Line type="monotone" dataKey="businesses" stroke="#16a34a" strokeWidth={2.5} name="Businesses (L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Department usage share" subtitle="Applications processed (thousands, YTD)" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="d" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="apps" fill="#2b5799" radius={[6, 6, 0, 0]} name="Applications (k)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="SLA compliance trend" subtitle="All departments, monthly" />
        <div className="px-5 pb-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={slaTrend}>
              <defs><linearGradient id="slg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} /><stop offset="100%" stopColor="#16a34a" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="m" tickLine={false} axisLine={false} /><YAxis domain={[80, 100]} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="compliance" stroke="#16a34a" fill="url(#slg)" strokeWidth={2.5} name="SLA met %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
