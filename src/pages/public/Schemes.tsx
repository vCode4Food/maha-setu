import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Sparkles, CheckCircle2, XCircle, ArrowRight, Search } from 'lucide-react'
import { schemes } from '@/data/schemes'
import { departmentById } from '@/data/departments'
import { Card, StatusBadge, EmptyState, Field, inputCls, Tabs } from '@/components/ui/primitives'
import { GistCard, Breadcrumb } from '@/components/ui/widgets'
import { SmartImage } from '@/components/ui/SmartImage'
import { Button } from '@/components/ui/Button'

type Answers = { age: string; category: string; income: string; occupation: string; rural: string }

export default function Schemes() {
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [showChecker, setShowChecker] = useState(false)
  const [a, setA] = useState<Answers>({ age: '26', category: 'General', income: '480000', occupation: 'Salaried', rural: 'Urban' })

  const filtered = schemes.filter((s) => {
    if (tab !== 'all' && s.category.toLowerCase() !== tab) return false
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  /** Deterministic mock matcher — no real eligibility is computed. */
  const matches = (): { s: typeof schemes[number]; score: number }[] => {
    const age = Number(a.age)
    return schemes.map((s) => {
      let score = 40
      if (s.category === 'Agriculture' && a.occupation === 'Farmer') score += 45
      if (s.category === 'Business' && a.occupation === 'Business / Self-employed') score += 45
      if (s.category === 'Education' && age < 30) score += 40
      if (s.category === 'Health') score += 20
      if ((s.category === 'Women & Child') && a.category !== 'General') score += 25
      if (s.category === 'Senior Citizens' && age >= 60) score += 50
      if (s.category === 'Housing' && Number(a.income) < 800000) score += 30
      if (Number(a.income) < 300000) score += 15
      return { s, score }
    }).sort((x, y) => y.score - x.score).slice(0, 4)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Schemes' }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Government Schemes</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">Every scheme with honest eligibility, benefits and deadlines. Check your match — recommendations are simulated for the prototype.</p>
        </div>
        <Button variant="saffron" onClick={() => setShowChecker((v) => !v)}>
          <Sparkles className="w-4 h-4" /> Check My Eligibility
        </Button>
      </div>

      {/* Eligibility checker */}
      {showChecker && (
        <Card className="mt-6 p-6 border-saffron-200 bg-saffron-50/40">
          <h2 className="font-semibold text-slate-900">Tell us about yourself</h2>
          <p className="text-sm text-slate-500 mt-1">Demo questionnaire — answers stay in your browser.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
            <Field label="Age"><input type="number" value={a.age} onChange={(e) => setA({ ...a, age: e.target.value })} className={inputCls} /></Field>
            <Field label="Category">
              <select value={a.category} onChange={(e) => setA({ ...a, category: e.target.value })} className={inputCls}>
                {['General', 'OBC', 'SC', 'ST', 'EWS'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Annual household income (₹)"><input type="number" value={a.income} onChange={(e) => setA({ ...a, income: e.target.value })} className={inputCls} /></Field>
            <Field label="Occupation">
              <select value={a.occupation} onChange={(e) => setA({ ...a, occupation: e.target.value })} className={inputCls}>
                {['Student', 'Salaried', 'Farmer', 'Business / Self-employed', 'Homemaker', 'Retired'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Area">
              <select value={a.rural} onChange={(e) => setA({ ...a, rural: e.target.value })} className={inputCls}>
                {['Urban', 'Rural'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-5 grid md:grid-cols-2 gap-3">
            {matches().map(({ s, score }) => (
              <div key={s.id} className="rounded-2xl bg-white border border-slate-200 p-4 flex gap-3">
                {score >= 80 ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />}
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 text-sm">{s.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.benefit} · match {Math.min(98, score)}% (demo)</div>
                  <Link to="/citizen/schemes" className="text-xs font-medium text-primary-700 mt-1 inline-block">Apply via portal →</Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-4">Simulated matching for demonstration — not a legal eligibility determination.</p>
        </Card>
      )}

      {/* Filter chips */}
      <div className="mt-8 flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search schemes…" className={`${inputCls} pl-9`} aria-label="Search schemes" />
        </div>
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: schemes.length },
            { id: 'agriculture', label: 'Agriculture' },
            { id: 'education', label: 'Education' },
            { id: 'business', label: 'Business' },
            { id: 'health', label: 'Health' },
            { id: 'housing', label: 'Housing' },
            { id: 'social welfare', label: 'Welfare' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {/* Grid */}
      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((s) => (
          <Card key={s.id} className="overflow-hidden flex flex-col">
            <SmartImage src={s.image} alt={s.name} className="h-36" />
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-saffron-600">{departmentById(s.departmentId)?.shortName}</span>
                <StatusBadge status={s.status} />
              </div>
              <h3 className="font-semibold text-slate-900 mt-2">{s.name}</h3>
              <p className="text-sm text-slate-500 mt-1.5">{s.benefit}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3"><CalendarDays className="w-3.5 h-3.5" /> {s.deadline}</div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link to="/login" className="text-sm font-medium text-primary-700 hover:text-primary-900">Login to apply</Link>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="mt-6"><EmptyState icon={<Search className="w-6 h-6" />} title="No schemes found" body="Try a different search or category." /></Card>
      )}
    </div>
  )
}
