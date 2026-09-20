import { FileText, Building2, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function BusinessDocuments() {
  const { documents } = useApp()
  const businessDocs = documents.filter((d) => ['Business', 'Identity', 'Income'].includes(d.category))
  const bizSpecific = [
    { id: 'bd1', name: 'Certificate of Incorporation', issuer: 'Ministry of Corporate Affairs (simulated)', status: 'verified', date: '18 Mar 2021' },
    { id: 'bd2', name: 'GST Registration Certificate', issuer: 'Finance & Taxation Dept', status: 'verified', date: '02 Apr 2021' },
    { id: 'bd3', name: 'FSSAI Licence', issuer: 'Food Safety & Standards Authority', status: 'verified', date: '14 Dec 2023' },
    { id: 'bd4', name: 'Udyam Registration', issuer: 'MSME (simulated)', status: 'verified', date: '10 May 2021' },
  ]
  void FileText

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Documents</h1>
        <p className="text-slate-500 mt-1.5">Company papers and the founder's vault documents — shared with departments via consent.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Company documents" subtitle="Sahyadri AgroTech Pvt. Ltd." />
          <div className="px-5 sm:px-6 pb-6 space-y-2.5">
            {bizSpecific.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                <span className="w-9 h-9 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{d.name}</div>
                  <div className="text-xs text-slate-400 truncate">{d.issuer} · {d.date}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Founder & operational vault documents" />
          <div className="px-5 sm:px-6 pb-6 space-y-2.5">
            {businessDocs.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                <span className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">{d.name}</div>
                  <div className="text-xs text-slate-400 truncate">{d.issuer}</div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-canvas flex gap-3.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-600">Departments access these documents only through scoped, revocable consents — each access appears in the audit trail visible to MahaSetu administrators and you.</p>
      </Card>
    </div>
  )
}
