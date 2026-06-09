import { Users, TrendingUp, Award, BookOpen, BarChart2, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

const classStats = [
  { class: 'SS2A', students: 32, avgGrade: 74, attendance: '87%', atRisk: 3, trend: 'up'   },
  { class: 'SS2B', students: 30, avgGrade: 68, attendance: '80%', atRisk: 5, trend: 'down' },
  { class: 'SS1A', students: 35, avgGrade: 81, attendance: '91%', atRisk: 1, trend: 'up'   },
]

const weeklySubmissions = [42, 55, 48, 60, 52, 58, 65]
const weeklyLabels      = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']

const topStudents = [
  { name: 'Emeka Okafor',  class: 'SS2A', avg: 92 },
  { name: 'Aisha Bello',   class: 'SS1A', avg: 89 },
  { name: 'Fatima Garba',  class: 'SS2A', avg: 86 },
  { name: 'Chidi Nwosu',   class: 'SS1A', avg: 84 },
  { name: 'Tobi Adeyemi',  class: 'SS2B', avg: 82 },
]

const subjectAvgs = [
  { subject: 'Mathematics',      avg: 74, color: 'bg-primary'   },
  { subject: 'Physics',          avg: 69, color: 'bg-amber-400' },
  { subject: 'English Language', avg: 81, color: 'bg-green-500' },
]

const gradingQueue = 14

export default function TeacherAnalyticsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const totalStudents = classStats.reduce((s, c) => s + c.students, 0)
  const overallAvg    = Math.round(classStats.reduce((s, c) => s + c.avgGrade, 0) / classStats.length)
  const totalAtRisk   = classStats.reduce((s, c) => s + c.atRisk, 0)

  return (
    <DashboardLayout
      activePage="analytics"
      onNavigate={onNavigate}
      title="My Analytics"
      subtitle="Performance overview across all your classes"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Total Students',  value: totalStudents, Icon: Users,        color: 'bg-primary/10 text-primary'    },
            { label: 'Overall Avg',     value: `${overallAvg}%`, Icon: BarChart2, color: 'bg-green-50 text-green-600'   },
            { label: 'Pending Grading', value: gradingQueue,  Icon: BookOpen,     color: 'bg-amber-50 text-amber-600'   },
            { label: 'At-Risk Students', value: totalAtRisk,  Icon: AlertCircle,  color: 'bg-red-50 text-red-500'       },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-5">
              <div className={`size-9 rounded-full flex items-center justify-center mb-2 ${color}`}>
                <Icon size={16} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Submissions trend */}
          <div className="bg-surface rounded-card shadow-sm p-5 xl:col-span-2">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-primary" /> Assignment Submissions (Last 7 Weeks)
            </h2>
            <div className="flex items-end gap-3 h-32">
              {weeklySubmissions.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[9px] font-bold text-foreground">{v}</span>
                  <div className="w-full bg-primary rounded-t" style={{ height: `${(v / 70) * 100}%` }} />
                  <span className="text-[9px] text-muted">{weeklyLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subject averages */}
          <div className="bg-surface rounded-card shadow-sm p-5">
            <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <BarChart2 size={14} className="text-primary" /> Subject Averages
            </h2>
            <div className="flex flex-col gap-3">
              {subjectAvgs.map(s => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-foreground truncate">{s.subject}</span>
                    <span className="font-bold text-foreground ml-2">{s.avg}%</span>
                  </div>
                  <div className="h-2 bg-canvas rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.avg}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Class breakdown */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/6">
              <h2 className="text-sm font-bold text-foreground">Class Breakdown</h2>
            </div>
            <div className="divide-y divide-black/4">
              {classStats.map(c => (
                <div key={c.class} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="size-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                    {c.class.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{c.class}</p>
                    <p className="text-xs text-muted">{c.students} students · {c.attendance} attendance</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${c.avgGrade >= 75 ? 'text-green-600' : c.avgGrade >= 65 ? 'text-foreground' : 'text-amber-600'}`}>
                      {c.avgGrade}%
                    </p>
                    {c.atRisk > 0 && (
                      <p className="text-[10px] text-red-500 font-semibold">{c.atRisk} at risk</p>
                    )}
                  </div>
                  <span className={`text-base ${c.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {c.trend === 'up' ? '↑' : '↓'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top students */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/6 flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award size={13} className="text-amber-500" /> Top Students
              </h2>
              <button onClick={() => onNavigate('students')} className="text-xs text-primary font-semibold hover:underline">
                All students
              </button>
            </div>
            <div className="divide-y divide-black/4">
              {topStudents.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-sm font-bold text-muted w-5">{i + 1}</span>
                  <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted">{s.class}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">{s.avg}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Grade Submissions', page: 'submissions-inbox', color: 'bg-primary text-white' },
            { label: 'View At-Risk',      page: 'behavior-analytics', color: 'bg-red-50 text-red-600' },
            { label: 'Class Performance', page: 'class-performance',  color: 'bg-green-50 text-green-700' },
            { label: 'Export Report',     page: 'reports',            color: 'bg-canvas text-foreground' },
          ].map(a => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.page)}
              className={`h-11 rounded-card text-sm font-semibold transition-colors ${a.color} hover:opacity-90`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
