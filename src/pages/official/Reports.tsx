import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardHeader, StatCard } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
} from 'recharts'

const monthly = [
  { m: 'Apr', disposed: 312, received: 340 }, { m: 'May', disposed: 335, received: 328 },
  { m: 'Jun', disposed: 356, received: 361 }, { m: 'Jul', disposed: 342, received: 330 },
  { m: 'Aug', disposed: 389, received: 375 }, { m: 'Sep', disposed: 401, received: 380 },
]

const stageData = [
  { name: 'Approved', value: 428, color: '#16a34a' },
  { name: 'In process', value: 236, color: '#2b5799' },
  { name: 'Action needed', value: 58, color: '#f59e0b' },
  { name: 'Rejected', value: 31, color: '#f43f5e' },
]

export default function OfficialReports() {
  const { pushToast } = useApp()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 mt-1.5">Your desk's disposal performance and case-mix (simulated).</p>
        </div>
        <button onClick={() => pushToast({ kind: 'success', title: 'Report exported', body: 'desk-report-sep-2026.xlsx (demo)' })} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Disposed this month" value="401" sub="+3.1% vs Aug" icon={<TrendingUp className="w-5 h-5" />} tone="green" />
        <StatCard label="Avg disposal time" value="4.2 days" sub="-0.6 days vs Aug" icon={<TrendingDown className="w-5 h-5" />} tone="primary" />
        <StatCard label="SLA met" value="94%" icon={<TrendingUp className="w-5 h-5" />} tone="primary" progress={94} />
        <StatCard label="Vault-verified cases" value="68%" sub="skipped re-verification" icon={<TrendingUp className="w-5 h-5" />} tone="saffron" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Received vs disposed" subtitle="Monthly trend" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2b5799" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2b5799" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="received" stroke="#2b5799" fill="url(#g1)" strokeWidth={2} name="Received" />
                <Area type="monotone" dataKey="disposed" stroke="#16a34a" fill="url(#g2)" strokeWidth={2} name="Disposed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Case outcomes" subtitle="This month" />
          <div className="px-5 pb-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stageData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {stageData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
