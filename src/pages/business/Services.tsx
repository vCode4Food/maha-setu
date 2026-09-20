import { Link } from 'react-router-dom'
import { Clock, IndianRupee, ArrowRight, Store, FileCheck, Scale, Zap, Users, FileText } from 'lucide-react'
import { Card } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'

const BIZ = [
  { id: 'business-registration', icon: Store },
  { id: 'trade-licence', icon: FileText },
  { id: 'gst-registration', icon: FileCheck },
  { id: 'building-permission', icon: Scale },
  { id: 'water-connection', icon: Zap },
  { id: 'shramik-card', icon: Users },
]

export default function BusinessServices() {
  const { allServicesWithState } = useApp()
  const list = BIZ.map((b) => ({ ...b, svc: allServicesWithState.find((s) => s.id === b.id)! })).filter((x) => x.svc)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Government Services for Business</h1>
        <p className="text-slate-500 mt-1.5">The services Sahyadri AgroTech touches most — coordinated through MahaSetu, not visited separately.</p>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map(({ id, icon: Icon, svc }) => (
          <Card key={id} className="p-5 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
            <h3 className="font-semibold text-slate-900 mt-3">{svc.name}</h3>
            <p className="text-sm text-slate-500 mt-1 flex-1">{svc.description}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{svc.processingTime}</span>
              <span className="inline-flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5" />{svc.fee === 0 ? 'Free' : `₹${svc.fee}`}</span>
            </div>
            <Link to={`/citizen/services/${svc.id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-900">
              View & apply <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
