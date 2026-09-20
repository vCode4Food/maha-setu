import { useState } from 'react'
import { Card, CardHeader, Field, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function DeptSettings() {
  const { pushToast } = useApp()
  const [sla, setSla] = useState({ income: 7, caste: 10, land: 1, domicile: 10 })
  const [escalation, setEscalation] = useState(true)

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1.5">Department-level SLA policy and escalation rules (demo configuration).</p>
      </div>

      <Card>
        <CardHeader title="Default SLA (days)" subtitle="Applied when a service doesn't define its own" />
        <div className="px-5 sm:px-6 pb-6 grid sm:grid-cols-4 gap-4">
          {(Object.keys(sla) as (keyof typeof sla)[]).map((k) => (
            <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
              <input type="number" value={sla[k]} onChange={(e) => setSla({ ...sla, [k]: Number(e.target.value) })} className={inputCls} />
            </Field>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Escalation policy" />
        <div className="px-5 sm:px-6 pb-6">
          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 cursor-pointer">
            <span className="text-sm text-slate-700">Auto-escalate to Department Head at 90% SLA</span>
            <input type="checkbox" checked={escalation} onChange={(e) => setEscalation(e.target.checked)} className="w-9 h-5 accent-primary-700" />
          </label>
        </div>
      </Card>

      <button onClick={() => pushToast({ kind: 'success', title: 'Settings saved', body: 'Department configuration updated (demo).' })} className="rounded-xl bg-primary-900 text-white font-medium px-6 py-3 text-sm hover:bg-primary-800">
        Save configuration
      </button>
    </div>
  )
}
