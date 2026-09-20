import { Link } from 'react-router-dom'

/**
 * Official MahaSetu brand lockup.
 *
 * Uses the official logo asset (mark + wordmark are baked into the uploaded
 * PNG; the "MahaSetu" name and tagline beside it stay editable text).
 * The asset has an opaque white background, so it sits in a white rounded
 * badge — which also keeps it legible on dark (navy) surfaces.
 *
 * variant:
 *  - icon    → official mark only
 *  - compact → mark + "MahaSetu" name
 *  - full    → mark + name + tagline
 */
const MARK_SRC = '/images/brand/mahasetu-mark.png'

export function MahaSetuBrand({
  variant = 'compact',
  showTagline,
  light = false,
  to,
  className = '',
}: {
  variant?: 'full' | 'compact' | 'icon'
  showTagline?: boolean
  /** White text for dark backgrounds (navy panels, footers). */
  light?: boolean
  /** Render as a link to this route (defaults to a plain block). */
  to?: string
  className?: string
}) {
  const taglineVisible = showTagline ?? variant === 'full'

  const mark = (
    <span
      className={`${variant === 'icon' ? 'w-9 h-9' : variant === 'compact' ? 'w-10 h-10' : 'w-11 h-11'} shrink-0 rounded-xl bg-white shadow-sm ring-1 ring-slate-900/10 flex items-center justify-center overflow-hidden`}
    >
      <img
        src={MARK_SRC}
        alt="MahaSetu logo"
        className="w-[82%] h-[82%] object-contain select-none"
        draggable={false}
        decoding="async"
      />
    </span>
  )

  if (variant === 'icon') {
    return to ? (
      <Link to={to} className={`inline-flex ${className}`} aria-label="MahaSetu home">{mark}</Link>
    ) : (
      <span className={`inline-flex ${className}`} aria-label="MahaSetu">{mark}</span>
    )
  }

  const text = (
    <span className="leading-none min-w-0">
      <span className={`block font-bold tracking-tight text-[17px] ${light ? 'text-white' : 'text-slate-900'}`}>
        Maha<span className="text-saffron-500">Setu</span>
      </span>
      {taglineVisible && (
        <span className={`block text-[10px] font-medium tracking-wide mt-0.5 whitespace-nowrap ${light ? 'text-white/70' : 'text-slate-400'}`}>
          Connecting Citizens | Empowering Maharashtra
        </span>
      )}
    </span>
  )

  const inner = (
    <>
      {mark}
      {text}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`flex items-center gap-2.5 group ${className}`} aria-label="MahaSetu home">
        {inner}
      </Link>
    )
  }
  return <div className={`flex items-center gap-2.5 ${className}`}>{inner}</div>
}
