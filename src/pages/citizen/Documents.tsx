import { useState, useRef } from 'react'
import {
  FileText, Upload, Download, Eye, Share2, Search, FolderOpen, ShieldCheck, Clock3, Cloud,
} from 'lucide-react'
import { Card, CardHeader, EmptyState, StatusBadge, Modal, Field, inputCls, Tabs } from '@/components/ui/primitives'
import { DigiLockerModal } from '@/features/documents/DigiLockerModal'
import { useApp } from '@/context/AppContext'

const CATEGORIES = ['All', 'Identity', 'Education', 'Certificates', 'Income', 'Property', 'Business', 'Health', 'Other'] as const

export default function CitizenDocuments() {
  const { documents, uploadDocument } = useApp()
  const [tab, setTab] = useState('All')
  const [q, setQ] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [dlOpen, setDlOpen] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Identity')
  const [file, setFile] = useState<File | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const filtered = documents.filter((d) => {
    if (tab !== 'All' && d.category !== tab) return false
    if (q && !d.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const statusCounts = {
    verified: documents.filter((d) => d.status === 'verified').length,
    pending: documents.filter((d) => d.status === 'pending').length,
    action: documents.filter((d) => d.status === 'action_required').length,
  }

  const doUpload = () => {
    const finalName = file ? file.name.replace(/\.[^.]+$/, '') : name
    if (!finalName.trim()) return
    uploadDocument({
      name: finalName, category: category as never, issuer: file ? `Self upload · ${file.type || 'file'}` : 'Self upload',
      issuedDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending', usedBy: [], sizeKb: file ? Math.max(1, Math.round(file.size / 1024)) : 160,
    })
    setUploadOpen(false); setName(''); setFile(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Documents</h1>
          <p className="text-slate-500 mt-1.5">Your government document vault — upload once, use everywhere with consent.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => setDlOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0b3a75] text-white font-medium px-4 py-2.5 text-sm hover:bg-[#0d4187]">
            <Cloud className="w-4 h-4" /> Fetch from DigiLocker
          </button>
          <button onClick={() => setUploadOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800">
            <Upload className="w-4 h-4" /> Upload manually
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><ShieldCheck className="w-4.5 h-4.5" /></span><div><div className="text-xl font-bold text-slate-900">{statusCounts.verified}</div><div className="text-xs text-slate-400">Verified</div></div></Card>
        <Card className="p-4 flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center"><Clock3 className="w-4.5 h-4.5" /></span><div><div className="text-xl font-bold text-slate-900">{statusCounts.pending}</div><div className="text-xs text-slate-400">Verifying</div></div></Card>
        <Card className="p-4 flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><FileText className="w-4.5 h-4.5" /></span><div><div className="text-xl font-bold text-slate-900">{statusCounts.action}</div><div className="text-xs text-slate-400">Action needed</div></div></Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={CATEGORIES.map((c) => ({ id: c, label: c }))} active={tab} onChange={setTab} />
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className={`${inputCls} pl-9`} aria-label="Search documents" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <Card key={d.id} className="p-5 flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><FileText className="w-5 h-5" /></span>
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 text-sm truncate">{d.name}</div>
                  <div className="text-xs text-slate-400 truncate">{d.issuer}</div>
                </div>
              </div>
              <StatusBadge status={d.status} />
            </div>
            <div className="mt-3 text-xs text-slate-400 space-y-0.5">
              <div>Issued {d.issuedDate}{d.expiryDate ? ` · Expires ${d.expiryDate}` : ''}</div>
              {d.usedBy && d.usedBy.length > 0 && <div className="truncate">Used by: {d.usedBy.join(', ')}</div>}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
              {[
                { icon: Eye, label: 'Preview' }, { icon: Download, label: 'Download' }, { icon: Share2, label: 'Share' },
              ].map((a) => (
                <button key={a.label} title={a.label} aria-label={a.label} className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg py-2 transition-colors">
                  <a.icon className="w-3.5 h-3.5" /> {a.label}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <Card><EmptyState icon={<FolderOpen className="w-6 h-6" />} title="No documents here" body="Upload once — every service reuses your vault automatically." action={<button onClick={() => setUploadOpen(true)} className="text-primary-700 font-medium text-sm">Upload your first document →</button>} /></Card>
      )}

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload to your vault">
        <div className="space-y-4">
          <Field label="Document name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Auto-filled from the selected file" className={inputCls} /></Field>
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div
            className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center cursor-pointer hover:border-primary-300 transition-colors"
            onClick={() => fileInput.current?.click()}
            role="button" tabIndex={0} aria-label="Select a local file to upload"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click() }}
          >
            <Upload className="w-6 h-6 text-slate-300 mx-auto" />
            {file ? (
              <>
                <div className="text-sm font-medium text-slate-700 mt-2 truncate">{file.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{file.type || 'file'} · {Math.max(1, Math.round(file.size / 1024))} KB</div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInput.current) fileInput.current.value = '' }} className="mt-1.5 text-xs text-rose-600 font-medium">Remove file</button>
              </>
            ) : (
              <div className="text-sm text-slate-400 mt-2">Click to browse your device (processed locally, simulated upload)</div>
            )}
          </div>
          <input ref={fileInput} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} aria-hidden="true" />
          <button onClick={doUpload} className="w-full rounded-xl bg-primary-900 text-white font-medium py-3 text-sm hover:bg-primary-800">Add to vault</button>
          <p className="text-[11px] text-slate-400 text-center">Statuses are simulated: Uploaded → Pending Verification → Verified (Demo)</p>
        </div>
      </Modal>

      <DigiLockerModal open={dlOpen} onClose={() => setDlOpen(false)} />
    </div>
  )
}
