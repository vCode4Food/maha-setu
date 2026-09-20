import { CheckCircle2, Loader2, CircleDashed, Play, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { departmentById } from '@/data/departments'

export function OrchestrationPanel() {
  const { orchFlow, simulateOrchestration, pushToast } = useApp()
  const allDone = orchFlow.steps.every((s) => s.status === 'completed')

  const stepIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    if (status === 'processing') return <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />
    return <CircleDashed className="w-5 h-5 text-slate-300" />
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="text-sm text-slate-500">
          Citizen: <span className="font-medium text-slate-700">{orchFlow.citizen}</span> · Started {orchFlow.startedAt} · Application {orchFlow.applicationId}
        </div>
        <button
          onClick={() => {
            simulateOrchestration(orchFlow.id)
            if (allDone) pushToast({ kind: 'info', title: 'Flow already complete', body: 'All departments have responded.' })
          }}
          disabled={allDone}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-primary-800 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Play className="w-4 h-4" /> {allDone ? 'All departments responded' : 'Simulate next API response'}
        </button>
      </div>

      <ol className="relative">
        {orchFlow.steps.map((s, i) => (
          <li key={s.id} className="relative pl-11 pb-5 last:pb-0">
            {i < orchFlow.steps.length - 1 && (
              <span className={`absolute left-[18px] top-9 bottom-0 w-0.5 ${s.status === 'completed' ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
            <span className="absolute left-0 top-0 w-9 h-9 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm">
              {stepIcon(s.status)}
            </span>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: departmentById(s.departmentId)?.color }} />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.departmentName}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {s.requestId && <span className="font-mono">{s.requestId}</span>}
                  {s.timestamp && ` · ${s.timestamp}`}
                </span>
              </div>
              <div className="font-medium text-slate-900 text-sm mt-1.5">{s.title}</div>
              <p className="text-sm text-slate-500 mt-0.5">{s.detail}</p>
              {s.response && <div className="mt-2 text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 inline-block">{s.response}</div>}
            </div>
          </li>
        ))}
      </ol>

      {allDone && (
        <Card className="mt-4 p-4 bg-emerald-50 border-emerald-200">
          <div className="text-sm text-emerald-900">
            <span className="font-semibold">Flow complete.</span> All department responses received; final certificate generation triggered on the application timeline.
          </div>
        </Card>
      )}
    </div>
  )
}
