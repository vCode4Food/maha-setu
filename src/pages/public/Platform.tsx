import { Link } from 'react-router-dom'
import {
  ArrowRight, ShieldCheck, Lock, Fingerprint, KeyRound, Users, Share2, FileCheck2, Clock3, Bell, Server,
  Database, Landmark, Car, Wheat, Building2, HeartHandshake, Laptop, Smartphone, Globe2,
  Workflow, Activity, GitBranch, CheckCircle2,
} from 'lucide-react'
import { Card } from '@/components/ui/primitives'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { Counter } from '@/components/ui/widgets'

function Section({ eyebrow, title, sub, children }: { eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-xs font-semibold uppercase tracking-widest text-saffron-600 mb-2">{eyebrow}</div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {sub && <p className="text-slate-500 mt-2 max-w-2xl">{sub}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}

export default function Platform() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-saffron-400 mb-2">Architecture</div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl leading-tight">
                Maharashtra's unified digital identity & service platform
              </h1>
              <p className="text-white/70 mt-4 max-w-2xl leading-relaxed">
                Secure, simple, citizen-centric, connected governance — a prototype representation of the proposed
                MahaSetu identity and interoperability architecture.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium">
                {['Secure', 'Simple', 'Citizen Centric', 'Connected Governance'].map((t) => (
                  <span key={t} className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm">
              <div className="flex items-center gap-2 font-semibold"><Globe2 className="w-4 h-4 text-saffron-400" /> One Citizen ID</div>
              <div className="text-white/70 mt-1">Multiple services</div>
              <div className="text-saffron-400 font-semibold mt-2">A Stronger Maharashtra</div>
            </div>
          </div>
        </div>
        <div className="tricolor-bar h-1.5" />
      </section>

      {/* 1. Citizen journey (UAE PASS style) */}
      <Section
        eyebrow="1 · Citizen Journey"
        title="Register once, access everything"
        sub="Like UAE PASS for Maharashtra — one identity, verified once, used across every department."
      >
        <div className="grid sm:grid-cols-5 gap-4">
          {[
            { n: 1, t: 'Register / Login', d: 'Enter mobile number to get started', icon: Smartphone },
            { n: 2, t: 'Verify with OTP', d: 'OTP sent to your mobile (demo: 123456)', icon: Fingerprint },
            { n: 3, t: 'Identity Verification', d: 'Mobile verified · Identity verified · Profile matched', icon: ShieldCheck },
            { n: 4, t: 'Create MahaSetu PIN', d: 'Set a 6-digit security PIN (demo: 123456)', icon: KeyRound },
            { n: 5, t: 'Access Services', d: 'Login once, access every department', icon: Landmark },
          ].map((s) => (
            <Card key={s.n} className="p-5">
              <span className="w-8 h-8 rounded-full bg-primary-900 text-white text-sm font-bold flex items-center justify-center">{s.n}</span>
              <s.icon className="w-5 h-5 text-primary-700 mt-3" />
              <div className="font-semibold text-slate-900 text-sm mt-2">{s.t}</div>
              <div className="text-xs text-slate-500 mt-1">{s.d}</div>
            </Card>
          ))}
        </div>
        <div className="mt-5 flex justify-center">
          <Button to="/login" variant="primary">Try the demo login <ArrowRight className="w-4 h-4" /></Button>
        </div>
      </Section>

      {/* 2. System architecture */}
      <Section
        eyebrow="2 · System Architecture"
        title="MahaSetu Identity & Authentication Platform (IdP)"
        sub="A secure, scalable and interoperable architecture using OAuth 2.0 and OpenID Connect concepts (proposed, simulated)."
      >
        <div className="space-y-4">
          {/* Citizen layer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center"><Users className="w-5 h-5" /></span>
              <div>
                <div className="font-semibold text-slate-900">Citizen</div>
                <div className="text-xs text-slate-400">Web / Mobile App</div>
              </div>
            </div>
            <div className="flex gap-2">
              {['Login', 'Approve', 'Access Services'].map((a) => (
                <span key={a} className="rounded-lg border border-slate-200 bg-canvas px-3 py-1.5 text-xs font-medium text-slate-600">{a}</span>
              ))}
            </div>
          </div>
          <div className="text-center text-xs font-semibold text-slate-400 tracking-widest">HTTPS</div>
          {/* IdP layer */}
          <div className="rounded-2xl border-2 border-primary-200 bg-primary-50/40 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Logo compact />
              <div className="font-bold text-primary-900">MahaSetu Identity & Authentication Platform (IdP)</div>
            </div>
            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { t: 'Authentication', d: 'OTP / PIN / Biometric (concept)', icon: Lock },
                { t: 'Identity Management', d: 'One profile, one session', icon: Fingerprint },
                { t: 'OAuth 2.0 / OpenID Connect', d: 'Authorization code flow (proposed)', icon: GitBranch },
                { t: 'Consent Management', d: 'Scoped, revocable grants', icon: Share2 },
                { t: 'Session Management', d: 'Timeouts & device binding', icon: Clock3 },
                { t: 'Risk & Step-up Auth', d: 'Simulated MFA escalation', icon: ShieldCheck },
              ].map((c) => (
                <div key={c.t} className="rounded-xl bg-white border border-primary-100 p-3.5">
                  <c.icon className="w-4.5 h-4.5 text-primary-700" />
                  <div className="text-xs font-semibold text-slate-800 mt-2 leading-snug">{c.t}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{c.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { t: 'User Profile Service', icon: Database },
                { t: 'MFA Service', icon: ShieldCheck },
                { t: 'Consent Service', icon: Share2 },
                { t: 'Audit & Logging', icon: FileCheck2 },
                { t: 'Notification Service', icon: Bell },
                { t: 'API Gateway', icon: Server },
              ].map((c) => (
                <div key={c.t} className="rounded-xl bg-white border border-slate-200 p-3 flex items-center gap-2">
                  <c.icon className="w-4 h-4 text-slate-500" />
                  <div className="text-xs font-medium text-slate-700">{c.t}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Adapters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-800 mb-1">Identity Verification Adapters</div>
            <div className="text-xs text-slate-400 mb-4">Integrate with authorized government identity sources (proposed)</div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { t: 'Aadhaar (UIDAI)', d: 'Masked, consent-based KYC', icon: Fingerprint },
                { t: 'DigiLocker', d: 'Document fetch & verification', icon: FileCheck2 },
                { t: 'Mobile / Email Verification', d: 'OTP channels', icon: Smartphone },
                { t: 'Other Govt. ID Sources', d: 'As applicable', icon: Landmark },
              ].map((a) => (
                <div key={a.t} className="rounded-xl bg-canvas border border-slate-200 p-3.5">
                  <a.icon className="w-4.5 h-4.5 text-saffron-600" />
                  <div className="text-xs font-semibold text-slate-800 mt-2">{a.t}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{a.d}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Departments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-800 mb-1">Government Services — Service Providers</div>
            <div className="text-xs text-slate-400 mb-4">Multiple departments integrate using standard APIs · Authenticate & authorize via authorization code flow</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { t: 'Revenue Department', d: 'Land records, certificates', icon: Landmark, color: 'text-rose-600 bg-rose-50' },
                { t: 'Transport Department', d: 'Driving licence, vehicle registration', icon: Car, color: 'text-sky-600 bg-sky-50' },
                { t: 'Agriculture Department', d: 'Farmer schemes, land data', icon: Wheat, color: 'text-emerald-600 bg-emerald-50' },
                { t: 'Municipal Services', d: 'Property tax, trade licences', icon: Building2, color: 'text-amber-600 bg-amber-50' },
                { t: 'Welfare Schemes', d: 'Social benefits, scholarships', icon: HeartHandshake, color: 'text-violet-600 bg-violet-50' },
                { t: 'Other Departments', d: 'Health, education, skills, etc.', icon: Laptop, color: 'text-slate-500 bg-slate-100' },
              ].map((d) => (
                <div key={d.t} className="rounded-xl border border-slate-200 p-3.5 flex items-start gap-3">
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${d.color}`}><d.icon className="w-4.5 h-4.5" /></span>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{d.t}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{d.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Consent flow */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 p-5">
            <div className="font-bold text-emerald-900 text-sm mb-4">4 · Consent Flow — Citizen Controlled Data Sharing</div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white border border-emerald-100 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900"><Car className="w-4 h-4 text-sky-600" /> Transport Department wants to access your data</div>
                <div className="mt-3 space-y-2">
                  {['Name', 'Date of Birth', 'Driving Licence Status'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}</div>
                  ))}
                </div>
                <div className="text-xs text-slate-400 mt-3">Purpose: Driving licence verification</div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-lg border border-rose-200 text-rose-600 text-sm font-medium py-2 hover:bg-rose-50">Deny</button>
                  <button className="flex-1 rounded-lg bg-primary-900 text-white text-sm font-medium py-2 hover:bg-primary-800">Allow</button>
                </div>
              </div>
              <div className="rounded-xl bg-white border border-emerald-100 p-4">
                <div className="text-sm font-semibold text-slate-900 mb-3">My Consent Dashboard</div>
                <div className="space-y-2">
                  {['Revenue', 'Transport', 'Agriculture', 'Municipal', 'Welfare'].map((d) => (
                    <div key={d} className="flex items-center justify-between rounded-lg border border-slate-100 bg-canvas px-3 py-2 text-sm">
                      <span className="text-slate-700">{d}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" /> Granted</span>
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-full rounded-lg border border-slate-200 text-xs font-medium text-slate-500 py-2 hover:bg-slate-50">Revoke Access</button>
                <Link to="/citizen/consent" className="mt-3 block text-center text-xs font-semibold text-primary-700 hover:text-primary-900">Open My Data Permissions →</Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Platform core & connectors */}
      <Section
        eyebrow="3 · Platform Core"
        title="MahaSetu Core & Connector Framework"
        sub="How the platform maps, resolves and exchanges data between departments (prototype visualization)."
      >
        <div className="grid lg:grid-cols-2 gap-5">
          <Card className="p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-primary-900 text-white flex items-center justify-center"><Workflow className="w-4.5 h-4.5" /></span>
              <div className="font-bold text-slate-900">MahaSetu Core</div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {['Identity / SSO', 'Master Data Management', 'Data Mapping Engine', 'Consent & Policy', 'Entity Resolution Engine', 'Workflow Engine', 'Canonical Data Model', 'Audit', 'Data Quality Engine'].map((m) => (
                <div key={m} className="rounded-xl bg-canvas border border-slate-100 px-3.5 py-2.5 text-xs font-medium text-slate-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0" /> {m}
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl bg-violet-700 text-white flex items-center justify-center"><GitBranch className="w-4.5 h-4.5" /></span>
              <div className="font-bold text-slate-900">Connector Framework</div>
            </div>
            <div className="space-y-2.5">
              {[
                { db: 'Employment DB', api: 'Legacy API', tone: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { db: 'Education DB', api: 'REST API', tone: 'text-sky-700 bg-sky-50 border-sky-100' },
                { db: 'Skills DB', api: 'SOAP/API', tone: 'text-amber-700 bg-amber-50 border-amber-100' },
                { db: 'Entrepreneurship DB', api: 'Federated view', tone: 'text-violet-700 bg-violet-50 border-violet-100' },
              ].map((c) => (
                <div key={c.db} className="flex items-center gap-2.5">
                  <div className={`flex-1 rounded-xl border px-3.5 py-2.5 text-xs font-semibold ${c.tone}`}>{c.db}</div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                  <div className="w-28 text-center rounded-xl bg-canvas border border-slate-200 px-2 py-2.5 text-[11px] font-medium text-slate-600">{c.api}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl bg-canvas border border-slate-200 p-3.5 flex items-center gap-2 text-xs text-slate-500">
              <Activity className="w-4 h-4 text-primary-600" /> All connectors exchange canonical events — auditable, replayable, consent-checked.
            </div>
          </Card>
        </div>
      </Section>

      {/* 4. Security & compliance */}
      <Section
        eyebrow="4 · Security & Compliance"
        title="Prototype representation of proposed security architecture"
        sub="Concepts referenced for demonstration only — no production authentication, encryption or compliance claims."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { t: 'End-to-End Encryption', d: 'Concept', icon: Lock },
            { t: 'OAuth 2.0 & OpenID Connect', d: 'Proposed', icon: GitBranch },
            { t: 'MFA / OTP / Biometric', d: 'Simulated', icon: Fingerprint },
            { t: 'Secure Session Management', d: 'Concept', icon: Clock3 },
            { t: 'RBAC / ABAC', d: 'Frontend simulation', icon: Users },
            { t: 'Audit Logs', d: 'Visible in admin portals', icon: FileCheck2 },
            { t: 'Rate Limiting & Anomaly Detection', d: 'Simulated', icon: Activity },
            { t: 'DPDP Act Alignment', d: 'Design intent', icon: ShieldCheck },
          ].map((c) => (
            <Card key={c.t} className="p-4">
              <c.icon className="w-5 h-5 text-rose-600" />
              <div className="text-xs font-semibold text-slate-800 mt-2.5 leading-snug">{c.t}</div>
              <div className="text-[10px] text-slate-400 mt-1">{c.d}</div>
            </Card>
          ))}
        </div>
        <div className="mt-8 rounded-3xl bg-primary-950 text-white p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="text-lg font-semibold">जनतेचा विश्वास &nbsp;|&nbsp; सेवांचा सेतू &nbsp;|&nbsp; विकसित महाराष्ट्र</div>
          <div className="text-white/60 text-sm mt-2">People · Services · A Developed Maharashtra</div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button to="/login" className="bg-white text-primary-900 hover:bg-blue-50">Login to the demo</Button>
            <Link to="/" className="rounded-xl border border-white/25 font-semibold px-6 py-3 text-sm hover:bg-white/10 transition-colors">Back to home</Link>
          </div>
        </div>
      </Section>
      <div className="sr-only"><Counter to={0} /></div>
    </div>
  )
}
