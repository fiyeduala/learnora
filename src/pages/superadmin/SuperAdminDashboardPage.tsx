import { AlertCircle, ChevronRight, Plus } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const stats = [
  { label: 'MRR',            value: '₦48.2M',  change: '+12%',  color: 'text-primary'   },
  { label: 'Active Schools', value: '127',      change: '+8',    color: 'text-accent-mint'},
  { label: 'Total Students', value: '84,320',   change: '+1,204',color: 'text-foreground' },
  { label: 'Churn Rate',     value: '2.1%',     change: '-0.3%', color: 'text-green-600' },
]

const recentSchools = [
  { name: 'Greenfield Academy',       location: 'Lagos',    plan: 'Professional', students: 1248, mrr: '₦1.06M', status: 'Active'  },
  { name: 'Royal Crown Secondary',    location: 'Abuja',    plan: 'Starter',      students: 420,  mrr: '₦357K',  status: 'Active'  },
  { name: 'Heritage International',   location: 'PH',       plan: 'Professional', students: 890,  mrr: '₦756.5K',status: 'Active'  },
  { name: 'Bright Future School',     location: 'Kano',     plan: 'Starter',      students: 310,  mrr: '₦263.5K',status: 'Trial'   },
  { name: 'Unity Academy',            location: 'Enugu',    plan: 'Professional', students: 680,  mrr: '₦578K',  status: 'Suspended'},
]

export default function SuperAdminDashboardPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="super-dashboard"
      onNavigate={onNavigate}
      title="Platform Dashboard"
      subtitle="Learnora — All Schools Overview"
      nav={superAdminNav}
      user={{ name: 'Learnora Admin', role: 'Super Admin', initials: 'LA' }}
    >
      <div className="max-w-[1300px] flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
              <p className={`text-xs font-semibold mt-1 ${s.change.startsWith('+') ? 'text-green-600' : s.change.startsWith('-') && s.label === 'Churn Rate' ? 'text-green-600' : 'text-red-500'}`}>
                {s.change} this month
              </p>
            </div>
          ))}
        </div>

        {/* Alert */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-card px-5 py-3.5 text-sm">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <p className="text-foreground">Unity Academy subscription is suspended due to missed payment. <button onClick={() => onNavigate('schools-list')} className="text-primary font-semibold hover:underline">View details</button></p>
        </div>

        {/* Schools table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/6">
            <h3 className="text-base font-bold text-foreground">Schools</h3>
            <div className="flex gap-2">
              <button onClick={() => onNavigate('onboard-school')} className="flex items-center gap-1.5 h-8 px-3 bg-primary text-white text-xs font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                <Plus size={11} /> Onboard School
              </button>
              <button onClick={() => onNavigate('schools-list')} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                View all <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/40">
                  {['School', 'Location', 'Plan', 'Students', 'MRR', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSchools.map((s, i) => (
                  <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors cursor-pointer" onClick={() => onNavigate('school-detail')}>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{s.name.charAt(0)}</div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-muted">{s.location}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.plan === 'Professional' ? 'bg-primary/10 text-primary' : 'bg-canvas text-muted border border-black/10'}`}>{s.plan}</span>
                    </td>
                    <td className="px-6 py-3.5 text-foreground">{s.students.toLocaleString()}</td>
                    <td className="px-6 py-3.5 font-semibold text-foreground">{s.mrr}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${
                        s.status === 'Active' ? 'bg-green-50 text-green-700' :
                        s.status === 'Trial'  ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-600'
                      }`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
