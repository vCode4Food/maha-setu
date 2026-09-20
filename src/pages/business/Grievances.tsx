import { MessageSquareWarning, Plus } from 'lucide-react'
import { Card, EmptyState } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { StatusBadge } from '@/components/ui/primitives'
import { initialGrievances } from '@/data/citizen'

export default function BusinessGrievances() {
  const { grievances } = useApp()
  void grievances

  const bizGrievances = initialGrievances.filter((g) => g.departmentId === 'business')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Grievances</h1>
          <p className="text-slate-500 mt-1.5">Escalations and service issues for the business, with SLA tracking.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary-900 text-white font-medium px-4 py-2.5 text-sm hover:bg-primary-800"><Plus className="w-4 h-4" /> Raise grievance</button>
      </div>

      <Card className="p-10">
        <EmptyState
          icon={<MessageSquareWarning className="w-6 h-6" />}
          title="No grievances on record"
          body="Raise an issue and MahaSetu routes it to the responsible department with a 72-hour SLA clock. Business escalations follow the same workflow as citizen grievances."
        />
      </Card>

      {bizGrievances.map((g) => (
        <Card key={g.id} className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-900">{g.subject}</span>
            <StatusBadge status={g.status} />
          </div>
        </Card>
      ))}
    </div>
  )
}
