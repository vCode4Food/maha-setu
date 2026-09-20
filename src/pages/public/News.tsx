import { useState } from 'react'
import { Newspaper, Search } from 'lucide-react'
import { initialNews } from '@/data/misc'
import { departmentById } from '@/data/departments'
import { Card, Tabs, EmptyState } from '@/components/ui/primitives'
import { GistCard, Breadcrumb } from '@/components/ui/widgets'

export default function News() {
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')

  const filtered = initialNews.filter((n) => {
    if (tab !== 'all' && n.category.toLowerCase().replaceAll(' ', '-') !== tab) return false
    if (q && !n.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Government Updates' }]} />
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-4">Government Updates</h1>
      <p className="text-slate-500 mt-2 max-w-2xl">Announcements, scheme windows and department notices — each with a plain-language Gist.</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search updates…" className="rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm pl-9 focus:outline-none focus:ring-2 focus:ring-primary-500" aria-label="Search updates" />
        </div>
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: initialNews.length },
            { id: 'breaking', label: 'Breaking' },
            { id: 'announcement', label: 'Announcements' },
            { id: 'scheme-update', label: 'Scheme Updates' },
            { id: 'local-update', label: 'Local' },
            { id: 'notice', label: 'Notices' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {filtered.map((n) => (
          <Card key={n.id} className="p-6">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className={`font-semibold uppercase tracking-wide ${n.category === 'Breaking' ? 'text-rose-600' : 'text-saffron-600'}`}>{n.category}</span>
              · {n.date} · {departmentById(n.departmentId)?.shortName}
            </div>
            <h3 className="font-semibold text-slate-900 mt-2 text-lg">{n.title}</h3>
            <p className="text-sm text-slate-500 mt-2">{n.excerpt}</p>
            <details className="mt-3 group">
              <summary className="cursor-pointer text-sm font-medium text-primary-700 hover:text-primary-900">Read the full notification</summary>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed border-l-2 border-slate-200 pl-4">{n.body}</p>
            </details>
            {n.gist && <div className="mt-4"><GistCard data={n.gist} compact /></div>}
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="mt-6"><EmptyState icon={<Newspaper className="w-6 h-6" />} title="No updates found" /></Card>
      )}
    </div>
  )
}
