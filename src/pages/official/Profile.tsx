import { IdCard, Building2, MapPin, BadgeCheck } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/primitives'
import { useAuth } from '@/context/AuthContext'
import { departmentById } from '@/data/departments'

export default function OfficialProfile() {
  const { user } = useAuth()
  const dept = departmentById(user?.departmentId ?? '')

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Officer Profile</h1>
        <p className="text-slate-500 mt-1.5">Your official assignment on MahaSetu.</p>
      </div>
      <Card>
        <CardHeader title="Assignment" />
        <div className="px-5 sm:px-6 pb-6 space-y-3">
          {[
            { icon: IdCard, k: 'Officer', v: `${user?.name} (${user?.id})` },
            { icon: Building2, k: 'Department', v: dept?.name ?? '—' },
            { icon: MapPin, k: 'Jurisdiction', v: 'Pune Sub-Division · Pune District, Maharashtra' },
            { icon: BadgeCheck, k: 'Role', v: user?.designation ?? 'Sub-Divisional Officer' },
          ].map((r) => (
            <div key={r.k} className="flex items-center gap-3.5 rounded-xl border border-slate-200 p-4">
              <r.icon className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <div><div className="text-xs text-slate-400">{r.k}</div><div className="text-sm font-medium text-slate-800">{r.v}</div></div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-6 bg-canvas">
        <p className="text-sm text-slate-600">Every action you take — approvals, rejections, document requests, forwards — is written to the immutable audit log with your officer ID, visible to department admins and MahaSetu administrators.</p>
      </Card>
    </div>
  )
}
