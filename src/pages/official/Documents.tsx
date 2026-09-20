import { ShieldCheck, FileText, Search } from 'lucide-react'
import { Card, CardHeader, EmptyState, StatusBadge, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function OfficialDocuments() {
  const { documents, applications } = useApp()
  void Search

  const vaultDocs = applications.flatMap((a) =>
    a.documents.map((d) => ({ ...d, appId: a.id, citizen: a.citizenName ?? '—', service: a.serviceName })),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Documents</h1>
        <p className="text-slate-500 mt-1.5">Documents attached to cases on your desk — vault-verified items are pre-trusted.</p>
      </div>

      <Card>
        <CardHeader title="Case documents" subtitle="VAULT items were verified at source with citizen consent" />
        <div className="px-5 sm:px-6 pb-6 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="pb-2.5 font-medium">Document</th><th className="pb-2.5 font-medium">Application</th>
                <th className="pb-2.5 font-medium">Citizen</th><th className="pb-2.5 font-medium">Source</th><th className="pb-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vaultDocs.map((d, i) => (
                <tr key={`${d.appId}-${d.name}-${i}`}>
                  <td className="py-3.5 font-medium text-slate-800">{d.name}</td>
                  <td className="py-3.5 text-slate-500">{d.appId}</td>
                  <td className="py-3.5 text-slate-600">{d.citizen}</td>
                  <td className="py-3.5">{d.fromVault
                    ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5"><ShieldCheck className="w-3 h-3" /> Vault</span>
                    : <span className="text-xs text-slate-400">Upload</span>}</td>
                  <td className="py-3.5"><StatusBadge status={d.verified ? 'verified' : 'pending'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {vaultDocs.length === 0 && <div className="px-6 pb-6"><EmptyState icon={<FileText className="w-6 h-6" />} title="No documents on your cases" /></div>}
      </Card>

      <Card className="p-6 bg-canvas">
        <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Why vault documents are trusted</div>
        <p className="text-sm text-slate-600 mt-2 max-w-3xl">Documents in the MahaSetu vault are verified at upload by the issuing department. With citizen consent, you can rely on them without re-verification — this is the core of the interoperability model and where processing time is saved.</p>
      </Card>
    </div>
  )
}
