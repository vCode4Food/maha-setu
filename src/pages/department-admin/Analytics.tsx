import { Download } from 'lucide-react'
import { Card, CardHeader, StatCard } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts'

const daily = Array.from({ length: 30 }, (_, i) => ({
  d: `${i + 1}`,
  applications: 60 + Math.round(30 * Math.sin(i / 4) + i * 0.8),
  grievances: 6 + Math.round(4 * Math.sin(i / 5) + (i % 3)),
}))

const modeSplit = [
  { name: 'Online', value: 72, color: '#2b5799' },
  { name: 'Assisted (CSC)', value: 21, color: '#f97316' },
  { name: 'Offline', value: 7, color: '#94a3b8' },
]

export default function DeptAnalytics() {
  const { pushToast } = useApp()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-slate-500 mt-1.5">Service demand, digital adoption and grievance trends (simulated datasets).</p>
        </div>
        <button onClick={() => pushToast({ kind: 'success', title: 'Export queued', body: 'department-analytics-sep-2026.xlsx (demo)' })} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"><Download className="w-4 h-4" /> Export</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Applications (30d)" value="1,385" sub="+8.4% MoM" tone="primary" />
        <StatCard label="Digital share" value="72%" sub="18% assisted · 10% offline" tone="saffron" progress={72} />
        <StatCard label="Avg processing" value="4.1 days" sub="SLA 7 days" tone="green" />
        <StatCard label="Grievances per 100 apps" value="2.9" sub="down from 3.4" tone="slate" />
      </div>

      <Card>
        <CardHeader title="Daily applications & grievances" subtitle="Last 30 days" />
        <div className="px-5 pb-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="d" tickLine={false} axisLine={false} interval={4} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#2b5799" strokeWidth={2.5} dot={false} name="Applications" />
              <Line type="monotone" dataKey="grievances" stroke="#f97316" strokeWidth={2} dot={false} name="Grievances" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Application mode split" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={modeSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {modeSplit.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Top services by processing time" subtitle="Average days vs SLA" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ s: 'Income', days: 4.1, sla: 7 }, { s: 'Caste', days: 6.2, sla: 10 }, { s: 'Land copy', days: 0.5, sla: 1 }, { s: 'Domicile', days: 5.4, sla: 10 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="s" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} />
                <Tooltip /><Legend />
                <Bar dataKey="days" fill="#2b5799" radius={[6, 6, 0, 0]} name="Avg days" />
                <Bar dataKey="sla" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="SLA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
