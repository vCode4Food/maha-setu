import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareWarning, Plus, Send } from 'lucide-react'
import { Card, CardHeader, EmptyState, StatusBadge, Modal, Field, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { departments } from '@/data/departments'
import type { Grievance } from '@/types'

function SLABar({ hoursUsed, total }: { hoursUsed: number; total: number }) {
  const pct = Math.min(100, Math.round((hoursUsed / total) * 100))
  const tone = pct > 80 ? 'bg-rose-500' : pct > 55 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
        <span>SLA · {total}h window</span><span>{pct}% used</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} /></div>
    </div>
  )
}

export default function CitizenGrievances() {
  const { user } = useAuth()
  const { grievances, addGrievance } = useApp()
  const uid = user?.id ?? ''
  const mine = grievances.filter((g) => g.citizenId === uid)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ category: 'Service Delay', departmentId: 'revenue', subject: '', description: '', location: 'Pune, Maharashtra' })

  const submit = () => {
    if (!form.subject.trim() || !form.description.trim()) return
    addGrievance({ ...form, citizenId: uid })
    setOpen(false)
    setForm({ category: 'Service Delay', departmentId: 'revenue', subject: '', description: '', location: 'Pune, Maharashtra' })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Grievances</h1>
          <p className="text-slate-500 mt-1.5">Raise an issue once — MahaSetu routes it to the right department with an SLA clock.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800">
          <Plus className="w-4 h-4" /> Raise Grievance
        </button>
      </div>

      <div className="space-y-4">
        {mine.map((g: Grievance) => (
          <Card key={g.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-slate-900">{g.subject}</span>
                  <StatusBadge status={g.status} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{g.id} · {g.category} · {departments.find((d) => d.id === g.departmentId)?.shortName} · {g.location}</div>
              </div>
              <div className="w-48"><SLABar hoursUsed={g.status === 'resolved' ? g.slaHours : Math.round(g.slaHours * 0.6)} total={g.slaHours} /></div>
            </div>
            {g.response && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-sm text-emerald-900">
                <span className="font-medium">Department response:</span> {g.response}
              </div>
            )}
            <div className="mt-4 grid grid-cols-5 gap-2">
              {g.timeline.map((t) => (
                <div key={t.label} className="text-center">
                  <div className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${t.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{t.done ? '✓' : ''}</div>
                  <div className={`text-[10px] mt-1 leading-tight ${t.done ? 'text-slate-600' : 'text-slate-400'}`}>{t.label}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {mine.length === 0 && (
          <Card><EmptyState icon={<MessageSquareWarning className="w-6 h-6" />} title="No grievances" body="When something goes wrong, raise it here — it reaches the right desk automatically." /></Card>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Raise a grievance" wide>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Category" required>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {['Service Delay', 'Wrong Information', 'Staff Behaviour', 'Payment Issue', 'Corruption', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Department (auto-suggested)" hint="MahaSetu can also detect this automatically">
              <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} className={inputCls}>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.shortName}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Subject" required><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Summarise the issue in one line" className={inputCls} /></Field>
          <Field label="Description" required><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="What happened? Include application IDs if relevant." className={inputCls} /></Field>
          <Field label="Location"><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} /></Field>
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">Attach photos or files (simulated)</div>
          <button onClick={submit} className="w-full rounded-xl bg-primary-900 text-white font-medium py-3 text-sm hover:bg-primary-800 inline-flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> Submit grievance
          </button>
          <p className="text-[11px] text-slate-400 text-center">A grievance ID will be generated and routed automatically (demo).</p>
        </div>
      </Modal>
    </div>
  )
}
