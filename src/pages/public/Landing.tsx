import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Sparkles, ShieldCheck, Landmark, Baby, Heart, Store, GraduationCap,
  Wheat, Home, Briefcase, HeartPulse, HandCoins, Armchair, Server, FileText, MapPin,
  CheckCircle2, Clock, IndianRupee, Users, Network, Database,
} from 'lucide-react'
import { SmartImage } from '@/components/ui/SmartImage'
import { images } from '@/data/images'
import { popularServices, serviceById } from '@/data/services'
import { departmentById } from '@/data/departments'
import { schemes } from '@/data/schemes'
import { initialLifeEvents, initialNews } from '@/data/misc'
import { NetworkViz } from '@/components/interoperability/NetworkViz'
import { MahaMap } from '@/components/interoperability/MahaMap'
import { GistCard } from '@/components/ui/widgets'
import { Counter } from '@/components/ui/widgets'
import { Card } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { roleMeta } from '@/data/users'
import type { Role } from '@/types'

const ICONS: Record<string, typeof Baby> = {
  Baby, Heart, Store, GraduationCap, Wheat, Home, Briefcase, HeartPulse, HandCoins, Armchair,
}

const EVENT_CHIPS = ['I had a baby', 'I am getting married', 'I am moving', 'I am starting a business', 'I am looking for a job', 'I am a student', 'I need healthcare', 'I am a senior citizen', 'I am a farmer', 'I need financial assistance']

export default function Landing() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/services?q=${encodeURIComponent(q)}`)
  }

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative bg-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: `url(${images.hero})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950 via-primary-950/85 to-primary-900/40" />
        <div className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full bg-primary-600/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/90 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              36 departments live on the network · Prototype demonstration
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold tracking-tight leading-[1.08]">
              Your Government.<br />
              <span className="text-saffron-400">Connected</span> through MahaSetu.
            </h1>
            <p className="mt-5 text-lg text-white/75 leading-relaxed max-w-xl">
              One intelligent platform connecting citizens, businesses and government departments for simpler, faster and more transparent public services.
            </p>

            {/* Service search */}
            <form onSubmit={submitSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What government service do you need?"
                  className="w-full rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 pl-12 pr-4 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-saffron-400 shadow-pop"
                  aria-label="Search government services"
                />
              </div>
              <button type="submit" className="rounded-2xl bg-saffron-500 hover:bg-saffron-600 text-white font-semibold px-7 py-4 text-[15px] transition-colors">
                Find a Service
              </button>
            </form>
            <div className="mt-3 text-xs text-white/50">Try: Birth Certificate · Driving Licence · Income Certificate · Scholarship · Pension · Business Registration</div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(user ? roleMeta[user.role].home : '/login')}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-primary-900 font-semibold px-5 py-3 text-sm hover:bg-blue-50 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-saffron-500" /> Ask MahaSetu Sahayak
              </button>
              {!user && (
                <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-white/25 text-white font-semibold px-5 py-3 text-sm hover:bg-white/10 transition-colors">
                  Login / Create Account
                </Link>
              )}
              <Link to="/schemes" className="inline-flex items-center gap-2 rounded-xl border border-white/25 text-white font-semibold px-5 py-3 text-sm hover:bg-white/10 transition-colors">
                Explore Schemes
              </Link>
              <Link to="/track" className="inline-flex items-center gap-2 rounded-xl text-white/80 font-medium px-5 py-3 text-sm hover:bg-white/10 transition-colors">
                Track Application →
              </Link>
            </div>
          </div>

          {/* Hero visual: live interoperability mock */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-tr from-saffron-500/10 to-emerald-400/10 rounded-[2rem] blur-xl" />
            <Card className="relative bg-white/95 backdrop-blur p-5 border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-slate-800">Live on the network</div>
                <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">SIMULATED FEED</span>
              </div>
              <NetworkViz compact />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[['6.1 Cr+', 'Citizens'], ['850+', 'Services'], ['96%', 'Digital']].map(([v, l]) => (
                  <div key={l} className="rounded-xl bg-canvas py-2.5">
                    <div className="font-bold text-primary-900">{v}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide">{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        <div className="relative tricolor-bar h-1.5" />
      </section>

      {/* ============ PROBLEM → SOLUTION ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* The problem */}
          <Card className="p-7 border-rose-100 bg-rose-50/30">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1">The Problem</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-4 tracking-tight">Fragmented governance</h2>
            <p className="text-sm text-slate-500 mt-1.5">Multiple portals. Multiple logins. Repeated verification. A confusing experience for every citizen.</p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {['Multiple logins', 'Repeated verification', 'Duplicate data', 'Time consuming', 'Fragmented services', 'Missed benefits'].map((p) => (
                <div key={p} className="rounded-xl bg-white border border-rose-100 px-3.5 py-2.5 text-sm text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" /> {p}
                </div>
              ))}
            </div>
            <p className="text-xs text-rose-700 font-medium mt-4">A more connected government experience is needed.</p>
          </Card>
          {/* The solution */}
          <Card className="p-7 border-emerald-100 bg-emerald-50/30">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1">The MahaSetu Vision</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-4 tracking-tight">One Identity → One Gateway → Many Services</h2>
            <p className="text-sm text-slate-500 mt-1.5">A unified citizen service platform for a smarter, simpler and more connected Maharashtra.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 rounded-2xl bg-white border border-emerald-100 p-4 text-center">
                <ShieldCheck className="w-6 h-6 text-primary-700 mx-auto" />
                <div className="text-sm font-bold text-slate-900 mt-2">One MahaSetu ID</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Single sign-on (MeriPehchaan concept)</div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1 rounded-2xl bg-white border border-emerald-100 p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-slate-900 mt-2">Access all services</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Anytime · Anywhere · Your language</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
              {[['Simpler access', 'Zap'], ['More inclusion', 'Users'], ['A stronger Maharashtra', 'TrendingUp']].map(([l]) => (
                <div key={l} className="rounded-xl bg-white border border-emerald-100 px-2 py-2.5 text-[11px] font-medium text-slate-600">{l}</div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ============ CITIZEN JOURNEY (8 STEPS) ============ */}
      <section className="bg-canvas border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Citizen Journey</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">From need to service — seamlessly</h2>
            </div>
            <span className="text-xs font-medium text-slate-400">A simpler, faster and hassle-free experience for every citizen.</span>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: 1, t: 'Login', d: 'One MahaSetu ID for all services (OTP / PIN demo)', tag: 'One identity' },
              { n: 2, t: 'Discover Service', d: 'Search or get Sahayak AI recommendations', tag: 'Found in seconds' },
              { n: 3, t: 'Check Eligibility', d: 'Instant check based on your demo profile', tag: 'Personalized guidance' },
              { n: 4, t: 'Auto-filled Form', d: 'Your data, pre-filled (with consent)', tag: 'Fewer errors' },
              { n: 5, t: 'Give Consent', d: 'Share data securely — you stay in control', tag: 'You own your data' },
              { n: 6, t: 'Apply', d: 'Submit online, anytime, anywhere', tag: 'No office visits' },
              { n: 7, t: 'Track', d: 'Real-time timeline & notifications', tag: 'Always informed' },
              { n: 8, t: 'Receive Service', d: 'Download your certificate or benefit', tag: 'Service delivered' },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-slate-200 bg-white p-5 hover:border-primary-300 hover:shadow-glow transition-all">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary-900 text-white text-sm font-bold flex items-center justify-center shrink-0">{s.n}</span>
                  <h3 className="font-semibold text-slate-900 text-sm">{s.t}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">{s.d}</p>
                <div className="mt-3 inline-flex text-[10px] font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">{s.tag}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-primary-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium">
            <span>Empowered Citizens</span><span className="text-white/30">|</span>
            <span>Transparent Governance</span><span className="text-white/30">|</span>
            <span>A Stronger Maharashtra</span>
          </div>
        </div>
      </section>

      {/* ============ POPULAR SERVICES ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Discover</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Popular services</h2>
            <p className="text-slate-500 mt-2 max-w-xl">The most-used services across departments — searchable, trackable, and delivered to your document vault.</p>
          </div>
          <Link to="/services" className="text-sm font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1">
            All 850+ services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularServices.map((s) => (
            <Link key={s.id} to={`/services/${s.id}`} className="group">
              <Card className="p-5 h-full group-hover:shadow-glow group-hover:border-primary-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 group-hover:text-primary-800">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{departmentById(s.departmentId)?.shortName}</p>
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> {s.processingTime}
                  <span className="text-slate-300">•</span>
                  <IndianRupee className="w-3.5 h-3.5" /> {s.fee === 0 ? 'Free' : s.fee}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ LIFE EVENTS ============ */}
      <section className="bg-canvas border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Life Events</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Tell us what is happening in your life.</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">You don't need to know which department does what. Pick your situation — MahaSetu identifies every registration, licence, scheme and document, then coordinates the departments for you.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {initialLifeEvents.slice(0, 10).map((ev) => {
              const Icon = ICONS[ev.icon] ?? Baby
              return (
                <Link key={ev.id} to={`/life-events/${ev.id}`} className="group">
                  <Card className="p-5 h-full group-hover:shadow-glow group-hover:border-primary-200 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron-600 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900 text-[15px] group-hover:text-primary-800">{ev.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ev.tagline}</p>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ AI SECTION ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Understand</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">MahaSetu Sahayak — answers, not runarounds</h2>
            <p className="text-slate-500 mt-3 leading-relaxed">Ask in plain language. The assistant reads your applications, vault and consents to answer with what's true for <em>you</em> — and hands you to the right place in one tap.</p>
            <div className="mt-6 space-y-3">
              {[
                'What schemes am I eligible for?',
                'I want to start a business.',
                'Why is my application pending?',
                'What documents do I need for a scholarship?',
              ].map((p) => (
                <div key={p} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <Sparkles className="w-4 h-4 text-primary-600 shrink-0" /> {p}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button to="/login" variant="primary">Try the assistant</Button>
              <Button to="/services" variant="outline">Browse services</Button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <Card className="overflow-hidden">
              <div className="bg-primary-900 text-white px-5 py-3.5 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-saffron-400" />
                <span className="font-semibold text-sm">MahaSetu Sahayak</span>
                <span className="ml-auto text-[10px] bg-white/10 rounded-full px-2 py-0.5">Demo</span>
              </div>
              <div className="p-5 space-y-3 bg-canvas">
                <div className="flex justify-end"><div className="bg-primary-900 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[80%]">I want to start a business.</div></div>
                <div className="flex justify-start"><div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[88%] text-slate-700">
                  Starting a business needs 5 registrations across 4 departments — Business Registration, Trade Licence, GST, labour and local approvals. One application; MahaSetu coordinates everything in parallel.
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded-lg px-2.5 py-1.5">Open the guided journey →</div>
                </div></div>
                <div className="flex justify-end"><div className="bg-primary-900 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm max-w-[80%]">What schemes am I eligible for?</div></div>
                <div className="flex justify-start"><div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 text-sm max-w-[88%] text-slate-700">
                  Based on your profile: MahaStartup Seed Support (up to ₹10L), MSME Modernisation (15–25% subsidy), Mahila Samruddhi (₹25,000 + training). Eligibility checks use only your vault — demo simulation.
                </div></div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ MAP / AVAILABILITY ============ */}
      <section className="bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-saffron-400 mb-2">Government of Maharashtra · Digital Public Infrastructure</div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Service availability across Maharashtra</h2>
            <p className="text-white/70 mt-3 leading-relaxed">Districts across the state plug into the same interoperability layer — from Mumbai to Gadchiroli. Select a district to see simulated platform activity.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
              {[['6.1 Cr+', 'Citizens connected'], ['36', 'Departments connected'], ['850+', 'Services indexed'], ['96%', 'Digital processing']].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-2xl font-bold text-saffron-400">{v}</div>
                  <div className="text-xs text-white/60 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* White card wrapper — matches the Citizen Dashboard Nearby widget */}
          <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-2xl ring-1 ring-black/10">
            <MahaMap compact />
          </div>
        </div>
      </section>

      {/* ============ SCHEMES ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Benefits</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Government schemes, made findable</h2>
            <p className="text-slate-500 mt-2 max-w-xl">Every scheme with honest eligibility, plain-language Gist summaries and one-tap applications.</p>
          </div>
          <Link to="/schemes" className="text-sm font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1">All schemes <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {schemes.slice(0, 3).map((sc) => (
            <Card key={sc.id} className="overflow-hidden group">
              <SmartImage src={sc.image} alt={sc.name} className="h-40" />
              <div className="p-5">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-saffron-600">{departmentById(sc.departmentId)?.shortName}</div>
                <h3 className="font-semibold text-slate-900 mt-1 group-hover:text-primary-800">{sc.name}</h3>
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{sc.benefit}</p>
                <Link to="/schemes" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-900">View details <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ============ INTEROPERABILITY ============ */}
      <section className="bg-canvas border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">The Bridge</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight max-w-2xl">One request in. Every department coordinated.</h2>
          <p className="text-slate-500 mt-2 max-w-2xl">MahaSetu sits between you and the government — identity here, documents here, departments coordinated here. You track one timeline; the platform does the running around.</p>
          <div className="mt-8 grid lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-card p-5">
              <NetworkViz />
            </div>
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: <Users className="w-5 h-5" />, t: 'Citizen asks once', d: 'One identity, one application — no repeated office visits.' },
                { icon: <Network className="w-5 h-5" />, t: 'MahaSetu orchestrates', d: 'Identity, revenue, municipal, tax and labour checks run in parallel.' },
                { icon: <Server className="w-5 h-5" />, t: 'Departments respond', d: 'Each response is timestamped, audited and tracked on your timeline.' },
                { icon: <Database className="w-5 h-5" />, t: 'Outcome delivered', d: 'Certificates and approvals land straight in your document vault.' },
              ].map((s) => (
                <div key={s.t} className="flex gap-4 bg-white rounded-2xl border border-slate-200 shadow-card p-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">{s.icon}</div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{s.t}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Updates</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Government updates</h2>
          </div>
          <Link to="/news" className="text-sm font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1">All updates <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {initialNews.slice(0, 3).map((n) => (
            <Card key={n.id} className="p-5 flex flex-col">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className={`font-semibold uppercase tracking-wide ${n.category === 'Breaking' ? 'text-rose-600' : 'text-saffron-600'}`}>{n.category}</span>
                · {n.date} · {departmentById(n.departmentId)?.shortName}
              </div>
              <h3 className="font-semibold text-slate-900 mt-2">{n.title}</h3>
              <p className="text-sm text-slate-500 mt-2 flex-1">{n.excerpt}</p>
              {n.gist && <div className="mt-4"><GistCard data={n.gist} compact /></div>}
            </Card>
          ))}
        </div>
      </section>

      {/* ============ DEPARTMENTS DIRECTORY ============ */}
      <section className="bg-canvas border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Directory</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Departments on the network</h2>
            </div>
            <Link to="/departments" className="text-sm font-semibold text-primary-700 hover:text-primary-900 inline-flex items-center gap-1">Full directory <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['revenue', 'transport', 'health', 'education', 'agriculture', 'municipal', 'labour', 'business'].map((id) => {
              const d = departmentById(id)
              if (!d) return null
              return (
                <Link key={id} to="/departments" className="group">
                  <Card className="p-4 flex items-center gap-3 group-hover:border-primary-200 group-hover:shadow-glow transition-all">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 text-sm truncate">{d.name}</div>
                      <div className="text-xs text-slate-400">{d.servicesCount} services · {d.status}</div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ TRUST & SECURITY ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <Card className="overflow-hidden h-72 lg:h-96">
            <SmartImage src={images.trust} alt="Secure digital infrastructure" className="w-full h-full" />
          </Card>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">Trust & Security</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Your data moves only with your consent</h2>
            <div className="mt-6 space-y-4">
              {[
                { icon: <ShieldCheck className="w-5 h-5" />, t: 'Consent-first sharing', d: 'Departments request specific documents; you approve each request and can revoke any time.' },
                { icon: <FileText className="w-5 h-5" />, t: 'One encrypted vault', d: 'Your documents live in one place, verified once and reused everywhere.' },
                { icon: <CheckCircle2 className="w-5 h-5" />, t: 'Fully auditable', d: 'Every access, approval and department response is logged and visible to you.' },
              ].map((f) => (
                <div key={f.t} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">{f.icon}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{f.t}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-6">Prototype representation of proposed security architecture — not connected to any production identity or payments system.</p>
          </div>
        </div>
      </section>

      {/* ============ STATS BAND ============ */}
      <section className="bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { v: <Counter to={24000000} suffix="+" />, l: 'Citizens Connected', short: '6.1 Cr+' },
            { v: <Counter to={18000} suffix="+" />, l: 'Services Indexed', short: '850+' },
            { v: <Counter to={36} />, l: 'Departments Connected', short: '36' },
            { v: <span>96%</span>, l: 'Digital Processing', short: '96%' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl sm:text-4xl font-bold text-white hidden sm:block">{s.v}</div>
              <div className="text-3xl sm:text-4xl font-bold text-saffron-400 sm:hidden">{s.short}</div>
              <div className="text-sm text-white/60 mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-primary-900 to-primary-800 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <MapPin className="absolute right-8 bottom-6 w-24 h-24 text-white/5" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">One identity. Every government service.</h2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">Create your Maha ID and let MahaSetu bridge every department for you.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="rounded-xl bg-white text-primary-900 font-semibold px-6 py-3 text-sm hover:bg-blue-50 transition-colors">Create Maha ID / Login</Link>
            <Link to="/services" className="rounded-xl border border-white/25 font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors">Explore services first</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
