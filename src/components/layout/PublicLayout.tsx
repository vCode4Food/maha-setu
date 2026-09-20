import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, Search, LogIn, Languages, ShieldCheck, ArrowRight } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { roleMeta } from '@/data/users'

const LANGS = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' }, { code: 'ta', label: 'தமிழ்' }, { code: 'te', label: 'తెలుగు' },
  { code: 'gu', label: 'ગુજરાતી' }, { code: 'kn', label: 'ಕನ್ನಡ' },
]

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang] = useState('English')
  const { user } = useAuth()
  const navigate = useNavigate()
  void roleMeta

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Gov banner */}
      <div className="bg-primary-950 text-white/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-saffron-400" /> Government of Maharashtra — unified citizen services prototype</span>
          <span className="hidden md:flex items-center gap-2"><Languages className="w-3.5 h-3.5" /> {lang} · Screen reader access · A+ A- </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {[
                { to: '/services', label: 'Services' },
                { to: '/life-events', label: 'Life Events' },
                { to: '/schemes', label: 'Schemes' },
                { to: '/departments', label: 'Departments' },
                { to: '/news', label: 'Updates' },
                { to: '/platform', label: 'Platform' },
                { to: '/track', label: 'Track' },
              ].map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'text-primary-800 bg-primary-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/services" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500" aria-label="Search services">
              <Search className="w-5 h-5" />
            </Link>
            {user ? (
              <Button to={roleMeta[user.role].home} size="sm" variant="primary">Open my portal</Button>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl bg-primary-900 text-white hover:bg-primary-800">
                  Login <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="sm:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600" aria-label="Login">
                  <LogIn className="w-5 h-5" />
                </Link>
              </>
            )}
            <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="lg:hidden border-t border-slate-100 px-4 py-3 flex flex-col gap-1 bg-white" aria-label="Mobile">
            {['Services', 'Life Events', 'Schemes', 'Departments', 'Updates', 'Track'].map((l) => (
              <Link key={l} to={`/${l.toLowerCase().replace(' ', '-')}`} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-slate-700 font-medium hover:bg-slate-50">
                {l}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-primary-950 text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
          <div>
            <Logo light />
            <p className="text-sm mt-4 leading-relaxed max-w-xs">
              The digital bridge between citizens, businesses and the government ecosystem — one identity, one platform, every department.
            </p>
            <div className="tricolor-bar h-1 w-24 rounded-full mt-5 opacity-80" />
          </div>
          {[
            { h: 'Platform', links: ['About MahaSetu', 'Services', 'Departments', 'Schemes', 'Government Updates'] },
            { h: 'Support', links: ['Help Centre', 'Citizen Support: 1800-XXX-XXXX', 'Accessibility', 'Contact'] },
            { h: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Data Consent Charter', 'Accessibility Statement'] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.h}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => <li key={l}><span className="hover:text-white cursor-pointer">{l}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-xs flex flex-wrap items-center justify-between gap-2">
            <span>© 2026 MahaSetu · Prototype — Demonstration Environment</span>
            <span>Not connected to any live government system. All data is simulated.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
