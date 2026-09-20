import { Link, useParams } from 'react-router-dom'
import {
  Baby, Heart, Store, GraduationCap, Wheat, Home, Briefcase, HeartPulse, HandCoins, Armchair,
  ArrowRight, ArrowLeft, FileText, Building2, Clock, ListChecks, Send, ShieldCheck, Sparkles,
} from 'lucide-react'
import { initialLifeEvents } from '@/data/misc'
import { serviceById } from '@/data/services'
import { departmentById } from '@/data/departments'
import { Card, StatusBadge } from '@/components/ui/primitives'
import { Breadcrumb } from '@/components/ui/widgets'
import { SmartImage } from '@/components/ui/SmartImage'
import { Button } from '@/components/ui/Button'

const ICONS: Record<string, typeof Baby> = {
  Baby, Heart, Store, GraduationCap, Wheat, Home, Briefcase, HeartPulse, HandCoins, Armchair,
}

export function LifeEvents() {
  return (
    <div className="bg-canvas min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Life Events' }]} />
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-4">What's happening in your life?</h1>
        <p className="text-slate-500 mt-2 max-w-2xl">Pick your situation. MahaSetu maps it to every registration, licence, scheme and document — across departments — in one guided journey.</p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {initialLifeEvents.map((ev) => {
            const Icon = ICONS[ev.icon] ?? Baby
            return (
              <Link key={ev.id} to={`/life-events/${ev.id}`} className="group">
                <Card className="overflow-hidden h-full group-hover:shadow-glow group-hover:border-primary-200 transition-all">
                  <SmartImage src={ev.image} alt={ev.title} className="h-32" />
                  <div className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center -mt-9 relative mb-3 border-4 border-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary-800">{ev.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{ev.tagline}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {ev.timelineWeeks}
                      <span className="text-slate-300">•</span> {ev.services.length} services
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function LifeEventDetail() {
  const { id } = useParams()
  const ev = initialLifeEvents.find((e) => e.id === id)
  if (!ev) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Life event not found</h1>
        <Button to="/life-events" className="mt-6">See all life events</Button>
      </div>
    )
  }
  const Icon = ICONS[ev.icon] ?? Baby

  return (
    <div>
      {/* Banner */}
      <div className="relative bg-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: `url(${ev.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Life Events', to: '/life-events' }, { label: ev.title }]} />
          <div className="mt-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Icon className="w-7 h-7 text-saffron-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{ev.title}</h1>
              <p className="text-white/70 mt-1">{ev.tagline}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {ev.departments.map((d) => (
              <span key={d} className="rounded-full bg-white/10 border border-white/15 px-3 py-1">{departmentById(d)?.shortName}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="space-y-6">
            {/* Journey */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2"><ListChecks className="w-5 h-5 text-primary-700" /> Your journey with MahaSetu</h2>
              <div className="mt-5 space-y-0">
                {ev.journey.map((j, i) => (
                  <div key={j.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="w-9 h-9 rounded-full bg-primary-900 text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                      {i < ev.journey.length - 1 && <span className="w-0.5 flex-1 bg-primary-100 my-1" />}
                    </div>
                    <div className="pb-8 last:pb-1">
                      <div className="font-medium text-slate-900">{j.title}</div>
                      <p className="text-sm text-slate-500 mt-1">{j.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Needs */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900">What MahaSetu identifies for you</h2>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                {ev.needs.map((n) => (
                  <div key={n} className="rounded-xl bg-canvas p-4 text-sm text-slate-700">{n}</div>
                ))}
              </div>
            </Card>

            {/* Services */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-primary-700" /> Services in this journey</h2>
              <div className="mt-4 space-y-3">
                {ev.services.map((sid) => {
                  const s = serviceById(sid)
                  if (!s) return null
                  return (
                    <div key={sid} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
                      <div>
                        <div className="font-medium text-slate-900 text-sm">{s.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{departmentById(s.departmentId)?.shortName} · {s.processingTime}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={s.mode} />
                        <Link to={`/services/${s.id}`} className="text-sm font-medium text-primary-700 hover:text-primary-900 inline-flex items-center gap-1">Details <ArrowRight className="w-3.5 h-3.5" /></Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Documents */}
            <Card className="p-6">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-primary-700" /> Documents to prepare</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {ev.documents.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-sm bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> {d}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3">Upload once to your vault — reused by every step with your consent.</p>
            </Card>
          </div>

          {/* Sticky rail */}
          <div className="space-y-5 lg:sticky lg:top-24">
            <Card className="p-6 bg-primary-900 text-white border-primary-900">
              <div className="flex items-center gap-2 font-semibold"><Sparkles className="w-4 h-4 text-saffron-400" /> Guided by MahaSetu</div>
              <p className="text-sm text-white/70 mt-2">Login to start this journey — applications, tracking and department coordination in one place.</p>
              <Button to="/login" variant="saffron" className="mt-4 w-full">Start this journey</Button>
              <Button to="/login" variant="outline" className="mt-2 w-full !bg-white/10 !text-white !border-white/25">Talk to MahaSetu Sahayak</Button>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Typical timeline</div>
              <div className="text-2xl font-bold text-slate-900 mt-2">{ev.timelineWeeks}</div>
              <p className="text-xs text-slate-400 mt-1">Simulated estimates from demo data — actual timelines vary by district.</p>
            </Card>
          </div>
        </div>

        <div className="mt-10">
          <Link to="/life-events" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700"><ArrowLeft className="w-4 h-4" /> All life events</Link>
        </div>
      </div>
    </div>
  )
}
