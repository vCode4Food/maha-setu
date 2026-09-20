import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Landmark, ArrowRight, CheckCircle2, Loader2, Sparkles, Building2, Scale,
  Zap, Users, FileCheck, Store,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { departmentById } from '@/data/departments'

const EXPANSION = [
  { id: 'municipal', dept: 'municipal', icon: Building2, title: 'Municipal building approval', detail: 'Zoning + plan sanction for the new unit at MIDC Satpur Phase 2.', sla: '12 working days' },
  { id: 'pollution', dept: 'municipal', icon: Scale, title: 'Pollution board consent (Orange category)', detail: 'Consent to Establish for food processing effluents.', sla: '18 working days' },
  { id: 'labour', dept: 'labour', icon: Users, title: 'Labour registrations', detail: 'Shops & Establishments + contract labour licence for 45 workers.', sla: '7 working days' },
  { id: 'power', dept: 'finance', icon: Zap, title: 'Industrial power connection (75 kVA)', detail: 'MSEDCL load sanction coordinated via Business Services.', sla: '10 working days' },
  { id: 'tax', dept: 'finance', icon: FileCheck, title: 'GST place-of-business update', detail: 'Additional premises added to GSTIN 27AABCS1429P1ZQ.', sla: '4 working days' },
]

export default function BusinessConnect() {
  const { pushToast, applications } = useApp()
  const [started, setStarted] = useState(false)
  const [stage, setStage] = useState(1)
  const [running, setRunning] = useState(false)

  const bizApp = applications.find((a) => a.serviceId === 'business-registration')

  const runPipeline = () => {
    if (running || stage > EXPANSION.length) return
    setRunning(true)
    const tick = () => {
      setStage((s) => {
        if (s >= EXPANSION.length) {
          setRunning(false)
          pushToast({ kind: 'success', title: 'All approvals coordinated', body: '5 clearances processed through one pipeline (demo).' })
          return s
        }
        window.setTimeout(tick, 850)
        return s + 1
      })
    }
    window.setTimeout(tick, 500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5"><Landmark className="w-6 h-6 text-primary-700" /> Government Connect</h1>
        <p className="text-slate-500 mt-1.5">One interface to every department your business touches — registrations, licences, compliance and incentives.</p>
      </div>

      {/* Expansion workflow demo */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-saffron-600"><Sparkles className="w-3.5 h-3.5" /> Cross-department workflow</div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">Expansion: new food-processing unit, Nashik</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">Declare the goal once. MahaSetu identifies every approval across departments and coordinates them as one pipeline.</p>
          </div>
          <button
            onClick={runPipeline}
            disabled={running || stage > EXPANSION.length}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-primary-800 disabled:opacity-40"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {stage > EXPANSION.length ? 'Pipeline complete' : running ? 'Coordinating…' : 'Simulate approvals'}
          </button>
        </div>

        <div className="mt-6 space-y-2.5">
          {EXPANSION.map((step, i) => {
            const state = !started && stage === 1 && i === 0 ? 'active' : i < stage ? 'done' : i === stage ? 'active' : 'pending'
            const dept = departmentById(step.dept)
            return (
              <div key={step.id} className={`rounded-2xl border p-4 flex flex-wrap items-center gap-4 ${state === 'done' ? 'border-emerald-200 bg-emerald-50/40' : state === 'active' ? 'border-sky-200 bg-sky-50/40' : 'border-slate-200'}`}>
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${state === 'done' ? 'bg-emerald-100 text-emerald-700' : state === 'active' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-400'}`}>
                  {state === 'done' ? <CheckCircle2 className="w-5 h-5" /> : state === 'active' ? <Loader2 className="w-5 h-5 animate-spin" /> : <step.icon className="w-5 h-5" />}
                </span>
                <div className="flex-1 min-w-[220px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-slate-900 text-sm">{step.title}</span>
                    <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 text-white" style={{ background: dept?.color }}>{dept?.shortName}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{step.detail}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">SLA</div>
                  <div className="text-sm font-medium text-slate-700">{step.sla}</div>
                </div>
                <StatusBadge status={state === 'done' ? 'completed' : state === 'active' ? 'processing' : 'submitted'} />
              </div>
            )
          })}
        </div>
        {stage > EXPANSION.length && (
          <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
            <span className="font-semibold">Pipeline complete.</span> In production, each approval would carry its request ID and officer signature into the audit trail.
          </div>
        )}
      </Card>

      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: Store, t: 'Register a new business', d: 'Single-window registration with municipal, tax and labour coordination.', to: '/business/services' },
          { icon: FileCheck, t: 'Renew licences', d: 'Renewal alerts 90 days ahead; renewals pre-filled from your profile.', to: '/business/licences' },
          { icon: Scale, t: 'Check compliance', d: 'Live compliance score with every pending obligation explained.', to: '/business/compliance' },
        ].map((c) => (
          <Card key={c.t} className="p-5">
            <c.icon className="w-6 h-6 text-primary-700" />
            <h3 className="font-semibold text-slate-900 mt-3">{c.t}</h3>
            <p className="text-sm text-slate-500 mt-1">{c.d}</p>
            <Link to={c.to} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-900">Open <ArrowRight className="w-3.5 h-3.5" /></Link>
          </Card>
        ))}
      </div>

      {bizApp && (
        <Card className="p-6 bg-canvas">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">Linked case:</span> {bizApp.id} — {bizApp.serviceName} is at {bizApp.currentStage}. Expansion clearances will reference this registration.
          </div>
        </Card>
      )}
    </div>
  )
}

function Play({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M8 5v14l11-7z" /></svg>
  )
}
