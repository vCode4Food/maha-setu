import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, XCircle, FileWarning, Forward, StickyNote, ShieldCheck, FileText,
  User, MapPin, IndianRupee, CalendarDays,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, Modal, Field, inputCls, EmptyState } from '@/components/ui/primitives'
import { Breadcrumb, Timeline } from '@/components/ui/widgets'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { departmentById } from '@/data/departments'

export default function OfficialApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getApplication, setAppStatus, addRemark, pushToast } = useApp()
  const app = getApplication(id ?? '')

  const [note, setNote] = useState('')
  const [forwardOpen, setForwardOpen] = useState(false)
  const [forwardTo, setForwardTo] = useState('Tehsildar, Pune City')
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [docRequestOpen, setDocRequestOpen] = useState(false)
  const [docRequest, setDocRequest] = useState('')

  if (!app) {
    return <Card className="p-6"><EmptyState icon={<FileText className="w-6 h-6" />} title="Case not found" action={<Button to="/official/applications">Back to queue</Button>} /></Card>
  }

  const officer = user?.name ?? 'Officer'

  const approve = () => {
    setAppStatus(app.id, 'approved', { stage: 'Approval', note: `Approved by ${officer}`, actor: officer })
    setTimeout(() => setAppStatus(app.id, 'completed', { stage: 'Completed', note: 'Certificate generated and delivered to citizen vault', actor: 'MahaSetu Engine' }), 900)
    addRemark(app.id, officer, 'official', 'Application verified and approved. Certificate generation initiated.')
    pushToast({ kind: 'success', title: 'Application approved', body: `${app.id} — citizen has been notified.` })
  }

  const reject = () => {
    setAppStatus(app.id, 'rejected', { stage: 'Officer Review', note: `Rejected: ${rejectReason}`, actor: officer })
    addRemark(app.id, officer, 'official', `Rejected. Reason: ${rejectReason}`)
    pushToast({ kind: 'warning', title: 'Application rejected', body: `${app.id} — citizen has been notified with the reason.` })
    setRejectOpen(false)
  }

  const requestDoc = () => {
    setAppStatus(app.id, 'action_required', { stage: app.currentStage, note: `Additional document requested: ${docRequest}`, actionRequired: `Upload: ${docRequest}`, actor: 'MahaSetu Engine' })
    addRemark(app.id, 'MahaSetu Engine', 'system', `Officer requested additional document: ${docRequest}. Citizen notified.`)
    pushToast({ kind: 'info', title: 'Document requested', body: 'Citizen will be notified to upload.' })
    setDocRequestOpen(false)
    setDocRequest('')
  }

  const forward = () => {
    setAppStatus(app.id, 'under_review', { stage: 'Officer Review', note: `Forwarded to ${forwardTo}`, actor: officer })
    addRemark(app.id, officer, 'official', `Case forwarded to ${forwardTo}.`)
    pushToast({ kind: 'info', title: 'Case forwarded', body: `Assigned to ${forwardTo}.` })
    setForwardOpen(false)
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Console', to: '/official' }, { label: 'Applications', to: '/official/applications' }, { label: app.id }]} />
      <Link to="/official/applications" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary-700"><ArrowLeft className="w-4 h-4" /> Back to queue</Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{app.serviceName}</h1>
                <div className="text-sm text-slate-400 mt-1">{app.id} · {departmentById(app.departmentId)?.name}</div>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="grid sm:grid-cols-4 gap-3 mt-5 text-sm">
              <div className="rounded-xl bg-canvas p-3.5"><span className="flex items-center gap-1.5 text-xs text-slate-400"><User className="w-3.5 h-3.5" /> Applicant</span><span className="font-medium text-slate-800 mt-1 block">{app.citizenName}</span></div>
              <div className="rounded-xl bg-canvas p-3.5"><span className="flex items-center gap-1.5 text-xs text-slate-400"><MapPin className="w-3.5 h-3.5" /> District</span><span className="font-medium text-slate-800 mt-1 block">{app.district}</span></div>
              <div className="rounded-xl bg-canvas p-3.5"><span className="flex items-center gap-1.5 text-xs text-slate-400"><IndianRupee className="w-3.5 h-3.5" /> Fee</span><span className="font-medium text-slate-800 mt-1 block">₹{app.fee}</span></div>
              <div className="rounded-xl bg-canvas p-3.5"><span className="flex items-center gap-1.5 text-xs text-slate-400"><CalendarDays className="w-3.5 h-3.5" /> Expected</span><span className="font-medium text-slate-800 mt-1 block">{app.expectedCompletion}</span></div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Case timeline" />
            <div className="px-5 sm:px-6 pb-6"><Timeline events={app.events} /></div>
          </Card>

          <Card>
            <CardHeader title="Internal notes & citizen messages" />
            <div className="px-5 sm:px-6 pb-6 space-y-3">
              {(app.remarks ?? []).map((r, i) => (
                <div key={i} className={`rounded-xl p-3.5 text-sm ${r.role === 'system' ? 'bg-sky-50 border border-sky-100 text-sky-900' : r.role === 'official' ? 'bg-canvas text-slate-700' : 'bg-emerald-50/60 border border-emerald-100 text-emerald-900'}`}>
                  <div className="text-xs text-slate-400 mb-1"><span className="font-medium text-slate-600">{r.author}</span> · {r.role} · {r.time}</div>
                  {r.text}
                </div>
              ))}
              <form onSubmit={(e) => { e.preventDefault(); if (note.trim()) { addRemark(app.id, officer, 'official', note); setNote('') } }} className="flex gap-2">
                <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note…" className={inputCls} aria-label="Internal note" />
                <Button type="button" variant="secondary" onClick={() => { if (note.trim()) { addRemark(app.id, officer, 'official', note); setNote('') } }} aria-label="Add note"><StickyNote className="w-4 h-4" /></Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Action rail */}
        <div className="space-y-5 lg:sticky lg:top-24">
          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-800 mb-1">Case actions</div>
            <p className="text-xs text-slate-400 mb-4">Actions update the citizen's timeline instantly (demo state).</p>
            <div className="space-y-2.5">
              <Button className="w-full" onClick={approve}><CheckCircle2 className="w-4 h-4" /> Approve application</Button>
              <Button variant="danger" className="w-full" onClick={() => setRejectOpen(true)}><XCircle className="w-4 h-4" /> Reject</Button>
              <Button variant="outline" className="w-full" onClick={() => setDocRequestOpen(true)}><FileWarning className="w-4 h-4" /> Request document</Button>
              <Button variant="outline" className="w-full" onClick={() => setForwardOpen(true)}><Forward className="w-4 h-4" /> Forward to officer</Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Documents ({app.documents.length})</div>
            <div className="space-y-2">
              {app.documents.map((d) => (
                <div key={d.name} className="rounded-xl border border-slate-200 px-3.5 py-2.5 flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700 flex-1 truncate">{d.name}</span>
                  {d.fromVault && <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">VAULT</span>}
                  <StatusBadge status={d.verified ? 'verified' : 'pending'} />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">VAULT = verified at source via MahaSetu Document Vault (with citizen consent).</p>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject application">
        <div className="space-y-4">
          <Field label="Reason (shared with the citizen)" required>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} className={inputCls} placeholder="e.g. Address proof does not match the application district" />
          </Field>
          <Button variant="danger" className="w-full" onClick={reject}>Confirm rejection</Button>
        </div>
      </Modal>

      <Modal open={docRequestOpen} onClose={() => setDocRequestOpen(false)} title="Request a document">
        <div className="space-y-4">
          <Field label="Document needed" required>
            <input value={docRequest} onChange={(e) => setDocRequest(e.target.value)} placeholder="e.g. Latest electricity bill" className={inputCls} />
          </Field>
          <p className="text-xs text-slate-400">The citizen is notified instantly and the application moves to Action Required.</p>
          <Button className="w-full" onClick={requestDoc} disabled={!docRequest.trim()}>Send request</Button>
        </div>
      </Modal>

      <Modal open={forwardOpen} onClose={() => setForwardOpen(false)} title="Forward case">
        <div className="space-y-4">
          <Field label="Forward to" required>
            <select value={forwardTo} onChange={(e) => setForwardTo(e.target.value)} className={inputCls}>
              {['Tehsildar, Pune City', 'District Collector Office', 'Circle Officer, Haveli', 'Additional SDO, Revenue'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </Field>
          <Button className="w-full" onClick={forward}>Forward case</Button>
        </div>
      </Modal>
    </div>
  )
}
