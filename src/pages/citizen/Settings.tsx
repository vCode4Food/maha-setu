import { useState } from 'react'
import { Languages, Bell, Moon, ShieldCheck, Accessibility, RotateCcw } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

const LANGS = ['English', 'हिन्दी', 'मराठी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'ગુજરાતી', 'ಕನ್ನಡ']

export default function CitizenSettings() {
  const [lang, setLang] = useState('English')
  const [notif, setNotif] = useState({ app: true, docs: true, schemes: false, grievances: true, sms: true })
  const { pushToast, resetDemo } = useApp()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1.5">Language, notifications and accessibility preferences.</p>
      </div>

      <Card>
        <CardHeader title="Language" subtitle="Demonstration selector — full translation is not part of the prototype" />
        <div className="px-5 sm:px-6 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {LANGS.map((l) => (
            <button key={l} onClick={() => setLang(l)} className={`rounded-xl border-2 px-3 py-2.5 text-sm font-medium ${lang === l ? 'border-primary-600 bg-primary-50 text-primary-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="px-5 sm:px-6 pb-6 -mt-2 flex items-center gap-2 text-xs text-slate-400"><Languages className="w-3.5 h-3.5" /> Selected: {lang}</div>
      </Card>

      <Card>
        <CardHeader title="Notifications" subtitle="Choose what reaches you" />
        <div className="px-5 sm:px-6 pb-6 space-y-2.5">
          {([
            ['app', 'Application status changes'], ['docs', 'Document verification results'],
            ['schemes', 'New scheme matches'], ['grievances', 'Grievance updates'], ['sms', 'SMS fallback for critical alerts'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 cursor-pointer">
              <span className="text-sm text-slate-700">{label}</span>
              <input type="checkbox" checked={notif[key]} onChange={(e) => setNotif({ ...notif, [key]: e.target.checked })} className="w-9 h-5 accent-primary-700" />
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Accessibility & appearance" />
        <div className="px-5 sm:px-6 pb-6 space-y-2.5">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-sm text-slate-700 flex items-center gap-2"><Accessibility className="w-4 h-4 text-slate-400" /> Larger text (demo)</span>
            <input type="checkbox" className="w-9 h-5 accent-primary-700" aria-label="Larger text" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-sm text-slate-700 flex items-center gap-2"><Moon className="w-4 h-4 text-slate-400" /> High-contrast mode (demo)</span>
            <input type="checkbox" className="w-9 h-5 accent-primary-700" aria-label="High contrast" />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-sm text-slate-700 flex items-center gap-2"><Bell className="w-4 h-4 text-slate-400" /> Reduce motion</span>
            <input type="checkbox" className="w-9 h-5 accent-primary-700" aria-label="Reduce motion" />
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => pushToast({ kind: 'success', title: 'Preferences saved', body: 'Stored locally for this demo session.' })}
          className="rounded-xl bg-primary-900 text-white font-medium px-6 py-3 text-sm hover:bg-primary-800"
        >
          Save preferences
        </button>
        <button
          onClick={resetDemo}
          className="rounded-xl border border-slate-300 text-slate-700 font-medium px-6 py-3 text-sm hover:bg-slate-50 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset demo data
        </button>
      </div>
      <p className="text-xs text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Preferences persist in memory only for this prototype session.</p>
    </div>
  )
}
