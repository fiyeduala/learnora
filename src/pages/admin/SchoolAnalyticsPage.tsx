import { TrendingUp, Users, BookOpen, Award, Download, ArrowUp, ArrowDown } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type StatRow = { label: string; value: string; change: string; up: boolean; Icon: typeof Users; color: string }
type ClassRow = { class: string; students: number; avgGpa: number; attendance: string; passRate: string }
type SubjectRow = { subject: string; avgScore: number; passRate: string; color: string }
type TermRow = { term: string; gpa: number; attendance: number }

const stats: StatRow[] = [
  { label: 'Total Enrollment', value: '—', change: '—', up: true,  Icon: Users,     color: 'bg-primary/10 text-primary'        },
  { label: 'Avg. Attendance',  value: '—', change: '—', up: true,  Icon: TrendingUp, color: 'bg-green-50 text-green-600'       },
  { label: 'Avg. GPA',         value: '—', change: '—', up: false, Icon: Award,     color: 'bg-amber-50 text-amber-600'        },
  { label: 'Active Courses',   value: '—', change: '—', up: true,  Icon: BookOpen,  color: 'bg-accent-mint/10 text-accent-mint' },
]

const classPerformance: ClassRow[] = []

const subjectPerformance: SubjectRow[] = []

const termTrend: TermRow[] = []

const maxGpa = 4.0

export default function SchoolAnalyticsPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="school-analytics"
      onNavigate={onNavigate}
      title="School Analytics"
      subtitle="Academic performance overview across all classes"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="flex flex-col gap-6">
        {/* Export button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors">
            <Download size={15} /> Export Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, change, up, Icon, color }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-5">
              <div className={`size-10 rounded-card ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
                {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                {change} vs last term
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* GPA trend chart */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-base font-bold text-foreground mb-5">GPA Trend (Last 5 Terms)</h2>
            <div className="flex items-end gap-3 h-36">
              {termTrend.length === 0
                ? <div className="flex-1 flex items-center justify-center text-sm text-muted">No data yet.</div>
                : termTrend.map(({ term, gpa }) => {
                  const h = Math.round((gpa / maxGpa) * 100)
                  return (
                    <div key={term} className="flex flex-col items-center gap-2 flex-1">
                      <span className="text-[10px] font-bold text-foreground">{gpa}</span>
                      <div className="w-full bg-primary rounded-t-lg" style={{ height: `${h}%` }} />
                      <span className="text-[9px] text-muted text-center leading-tight">{term.split(' ').join('\n')}</span>
                    </div>
                  )
                })
              }
            </div>
          </div>

          {/* Attendance trend */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-base font-bold text-foreground mb-5">Attendance Trend (%)</h2>
            <div className="flex items-end gap-3 h-36">
              {termTrend.length === 0
                ? <div className="flex-1 flex items-center justify-center text-sm text-muted">No data yet.</div>
                : termTrend.map(({ term, attendance }) => (
                  <div key={term} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-[10px] font-bold text-foreground">{attendance}%</span>
                    <div className="w-full bg-accent-mint rounded-t-lg" style={{ height: `${attendance}%` }} />
                    <span className="text-[9px] text-muted text-center leading-tight">{term.split(' ').join('\n')}</span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* Class performance table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Class Performance</h2>
            <span className="text-xs text-muted">Current term</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-canvas">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Students</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Avg GPA</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Attendance</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/4">
                {classPerformance.length === 0
                  ? <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-muted">No data yet.</td></tr>
                  : classPerformance.map(row => (
                    <tr key={row.class} className="hover:bg-canvas/50 transition-colors">
                      <td className="px-6 py-3.5 font-semibold text-foreground">{row.class}</td>
                      <td className="px-4 py-3.5 text-muted">{row.students}</td>
                      <td className="px-4 py-3.5">
                        <span className={`font-semibold ${row.avgGpa >= 3.7 ? 'text-green-600' : row.avgGpa >= 3.5 ? 'text-primary' : 'text-amber-600'}`}>
                          {row.avgGpa}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted">{row.attendance}</td>
                      <td className="px-4 py-3.5 text-muted">{row.passRate}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject performance */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-5">Subject Performance (Avg Score)</h2>
          <div className="flex flex-col gap-4">
            {subjectPerformance.length === 0
              ? <div className="py-8 text-center text-sm text-muted">No data yet.</div>
              : subjectPerformance.map(({ subject, avgScore, passRate, color }) => (
                <div key={subject}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-foreground">{subject}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted">Pass: {passRate}</span>
                      <span className="text-sm font-bold text-foreground">{avgScore}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-black/8 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${avgScore}%` }} />
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
