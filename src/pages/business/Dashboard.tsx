import { Link } from 'react-router-dom'
import {
  FileCheck, ArrowRight, AlertTriangle, Sparkles, TrendingUp, Landmark,
} from 'lucide-react'
import { Card, CardHeader, StatCard, StatusBadge } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { initialBusiness } from '@/data/misc'
import { schemes } from '@/data/schemes'
import { initialNews } from '@/data/misc'
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'

export default function BusinessDashboard() {
  const biz = initialBusiness
  const { applications, pushToast } = useApp()
  const bizApps = applications.filter((a) => a.serviceId === 'business-registration' || a.serviceId === 'trade-licence')

  const expiring = biz.licences.filter((l) => l.status === 'expiring')
  const complianceData = [{ name: 'score', value: biz.complianceScore, fill: biz.complianceScore > 75 ? '#16a34a' : '#f59e0b' }]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">{biz.legalName} · GSTIN {biz.gstin}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Sahyadri AgroTech — compliance console</h1>
        </div>
        <Link to="/business/connect" className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800">
          <Landmark className="w-4 h-4" /> Government Connect
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Compliance health</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{biz.complianceScore}/100</div>
            </div>
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={complianceData} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background={{ fill: '#e2e8f0' }} cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-1">2 renewals due within 90 days</div>
        </Card>
        <StatCard label="Active applications" value={bizApps.length || 1} sub="registration in officer review" icon={<FileCheck className="w-5 h-5" />} tone="primary" />
        <StatCard label="Licences expiring" value={expiring.length} sub="FSSAI · Trade Licence" icon={<AlertTriangle className="w-5 h-5" />} tone="saffron" />
        <StatCard label="Eligible incentives" value="4" sub="seed grant · equipment subsidy" icon={<Sparkles className="w-5 h-5" />} tone="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Licences & registrations" subtitle="Renewal alerts appear 90 days ahead" action={<Link to="/business/licences" className="text-sm font-medium text-primary-700">Manage</Link>} />
            <div className="px-5 sm:px-6 pb-5 overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                    <th className="pb-2.5 font-medium">Licence</th><th className="pb-2.5 font-medium">Authority</th><th className="pb-2.5 font-medium">Expires</th><th className="pb-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {biz.licences.map((l) => (
                    <tr key={l.id}>
                      <td className="py-3 font-medium text-slate-800">{l.name}</td>
                      <td className="py-3 text-slate-500">{l.authority}</td>
                      <td className="py-3 text-slate-600">{l.expires}</td>
                      <td className="py-3"><StatusBadge status={l.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent government activity" />
            <div className="px-5 sm:px-6 pb-5 space-y-3">
              {bizApps.length > 0 ? bizApps.slice(0, 2).map((a) => (
                <div key={a.id} className="rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{a.serviceName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{a.id} · {a.currentStage}</div>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              )) : null}
              <div className="rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-slate-900">FSSAI Food Safety Licence renewal</div>
                  <div className="text-xs text-slate-400 mt-0.5">Due 14 Dec 2026 · file after 15 Sep for seamless validity</div>
                </div>
                <button onClick={() => pushToast({ kind: 'info', title: 'Renewal drafted', body: 'Application pre-filled from business profile (demo).' })} className="text-sm font-medium text-primary-700 hover:text-primary-900">Start renewal →</button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Schemes & incentives" action={<Link to="/business/schemes" className="text-sm text-primary-700 font-medium">All</Link>} />
            <div className="px-5 sm:px-6 pb-5 space-y-3">
              {schemes.filter((s) => s.category === 'Business').map((s) => (
                <Link key={s.id} to="/business/schemes" className="block rounded-xl border border-slate-200 p-3.5 hover:border-primary-200 hover:bg-primary-50/40">
                  <div className="text-sm font-medium text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.benefit}</div>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Notices for your sector" />
            <div className="px-5 sm:px-6 pb-5 space-y-2.5">
              {initialNews.filter((n) => n.departmentId === 'business' || n.departmentId === 'municipal').map((n) => (
                <div key={n.id} className="rounded-xl bg-canvas p-3.5">
                  <div className="text-xs text-saffron-600 font-semibold uppercase">{n.category}</div>
                  <div className="text-sm text-slate-800 mt-0.5">{n.title}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-primary-50/60 border-primary-100">
            <div className="flex items-center gap-2 font-semibold text-primary-900 text-sm"><TrendingUp className="w-4 h-4" /> Expansion workflow</div>
            <p className="text-sm text-primary-900/80 mt-2">Planning a new unit? Government Connect maps municipal, pollution, labour and power approvals into one guided pipeline.</p>
            <Link to="/business/connect" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-800">Open Connect <ArrowRight className="w-3.5 h-3.5" /></Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
