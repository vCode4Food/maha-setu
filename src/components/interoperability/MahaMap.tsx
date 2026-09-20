import { memo, useState } from 'react'
import { MapPin, Activity, Building2, Users } from 'lucide-react'
import { districtStats } from '@/data/misc'
import type { DistrictStat } from '@/types'

/** Rough centroid of a polygon path's numeric points, for label placement. */
function centroid(path: string): [number, number] {
  const nums = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
  const xs: number[] = [], ys: number[] = []
  nums.forEach((n, i) => (i % 2 === 0 ? xs : ys).push(n))
  const avg = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0)
  return [avg(xs), avg(ys)]
}

/**
 * Stylized, interactive Maharashtra district map (frontend simulation,
 * not geographically exact). Districts are clickable with a stats panel.
 */
export const MahaMap = memo(function MahaMap({ onSelect, selectedId, compact }: {
  onSelect?: (d: DistrictStat) => void
  selectedId?: string
  compact?: boolean
}) {
  const [localSel, setLocalSel] = useState<string | null>('pune')
  // Controlled when the parent passes selectedId — uncontrolled otherwise (defaults to Pune).
  const sel = selectedId !== undefined ? selectedId : localSel
  const setSel = (id: string) => {
    setLocalSel(id)
    const d = districtStats.find((x) => x.id === id)
    if (d && onSelect) onSelect(d)
  }
  const activeDistrict = districtStats.find((d) => d.id === sel)

  return (
    <div className="space-y-4">
      {/* Map — full width so districts stay readable at every size */}
      <div className="relative">
        <svg viewBox="0 0 620 430" className="w-full" role="img" aria-label="Stylized map of Maharashtra showing platform activity by district">
          <defs>
            <pattern id="mahagrid" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M 26 0 L 0 0 0 26" fill="none" stroke="#e2e8f0" strokeWidth="0.6" />
            </pattern>
            <linearGradient id="mahasel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e4478" />
              <stop offset="100%" stopColor="#12294a" />
            </linearGradient>
          </defs>
          <rect width="620" height="430" fill="url(#mahagrid)" opacity="0.5" />
          {/* Arabian Sea hint */}
          <text x="34" y="250" fontSize="11" fill="#94a3b8" fontStyle="italic" className="select-none">Arabian Sea</text>
          {districtStats.map((d) => {
            const active = sel === d.id
            const [cx, cy] = centroid(d.path)
            return (
              <g key={d.id} onClick={() => setSel(d.id)} className="cursor-pointer" role="button" aria-label={`${d.name} district`}>
                <path
                  d={d.path}
                  fill={active ? 'url(#mahasel)' : d.load > 85 ? '#b9d2ee' : d.load > 75 ? '#c7dcf3' : '#dbe8f7'}
                  stroke={active ? '#f97316' : '#94a3b8'}
                  strokeWidth={active ? 2.5 : 1.2}
                  className="transition-colors"
                />
                <text
                  x={cx} y={cy} textAnchor="middle"
                  fontSize={compact ? 10 : 11.5}
                  fontWeight="600"
                  fill={active ? '#fff' : '#334155'}
                  className="pointer-events-none select-none"
                >
                  {d.name}
                </text>
              </g>
            )
          })}
          {/* Activity pulses — compositor-friendly CSS (see index.css); paused for reduced motion */}
          {districtStats.map((d) => {
            const [cx, cy] = centroid(d.path)
            return <circle key={d.id + '-dot'} className="map-pulse" cx={cx + 42} cy={cy - 16} r="3" fill="#f97316" />
          })}
        </svg>
        <div className="text-[10px] text-slate-400 mt-1">Illustrative visualization — district shapes are stylised, not geographically exact. Does not imply real-time availability.</div>
      </div>

      {/* District strip — horizontal, flows left to right under the map */}
      {activeDistrict && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-saffron-600" />
              <h3 className="font-bold text-slate-900">{activeDistrict.name}</h3>
            </div>
            <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-1 ${activeDistrict.load > 85 ? 'bg-rose-50 text-rose-600' : activeDistrict.load > 75 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {activeDistrict.load > 85 ? 'High load' : activeDistrict.load > 75 ? 'Moderate' : 'Normal'}
            </span>
            <span className="text-xs text-slate-400">Simulated district snapshot</span>
          </div>
          {/* Stats in one horizontal row */}
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm">
            <div className="rounded-xl bg-canvas border border-slate-100 p-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Users className="w-4 h-4" /></span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 leading-tight">{activeDistrict.populationServed}</div>
                <div className="text-[10px] text-slate-400 leading-snug">Citizens served</div>
              </div>
            </div>
            <div className="rounded-xl bg-canvas border border-slate-100 p-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0"><Activity className="w-4 h-4" /></span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 leading-tight">{activeDistrict.applications.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-400 leading-snug">Applications</div>
              </div>
            </div>
            <div className="rounded-xl bg-canvas border border-slate-100 p-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4" /></span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 leading-tight">{activeDistrict.services}</div>
                <div className="text-[10px] text-slate-400 leading-snug">Live services</div>
              </div>
            </div>
            <div className="rounded-xl bg-canvas border border-slate-100 p-3 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-saffron-50 text-saffron-600 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4" /></span>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 leading-tight">{activeDistrict.centers}</div>
                <div className="text-[10px] text-slate-400 leading-snug">Seva Kendras</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
