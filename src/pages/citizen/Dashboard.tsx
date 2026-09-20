import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FilePlus2, PackageSearch, HandHeart, MessageSquareWarning, Upload, Sparkles,
  ArrowRight, MapPin, Sun, CloudSun, Bell,
} from 'lucide-react'
import { Card, CardHeader, StatCard, StatusBadge } from '@/components/ui/primitives'
import { ServiceCard } from '@/components/ui/widgets'
import { MahaMap } from '@/components/interoperability/MahaMap'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { schemes } from '@/data/schemes'
import { departmentById } from '@/data/departments'
import { initialLifeEvents, serviceCenters, districtStats } from '@/data/misc'
import type { DistrictStat } from '@/types'


const quick = [
  { icon: FilePlus2, label: 'Apply for Service', to: '/citizen/services', tone: 'bg-primary-50 text-primary-700' },
  { icon: PackageSearch, label: 'Track Application', to: '/citizen/applications', tone: 'bg-sky-50 text-sky-700' },
  { icon: HandHeart, label: 'Find Scheme', to: '/citizen/schemes', tone: 'bg-saffron-50 text-saffron-600' },
  { icon: MessageSquareWarning, label: 'Raise Grievance', to: '/citizen/grievances', tone: 'bg-rose-50 text-rose-600' },
  { icon: Upload, label: 'Upload Document', to: '/citizen/documents', tone: 'bg-emerald-50 text-emerald-700' },
  { icon: Sparkles, label: 'Ask AI', to: '/citizen/ai', tone: 'bg-violet-50 text-violet-700' },
]

export default function CitizenDashboard() {
  const { user } = useAuth()
  const { applications, notifications, grievances, serviceWithState } = useApp()
  const [districtId, setDistrictId] = useState('pune')
  const activeDistrict = districtStats.find((d) => d.id === districtId)
  const handleDistrict = useCallback((d: DistrictStat) => setDistrictId(d.id), [])
  const districtCenters = useMemo(
    () => serviceCenters.filter((c) => c.district === (activeDistrict?.name ?? 'Pune')),
    [activeDistrict],
  )
  const uid = user?.id ?? ''
  const myApps = applications.filter((a) => a.citizenId === uid)
  const myGrievances = grievances.filter((g) => g.citizenId === uid)

  const counts = {
    pending: myApps.filter((a) => a.status === 'submitted').length,
    progress: myApps.filter((a) => ['under_review', 'processing'].includes(a.status)).length,
    action: myApps.filter((a) => a.status === 'action_required').length,
    completed: myApps.filter((a) => ['approved', 'completed'].includes(a.status)).length,
  }

  const recent = myApps.slice(0, 3)
  const recSchemes = schemes.filter((s) => ['sch-startup', 'sch-nurture', 'sch-ayush'].includes(s.id))
  const recommended = ['income-certificate', 'immunisation', 'property-tax']

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sun className="w-4 h-4 text-saffron-500" /> Good morning,
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{user?.name.split(' ')[0]} 👋</h1>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1"><MapPin className="w-3.5 h-3.5" /> Pune, Maharashtra · Maha ID {user?.mahaId}</div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 px-4 py-2.5 shadow-card">
          <CloudSun className="w-5 h-5 text-saffron-500" />
          <div>
            <div className="text-sm font-semibold text-slate-800">28°C · Partly cloudy</div>
            <div className="text-[11px] text-slate-400">Good day for outdoor government work 😄</div>
          </div>
        </div>
        </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quick.map((q) => (
          <Link key={q.label} to={q.to}>
            <Card className="p-4 h-full flex flex-col items-center gap-2.5 text-center hover:shadow-glow hover:border-primary-200 transition-all group">
              <span className={`w-11 h-11 rounded-2xl flex items-center justify-center ${q.tone} group-hover:scale-105 transition-transform`}>
                <q.icon className="w-5 h-5" />
              </span>
              <span className="text-xs font-medium text-slate-700">{q.label}</span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending" value={counts.pending} sub="Awaiting department pickup" tone="slate" />
        <StatCard label="In Progress" value={counts.progress} sub="Being processed now" tone="primary" progress={60} />
        <StatCard label="Action Required" value={counts.action} sub="Needs your attention" tone="saffron" />
        <StatCard label="Completed" value={counts.completed} sub="Delivered to your vault" tone="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent applications */}
          <Card>
            <CardHeader title="Recent applications" subtitle="One timeline for everything you've applied for" action={<Link to="/citizen/applications" className="text-sm font-medium text-primary-700 hover:text-primary-900 inline-flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5" /></Link>} />
            <div className="px-5 sm:px-6 pb-5 space-y-3">
              {recent.map((a) => (
                <Link key={a.id} to={`/citizen/applications/${a.id}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{a.serviceName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{a.id} · {departmentById(a.departmentId)?.shortName}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  {a.actionRequired && (
                    <div className="mt-2.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      ⚠ {a.actionRequired}
                    </div>
                  )}
                </Link>
              ))}
              {recent.length === 0 && <div className="text-sm text-slate-400 py-6 text-center">No applications yet — start with Find Services.</div>}
            </div>
          </Card>

          {/* Recommended services */}
          <Card>
            <CardHeader title="Recommended for you" subtitle="Based on your profile and consents (demo personalization)" />
            <div className="px-5 sm:px-6 pb-6 grid sm:grid-cols-3 gap-3">
              {recommended.map((sid) => {
                const s = serviceWithState(sid)
                return s ? (
                  <ServiceCard key={sid} name={s.name} department={departmentById(s.departmentId)?.shortName ?? ''} category={s.category} fee={s.fee === 0 ? 'Free' : `₹${s.fee}`} processing={s.processingTime} mode={s.mode} to={`/citizen/services/${s.id}`} />
                ) : null
              })}
            </div>
          </Card>

          {/* Life event suggestions */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Planning something?</h3>
                <p className="text-sm text-slate-500 mt-1">Life event journeys coordinate every department at once.</p>
              </div>
              <Link to="/citizen/life-events" className="text-sm font-medium text-primary-700 whitespace-nowrap">See all →</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {initialLifeEvents.slice(0, 5).map((ev) => (
                <Link key={ev.id} to={`/citizen/life-events/${ev.id}`} className="rounded-xl border border-slate-200 p-3 text-center hover:border-primary-300 hover:bg-primary-50/40 transition-colors">
                  <span className="text-2xl">{['👶', '💍', '🚚', '🏪', '🎓'][initialLifeEvents.findIndex((x) => x.id === ev.id)]}</span>
                  <div className="text-xs font-medium text-slate-700 mt-1.5 leading-snug">{ev.title.replace('I am ', '').replace('I ', '')}</div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader title="Important updates" action={<Link to="/citizen/notifications" className="text-sm text-primary-700 font-medium">All</Link>} />
            <div className="px-5 sm:px-6 pb-5 space-y-3">
              {notifications.filter((n) => n.audience.includes('citizen')).slice(0, 3).map((n) => (
                <div key={n.id} className="flex gap-3 rounded-xl border border-slate-200 p-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Bell className="w-4 h-4" /></span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{n.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recommended schemes */}
          <Card>
            <CardHeader title="Schemes for you" action={<Link to="/citizen/schemes" className="text-sm text-primary-700 font-medium">All</Link>} />
            <div className="px-5 sm:px-6 pb-5 space-y-3">
              {recSchemes.map((s) => (
                <Link key={s.id} to="/citizen/schemes" className="block rounded-xl border border-slate-200 p-3.5 hover:border-primary-200 hover:bg-primary-50/40 transition-colors">
                  <div className="text-sm font-medium text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.benefit}</div>
                  <div className="text-[11px] text-saffron-600 font-medium mt-1.5">{departmentById(s.departmentId)?.shortName}</div>
                </Link>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* Nearby — full-width horizontal band (mirrors the landing map section) */}
      <div className="grid lg:grid-cols-5 gap-6 items-stretch">
        <Card className="lg:col-span-2 order-2 lg:order-1">
          <CardHeader title="Nearby service centres" subtitle={`Simulated locations · ${activeDistrict?.name ?? 'Pune'}`} action={<Link to="/citizen/nearby" className="text-sm text-primary-700 font-medium">Open map</Link>} />
          <div className="px-5 sm:px-6 pb-5 space-y-2">
            {districtId !== 'pune' && (
              <button onClick={() => setDistrictId('pune')} className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium px-3 py-1.5 hover:bg-primary-100 transition-colors">
                <MapPin className="w-3.5 h-3.5" /> Showing {activeDistrict?.name} · Clear
              </button>
            )}
            {districtCenters.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 hover:border-primary-200 hover:bg-primary-50/30 transition-colors">
                <div className="min-w-0">
                  <div className="font-medium text-slate-800 truncate">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.type} · {c.open}–{c.close}</div>
                </div>
                <span className="text-xs text-slate-500 shrink-0">{c.distanceKm} km</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lg:col-span-3 order-1 lg:order-2">
          <CardHeader title="Maharashtra service availability" subtitle="Select a district to filter the centre list" />
          <div className="px-5 sm:px-6 pb-6">
            <MahaMap compact selectedId={districtId} onSelect={handleDistrict} />
          </div>
        </Card>
      </div>
    </div>
  )
}

