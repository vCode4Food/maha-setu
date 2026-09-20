import { Fingerprint, IdCard, MapPin, ShieldCheck, BadgeCheck, Wallet, Clock3, LogOut } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '@/components/ui/primitives'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'

export default function CitizenProfile() {
  const { user, session, logout } = useAuth()
  const { applications, documents } = useApp()
  const mine = applications.filter((a) => a.citizenId === user?.id)
  void StatusBadge

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-500 mt-1.5">Your Maha ID profile — one identity across every department.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <span className="w-16 h-16 rounded-2xl bg-primary-900 text-white text-xl font-bold flex items-center justify-center">
            {user?.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
          </span>
          <div className="flex-1 min-w-[220px]">
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" />{user?.location}</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-emerald-500" />Identity verified</span>
            </div>
          </div>
          <button className="rounded-xl border border-slate-300 bg-white text-slate-700 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">Edit profile</button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Identity" subtitle="Simulated identity attributes for the prototype" />
          <div className="px-5 sm:px-6 pb-6 space-y-3">
            {[
              { icon: IdCard, label: 'Maha ID', value: user?.mahaId ?? '—' },
              { icon: Fingerprint, label: 'Aadhaar (masked, demo)', value: user?.aadhaarMasked ?? 'XXXX XXXX 0000' },
              { icon: Wallet, label: 'Linked bank (masked)', value: 'XXXX XX91 · SBI' },
              { icon: MapPin, label: 'Address on record', value: 'Flat 402, Shanti Heights, Kothrud, Pune 411038' },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                <r.icon className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-slate-400">{r.label}</div>
                  <div className="text-sm font-medium text-slate-800 truncate">{r.value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Platform summary" />
          <div className="px-5 sm:px-6 pb-6 grid grid-cols-2 gap-3">
            {[
              ['Applications', String(mine.length)], ['Documents in vault', String(documents.length)],
              ['Consents active', '3'], ['Family members linked', '4'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-canvas p-4"><div className="text-2xl font-bold text-slate-900">{v}</div><div className="text-xs text-slate-400 mt-0.5">{k}</div></div>
            ))}
          </div>
          <div className="px-5 sm:px-6 pb-6">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-900">All demo data is fictional. No real personal records are used anywhere in this prototype.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active session (simulated) */}
      {session && (
        <Card>
          <CardHeader title="Active Session" subtitle="Simulated session — the prototype frontend manages expiry and logout" />
          <div className="px-5 sm:px-6 pb-6 grid sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-canvas p-4"><div className="text-xs text-slate-400">Maha ID</div><div className="text-sm font-mono font-semibold text-slate-800 mt-1">{session.mahaId}</div></div>
            <div className="rounded-xl bg-canvas p-4"><div className="text-xs text-slate-400 flex items-center gap-1"><Clock3 className="w-3 h-3" /> Last login</div><div className="text-sm font-medium text-slate-800 mt-1">{session.loginAt}</div></div>
            <div className="rounded-xl bg-canvas p-4"><div className="text-xs text-slate-400">Session expires in</div><div className="text-sm font-medium text-slate-800 mt-1">{Math.max(0, Math.round((session.expiresAt - Date.now()) / 60000))} min</div></div>
            <div className="rounded-xl bg-canvas p-4 flex flex-col items-start gap-2"><div className="text-xs text-slate-400">Actions</div><button onClick={logout} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold px-3 py-1.5 hover:bg-rose-50"><LogOut className="w-3.5 h-3.5" /> Logout</button></div>
          </div>
        </Card>
      )}
    </div>
  )
}
