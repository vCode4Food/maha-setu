import { ShieldCheck, KeyRound, FileCheck, Database, ScrollText, UserCog, Activity, Lock } from 'lucide-react'
import { Card, CardHeader, StatusBadge, StatCard } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

const LAYERS = [
  { icon: KeyRound, name: 'Identity & Authentication', detail: 'Maha ID SSO with OTP + biometric unlock (simulated). Aadhaar used only in masked, demo form.', status: 'healthy' },
  { icon: FileCheck, name: 'Consent Framework', detail: 'Every cross-department data read requires a scoped, revocable citizen consent with purpose binding.', status: 'healthy' },
  { icon: Database, name: 'Data Sharing', detail: 'Read-only, purpose-limited exchanges. No bulk exports; department connectors exchange field-level payloads.', status: 'healthy' },
  { icon: UserCog, name: 'Role-Based Access Control', detail: 'Five distinct roles with route-level authorization and per-department data scoping.', status: 'healthy' },
  { icon: ScrollText, name: 'Audit & Traceability', detail: 'Immutable, append-only logs for every approval, consent change and department exchange.', status: 'healthy' },
  { icon: Activity, name: 'System Monitoring', detail: 'Continuous probes on gateway, vault, workflow and connector subsystems with alerting.', status: 'healthy' },
]

export default function AdminSecurity() {
  const { pushToast } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Security Center</h1>
        <p className="text-slate-500 mt-1.5">Prototype representation of the proposed security architecture — no live security claims.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active consents" value="1.1 Cr" icon={<FileCheck className="w-5 h-5" />} tone="primary" />
        <StatCard label="Consent violations" value="0" sub="since launch (demo)" icon={<ShieldCheck className="w-5 h-5" />} tone="green" />
        <StatCard label="Failed logins (24h)" value="214" sub="auto rate-limited" icon={<Lock className="w-5 h-5" />} tone="saffron" />
        <StatCard label="Audit events (24h)" value="8.6 L" icon={<ScrollText className="w-5 h-5" />} tone="slate" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {LAYERS.map((l) => (
          <Card key={l.name} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center"><l.icon className="w-5 h-5" /></span>
                <div className="font-semibold text-slate-900 text-sm">{l.name}</div>
              </div>
              <StatusBadge status={l.status} />
            </div>
            <p className="text-sm text-slate-500 mt-2.5">{l.detail}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-600 max-w-2xl">
            <span className="font-semibold text-slate-900">Responsible disclosure note:</span> this prototype demonstrates frontend behaviour only. It does not connect to Aadhaar, payments or any government system, and no real personal data exists anywhere in the demo dataset.
          </div>
          <button onClick={() => pushToast({ kind: 'info', title: 'Security policy', body: 'Full policy document is out of scope for the demo.' })} className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">View policy (demo)</button>
        </div>
      </Card>
    </div>
  )
}
