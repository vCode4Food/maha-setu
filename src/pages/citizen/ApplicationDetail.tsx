import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Building2, Upload, MessageSquarePlus, Download, AlertTriangle, CheckCircle2, FileText, ShieldCheck, Award,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, Modal, Field, inputCls, EmptyState } from '@/components/ui/primitives'
import { Breadcrumb, Timeline } from '@/components/ui/widgets'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { departmentById } from '@/data/departments'

export default function CitizenApplicationDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { getApplication, uploadDocument, setAppStatus, addRemark, pushToast } = useApp()
  const app = getApplication(id ?? '')

  const [uploadOpen, setUploadOpen] = useState(false)
  const [docName, setDocName] = useState('')
  const [remark, setRemark] = useState('')

  if (!app) {
    return (
      <Card className="p-6">
        <EmptyState icon={<FileText className="w-6 h-6" />} title="Application not found" action={<Button to="/citizen/applications">All applications</Button>} />
      </Card>
    )
  }

  const isActionNeeded = app.status === 'action_required'

  const doUpload = () => {
    if (!docName.trim()) return
    uploadDocument({
      name: docName,
      category: 'Other',
      issuer: 'Self upload',
      issuedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      usedBy: [app.serviceName],
      sizeKb: 180,
    })
    if (isActionNeeded) {
      setAppStatus(app.id, 'processing', {
        stage: 'Department Processing',
        note: 'Re-uploaded document received; verification resumed',
        actor: 'MahaSetu Engine',
      })
      pushToast({ kind: 'success', title: 'Verification resumed', body: 'The department will continue processing your application.' })
    }
    setUploadOpen(false)
    setDocName('')
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Dashboard', to: '/citizen' }, { label: 'Applications', to: '/citizen/applications' }, { label: app.id }]} />
      <Link to="/citizen/applications" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700"><ArrowLeft className="w-4 h-4" /> Back</Link>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{app.serviceName}</h1>
                <div className="text-sm text-slate-400 mt-1">{app.id} · {departmentById(app.departmentId)?.shortName}</div>
              </div>
              <StatusBadge status={app.status} />
            </div>
            {isActionNeeded && app.actionRequired && (
              <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800 text-sm">Action required</div>
                  <div className="text-sm text-amber-700 mt-0.5">{app.actionRequired}</div>
                  <button onClick={() => setUploadOpen(true)} className="mt-2.5 text-sm font-semibold text-amber-800 underline underline-offset-2">Upload now →</button>
                </div>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Application timeline" subtitle="Departments are coordinating your request — one place, always current." />
            <div className="px-5 sm:px-6 pb-6"><Timeline events={app.events} /></div>
          </Card>

          <Card>
            <CardHeader title="Updates & conversation" />
            <div className="px-5 sm:px-6 pb-6 space-y-3">
              {(app.remarks ?? []).map((r, i) => (
                <div key={i} className={`rounded-xl p-3.5 text-sm ${r.role === 'system' ? 'bg-sky-50 border border-sky-100 text-sky-900' : 'bg-canvas text-slate-700'}`}>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-medium text-slate-600">{r.author}</span> · {r.role} · {r.time}
                  </div>
                  {r.text}
                </div>
              ))}
              <form onSubmit={(e) => { e.preventDefault(); if (remark.trim()) { addRemark(app.id, user?.name ?? 'You', 'citizen', remark); setRemark('') } }} className="flex gap-2">
                <input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Add a message to the department…" className={inputCls} aria-label="Add message" />
                <Button type="button" onClick={() => { if (remark.trim()) { addRemark(app.id, user?.name ?? 'You', 'citizen', remark); setRemark('') } }} variant="secondary" aria-label="Send message">
                  <MessageSquarePlus className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-primary-700" /> Handled by</div>
            <div className="text-sm text-slate-600 mt-2">{departmentById(app.departmentId)?.name}</div>
            <div className="text-xs text-slate-400 mt-0.5">Officer: {app.assignedOfficer ?? 'To be assigned'}</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-canvas p-3"><span className="text-xs text-slate-400 block">Submitted</span>{app.submittedAt.split(',')[0]}</div>
              <div className="rounded-xl bg-canvas p-3"><span className="text-xs text-slate-400 block">Expected</span>{app.expectedCompletion}</div>
              <div className="rounded-xl bg-canvas p-3"><span className="text-xs text-slate-400 block">Fee paid</span>₹{app.fee}</div>
              <div className="rounded-xl bg-canvas p-3"><span className="text-xs text-slate-400 block">District</span>{app.district}</div>
            </div>
            <div className="mt-4 space-y-2.5">
              <Button variant="outline" className="w-full" onClick={() => setUploadOpen(true)}><Upload className="w-4 h-4" /> Upload document</Button>
              <Button variant="outline" className="w-full" onClick={() => pushToast({ kind: 'success', title: 'Acknowledgement downloaded', body: `${app.id}-acknowledgement.pdf (demo)` })}><Download className="w-4 h-4" /> Download acknowledgement</Button>
              {['approved', 'completed'].includes(app.status) && (
                <Button
                  className="w-full"
                  onClick={() => pushToast({ kind: 'success', title: 'Certificate delivered to vault', body: `${app.serviceName} certificate is now in My Documents (demo).` })}
                >
                  <Award className="w-4 h-4" /> Download certificate
                </Button>
              )}
              <Button to="/citizen/grievances" variant="ghost" className="w-full">Raise an issue</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Documents attached</div>
            <div className="space-y-2">
              {app.documents.map((d) => (
                <div key={d.name} className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700 flex-1 truncate">{d.name}</span>
                  {d.verified ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <StatusBadge status="pending" />}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload a document">
        <div className="space-y-4">
          <Field label="Document name" required>
            <input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g. Self-declaration of income (clear copy)" className={inputCls} />
          </Field>
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">Drag & drop or click to browse (simulated)</div>
          <Button className="w-full" onClick={doUpload}>Add to vault & attach</Button>
        </div>
      </Modal>
    </div>
  )
}
