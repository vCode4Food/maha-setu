import { useState } from 'react'

/** Image with skeleton loading + graceful fallback so layouts never break. */
export function SmartImage({ src, alt, className = '', fallbackTone = '#12294a' }: {
  src?: string
  alt: string
  className?: string
  fallbackTone?: string
}) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>(src ? 'loading' : 'error')
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {state === 'loading' && <div className="absolute inset-0 skeleton" />}
      {state === 'error' ? (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: fallbackTone }}>
          <svg viewBox="0 0 64 64" className="w-1/3 h-1/3 opacity-40" fill="none" stroke="#fff" strokeWidth="3">
            <path d="M10 46 Q32 14 54 46" strokeLinecap="round" />
            <circle cx="10" cy="46" r="4" fill="#f97316" stroke="none" />
            <circle cx="54" cy="46" r="4" fill="#16a34a" stroke="none" />
          </svg>          </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
        />
      )}
    </div>
  )
}
