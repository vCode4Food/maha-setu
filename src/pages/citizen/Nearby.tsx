import { useCallback, useMemo, useState } from 'react'
import { MapPin, Phone, Clock, Search, Building, Hospital, Landmark, Store, TrainFront, Building2 } from 'lucide-react'
import { serviceCenters, districtStats } from '@/data/misc'
import type { DistrictStat } from '@/types'
import { MahaMap } from '@/components/interoperability/MahaMap'
import { Card, EmptyState, inputCls } from '@/components/ui/primitives'

const TYPE_ICON: Record<string, typeof Building> = {
  CSC: Store, 'District Office': Landmark, Hospital: Hospital, 'Transport Office': TrainFront,
  'Municipal Ward Office': Building2, 'Business Support Center': Building,
}

export default function CitizenNearby() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('All')
  const [districtId, setDistrictId] = useState('pune')
  const activeDistrict = districtStats.find((d) => d.id === districtId)
  const handleDistrict = useCallback((d: DistrictStat) => setDistrictId(d.id), [])
  const filtered = useMemo(() => serviceCenters.filter((c) => {
    if (activeDistrict && c.district !== activeDistrict.name) return false
    if (type !== 'All' && c.type !== type) return false
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false
    return true
  }), [activeDistrict, type, q])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Nearby Services</h1>
        <p className="text-slate-500 mt-1.5">Service centres {activeDistrict ? `in ${activeDistrict.name} district` : 'around Pune'} — timings, phone numbers and what they handle. Simulated directory.</p>
      </div>

      {/* Full-width map card, centre list below — horizontal flow */}
      <Card className="p-5">
        <MahaMap compact selectedId={districtId} onSelect={handleDistrict} />
        <p className="text-xs text-slate-400 mt-3">Select a district on the map to filter the centre list. Distances are simulated for the prototype.</p>
      </Card>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search centres…" className={`${inputCls} pl-9`} aria-label="Search centres" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls} aria-label="Centre type">
            {['All', 'CSC', 'District Office', 'Hospital', 'Transport Office', 'Municipal Ward Office', 'Business Support Center'].map((t) => <option key={t}>{t}</option>)}
          </select>
          {districtId !== 'pune' && (
            <button onClick={() => setDistrictId('pune')} className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-medium px-3.5 py-2 hover:bg-primary-100 transition-colors">
              <MapPin className="w-3.5 h-3.5" /> {activeDistrict?.name} · Clear
            </button>
          )}
          <span className="text-xs text-slate-400" aria-live="polite">{filtered.length} centre{filtered.length === 1 ? '' : 's'}</span>
        </div>
        {filtered.map((c) => {
          const Icon = TYPE_ICON[c.type] ?? Building
          return (
            <Card key={c.id} className="p-5 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 min-w-0">
                <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{c.type} · {c.district}</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {c.open}–{c.close}</span>
                    <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {c.phone}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {c.distanceKm} km away</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {c.services.map((s) => <span key={s} className="text-[11px] rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-500">{s}</span>)}
                  </div>
                </div>
              </div>
              <button className="text-sm font-medium text-primary-700 hover:text-primary-900 whitespace-nowrap">Directions →</button>
            </Card>
          )
        })}
        {filtered.length === 0 && <Card><EmptyState icon={<MapPin className="w-6 h-6" />} title="No centres match" /></Card>}
      </div>
    </div>
  )
}
