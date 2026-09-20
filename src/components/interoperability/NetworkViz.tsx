import { useState } from 'react'
import { departments, healthTone } from '@/data/departments'
import { Modal, StatusBadge } from '@/components/ui/primitives'

/** Animated network: MahaSetu hub connecting all departments. */
export function NetworkViz({ compact }: { compact?: boolean }) {
  const [selected, setSelected] = useState<string | null>(null)
  const dept = departments.find((d) => d.id === selected)
  const shown = compact ? departments.slice(0, 8) : departments

  const w = compact ? 720 : 760
  const h = compact ? 320 : 380
  const cx = w / 2
  const cy = h / 2

  const nodes = shown.map((d, i) => {
    const angle = (i / shown.length) * Math.PI * 2 - Math.PI / 2
    const rx = w * (compact ? 0.36 : 0.38)
    const ry = h * 0.34
    return { d, x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry }
  })

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="MahaSetu interoperability network">
        <defs>
          <radialGradient id="hub" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#2b5799" />
            <stop offset="100%" stopColor="#12294a" />
          </radialGradient>
        </defs>
        {/* links */}
        {nodes.map(({ d, x, y }) => (
          <g key={d.id}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={d.color} strokeOpacity="0.25" strokeWidth="1.5" className="flow-line" />
            <circle cx={x} cy={y} r="26" fill="#fff" stroke={d.color} strokeWidth="2" className="cursor-pointer hover:opacity-80" onClick={() => setSelected(d.id)} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155" className="cursor-pointer select-none" onClick={() => setSelected(d.id)}>
              {d.shortName.length > 12 ? d.shortName.slice(0, 11) + '…' : d.shortName}
            </text>
            <circle cx={x + 18} cy={y - 18} r="5" fill={healthTone[d.status].dot.includes('emerald') ? '#10b981' : healthTone[d.status].dot.includes('sky') ? '#0ea5e9' : healthTone[d.status].dot.includes('amber') ? '#f59e0b' : '#f43f5e'}>
              {d.status === 'syncing' && <animate attributeName="opacity" values="1;.3;1" dur="1.2s" repeatCount="indefinite" />}
            </circle>
          </g>
        ))}
        {/* hub */}
        <circle cx={cx} cy={cy} r={compact ? 42 : 48} fill="url(#hub)" />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">MAHASETU</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="8" fill="#93c5fd">INTEROPERABILITY LAYER</text>
        {/* pulses */}
        {!compact && (
          <>
            <circle cx={cx} cy={cy} r="48" fill="none" stroke="#2b5799" strokeWidth="1.5" className="animate-pingSoft origin-center" style={{ transformBox: 'fill-box' }} />
          </>
        )}
      </svg>
      <div className="absolute bottom-2 right-3 text-[10px] text-slate-400 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> healthy
        <span className="w-2 h-2 rounded-full bg-sky-500 inline-block ml-2" /> syncing
        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-2" /> warning
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={dept?.name}>
        {dept && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={dept.status} />
              <span className="text-sm text-slate-500">Last sync {dept.lastSync}</span>
            </div>
            <p className="text-sm text-slate-600">{dept.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Services', String(dept.servicesCount)], ['Requests (24h)', dept.requests24h.toLocaleString('en-IN')],
                ['Avg response', `${dept.responseMs} ms`], ['Data exchanged', dept.dataExchanged],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-canvas p-3">
                  <div className="text-xs text-slate-400">{k}</div>
                  <div className="font-semibold text-slate-800">{v}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Active workflows</div>
              <div className="text-sm text-slate-600 space-y-1">
                <div>• Certificates pipeline — {Math.floor(dept.requests24h / 380)} live requests</div>
                <div>• Scheme verification sync — hourly</div>
                <div>• Grievance routing — real-time</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
