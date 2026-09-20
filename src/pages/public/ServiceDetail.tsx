import { Link, useParams, useLocation } from 'react-router-dom'
import { IndianRupee, FileText, CheckCircle2, Building2, Sparkles, ArrowLeft } from 'lucide-react'
import { serviceById } from '@/data/services'
import { departmentById } from '@/data/departments'
import { schemes } from '@/data/schemes'
import { Card, StatusBadge } from '@/components/ui/primitives'
import { Breadcrumb } from '@/components/ui/widgets'
import { Button } from '@/components/ui/Button'
import { SmartImage } from '@/components/ui/SmartImage'
import { PathSuggestions } from '@/components/audit/PathSuggestions'
import { images } from '@/data/images'

export default function ServiceDetail() {
  const { id } = useParams()
  const location = useLocation()
  const svc = serviceById(id ?? '')
  if (!svc) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Service not found</h1>
          <p className="text-slate-500 mt-2">This service may have been moved or retired.</p>
          <Button to="/services" className="mt-6" variant="primary">Browse all services</Button>
        </div>
        <div className="mt-12">
          <PathSuggestions pathname={location.pathname} search={location.search} />
        </div>
      </div>
    )
  }
  const dept = departmentById(svc.departmentId)
  const related = schemes.filter((s) => s.linkedServiceId === svc.id)

  return (
    <div className="bg-canvas min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: svc.name }]} />
        <Link to="/services" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700 mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>

        <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div>
            <Card className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold uppercase tracking-wide text-saffron-600">{svc.category}</span>
                <StatusBadge status={svc.status} />
                <span className="text-slate-400 uppercase">{svc.mode}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-3">{svc.name}</h1>
              <p className="text-slate-500 mt-3 leading-relaxed">{svc.description}</p>

              <div className="grid sm:grid-cols-3 gap-3 mt-6">
                <div className="rounded-2xl bg-canvas p-4">
                  <div className="text-xs text-slate-400">Fee</div>
                  <div className="font-bold text-slate-900 mt-1 flex items-center gap-1"><IndianRupee className="w-4 h-4" />{svc.fee === 0 ? 'Free' : svc.fee}</div>
                </div>
                <div className="rounded-2xl bg-canvas p-4">
                  <div className="text-xs text-slate-400">Processing time</div>
                  <div className="font-bold text-slate-900 mt-1">{svc.processingTime}</div>
                </div>
                <div className="rounded-2xl bg-canvas p-4">
                  <div className="text-xs text-slate-400">SLA</div>
                  <div className="font-bold text-slate-900 mt-1">{svc.slaDays} days</div>
                </div>
              </div>

              <h2 className="font-semibold text-slate-900 mt-8 mb-3">Eligibility</h2>
              <ul className="space-y-2">
                {svc.eligibility.map((e) => (
                  <li key={e} className="flex gap-2.5 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{e}</li>
                ))}
              </ul>

              <h2 className="font-semibold text-slate-900 mt-8 mb-3">Documents required</h2>
              <div className="flex flex-wrap gap-2">
                {svc.documents.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-sm bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> {d}
                  </span>
                ))}
              </div>

              <h2 className="font-semibold text-slate-900 mt-8 mb-3">Process</h2>
              <ol className="space-y-3">
                {svc.steps.map((st, i) => (
                  <li key={st} className="flex gap-3 text-sm text-slate-600">
                    <span className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    {st}
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          {/* Side rail */}
          <div className="space-y-5 lg:sticky lg:top-24">
            <Card className="p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Building2 className="w-4 h-4 text-primary-700" /> {dept?.name}</div>
              <div className="text-xs text-slate-400 mt-1">{dept?.domain}</div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <StatusBadge status={dept?.status ?? 'connected'} /> Last sync {dept?.lastSync}
              </div>
              <div className="mt-5 space-y-2.5">
                <Button to={`/apply/${svc.id}`} className="w-full">Apply for this service</Button>
                <Button to="/track" variant="outline" className="w-full">Track an existing application</Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-4">Prototype simulation — no real application is filed.</p>
            </Card>

            <Card className="p-6 bg-primary-50/60 border-primary-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-900"><Sparkles className="w-4 h-4" /> Ask MahaSetu Sahayak</div>
              <p className="text-sm text-primary-800/80 mt-2">"Do I qualify? Which of my documents already work?" — answered from your vault after login.</p>
              <Button to="/login" variant="secondary" size="sm" className="mt-4 w-full">Open assistant</Button>
            </Card>

            {related.length > 0 && (
              <Card className="p-6">
                <div className="text-sm font-semibold text-slate-800 mb-3">Linked schemes</div>
                <div className="space-y-3">
                  {related.map((s) => (
                    <Link key={s.id} to="/schemes" className="block rounded-xl border border-slate-200 p-3 hover:border-primary-200 hover:bg-primary-50/40 transition-colors">
                      <div className="text-sm font-medium text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{s.benefit}</div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-10 hidden lg:block">
          <SmartImage src={images.services[svc.category.toLowerCase() as keyof typeof images.services] ?? images.india.city} alt={svc.name} className="h-56 rounded-3xl" />
        </div>
      </div>
    </div>
  )
}
