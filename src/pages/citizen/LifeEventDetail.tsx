import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Baby, Heart, Store, GraduationCap, Wheat, Home, Briefcase, HeartPulse, HandCoins,
  Armchair, FileText, Building2, Clock, ListChecks, Sparkles, ArrowRight, ShieldCheck, Send,
} from 'lucide-react'
import { initialLifeEvents } from '@/data/misc'
import { serviceById } from '@/data/services'
import { departmentById } from '@/data/departments'
import { Card } from '@/components/ui/primitives'
import { Breadcrumb } from '@/components/ui/widgets'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

const ICONS: Record<string, typeof Baby> = {
  Baby, Heart, Store, GraduationCap, Wheat, Home, Briefcase, HeartPulse, HandCoins, Armchair,
}

export default function CitizenLifeEventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { serviceWithState, documents, submitApplication, pushToast } = useApp()
  const ev = initialLifeEvents.find((e) => e.id === id)
  const [applying, setApplying] = useState<string | null>(null)

  if (!ev) {
    return <Card className="p-6">Life event not found. <Link to="/citizen/life-events" className="text-primary-700">See all</Link></Card>
  }
  const Icon = ICONS[ev.icon] ?? Baby

  const applyWithVault = (serviceId: string) => {
    const svc = serviceById(serviceId)
    if (!svc) return
    const attached = documents
      .filter((d) => svc.documents.some((need) => d.name.toLowerCase().includes(need.toLowerCase().split(' ')[0])))
      .map((d) => d.name)
    setApplying(serviceId)
    window.setTimeout(() => {
      const app = submitApplication(serviceId, user?.id ?? 'cit-001', user?.name ?? 'Citizen', attached)
      setApplying(null)
      if (app) navigate(`/citizen/applications/${app.id}`)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/citizen' }, { label: 'Life Events', to: '/citizen/life-events' }, { label: ev.title }]} />
      <Link to="/citizen/life-events" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700"><ArrowLeft className="w-4 h-4" /> All life events</Link>

      {/* Header */}
      <Card className="p-6 sm:p-8 bg-primary-950 border-primary-950 text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-saffron-500/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Icon className="w-7 h-7 text-saffron-400" />
          </div>
          <div className="flex-1 min-w-[240px]">
            <h1 className="text-2xl font-bold tracking-tight">{ev.title}</h1>
            <p className="text-white/70 mt-1">{ev.tagline}</p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-xl px-3.5 py-2">
            <Clock className="w-4 h-4 text-saffron-400" /> {ev.timelineWeeks}
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="space-y-6">
          {/* Journey */}
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2"><ListChecks className="w-5 h-5 text-primary-700" /> Your journey with MahaSetu</h2>
            <div className="mt-5">
              {ev.journey.map((j, i) => (
                <div key={j.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-9 h-9 rounded-full bg-primary-900 text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    {i < ev.journey.length - 1 && <span className="w-0.5 flex-1 bg-primary-100 my-1" />}
                  </div>
                  <div className="pb-7 last:pb-1">
                    <div className="font-medium text-slate-900">{j.title}</div>
                    <p className="text-sm text-slate-500 mt-1">{j.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Services */}
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-primary-700" /> Services in this journey</h2>
            <div className="mt-4 space-y-3">
              {ev.services.map((sid) => {
                const s = serviceWithState(sid)
                if (!s) return null
                const attachedCount = documents.filter((d) => s.documents.some((need) => d.name.toLowerCase().includes(need.toLowerCase().split(' ')[0]))).length
                return (
                  <div key={sid} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 text-sm">{s.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {departmentById(s.departmentId)?.shortName} · {s.processingTime} · {s.fee === 0 ? 'Free' : `₹${s.fee}`} · {attachedCount}/{s.documents.length} docs in vault
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => applyWithVault(sid)} loading={applying === sid}>
                          Apply with vault <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        <Link to={`/citizen/services/${s.id}`} className="text-sm font-medium text-primary-700 hover:text-primary-900">Details</Link>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.documents.map((d) => (
                        <span key={d} className="text-[11px] rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-500">{d}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Docs + departments */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-700" /> Documents to prepare</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {ev.documents.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600"><FileText className="w-3.5 h-3.5 text-slate-400" /> {d}</span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">Upload once — reused everywhere with your consent.</p>
            </Card>
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600" /> Departments coordinated</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {ev.departments.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-xs rounded-full px-3 py-1.5 text-white" style={{ background: departmentById(d)?.color }}>{departmentById(d)?.shortName}</span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">MahaSetu orchestrates these checks in parallel — you never visit them separately.</p>
            </Card>
          </div>
        </div>

        {/* Rail */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <Card className="p-6 bg-primary-50/60 border-primary-100">
            <div className="flex items-center gap-2 font-semibold text-primary-900"><Sparkles className="w-4 h-4" /> What happens when you apply</div>
            <ol className="mt-3 space-y-2 text-sm text-primary-900/80 list-decimal list-inside">
              <li>Vault documents attach automatically</li>
              <li>One application is created</li>
              <li>Departments coordinate in parallel</li>
              <li>Certificates land in your vault</li>
            </ol>
            <Button variant="outline" className="w-full mt-4" onClick={() => pushToast({ kind: 'info', title: 'MahaSetu Sahayak', body: 'Opening assistant… use the chat button (demo).' })}>
              Ask AI about this journey
            </Button>
          </Card>
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-800">MahaSetu identifies for you</div>
            <div className="mt-3 space-y-2">
              {ev.needs.map((n) => (
                <div key={n} className="text-sm text-slate-600 rounded-xl bg-canvas px-3.5 py-2.5">{n}</div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
