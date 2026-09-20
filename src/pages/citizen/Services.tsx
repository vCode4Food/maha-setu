import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Clock, IndianRupee, SlidersHorizontal } from 'lucide-react'
import { serviceCategories } from '@/data/services'
import { departmentById } from '@/data/departments'
import { Card, EmptyState, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function CitizenServices() {
  const { allServicesWithState } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [maxFee, setMaxFee] = useState(3000)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return allServicesWithState.filter((s) => {
      if (s.status !== 'active') return false
      if (query && !(s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query))) return false
      if (cat !== 'All' && s.category !== cat) return false
      if (s.fee > maxFee) return false
      return true
    })
  }, [q, cat, maxFee, allServicesWithState])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Find Services</h1>
        <p className="text-slate-500 mt-1.5">Every department, one catalog. Your vault pre-fills applications automatically.</p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do you need? e.g. certificate, licence, pension…" className={`${inputCls} pl-9`} aria-label="Search services" />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls} aria-label="Category">
            {['All', ...serviceCategories].map((c) => <option key={c}>{c}</option>)}
          </select>
          <label className="hidden sm:flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
            ≤ ₹{maxFee}
            <input type="range" min={0} max={3000} step={50} value={maxFee} onChange={(e) => setMaxFee(Number(e.target.value))} className="accent-primary-700 w-24" aria-label="Max fee" />
          </label>
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Link key={s.id} to={`/citizen/services/${s.id}`} className="group">
            <Card className="p-5 h-full group-hover:shadow-glow group-hover:border-primary-200 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-saffron-600">{s.category}</span>
                <span className="text-[10px] uppercase text-slate-400">{s.mode}</span>
              </div>
              <h3 className="font-semibold text-slate-900 mt-2 group-hover:text-primary-800">{s.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{departmentById(s.departmentId)?.shortName}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.processingTime}</span>
                <span className="inline-flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{s.fee === 0 ? 'Free' : s.fee}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card><EmptyState icon={<Search className="w-6 h-6" />} title="No services match" body="Try clearing filters." /></Card>
      )}
    </div>
  )
}
