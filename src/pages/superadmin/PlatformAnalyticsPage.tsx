import { Building2, Users, Activity, BookOpen, ArrowUp, Download } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const stats = [
  { label: 'Total Schools',   value: '142',     change: '+8',    Icon: Building2, color: 'bg-primary/10 text-primary'         },
  { label: 'Total Students',  value: '86,450',  change: '+4,200', Icon: Users,    color: 'bg-accent-mint/10 text-accent-mint' },
  { label: 'Monthly Active',  value: '71,200',  change: '+3,100', Icon: Activity, color: 'bg-green-50 text-green-600'         },
  { label: 'Lessons Created', value: '12,840',  change: '+940',  Icon: BookOpen, color: 'bg-amber-50 text-amber-600'         },
]

const growthData = [58, 72, 80, 92, 110, 125, 130, 135, 138, 140, 141, 142]
const mauData    = [40, 48, 55, 62, 71, 80, 84, 86, 87, 89, 90, 91]
const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

const topSchools = [
  { name: 'Unity High School',      students: 1240, mau: '94%', plan: 'Enterprise' },
  { name: 'Greenfield Academy',     students: 980,  mau: '91%', plan: 'Growth'     },
  { name: 'Royal Crown Academy',    students: 870,  mau: '89%', plan: 'Enterprise' },
  { name: 'Scholars Hub',           students: 760,  mau: '88%', plan: 'Growth'     },
  { name: 'Bright Minds School',    students: 290,  mau: '85%', plan: 'Starter'    },
]

const moduleAdoption = [
  { module: 'Core LMS',          pct: 98 },
  { module: 'Attendance',        pct: 94 },
  { module: 'Assignments',       pct: 91 },
  { module: 'Parent Portal',     pct: 82 },
  { module: 'Messages',          pct: 75 },
  { module: 'Finance',           pct: 68 },
  { module: 'Analytics',         pct: 55 },
  { module: 'AI Tutor',          pct: 32 },
]

const maxSchools = 150
const maxMau = 100

export default function PlatformAnalyticsPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="platform-analytics"
      onNavigate={onNavigate}
      title="Platform Analytics"
      subtitle="Platform-wide usage, growth, and engagement"
      nav={superAdminNav}
      user={{ name: 'Learnora Admin', role: 'Super Admin', initials: 'LA' }}
    >
      <div className="flex flex-col gap-6">

        <div className="flex justify-end">
          <button className="flex items-center gap-2 h-10 px-5 border border-black/20 text-sm font-semibold text-foreground rounded-pill hover:bg-canvas transition-colors">
            <Download size={14} /> Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, change, Icon, color }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-5">
              <div className={`size-10 rounded-card ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-green-600">
                <ArrowUp size={11} /> {change} vs last month
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Schools growth chart */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-base font-bold text-foreground mb-5">School Growth (Last 12 Months)</h2>
            <div className="flex items-end gap-1.5 h-36">
              {growthData.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-full bg-primary rounded-t" style={{ height: `${Math.round((v / maxSchools) * 100)}%` }} />
                  <span className="text-[8px] text-muted">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MAU chart */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-base font-bold text-foreground mb-5">Monthly Active Users (k)</h2>
            <div className="flex items-end gap-1.5 h-36">
              {mauData.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-full bg-accent-mint rounded-t" style={{ height: `${Math.round((v / maxMau) * 100)}%` }} />
                  <span className="text-[8px] text-muted">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top schools */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-black/6">
              <h2 className="text-base font-bold text-foreground">Top Schools by Usage</h2>
            </div>
            <div className="divide-y divide-black/4">
              {topSchools.map((s, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <span className="text-sm font-bold text-muted w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted">{s.students} students · {s.plan}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{s.mau}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module adoption */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-base font-bold text-foreground mb-5">Module Adoption</h2>
            <div className="flex flex-col gap-3.5">
              {moduleAdoption.map(({ module, pct }) => (
                <div key={module}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{module}</p>
                    <p className="text-sm font-bold text-foreground">{pct}%</p>
                  </div>
                  <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-primary' : 'bg-amber-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
