import { Link } from 'react-router-dom'
import { Inbox, AlertTriangle, CheckCircle2, Clock, FileSearch, ArrowRight, Gavel } from 'lucide-react'
import { Card, CardHeader, StatCard, StatusBadge } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { departmentById } from '@/data/departments'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const weeklyData = [
  { day: 'Mon', assigned: 14, resolved: 11 }, { day: 'Tue', assigned: 18, resolved: 15 },
  { day: 'Wed', assigned: 16, resolved: 14 }, { day: 'Thu', assigned: 21, resolved: 17 },
  { day: 'Fri', assigned: 19, resolved: 18 }, { day: 'Sat', assigned: 9, resolved: 8 },
]

export default function OfficialDashboard() {
  const { user } = useAuth()
  const { applications, grievances } = useApp()
  const me = user?.name ?? ''

  const mine = applications.filter((a) => a.assignedOfficer === me || (a.status === 'under_review' && a.departmentId === user?.departmentId))
  const pending = mine.filter((a) => ['submitted', 'under_review', 'processing'].includes(a.status))
  const overdue = pending.filter((a) => a.priority === 'high')
  const actionNeeded = mine.filter((a) => a.status === 'action_required')
  const resolved = mine.filter((a) => ['approved', 'completed', 'rejected'].includes(a.status))
  const myGrievances = grievances.filter((g) => g.status !== 'resolved').slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Sub-Divisional Office · Revenue Department</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Officer console, {user?.name.split(' ')[0]}</h1>
        </div>
        <Link to="/official/applications" className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800">
          Open case queue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Assigned today" value={mine.length} icon={<Inbox className="w-5 h-5" />} tone="primary" />
        <StatCard label="Pending" value={pending.length} icon={<Clock className="w-5 h-5" />} tone="slate" />
        <StatCard label="High priority" value={overdue.length} icon={<AlertTriangle className="w-5 h-5" />} tone="saffron" />
        <StatCard label="Resolved" value={resolved.length} icon={<CheckCircle2 className="w-5 h-5" />} tone="green" />
        <StatCard label="SLA compliance" value="94%" icon={<Gavel className="w-5 h-5" />} tone="primary" progress={94} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Priority cases" subtitle="High-priority applications awaiting your review" action={<Link to="/official/applications" className="text-sm font-medium text-primary-700">View all</Link>} />
            <div className="px-5 sm:px-6 pb-5 space-y-3">
              {mine.slice(0, 4).map((a) => (
                <Link key={a.id} to={`/official/applications/${a.id}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{a.serviceName} · {a.citizenName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{a.id} · {a.district} · waiting since {a.submittedAt}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.priority === 'high' && <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5">Priority</span>}
                      <StatusBadge status={a.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Weekly throughput" subtitle="Cases assigned vs resolved (simulated)" />
            <div className="px-5 sm:px-6 pb-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(43,87,153,0.06)' }} />
                  <Bar dataKey="assigned" fill="#2b5799" radius={[6, 6, 0, 0]} name="Assigned" />
                  <Bar dataKey="resolved" fill="#16a34a" radius={[6, 6, 0, 0]} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Grievances in your queue" action={<Link to="/official/grievances" className="text-sm font-medium text-primary-700">All</Link>} />
            <div className="px-5 sm:px-6 pb-5 space-y-3">
              {myGrievances.map((g) => (
                <Link key={g.id} to="/official/grievances" className="block rounded-xl border border-slate-200 p-3.5 hover:border-primary-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-800 truncate">{g.subject}</span>
                    <StatusBadge status={g.status} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{g.id} · {g.citizenName} · SLA {g.slaHours}h</div>
                </Link>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-primary-50/60 border-primary-100">
            <div className="flex items-center gap-2 font-semibold text-primary-900"><FileSearch className="w-4 h-4" /> Vault-verified documents</div>
            <p className="text-sm text-primary-900/80 mt-2">Documents marked "from vault" were verified at upload — you review only flagged ones. This is where interoperability saves your desk hours.</p>
          </Card>

          <Card>
            <CardHeader title="Department notice" />
            <div className="px-5 sm:px-6 pb-5 text-sm text-slate-600">
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3.5">New stamp duty circular effective 20 Sep — apply revised rates to property services this week.</div>
            </div>
          </Card>
        </div>
      </div>
      {actionNeeded.length > 0 && (
        <div className="sr-only">Applications needing action: {actionNeeded.length}</div>
      )}
    </div>
  )
}
