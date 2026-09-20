import { Link } from 'react-router-dom'
import { Sparkles, CalendarDays, ArrowRight } from 'lucide-react'
import { schemes } from '@/data/schemes'
import { departmentById } from '@/data/departments'
import { Card, StatusBadge } from '@/components/ui/primitives'
import { SmartImage } from '@/components/ui/SmartImage'
import { useApp } from '@/context/AppContext'

export default function BusinessSchemes() {
  const { pushToast } = useApp()
  const bizSchemes = schemes.filter((s) => ['Business', 'Agriculture', 'Housing'].includes(s.category))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Schemes & Incentives</h1>
        <p className="text-slate-500 mt-1.5">Capital subsidies, seed support and sector incentives matched to Sahyadri AgroTech.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {bizSchemes.map((s) => (
          <Card key={s.id} className="overflow-hidden flex flex-col">
            <SmartImage src={s.image} alt={s.name} className="h-36" />
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-saffron-600">{departmentById(s.departmentId)?.shortName}</span>
                <StatusBadge status={s.status} />
              </div>
              <h3 className="font-semibold text-slate-900 mt-2">{s.name}</h3>
              <p className="text-sm text-slate-500 mt-1.5 flex-1">{s.benefit}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3"><CalendarDays className="w-3.5 h-3.5" /> {s.deadline}</div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button onClick={() => pushToast({ kind: 'info', title: 'Application drafted', body: `${s.name} — pre-filled from business profile (demo).` })} className="flex-1 rounded-xl bg-primary-900 text-white text-sm font-medium py-2.5 hover:bg-primary-800">Apply</button>
                <Link to="/business/documents" className="flex-1 text-center rounded-xl border border-slate-300 text-slate-700 text-sm font-medium py-2.5 hover:bg-slate-50">Required docs</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6 bg-primary-50/60 border-primary-100 flex items-center gap-3.5">
        <Sparkles className="w-5 h-5 text-primary-700" />
        <p className="text-sm text-primary-900/80">Eligibility pre-checks use your business profile and vault documents via consent. Matching is simulated in this prototype.</p>
      </Card>
    </div>
  )
}
