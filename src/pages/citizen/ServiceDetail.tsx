import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, IndianRupee, Clock, FileText, CheckCircle2, Square, CheckSquare, Sparkles, ShieldCheck } from 'lucide-react'
import { Card, EmptyState, StatusBadge } from '@/components/ui/primitives'
import { PathSuggestions } from '@/components/audit/PathSuggestions'
import { Breadcrumb } from '@/components/ui/widgets'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { serviceById } from '@/data/services'
import { departmentById } from '@/data/departments'
import { schemes } from '@/data/schemes'

export default function CitizenServiceDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { serviceWithState, documents, submitApplication } = useApp()
  const svc = serviceWithState(id ?? '')
  const base = serviceById(id ?? '')

  const vaultMatches = useMemo(() => {
    if (!base) return []
    return documents.filter((d) =>
      base.documents.some((need) => need.toLowerCase().includes(d.name.toLowerCase().split(' ')[0])) ||
      d.name.toLowerCase().includes(base.name.toLowerCase().split(' ')[0]),
    )
  }, [base, documents])

  const [selected, setSelected] = useState<string[]>(vaultMatches.map((d) => d.name))
  const [submitting, setSubmitting] = useState(false)

  if (!svc || !base) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4">
        <EmptyState
          icon={<FileText className="w-6 h-6" />}
          title="Service not found"
          body="This service may have been moved or retired. Here are close matches based on the address you tried."
          action={<Button to="/citizen/services">Back to services</Button>}
        />
        <div className="mt-10">
          <PathSuggestions
            pathname={location.pathname}
            search={location.search}
            links={{
              service: (sid) => `/citizen/services/${sid}`,
              scheme: () => '/citizen/schemes',
              department: () => '/citizen/services',
            }}
          />
        </div>
      </div>
    )
  }

  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]))

  const apply = () => {
    setSubmitting(true)
    window.setTimeout(() => {
      const app = submitApplication(svc.id, user?.id ?? 'cit-001', user?.name ?? 'Citizen', selected)
      setSubmitting(false)
      if (app) navigate(`/citizen/applications/${app.id}`)
    }, 900)
  }

  const linkedSchemes = schemes.filter((s) => s.linkedServiceId === svc.id)

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/citizen' }, { label: 'Services', to: '/citizen/services' }, { label: svc.name }]} />
      <Link to="/citizen/services" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700"><ArrowLeft className="w-4 h-4" /> Back</Link>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold uppercase tracking-wide text-saffron-600">{svc.category}</span>
              <StatusBadge status={svc.status} />
              <span className="text-slate-400 uppercase">{svc.mode}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">{svc.name}</h1>
            <p className="text-slate-500 mt-2">{svc.description}</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <div className="rounded-2xl bg-canvas p-4"><div className="text-xs text-slate-400">Fee</div><div className="font-bold mt-1 flex items-center gap-1"><IndianRupee className="w-4 h-4" />{svc.fee === 0 ? 'Free' : svc.fee}</div></div>
              <div className="rounded-2xl bg-canvas p-4"><div className="text-xs text-slate-400">Processing</div><div className="font-bold mt-1">{svc.processingTime}</div></div>
              <div className="rounded-2xl bg-canvas p-4"><div className="text-xs text-slate-400">SLA</div><div className="font-bold mt-1">{svc.slaDays} days</div></div>
            </div>
            <h2 className="font-semibold mt-7 mb-3">Eligibility</h2>
            <ul className="space-y-2">{svc.eligibility.map((e) => <li key={e} className="flex gap-2.5 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{e}</li>)}</ul>
            <h2 className="font-semibold mt-7 mb-3">Process</h2>
            <ol className="space-y-3">{svc.steps.map((st, i) => (
              <li key={st} className="flex gap-3 text-sm text-slate-600">
                <span className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>{st}
              </li>
            ))}</ol>
          </Card>

          {/* Vault selection */}
          <Card className="p-6">
            <div className="flex items-center gap-2 font-semibold text-slate-900"><ShieldCheck className="w-5 h-5 text-emerald-600" /> Attach documents from your vault</div>
            <p className="text-sm text-slate-500 mt-1">Required: {svc.documents.join(', ')}. Selected documents are shared with {departmentById(svc.departmentId)?.shortName} for this application only.</p>
            <div className="mt-4 space-y-2">
              {documents.map((d) => (
                <button key={d.id} onClick={() => toggle(d.name)} className={`w-full flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all ${selected.includes(d.name) ? 'border-primary-500 bg-primary-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                  {selected.includes(d.name) ? <CheckSquare className="w-5 h-5 text-primary-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-slate-800 truncate">{d.name}</span>
                    <span className="block text-xs text-slate-400">{d.issuer} · {d.status}</span>
                  </span>
                  <StatusBadge status={d.status} />
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {svc.documents.filter((need) => !documents.some((d) => d.name.toLowerCase().includes(need.toLowerCase().split(' ')[0]))).map((need) => (
                <span key={need} className="text-xs rounded-full bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5">Still needed: {need}</span>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-800">{departmentById(svc.departmentId)?.name}</div>
            <div className="text-xs text-slate-400 mt-1">{departmentById(svc.departmentId)?.domain}</div>
            <div className="mt-4 rounded-xl bg-primary-50/70 border border-primary-100 p-3.5 flex gap-2.5">
              <Sparkles className="w-4 h-4 text-primary-700 shrink-0 mt-0.5" />
              <p className="text-xs text-primary-900">{selected.length} vault document{selected.length === 1 ? '' : 's'} attached · departments coordinated automatically · e-certificate delivered to vault.</p>
            </div>
            <Button className="w-full mt-5" onClick={apply} loading={submitting}>
              {submitting ? 'Submitting…' : `Apply · ${svc.fee === 0 ? 'No fee' : `₹${svc.fee} (demo pay)`}`}
            </Button>
            <Button to="/citizen/applications" variant="outline" className="w-full mt-2.5">Track existing applications</Button>
            <p className="text-[11px] text-slate-400 mt-3 text-center">Prototype — no real payment or filing.</p>
          </Card>
          {linkedSchemes.length > 0 && (
            <Card className="p-6">
              <div className="text-sm font-semibold text-slate-800 mb-3">Schemes linked to this service</div>
              <div className="space-y-2.5">
                {linkedSchemes.map((s) => (
                  <Link key={s.id} to="/citizen/schemes" className="block rounded-xl border border-slate-200 p-3 hover:border-primary-200 hover:bg-primary-50/40">
                    <div className="text-sm font-medium text-slate-800">{s.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.benefit}</div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
