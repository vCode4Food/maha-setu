import { useState } from 'react'
import { Search, PackageSearch } from 'lucide-react'
import { initialApplications } from '@/data/applications'
import { Card, EmptyState, inputCls, StatusBadge } from '@/components/ui/primitives'
import { Breadcrumb, Timeline } from '@/components/ui/widgets'
import { Button } from '@/components/ui/Button'

export default function Track() {
  const [q, setQ] = useState('')
  const [result, setResult] = useState<typeof initialApplications[number] | null>(null)
  const [searched, setSearched] = useState(false)

  const search = () => {
    const found = initialApplications.find(
      (a) => a.id.toLowerCase() === q.trim().toLowerCase() && a.citizenName === 'Aarav Sharma',
    )
    setResult(found ?? null)
    setSearched(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Track Application' }]} />
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-4">Track an application</h1>
      <p className="text-slate-500 mt-2">Enter an application ID to see its status. Demo tip: use <strong>MS-2026-004821</strong>.</p>

      <Card className="mt-6 p-6">
        <form onSubmit={(e) => { e.preventDefault(); search() }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. MS-2026-004821" className={`${inputCls} pl-9`} aria-label="Application ID" />
          </div>
          <Button type="button" onClick={search}>Track</Button>
        </form>

        {searched && !result && (
          <div className="mt-6">
            <EmptyState
              icon={<PackageSearch className="w-6 h-6" />}
              title="No application found"
              body="Check the ID, or login to see all your applications in one place."
              action={<Button to="/login" variant="secondary">Login to view my applications</Button>}
            />
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">Application</div>
                <div className="font-semibold text-slate-900">{result.id}</div>
              </div>
              <StatusBadge status={result.status} />
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-xl bg-canvas p-3"><span className="text-xs text-slate-400 block">Service</span>{result.serviceName}</div>
              <div className="rounded-xl bg-canvas p-3"><span className="text-xs text-slate-400 block">Submitted</span>{result.submittedAt}</div>
              <div className="rounded-xl bg-canvas p-3"><span className="text-xs text-slate-400 block">Expected</span>{result.expectedCompletion}</div>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <Timeline events={result.events} />
            </div>
            <p className="text-[11px] text-slate-400">Prototype simulation — public tracking shows limited details. Login for documents, remarks and actions.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
