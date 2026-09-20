import { useState } from 'react'
import {
  Workflow as WorkflowIcon, Plus, Pencil, Trash2, ArrowDown, GripVertical, Save,
} from 'lucide-react'
import { Card, CardHeader, Modal, Field, inputCls } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'

interface Step { id: string; name: string; owner: string; sla: string; desc: string }

const seedSteps: Step[] = [
  { id: 'w1', name: 'Application Received', owner: 'MahaSetu Engine', sla: 'Instant', desc: 'Submission acknowledgement + fee receipt issued to citizen.' },
  { id: 'w2', name: 'Document Verification', owner: 'Verification Cell', sla: '1 day', desc: 'Vault-verified documents auto-trusted; flagged items checked manually.' },
  { id: 'w3', name: 'Officer Review', owner: 'Sub-Divisional Officer', sla: '3 days', desc: 'Merit review with field verification where required.' },
  { id: 'w4', name: 'Department Approval', owner: 'Deputy Collector', sla: '2 days', desc: 'Final sign-off with digital signature.' },
  { id: 'w5', name: 'Certificate Generation', owner: 'MahaSetu Engine', sla: 'Instant', desc: 'Signed PDF issued to citizen vault + QR verifiable copy.' },
]

export default function DeptWorkflows() {
  const { pushToast } = useApp()
  const [steps, setSteps] = useState<Step[]>(seedSteps)
  const [edit, setEdit] = useState<Step | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [draft, setDraft] = useState<Step>({ id: '', name: '', owner: '', sla: '2 days', desc: '' })

  const save = () => {
    if (!draft.name.trim()) return
    if (edit) {
      setSteps((prev) => prev.map((s) => (s.id === edit.id ? { ...draft, id: edit.id } : s)))
      pushToast({ kind: 'success', title: 'Step updated', body: draft.name })
    } else {
      setSteps((prev) => [...prev, { ...draft, id: `w${Date.now()}` }])
      pushToast({ kind: 'success', title: 'Step added', body: draft.name })
    }
    setAddOpen(false)
    setEdit(null)
    setDraft({ id: '', name: '', owner: '', sla: '2 days', desc: '' })
  }

  const remove = (id: string, name: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id))
    pushToast({ kind: 'warning', title: 'Step removed', body: name })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5"><WorkflowIcon className="w-6 h-6 text-primary-700" /> Workflow Builder</h1>
          <p className="text-slate-500 mt-1.5">Configure how applications move through the department. Changes apply to new applications immediately (demo).</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEdit(null); setDraft({ id: '', name: '', owner: '', sla: '2 days', desc: '' }); setAddOpen(true) }} className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800"><Plus className="w-4 h-4" /> Add step</button>
          <button onClick={() => pushToast({ kind: 'success', title: 'Workflow published', body: 'v4.1 is now live for new applications.' })} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium px-4 py-2.5 text-sm hover:bg-slate-50"><Save className="w-4 h-4" /> Publish</button>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader title="Income Certificate — approval workflow" subtitle="v4.0 · applies to new applications" />
        <div className="px-2 pb-2">
          {steps.map((s, i) => (
            <div key={s.id}>
              <div className="group rounded-2xl border border-slate-200 p-4 hover:border-primary-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />
                    <span className="w-9 h-9 rounded-xl bg-primary-900 text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 text-sm">{s.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{s.owner} · SLA {s.sla}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setEdit(s); setDraft(s); setAddOpen(true) }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label={`Edit ${s.name}`}><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(s.id, s.name)} className="p-2 rounded-lg hover:bg-rose-50 text-rose-500" aria-label={`Delete ${s.name}`}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-2">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1"><ArrowDown className="w-4 h-4 text-slate-300" /></div>
              )}
            </div>
          ))}
          {steps.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-400">No steps — add the first stage of your workflow.</div>
          )}
        </div>
      </Card>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={edit ? 'Edit step' : 'Add workflow step'}>
        <div className="space-y-4">
          <Field label="Step name" required><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Field Verification" className={inputCls} /></Field>
          <Field label="Responsible office" required><input value={draft.owner} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} placeholder="e.g. Circle Office" className={inputCls} /></Field>
          <Field label="SLA"><input value={draft.sla} onChange={(e) => setDraft({ ...draft, sla: e.target.value })} className={inputCls} /></Field>
          <Field label="What happens at this step"><textarea value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} rows={3} className={inputCls} /></Field>
          <Button className="w-full" onClick={save}>{edit ? 'Save changes' : 'Add step'}</Button>
        </div>
      </Modal>
    </div>
  )
}
