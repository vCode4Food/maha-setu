import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, FileText, Landmark, HeartHandshake, FolderOpen, Building2, MessageSquareWarning, CornerDownLeft } from 'lucide-react'
import { services } from '@/data/services'
import { schemes } from '@/data/schemes'
import { departments } from '@/data/departments'
import { initialApplications as applications } from '@/data/applications'
import { initialDocuments } from '@/data/citizen'
import { initialGrievances } from '@/data/citizen'
import { Card, inputCls } from '@/components/ui/primitives'

interface Hit { icon: typeof FileText; label: string; sub: string; to: string; kind: string }

export default function GlobalSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  // The query lives in the URL (`/search?q=…`) so searches are deep-linkable —
  // e.g. the 404 page routes recoveries here with the user's term pre-filled.
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const navigate = useNavigate()

  const updateQ = (v: string) => {
    setQ(v)
    setSearchParams(v ? { q: v } : {}, { replace: true })
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate])

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase()
    if (!query) return []
    const out: Hit[] = []
    services.filter((s) => s.name.toLowerCase().includes(query)).slice(0, 5).forEach((s) =>
      out.push({ icon: FileText, label: s.name, sub: `Service · ${s.category}`, to: `/citizen/services/${s.id}`, kind: 'Service' }))
    schemes.filter((s) => s.name.toLowerCase().includes(query)).slice(0, 4).forEach((s) =>
      out.push({ icon: HeartHandshake, label: s.name, sub: `Scheme · ${s.benefit}`, to: '/citizen/schemes', kind: 'Scheme' }))
    departments.filter((d) => d.name.toLowerCase().includes(query)).slice(0, 4).forEach((d) =>
      out.push({ icon: Landmark, label: d.name, sub: `Department · ${d.domain}`, to: '/departments', kind: 'Department' }))
    applications.filter((a) => a.id.toLowerCase().includes(query) || a.citizenName?.toLowerCase().includes(query)).slice(0, 4).forEach((a) =>
      out.push({ icon: FolderOpen, label: `${a.serviceName} — ${a.id}`, sub: `Application · ${a.citizenName ?? ''}`, to: `/citizen/applications/${a.id}`, kind: 'Application' }))
    initialDocuments.filter((d) => d.name.toLowerCase().includes(query)).slice(0, 3).forEach((d) =>
      out.push({ icon: FolderOpen, label: d.name, sub: `Vault document · ${d.issuer}`, to: '/citizen/documents', kind: 'Document' }))
    initialGrievances.filter((g) => g.subject.toLowerCase().includes(query) || g.id.toLowerCase().includes(query)).slice(0, 3).forEach((g) =>
      out.push({ icon: MessageSquareWarning, label: g.subject, sub: `Grievance · ${g.id}`, to: '/citizen/grievances', kind: 'Grievance' }))
    return out.slice(0, 18)
  }, [q])

  return (
    <div className="min-h-screen bg-slate-950/30 backdrop-blur-sm p-4 sm:p-10" onClick={() => navigate(-1)}>
      <div className="max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <Card className="overflow-hidden shadow-pop">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              autoFocus
              value={q}
              onChange={(e) => updateQ(e.target.value)}
              placeholder="Search services, schemes, departments, applications, documents…"
              className="flex-1 text-[15px] outline-none placeholder:text-slate-400"
              aria-label="Global search"
            />
            <kbd className="text-[10px] bg-slate-100 border border-slate-200 rounded px-1.5 py-1 text-slate-400">ESC</kbd>
          </div>
          <div className="max-h-[55vh] overflow-y-auto scrollbar-thin">
            {!q && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                Type to search across the platform · Tip: try "income", "scholarship", "MS-2026"
              </div>
            )}
            {q && hits.length === 0 && <div className="px-5 py-8 text-center text-sm text-slate-400">No matches for "{q}"</div>}
            {hits.map((h, i) => (
              <button key={i} onClick={() => navigate(h.to)} className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-slate-50 text-left border-b border-slate-50">
                <span className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><h.icon className="w-4 h-4" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-slate-900 truncate">{h.label}</span>
                  <span className="block text-xs text-slate-400 truncate">{h.sub}</span>
                </span>
                <CornerDownLeft className="w-3.5 h-3.5 text-slate-300" />
              </button>
            ))}
          </div>
          <div className="px-5 py-2.5 bg-canvas text-[11px] text-slate-400 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> MahaSetu global search — prototype indexes local demo data only
          </div>
        </Card>
      </div>
    </div>
  )
}
