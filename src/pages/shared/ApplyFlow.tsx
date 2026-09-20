import { Link, useParams } from 'react-router-dom'
import { LogIn, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { Breadcrumb } from '@/components/ui/widgets'
import { serviceById } from '@/data/services'
import { departmentById } from '@/data/departments'

export default function ApplyFlow() {
  const { serviceId } = useParams()
  const svc = serviceById(serviceId ?? '')

  if (!svc) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Service not found</h1>
        <Button to="/services" className="mt-6">Browse services</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: svc.name, to: `/services/${svc.id}` }, { label: 'Apply' }]} />
      <Card className="mt-6 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold uppercase tracking-wide text-saffron-600">{svc.category}</span>
          <StatusBadge status={svc.status} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Apply: {svc.name}</h1>
        <p className="text-slate-500 mt-2">{svc.description}</p>

        <div className="mt-6 rounded-2xl bg-primary-50/60 border border-primary-100 p-5 flex gap-4">
          <span className="w-11 h-11 rounded-xl bg-primary-900 text-white flex items-center justify-center shrink-0"><LogIn className="w-5 h-5" /></span>
          <div>
            <div className="font-semibold text-slate-900">Login to apply</div>
            <p className="text-sm text-slate-600 mt-1">Applications are filed through your Maha ID. Your document vault pre-fills everything — most applicants need zero uploads.</p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Button to="/login">Login / Create Maha ID <ArrowRight className="w-4 h-4" /></Button>
              <Button to={`/services/${svc.id}`} variant="outline">Back to service details</Button>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <div className="text-sm font-semibold text-slate-800 mb-3">What happens after login</div>
          <div className="space-y-2.5">
            {[
              { icon: FileText, t: 'Vault documents attach automatically', d: `We match ${svc.documents.length} required documents against your vault.` },
              { icon: ShieldCheck, t: 'One consent, scoped access', d: `${departmentById(svc.departmentId)?.shortName} gets read-only access for this application only.` },
              { icon: CheckCircle2, t: 'Departments coordinate in parallel', d: 'MahaSetu orchestrates checks across departments; you watch one timeline.' },
            ].map((s) => (
              <div key={s.t} className="flex gap-3.5 rounded-xl border border-slate-200 p-4">
                <s.icon className="w-5 h-5 text-primary-700 shrink-0 mt-0.5" />
                <div><div className="text-sm font-medium text-slate-900">{s.t}</div><div className="text-sm text-slate-500 mt-0.5">{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <p className="text-xs text-slate-400 text-center mt-6">Prototype — no real application is filed anywhere.</p>
    </div>
  )
}
