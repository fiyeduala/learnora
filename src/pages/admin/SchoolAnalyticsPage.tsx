import { TrendingUp, Users, BookOpen, Award, Download, ArrowUp, ArrowDown } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const stats = [
  { label: 'Total Enrollment',  value: '1,248', change: '+42',  up: true,  Icon: Users,      color: 'bg-primary/10 text-primary'   },
  { label: 'Avg. Attendance',   value: '89.4%', change: '+2.1%', up: true, Icon: TrendingUp,  color: 'bg-green-50 text-green-600'  },
  { label: 'Avg. GPA',          value: '3.61',  change: '-0.08', up: false, Icon: Award,      color: 'bg-amber-50 text-amber-600'  },
  { label: 'Active Courses',    value: '64',    change: '+6',    up: true,  Icon: BookOpen,   color: 'bg-accent-mint/10 text-accent-mint' },
]

const classPerformance = [
  { class: 'SS3A', students: 38, avgGpa: 3.81, attendance: '93%', passRate: '97%' },
  { class: 'SS3B', students: 36, avgGpa: 3.60, attendance: '90%', passRate: '94%' },
  { class: 'SS2A', students: 42, avgGpa: 3.55, attendance: '88%', passRate: '92%' },
  { class: 'SS2B', students: 40, avgGpa: 3.48, attendance: '87%', passRate: '90%' },
  { class: 'SS1A', students: 44, avgGpa: 3.72, attendance: '91%', passRate: '95%' },
  { class: 'SS1B', students: 41, avgGpa: 3.50, attendance: '86%', passRate: '89%' },
]

const subjectPerformance = [
  { subject: 'Mathematics',   avgScore: 71, passRate: '88%', color: 'bg-primary' },
  { subject: 'English',       avgScore: 78, passRate: '94%', color: 'bg-accent-mint' },
  { subject: 'Physics',       avgScore: 68, passRate: '82%', color: 'bg-amber-400' },
  { subject: 'Chemistry',     avgScore: 65, passRate: '79%', color: 'bg-red-400' },
  { subject: 'Biology',       avgScore: 74, passRate: '91%', color: 'bg-green-500' },
]

const termTrend = [
  { term: '1st Term 25', gpa: 3.52, attendance: 87 },
  { term: '2nd Term 25', gpa: 3.58, attendance: 88 },
  { term: '3rd Term 25', gpa: 3.61, attendance: 90 },
  { term: '1st Term 26', gpa: 3.55, attendance: 88 },
  { term: '2nd Term 26', gpa: 3.61, attendance: 89 },
]

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
              {termTrend.map(({ term, gpa }) => {
                const h = Math.round((gpa / maxGpa) * 100)
                return (
                  <div key={term} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-[10px] font-bold text-foreground">{gpa}</span>
                    <div className="w-full bg-primary rounded-t-lg" style={{ height: `${h}%` }} />
                    <span className="text-[9px] text-muted text-center leading-tight">{term.split(' ').join('\n')}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Attendance trend */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-base font-bold text-foreground mb-5">Attendance Trend (%)</h2>
            <div className="flex items-end gap-3 h-36">
              {termTrend.map(({ term, attendance }) => (
                <div key={term} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] font-bold text-foreground">{attendance}%</span>
                  <div className="w-full bg-accent-mint rounded-t-lg" style={{ height: `${attendance}%` }} />
                  <span className="text-[9px] text-muted text-center leading-tight">{term.split(' ').join('\n')}</span>
                </div>
              ))}
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
                {classPerformance.map(row => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Subject performance */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-5">Subject Performance (Avg Score)</h2>
          <div className="flex flex-col gap-4">
            {subjectPerformance.map(({ subject, avgScore, passRate, color }) => (
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
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
