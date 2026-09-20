import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, ChevronDown, LogOut, Menu, X,
  ShieldCheck,
} from 'lucide-react'
import { MahaSetuBrand } from '@/components/branding/MahaSetuBrand'
import { useAuth } from '@/context/AuthContext'
import { useApp } from '@/context/AppContext'
import { roleMeta } from '@/data/users'
import type { User } from '@/types'

export interface NavItem { to: string; label: string; icon: ReactNode; badge?: number }

const LANGS = ['English', 'हिन्दी', 'मराठी', 'বাংলা', 'தமிழ்', 'తెలుగు', 'ગુજરાતી', 'ಕನ್ನಡ']

export function SidebarLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive ? 'bg-primary-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="flex-1 truncate">{item.label}</span>
      {typeof item.badge === 'number' && item.badge > 0 && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-saffron-500 text-white text-[11px] font-bold flex items-center justify-center">{item.badge}</span>
      )}
    </NavLink>
  )
}

export function PortalShell({ nav, children, mobileTitle }: { nav: NavItem[]; children: ReactNode; mobileTitle?: string }) {
  const [mobileNav, setMobileNav] = useState(false)
  const [lang, setLang] = useState('English')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { user, logout, session } = useAuth()
  const { notifications, markNotifRead, markAllRead, role } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => { setMobileNav(false) }, [location.pathname])

  const unread = notifications.filter((n) => n.audience.includes(role) && !n.read)
  const myNotifs = notifications.filter((n) => n.audience.includes(role)).slice(0, 10)

  return (
    <div className="min-h-screen bg-canvas">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
          <button className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-600" onClick={() => setMobileNav(true)} aria-label="Open navigation">
            <Menu className="w-6 h-6" />
          </button>
          <MahaSetuBrand variant="compact" to="/" />
          <button
            onClick={() => navigate('/search')}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm text-slate-400"
            aria-label="Open global search (Ctrl+K)"
          >
            <Search className="w-4 h-4" /> Search MahaSetu…
            <kbd className="ml-auto text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400">Ctrl K</kbd>
          </button>
          <div className="flex-1 md:hidden" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="hidden sm:block text-sm rounded-xl border border-slate-200 bg-white px-2 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Select language"
          >
            {LANGS.map((l) => <option key={l}>{l}</option>)}
          </select>
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotifOpen((o) => !o)} className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              {unread.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-saffron-500 text-white text-[10px] font-bold flex items-center justify-center">{unread.length}</span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-[min(92vw,380px)] bg-white rounded-2xl shadow-pop border border-slate-200 z-[70] overflow-hidden animate-fadeUp">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    {unread.length > 0 && <button onClick={markAllRead} className="text-xs text-primary-600 font-medium">Mark all read</button>}
                  </div>
                  <div className="max-h-[380px] overflow-y-auto scrollbar-thin divide-y divide-slate-100">
                    {myNotifs.length === 0 && <div className="px-4 py-8 text-center text-sm text-slate-400">You're all caught up.</div>}
                    {myNotifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => { markNotifRead(n.id); setNotifOpen(false); if (n.link) navigate(n.link) }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3 ${!n.read ? 'bg-primary-50/40' : ''}`}
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-slate-200' : 'bg-saffron-500'}`} />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-slate-900">{n.title}</span>
                          <span className="block text-xs text-slate-500 mt-0.5">{n.body}</span>
                          <span className="block text-[11px] text-slate-400 mt-1">{n.time}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Profile */}
          <div className="relative">
            <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100" aria-haspopup="menu" aria-expanded={profileOpen}>
              <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center uppercase">
                {user?.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <span className="hidden md:block text-left">
                <span className="block text-xs font-semibold text-slate-800 leading-tight">{user?.name}</span>
                <span className="block text-[10px] text-slate-400 leading-tight">{roleMeta[user!.role].label}</span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>
            {profileOpen && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-pop border border-slate-200 z-[70] p-2 animate-fadeUp">
                  <div className="px-3 py-2.5">
                    <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                    <div className="text-xs text-slate-400">{roleMeta[user!.role].label}{user?.designation ? ` · ${user.designation}` : ''}</div>
                  </div>
                  {/* Active session (simulated) */}
                  {session && (
                    <div className="mx-1 mb-1 rounded-xl bg-canvas border border-slate-100 p-3 text-[11px] text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-700"><ShieldCheck className="w-3.5 h-3.5" /> Active Session</div>
                      <div>Maha ID: <span className="font-mono text-slate-700">{session.mahaId}</span></div>
                      <div>Last login: {session.loginAt}</div>
                      <div>Session expires in <span className="font-semibold text-slate-700">{Math.max(0, Math.round((session.expiresAt - Date.now()) / 60000))} min</span></div>
                      <div className="text-[10px] text-slate-400">Simulated session · logout clears it</div>
                    </div>
                  )}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button onClick={() => { setProfileOpen(false); navigate(roleMeta[role].home + 'profile'.replace('profile', 'profile')) }} className="hidden" aria-hidden>noop</button>
                    <button onClick={logout} className="w-full text-left px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 inline-flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin">
          <nav className="p-3 space-y-1 flex-1" aria-label="Portal">
            {nav.map((item) => <SidebarLink key={item.to} item={item} />)}
          </nav>
          <div className="p-3 border-t border-slate-100">
            <div className="rounded-xl bg-canvas p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Demo Mode — simulated data
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileNav && (
          <div className="fixed inset-0 z-[65] lg:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-slate-950/40" onClick={() => setMobileNav(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-pop flex flex-col">
              <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
                <MahaSetuBrand variant="compact" />
                <button onClick={() => setMobileNav(false)} aria-label="Close navigation" className="p-2 rounded-xl hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-3 space-y-1 overflow-y-auto flex-1" aria-label="Portal mobile">
                {nav.map((item) => <SidebarLink key={item.to} item={item} onNavigate={() => setMobileNav(false)} />)}
              </nav>
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px]">
          {mobileTitle && <h1 className="lg:hidden text-xl font-bold text-slate-900 mb-4">{mobileTitle}</h1>}
          {children}
        </main>
      </div>
    </div>
  )
}

export type { User }
