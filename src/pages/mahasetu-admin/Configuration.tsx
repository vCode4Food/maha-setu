import { useState } from 'react'
import { Card, CardHeader, Field, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function AdminConfiguration() {
  const { pushToast } = useApp()
  const [cfg, setCfg] = useState({
    platformName: 'MahaSetu', defaultSla: 7, grievanceSla: 72, consentExpiry: 30,
    autoEscalation: true, maintenanceMode: false, newRegistrations: true,
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Configuration</h1>
        <p className="text-slate-500 mt-1.5">Platform-wide defaults (demo configuration — stored in memory only).</p>
      </div>

      <Card>
        <CardHeader title="Platform defaults" />
        <div className="px-5 sm:px-6 pb-6 grid sm:grid-cols-2 gap-4">
          <Field label="Platform name"><input value={cfg.platformName} onChange={(e) => setCfg({ ...cfg, platformName: e.target.value })} className={inputCls} /></Field>
          <Field label="Default service SLA (days)"><input type="number" value={cfg.defaultSla} onChange={(e) => setCfg({ ...cfg, defaultSla: Number(e.target.value) })} className={inputCls} /></Field>
          <Field label="Grievance SLA (hours)"><input type="number" value={cfg.grievanceSla} onChange={(e) => setCfg({ ...cfg, grievanceSla: Number(e.target.value) })} className={inputCls} /></Field>
          <Field label="Consent expiry (days)"><input type="number" value={cfg.consentExpiry} onChange={(e) => setCfg({ ...cfg, consentExpiry: Number(e.target.value) })} className={inputCls} /></Field>
        </div>
      </Card>

      <Card>
        <CardHeader title="Feature switches" />
        <div className="px-5 sm:px-6 pb-6 space-y-2.5">
          {([
            ['autoEscalation', 'Auto-escalate SLA breaches to department heads'],
            ['maintenanceMode', 'Global maintenance mode (banner on all portals)'],
            ['newRegistrations', 'Allow new citizen / business registrations'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 cursor-pointer">
              <span className="text-sm text-slate-700">{label}</span>
              <input
                type="checkbox"
                checked={cfg[key]}
                onChange={(e) => setCfg({ ...cfg, [key]: e.target.checked })}
                className="w-9 h-5 accent-primary-700"
                aria-label={label}
              />
            </label>
          ))}
        </div>
      </Card>

      <button onClick={() => pushToast({ kind: 'success', title: 'Configuration saved', body: 'Platform defaults updated for this demo session.' })} className="rounded-xl bg-primary-900 text-white font-medium px-6 py-3 text-sm hover:bg-primary-800">
        Save configuration
      </button>
      <p className="text-xs text-slate-400">Prototype — configuration changes are not persisted beyond this browser session.</p>
    </div>
  )
}
