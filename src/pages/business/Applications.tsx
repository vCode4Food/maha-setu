import { Link } from 'react-router-dom'
import { FileStack, Search } from 'lucide-react'
import { Card, EmptyState, StatusBadge, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

export default function BusinessApplications() {
  const { applications } = useApp()
  const bizApps = applications.filter((a) => ['business-registration', 'trade-licence', 'gst-registration'].includes(a.serviceId))
  void Search

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Applications</h1>
        <p className="text-slate-500 mt-1.5">Every filing your business has made through MahaSetu.</p>
      </div>
      <div className="space-y-3">
        {bizApps.map((a) => (
          <Link key={a.id} to={`/citizen/applications/${a.id}`} className="block group">
            <Card className="p-5 group-hover:border-primary-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-semibold text-slate-900">{a.serviceName}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{a.id} · {a.currentStage} · filed {a.submittedAt}</div>
                </div>
                <span className="text-sm font-medium text-primary-700">Open timeline →</span>
              </div>
            </Card>
          </Link>
        ))}
        {bizApps.length === 0 && (
          <Card><EmptyState icon={<FileStack className="w-6 h-6" />} title="No business applications yet" body="Start one from Government Services or Government Connect." /></Card>
        )}
      </div>
    </div>
  )
}
