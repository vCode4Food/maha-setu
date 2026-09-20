import { Link } from 'react-router-dom'
import { Baby, Heart, Store, GraduationCap, Wheat, Home, Briefcase, HeartPulse, HandCoins, Armchair, Clock } from 'lucide-react'
import { initialLifeEvents } from '@/data/misc'
import { Card } from '@/components/ui/primitives'

const ICONS: Record<string, typeof Baby> = {
  Baby, Heart, Store, GraduationCap, Wheat, Home, Briefcase, HeartPulse, HandCoins, Armchair,
}

export default function CitizenLifeEvents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">What's happening in your life?</h1>
        <p className="text-slate-500 mt-1.5">Pick your situation — MahaSetu maps it to every registration, licence, scheme and document, then coordinates the departments for you.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {initialLifeEvents.map((ev) => {
          const Icon = ICONS[ev.icon] ?? Baby
          return (
            <Link key={ev.id} to={`/citizen/life-events/${ev.id}`} className="group">
              <Card className="p-5 h-full group-hover:shadow-glow group-hover:border-primary-200 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-saffron-50 text-saffron-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary-800">{ev.title}</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{ev.tagline}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                  <Clock className="w-3.5 h-3.5" /> {ev.timelineWeeks} · {ev.services.length} services
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
