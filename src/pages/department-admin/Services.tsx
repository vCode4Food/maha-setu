import { useState } from 'react'
import { Search, Power, Plus, Pencil } from 'lucide-react'
import { Card, EmptyState, StatusBadge, Modal, Field, inputCls, Tabs } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { services as serviceDefs } from '@/data/services'

export default function DeptServices() {
  const { allServicesWithState, setServiceStatus, pushToast } = useApp()
  const deptServices = allServicesWithState.filter((s) => s.departmentId === 'revenue')
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')

  const filtered = deptServices.filter((s) => {
    if (tab === 'active' && s.status !== 'active') return false
    if (tab === 'disabled' && s.status !== 'disabled') return false
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Services</h1>
          <p className="text-slate-500 mt-1.5">Configure the department's service catalog on MahaSetu. Toggles apply instantly (demo state).</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800">
          <Plus className="w-4 h-4" /> Create service
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          tabs={[
            { id: 'all', label: 'All', count: deptServices.length },
            { id: 'active', label: 'Active', count: deptServices.filter((s) => s.status === 'active').length },
            { id: 'disabled', label: 'Disabled', count: deptServices.filter((s) => s.status === 'disabled').length },
          ]}
          active={tab} onChange={setTab}
        />
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" className={`${inputCls} pl-9`} aria-label="Search services" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-medium text-slate-900">{s.name}</span>
                  <StatusBadge status={s.status} />
                  <span className="text-[10px] uppercase text-slate-400">{s.mode}</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {s.category} · Fee ₹{s.fee} · SLA {s.slaDays}d · v{s.version} · {s.documents.length} documents configured
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => pushToast({ kind: 'info', title: 'Service editor', body: `${s.name} — editing configuration is simulated in this demo.` })} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500" aria-label={`Edit ${s.name}`}><Pencil className="w-4 h-4" /></button>
                <button
                  onClick={() => setServiceStatus(s.id, s.status === 'active' ? 'disabled' : 'active')}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-lg px-3 py-2 border ${s.status === 'active' ? 'border-slate-300 text-slate-600 hover:bg-slate-50' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}
                  aria-label={`${s.status === 'active' ? 'Disable' : 'Enable'} ${s.name}`}
                >
                  <Power className="w-3.5 h-3.5" /> {s.status === 'active' ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <Card><EmptyState icon={<Search className="w-6 h-6" />} title="No services match" /></Card>}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a new service">
        <div className="space-y-4">
          <Field label="Service name" required><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Domicile Certificate" className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Fee (₹)"><input type="number" defaultValue={30} className={inputCls} /></Field>
            <Field label="SLA (days)"><input type="number" defaultValue={7} className={inputCls} /></Field>
          </div>
          <Field label="Required documents"><input placeholder="Comma separated" className={inputCls} /></Field>
          <button
            onClick={() => { pushToast({ kind: 'success', title: 'Service created', body: `${name || 'New service'} drafted in disabled state.` }); setCreateOpen(false); setName('') }}
            className="w-full rounded-xl bg-primary-900 text-white font-medium py-3 text-sm hover:bg-primary-800"
          >
            Create service (demo)
          </button>
        </div>
      </Modal>
    </div>
  )
}
