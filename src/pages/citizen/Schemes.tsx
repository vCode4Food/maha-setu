import { useState } from 'react'
import { CalendarDays, Sparkles, CheckCircle2, XCircle, Search } from 'lucide-react'
import { schemes } from '@/data/schemes'
import { departmentById } from '@/data/departments'
import { Card, StatusBadge, EmptyState, Field, inputCls, Tabs } from '@/components/ui/primitives'
import { GistCard } from '@/components/ui/widgets'
import { useApp } from '@/context/AppContext'
import { SmartImage } from '@/components/ui/SmartImage'

type Answers = { age: string; category: string; income: string; occupation: string }

export default function CitizenSchemes() {
  const { pushToast } = useApp()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [showChecker, setShowChecker] = useState(false)
  const [a, setA] = useState<Answers>({ age: '24', category: 'General', income: '480000', occupation: 'Salaried' })
  const [checked, setChecked] = useState(false)

  const filtered = schemes.filter((s) => {
    if (tab !== 'all' && s.category.toLowerCase() !== tab) return false
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const matches = () =>
    schemes.map((s) => {
      let score = 40
      const age = Number(a.age)
      if (s.category === 'Agriculture' && a.occupation === 'Farmer') score += 45
      if (s.category === 'Business' && (a.occupation === 'Business / Self-employed')) score += 45
      if (s.category === 'Education' && age < 30) score += 40
      if (s.category === 'Health') score += 20
      if (s.category === 'Women & Child' && a.category !== 'General') score += 25
      if (s.category === 'Senior Citizens' && age >= 60) score += 50
      if (s.category === 'Housing' && Number(a.income) < 800000) score += 30
      if (Number(a.income) < 300000) score += 15
      return { s, score }
    }).sort((x, y) => y.score - x.score).slice(0, 4)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Schemes for You</h1>
          <p className="text-slate-500 mt-1.5">Every scheme with honest eligibility and plain-language summaries. Matching is simulated.</p>
        </div>
        <button onClick={() => setShowChecker((v) => !v)} className="inline-flex items-center gap-2 rounded-xl bg-saffron-500 text-white font-medium px-4 py-2.5 text-sm hover:bg-saffron-600">
          <Sparkles className="w-4 h-4" /> Check My Eligibility
        </button>
      </div>

      {showChecker && (
        <Card className="p-6 border-saffron-200 bg-saffron-50/40">
          <div className="grid sm:grid-cols-4 gap-4">
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
          </div>
          <button
            onClick={() => { setChecked(true); pushToast({ kind: 'info', title: 'Eligibility checked', body: 'Top matches updated below (demo simulation).' }) }}
            className="mt-4 rounded-xl bg-saffron-500 text-white font-medium px-5 py-2.5 text-sm hover:bg-saffron-600"
          >
            Match me
          </button>
          {checked && (
            <div className="mt-5 grid md:grid-cols-2 gap-3">
              {matches().map(({ s, score }) => (
                <div key={s.id} className="rounded-2xl bg-white border border-slate-200 p-4 flex gap-3">
                  {score >= 80 ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900 text-sm">{s.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.benefit} · match {Math.min(98, score)}% (demo)</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-slate-400 mt-4">Simulated matching for demonstration — not a legal eligibility determination.</p>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search schemes…" className={`${inputCls} pl-9`} aria-label="Search schemes" />
        </div>
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: schemes.length },
            { id: 'agriculture', label: 'Agriculture' }, { id: 'education', label: 'Education' },
            { id: 'business', label: 'Business' }, { id: 'health', label: 'Health' },
            { id: 'housing', label: 'Housing' }, { id: 'senior citizens', label: 'Seniors' },
          ]}
          active={tab} onChange={setTab}
        />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((s) => (
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
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => pushToast({ kind: 'info', title: 'Consent requested (demo)', body: `Allow ${departmentById(s.departmentId)?.shortName} to verify your documents for ${s.name}?` })}
                  className="rounded-xl bg-primary-900 text-white text-sm font-medium py-2.5 hover:bg-primary-800"
                >
                  Apply
                </button>
                <button
                  onClick={() => pushToast({ kind: 'success', title: 'Gist generated', body: 'Plain-language summary shown on the card.' })}
                  className="rounded-xl border border-slate-300 text-slate-700 text-sm font-medium py-2.5 hover:bg-slate-50"
                >
                  Gist
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && <Card><EmptyState icon={<Search className="w-6 h-6" />} title="No schemes found" /></Card>}
    </div>
  )
}
