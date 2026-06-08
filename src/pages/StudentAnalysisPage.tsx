import { ChevronDown, Download, Calendar, BookOpen, TrendingUp, Clock, FileText } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const stats = [
  { label: 'Attendance Rate',      value: '90%',   color: 'text-green-600',  icon: Calendar   },
  { label: 'Pending Assignments',  value: '12',    color: 'text-amber-600',  icon: BookOpen   },
  { label: 'Average Performance',  value: '84%',   color: 'text-primary',    icon: TrendingUp },
  { label: 'Study Time This Week', value: '18hrs', color: 'text-foreground', icon: Clock      },
]

const monthlyBars = [
  { month: 'JAN', pct: 26 },
  { month: 'FEB', pct: 54 },
  { month: 'MAR', pct: 93 },
  { month: 'APR', pct: 65 },
  { month: 'MAY', pct: 36 },
  { month: 'JUN', pct: 26 },
  { month: 'JUL', pct: 100 },
  { month: 'AUG', pct: 49 },
  { month: 'SEP', pct: 70 },
  { month: 'OCT', pct: 54 },
  { month: 'NOV', pct: 32 },
  { month: 'DEC', pct: 65 },
]

const subjects = [
  { name: 'Mathematics', score: 89, assignments: 12, tests: 8,  attendance: 95 },
  { name: 'Physics',     score: 55, assignments: 10, tests: 6,  attendance: 88 },
  { name: 'Biology',     score: 89, assignments: 12, tests: 7,  attendance: 92 },
  { name: 'English',     score: 90, assignments: 11, tests: 8,  attendance: 97 },
]

export default function StudentAnalysisPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="analysis"
      onNavigate={onNavigate}
      title="Analysis"
    >
      <div className="flex flex-col gap-6 max-w-[1300px]">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Performance Analysis</h2>
            <p className="text-sm text-muted mt-1">Track your academic growth and learning progress.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 h-10 px-4 bg-surface border border-black/10 rounded-input text-sm text-foreground shadow-sm hover:border-primary transition-colors">
              This Week
              <ChevronDown size={14} className="text-muted" />
            </button>
            <button className="flex items-center gap-2 h-10 px-4 bg-primary text-white rounded-input text-sm font-semibold shadow-primary hover:bg-primary-deep transition-colors">
              Export
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-surface rounded-card shadow-sm p-5 flex items-start gap-3">
                <div className="size-10 rounded-card bg-canvas flex items-center justify-center text-primary shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted mt-0.5 leading-snug">{s.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Performance Trend chart */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Performance Trend</h3>
            <button className="flex items-center gap-2 h-9 px-3 bg-canvas border border-black/8 rounded-input text-sm text-foreground hover:border-primary transition-colors">
              Monthly
              <ChevronDown size={13} className="text-muted" />
            </button>
          </div>

          <div className="flex items-end gap-2" style={{ height: '200px' }}>
            {monthlyBars.map(b => (
              <div key={b.month} className="flex flex-col items-center gap-2 flex-1 min-w-0 h-full">
                <div className="flex-1 flex items-end w-full">
                  <div
                    className="w-full rounded-t-sm bg-primary/80 hover:bg-primary transition-colors"
                    style={{ height: `${b.pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted font-medium shrink-0">{b.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div>
          <div className="mb-5">
            <h3 className="text-xl font-bold text-foreground">Subject Performance</h3>
            <p className="text-sm text-muted mt-1">Compare your performance across all subjects</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {subjects.map(s => (
              <div key={s.name} className="bg-surface rounded-card shadow-sm p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-[60px] rounded-card bg-canvas flex items-center justify-center text-primary shrink-0">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{s.name}</p>
                      <p className="text-sm text-muted">Overall Performance</p>
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-primary shrink-0">{s.score}%</span>
                </div>

                <div className="h-2.5 bg-black/8 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${s.score}%` }}
                  />
                </div>

                <div className="flex items-center gap-5 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    <FileText size={13} />
                    <span className="font-semibold text-foreground">{s.assignments}</span>
                    <span>Assignments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{s.tests}</span>
                    <span>Tests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span className="font-semibold text-foreground">{s.attendance}%</span>
                    <span>Attendance</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
