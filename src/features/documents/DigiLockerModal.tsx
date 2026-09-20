import { useState } from 'react'
import { X, ShieldCheck, FileCheck2, Search, BadgeCheck, Lock } from 'lucide-react'
import { digilockerLibrary, type DigiLockerDoc } from '@/data/auth'
import { useApp } from '@/context/AppContext'
import { inputCls } from '@/components/ui/primitives'

/**
 * Mock DigiLocker — document FETCHING only (never authentication).
 * Fully simulated: no real DigiLocker / UIDAI connection.
 */
export function DigiLockerModal({ open, onClose, purpose }: { open: boolean; onClose: () => void; purpose?: string }) {
  const { uploadDocument, pushToast } = useApp()
  const [stage, setStage] = useState<'browse' | 'consent' | 'fetched'>('browse')
  const [selected, setSelected] = useState<DigiLockerDoc[]>([])
  const [q, setQ] = useState('')

  if (!open) return null

  const filtered = digilockerLibrary.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()))

  const toggle = (doc: DigiLockerDoc) => {
    setSelected((prev) => (prev.find((d) => d.id === doc.id) ? prev.filter((d) => d.id !== doc.id) : [...prev, doc]))
  }

  const fetchSelected = () => {
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    selected.forEach((doc) => {
      uploadDocument({
        name: doc.name,
        category: doc.category,
        issuer: `${doc.issuer} · via DigiLocker (demo)`,
        issuedDate: doc.issuedDate,
        status: 'verified',
        usedBy: purpose ? [purpose] : [],
        sizeKb: 120,
      })
    })
    pushToast({ kind: 'success', title: 'Documents fetched', body: `${selected.length} document(s) added to your vault (demo).` })
    setStage('fetched')
  }

  const reset = () => { setStage('browse'); setSelected([]); setQ(''); onClose() }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="Fetch from DigiLocker (demo)">
      <div className="absolute inset-0 bg-slate-950/50" onClick={reset} />
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-pop max-h-[92vh] overflow-hidden flex flex-col animate-fadeUp">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-[#0b3a75] text-white flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"><FileCheck2 className="w-5 h-5" /></span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm">DigiLocker — Document Fetch</div>
            <div className="text-[11px] text-white/70">Simulated integration · fetch only, not authentication</div>
          </div>
          <button onClick={reset} className="p-2 rounded-xl hover:bg-white/10" aria-label="Close DigiLocker"><X className="w-5 h-5" /></button>
        </div>

        {stage === 'browse' && (
          <>
            <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your DigiLocker documents…" className={`${inputCls} pl-9`} aria-label="Search DigiLocker documents" />
              </div>
              <p className="text-xs text-slate-400 mt-2.5">{selected.length} selected · documents shown are fictional demo records</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 sm:px-6 py-4 space-y-2.5">
              {filtered.map((doc) => {
                const isSel = !!selected.find((d) => d.id === doc.id)
                return (
                  <button
                    key={doc.id}
                    onClick={() => toggle(doc)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${isSel ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-primary-300'}`}
                    aria-pressed={isSel}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSel ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-50 text-primary-700'}`}>
                        {isSel ? <BadgeCheck className="w-4.5 h-4.5" /> : <FileCheck2 className="w-4.5 h-4.5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-slate-900 truncate">{doc.name}</div>
                        <div className="text-xs text-slate-400 truncate">{doc.issuer} · {doc.issuedDate}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-emerald-700 font-semibold">{doc.status}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{doc.maskedNumber}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex gap-3">
              <button onClick={reset} className="flex-1 rounded-xl border border-slate-300 text-slate-700 font-medium py-3 text-sm hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => selected.length && setStage('consent')}
                disabled={!selected.length}
                className="flex-1 rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800 disabled:opacity-50"
              >
                Review consent ({selected.length})
              </button>
            </div>
          </>
        )}

        {stage === 'consent' && (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 sm:px-6 py-5 space-y-4">
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-3">
                <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900 text-sm">Consent required before fetching</div>
                  <p className="text-sm text-amber-800 mt-1">Documents are shared with MahaSetu only after your approval. Nothing is fetched yet.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2.5 text-sm">
                <div className="flex justify-between gap-4"><span className="text-slate-400">Receiving platform</span><span className="font-medium text-slate-800">MahaSetu (your own vault)</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-400">Purpose</span><span className="font-medium text-slate-800 text-right">{purpose ?? 'Vault storage for reuse across services'}</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-400">Requested documents</span><span className="font-medium text-slate-800 text-right">{selected.map((d) => d.name).join(', ')}</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-400">Scope</span><span className="font-medium text-slate-800">Read-only · one-time fetch</span></div>
              </div>
              <p className="text-[11px] text-slate-400">Prototype representation of consent-based document sharing — not a legally binding DigiLocker consent artefact.</p>
            </div>
            <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setStage('browse')} className="flex-1 rounded-xl border border-rose-200 text-rose-600 font-medium py-3 text-sm hover:bg-rose-50">Deny</button>
              <button onClick={fetchSelected} className="flex-1 rounded-xl bg-emerald-600 text-white font-semibold py-3 text-sm hover:bg-emerald-700 inline-flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Allow & Fetch Documents
              </button>
            </div>
          </>
        )}

        {stage === 'fetched' && (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto"><BadgeCheck className="w-7 h-7 text-emerald-600" /></div>
            <h3 className="font-bold text-slate-900 mt-4">Documents fetched to your vault</h3>
            <p className="text-sm text-slate-500 mt-1.5">{selected.length} document(s) now available for reuse across every application.</p>
            <div className="mt-4 space-y-2 text-left max-w-sm mx-auto">
              {selected.map((d) => (
                <div key={d.id} className="rounded-xl border border-slate-200 px-3.5 py-2.5 flex items-center gap-2.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm text-slate-700 flex-1 truncate">{d.name}</span>
                  <span className="text-[10px] font-semibold text-emerald-700">Verified — Demo</span>
                </div>
              ))}
            </div>
            <button onClick={reset} className="mt-6 w-full max-w-sm mx-auto block rounded-xl bg-primary-900 text-white font-semibold py-3 text-sm hover:bg-primary-800">Continue</button>
          </div>
        )}
      </div>
    </div>
  )
}
