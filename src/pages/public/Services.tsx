import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Clock, IndianRupee, MapPin } from 'lucide-react'
import { services, serviceCategories } from '@/data/services'
import { departmentById } from '@/data/departments'
import { Card, EmptyState, Tabs, inputCls } from '@/components/ui/primitives'
import { Breadcrumb } from '@/components/ui/widgets'

const MODES = ['Any mode', 'online', 'offline', 'hybrid'] as const

export default function Services() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [cat, setCat] = useState('All')
  const [dept, setDept] = useState('All departments')
  const [mode, setMode] = useState<string>('Any mode')
  const [maxFee, setMaxFee] = useState(3000)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return services.filter((s) => {
      if (s.status !== 'active') return false
      if (query && !(s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query) || s.category.toLowerCase().includes(query))) return false
      if (cat !== 'All' && s.category !== cat) return false
      if (dept !== 'All departments' && departmentById(s.departmentId)?.shortName !== dept) return false
      if (mode !== 'Any mode' && s.mode !== mode) return false
      if (s.fee > maxFee) return false
      return true
    })
  }, [q, cat, dept, mode, maxFee])

  const depts = ['All departments', ...new Set(services.map((s) => departmentById(s.departmentId)?.shortName ?? '').filter(Boolean))]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Services' }]} />
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-4">Government Services</h1>
      <p className="text-slate-500 mt-2 max-w-2xl">One catalog across every department. Search once — MahaSetu tells you eligibility, documents, fees and processing time, then coordinates the rest.</p>

      <div className="mt-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters */}
        <aside className="space-y-5 lg:sticky lg:top-24 self-start">
          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" className={`${inputCls} pl-9`} aria-label="Search services" />
            </div>
          </Card>
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><SlidersHorizontal className="w-4 h-4" /> Filters</div>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Category</span>
              <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${inputCls} mt-1`} aria-label="Filter by category">
                {['All', ...serviceCategories].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Department</span>
              <select value={dept} onChange={(e) => setDept(e.target.value)} className={`${inputCls} mt-1`} aria-label="Filter by department">
                {depts.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Mode</span>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className={`${inputCls} mt-1`} aria-label="Filter by mode">
                {MODES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Max fee: ₹{maxFee}</span>
              <input type="range" min={0} max={3000} step={50} value={maxFee} onChange={(e) => setMaxFee(Number(e.target.value))} className="w-full accent-primary-700" aria-label="Maximum fee" />
            </label>
            <div className="text-xs text-slate-400">{filtered.length} services match</div>
          </Card>
        </aside>

        {/* Results */}
        <div>
          <Tabs
            tabs={[{ id: 'all', label: 'All services', count: filtered.length }]}
            active="all"
            onChange={() => {}}
          />
          <div className="mt-5 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <Link key={s.id} to={`/services/${s.id}`} className="group">
                <Card className="p-5 h-full group-hover:shadow-glow group-hover:border-primary-200 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-saffron-600">{s.category}</span>
                    <span className="text-[10px] uppercase text-slate-400">{s.mode}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-2 group-hover:text-primary-800">{s.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{departmentById(s.departmentId)?.name}</p>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{s.description}</p>
                  <div className="flex items-center gap-3 mt-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{s.processingTime}</span>
                    <span className="inline-flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{s.fee === 0 ? 'Free' : s.fee}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <Card className="mt-5">
              <EmptyState icon={<Search className="w-6 h-6" />} title="No services match your filters" body="Try widening the fee range or clearing the department filter." />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
