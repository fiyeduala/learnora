import { TrendingUp, TrendingDown, Minus, Users2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

const subjectStats = [
  { subject: 'Mathematics', classAvg: 81, topScore: 95, passRate: 88 },
  { subject: 'English',     classAvg: 79, topScore: 92, passRate: 85 },
  { subject: 'Physics',     classAvg: 77, topScore: 97, passRate: 81 },
  { subject: 'Government',  classAvg: 83, topScore: 93, passRate: 90 },
]

const topStudents = [
  { name: 'Yetunde Adesanya', avg: 94.3, trend: 'up',     strong: 'Physics, English' },
  { name: 'Fatima Al-Rashid', avg: 90.0, trend: 'up',     strong: 'All Subjects' },
  { name: 'Chisom Eze',       avg: 88.3, trend: 'up',     strong: 'English, Govt' },
  { name: 'Amara Osei',       avg: 83.8, trend: 'stable', strong: 'Physics, Math' },
  { name: 'Akosua Mensah',    avg: 79.5, trend: 'down',   strong: 'Mathematics' },
]

const scoreBands = [
  { range: '0–49',  count: 1,  pct: 3,  color: 'bg-red-400' },
  { range: '50–59', count: 2,  pct: 6,  color: 'bg-amber-400' },
  { range: '60–69', count: 4,  pct: 13, color: 'bg-amber-300' },
  { range: '70–79', count: 9,  pct: 28, color: 'bg-primary/60' },
  { range: '80–89', count: 11, pct: 34, color: 'bg-primary' },
  { range: '90+',   count: 5,  pct: 16, color: 'bg-accent-mint' },
]

export default function AnalysisPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  return (
    <DashboardLayout
      activePage="analytics"
      onNavigate={onNavigate}
      title="Academic Analysis"
      subtitle="Class performance insights and student progress"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-6 max-w-[1200px]">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students',  value: '32',    sub: 'Active this term',     color: 'text-foreground' },
            { label: 'Class Avg Score', value: '80.0%', sub: '+2.3% from last term', color: 'text-green-600'  },
            { label: 'Pass Rate',       value: '86%',   sub: 'Passed all subjects',  color: 'text-primary'    },
            { label: 'Top Score',       value: '97%',   sub: 'Yetunde Adesanya',     color: 'text-accent-mint'},
          ].map(stat => (
            <div key={stat.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className="text-sm text-muted">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* Subject performance + distribution */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h3 className="text-xl font-bold text-foreground mb-6">Subject Performance</h3>
            <div className="flex flex-col gap-6">
              {subjectStats.map(s => (
                <div key={s.subject} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{s.subject}</span>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span>Avg: <strong className="text-foreground">{s.classAvg}%</strong></span>
                      <span>Top: <strong className="text-foreground">{s.topScore}%</strong></span>
                      <span>Pass: <strong className="text-green-600">{s.passRate}%</strong></span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-black/6 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${s.classAvg}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Score distribution */}
            <div className="mt-8 pt-6 border-t border-black/6">
              <h4 className="text-base font-semibold text-foreground mb-4">Score Distribution (Mathematics)</h4>
              <div className="flex items-end gap-2 h-36">
                {scoreBands.map(bar => (
                  <div key={bar.range} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-foreground">{bar.count}</span>
                    <div
                      className={`w-full rounded-t-sm ${bar.color}`}
                      style={{ height: `${bar.pct * 2.8}px` }}
                    />
                    <span className="text-xs text-muted">{bar.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top performers */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users2 size={18} className="text-primary" />
              <h3 className="text-base font-bold text-foreground">Top Performers</h3>
            </div>
            <div className="flex flex-col gap-3">
              {topStudents.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-card bg-canvas/60">
                  <span className="text-xs font-bold text-muted w-5 text-center shrink-0">
                    #{i + 1}
                  </span>
                  <div className="size-8 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted truncate">{s.strong}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-sm font-bold text-foreground">{s.avg}%</span>
                    {s.trend === 'up'     && <TrendingUp   size={12} className="text-green-500" />}
                    {s.trend === 'down'   && <TrendingDown size={12} className="text-red-500"   />}
                    {s.trend === 'stable' && <Minus        size={12} className="text-muted"     />}
                  </div>
                </div>
              ))}
            </div>

            {/* Class health */}
            <div className="mt-6 pt-5 border-t border-black/6">
              <h4 className="text-sm font-bold text-foreground mb-3">Class Health</h4>
              {[
                { label: 'At Risk (< 60%)',   count: 3,  color: 'bg-red-400',   pct: 9  },
                { label: 'Below Avg (60–74%)', count: 8,  color: 'bg-amber-400', pct: 25 },
                { label: 'Average (75–84%)',  count: 13, color: 'bg-primary/60', pct: 41 },
                { label: 'Excellent (85%+)',  count: 8,  color: 'bg-green-500',  pct: 25 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 mb-2.5">
                  <span className={`size-2.5 rounded-full ${item.color} shrink-0`} />
                  <span className="text-xs text-muted flex-1">{item.label}</span>
                  <span className="text-xs font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
