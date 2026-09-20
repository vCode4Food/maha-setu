import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Compass, FileText, Home, LayoutDashboard, ArrowLeft, Landmark, GraduationCap, Baby, Search, CornerDownLeft } from 'lucide-react'
import { MahaSetuBrand } from '@/components/branding/MahaSetuBrand'
import { PathSuggestions } from '@/components/audit/PathSuggestions'
import { useAuth } from '@/context/AuthContext'
import { recordRouteEvent } from '@/features/audit/routeAudit'

const ROLE_HOME: Record<string, string> = {
  citizen: '/citizen',
  official: '/official',
  business: '/business',
  department_admin: '/department-admin',
  super_admin: '/admin',
}

/** Branded 404 — helps the visitor recover and logs the hit to the route audit trail. */
export default function NotFound() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const home = ROLE_HOME[user?.role ?? 'citizen']

  // One audit entry per 404 path, even under StrictMode double-invoke or re-renders.
  const logged = useRef<string | null>(null)
  useEffect(() => {
    if (logged.current !== location.pathname) {
      logged.current = location.pathname
      recordRouteEvent('404', location.pathname, user?.role ?? null, user?.id ?? null)
    }
  }, [location.pathname, user?.role, user?.id])

  const suggestions = [
    { to: '/services', icon: Landmark, label: 'Browse all services', hint: '100+ services across departments' },
    { to: '/life-events', icon: Baby, label: 'Life event guidance', hint: 'Tell us what is happening in your life' },
    { to: '/schemes', icon: GraduationCap, label: 'Government schemes', hint: 'Find what you may be eligible for' },
    { to: '/track', icon: FileText, label: 'Track an application', hint: 'Status of anything you have submitted' },
  ]

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <header className="border-b border-slate-200 bg-white/90">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <MahaSetuBrand variant="compact" />
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-800 inline-flex items-center gap-1.5">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-14">
        <div className="w-full max-w-2xl">
          <div className="text-center">
            {/* Stylized 404 with a saffron bridge accent */}
            <div className="relative inline-block">
              <div className="text-[96px] leading-none font-black tracking-tight text-slate-200 select-none">404</div>
              <svg className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40" viewBox="0 0 160 18" fill="none" aria-hidden="true">
                <path d="M4 14 Q80 -8 156 14" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="80" cy="3.5" r="3" fill="#1e3a8a" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-6">This page took a wrong turn</h1>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto text-[15px]">
              We couldn't find <span className="font-mono text-[13px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 break-all">{location.pathname}</span>.
              It may have moved, or the link may be incorrect. The rest of MahaSetu is one click away.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {user ? (
                <Link
                  to={home}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-semibold px-5 py-3 text-sm hover:bg-primary-800 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to my dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-semibold px-5 py-3 text-sm hover:bg-primary-800 transition-colors"
                >
                  Login with Maha ID
                </Link>
              )}
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium px-5 py-3 text-sm hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to homepage
              </Link>
            </div>
          </div>

          <div className="mt-12">
            {/* Search-first recovery: routes into the global search with the term pre-filled. */}
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault()
                const q = term.trim()
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
              }}
              className="relative"
              role="search"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for the service you were looking for…"
                className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-24 text-[15px] text-slate-800 placeholder:text-slate-400 shadow-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-shadow"
                aria-label="Search MahaSetu"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-xl bg-primary-900 text-white font-semibold px-4 py-2 text-sm hover:bg-primary-800 transition-colors"
              >
                Search <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </form>

            <PathSuggestions pathname={location.pathname} search={location.search} />

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mt-8 mb-4">
              <Compass className="w-4 h-4 text-saffron-500" /> Popular destinations
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {suggestions.map(({ to, icon: Icon, label, hint }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-start gap-3.5 rounded-2xl bg-white border border-slate-200 p-4 hover:border-primary-300 hover:shadow-pop transition-all"
                >
                  <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-800 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-800 text-sm">{label}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{hint}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">
        MahaSetu · Connecting Citizens | Empowering Maharashtra
      </footer>
    </div>
  )
}
