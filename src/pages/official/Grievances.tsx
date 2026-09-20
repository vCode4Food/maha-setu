import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareWarning, Send, Search } from 'lucide-react'
import { Card, CardHeader, EmptyState, StatusBadge, Modal, Field, inputCls, Tabs } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { departments } from '@/data/departments'
import type { Grievance } from '@/types'

export default function OfficialGrievances() {
  const { grievances, setGrievanceStatus, pushToast } = useApp()
  const [tab, setTab] = useState('open')
  const [q, setQ] = useState('')
  const [respondTo, setRespondTo] = useState<Grievance | null>(null)
  const [response, setResponse] = useState('')

  const open = grievances.filter((g) => g.status !== 'resolved')
  const tabs = [
    { id: 'open', label: 'Open', count: open.length },
    { id: 'all', label: 'All', count: grievances.length },
    { id: 'resolved', label: 'Resolved', count: grievances.filter((g) => g.status === 'resolved').length },
  ]
  const list = grievances.filter((g) => {
    if (tab === 'open' && g.status === 'resolved') return false
    if (tab === 'resolved' && g.status !== 'resolved') return false
    if (q && !(g.subject.toLowerCase().includes(q.toLowerCase()) || g.id.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  const sendResponse = () => {
    if (!respondTo || !response.trim()) return
    setGrievanceStatus(respondTo.id, 'resolved', response)
    pushToast({ kind: 'success', title: 'Grievance resolved', body: `${respondTo.id} — citizen notified.` })
    setRespondTo(null)
    setResponse('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Grievances</h1>
        <p className="text-slate-500 mt-1.5">Issues routed to your desk by MahaSetu. Respond before the SLA clock breaches.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search grievances…" className={`${inputCls} pl-9`} aria-label="Search grievances" />
        </div>
      </div>

      <div className="space-y-4">
        {list.map((g) => {
          const pct = g.status === 'resolved' ? 100 : Math.round(60)
          return (
            <Card key={g.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-semibold text-slate-900">{g.subject}</span>
                    <StatusBadge status={g.status} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{g.id} · {g.citizenName} · {g.category} · {departments.find((d) => d.id === g.departmentId)?.shortName}</div>
                  <p className="text-sm text-slate-600 mt-2 max-w-2xl">{g.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2.5 w-56">
                  <div className="w-full">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1"><span>SLA {g.slaHours}h</span><span>{pct}%</span></div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className={`h-full ${pct >= 100 ? 'bg-emerald-500' : pct > 55 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} /></div>
                  </div>
                  {g.status !== 'resolved' && (
                    <button onClick={() => { setRespondTo(g); setResponse('') }} className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-primary-900 rounded-xl px-4 py-2 hover:bg-primary-800">
                      <Send className="w-3.5 h-3.5" /> Respond & resolve
                    </button>
                  )}
                </div>
              </div>
              {g.response && <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-sm text-emerald-900"><span className="font-medium">Response:</span> {g.response}</div>}
            </Card>
          )
        })}
        {list.length === 0 && <Card><EmptyState icon={<MessageSquareWarning className="w-6 h-6" />} title="No grievances here" /></Card>}
      </div>

      <Modal open={!!respondTo} onClose={() => setRespondTo(null)} title="Respond & resolve" wide>
        {respondTo && (
          <div className="space-y-4">
            <Card className="p-4 bg-canvas border-0">
              <div className="font-medium text-slate-900 text-sm">{respondTo.subject}</div>
              <p className="text-sm text-slate-600 mt-1">{respondTo.description}</p>
            </Card>
            <Field label="Official response (visible to citizen)" required>
              <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={4} className={inputCls} placeholder="Explain the resolution taken…" />
            </Field>
            <div className="flex gap-2">
              <button onClick={sendResponse} className="flex-1 rounded-xl bg-primary-900 text-white font-medium py-3 text-sm hover:bg-primary-800">Resolve grievance</button>
              <button onClick={() => { setGrievanceStatus(respondTo.id, 'escalated'); setRespondTo(null); pushToast({ kind: 'warning', title: 'Escalated', body: 'Sent to department head with SLA breach flag.' }) }} className="rounded-xl border border-amber-300 text-amber-700 font-medium px-4 text-sm hover:bg-amber-50">
                Escalate
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
