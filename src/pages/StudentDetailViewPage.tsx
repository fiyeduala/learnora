import { ArrowLeft, BookOpen, Calendar, AlertCircle, MessageSquare, TrendingUp, Award, Clock } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const student = {
  name:        'Daniel Aliyu',
  class:       'SS2A',
  email:       'daniel.aliyu@greenfield.edu',
  initials:    'DA',
  gpa:         2.8,
  rank:        18,
  attendance:  '71%',
  risk:        'At Risk',
  streak:      2,
  lastActive:  '2 days ago',
}

const subjectScores = [
  { subject: 'Mathematics',      score: 58, trend: 'down' },
  { subject: 'English Language', score: 66, trend: 'flat' },
  { subject: 'Physics',          score: 48, trend: 'down' },
  { subject: 'Chemistry',        score: 61, trend: 'up'   },
  { subject: 'Biology',          score: 55, trend: 'down' },
  { subject: 'Economics',        score: 72, trend: 'up'   },
]

const attendanceMonths = [
  { month: 'Jan', pct: 82 }, { month: 'Feb', pct: 78 }, { month: 'Mar', pct: 74 },
  { month: 'Apr', pct: 70 }, { month: 'May', pct: 68 }, { month: 'Jun', pct: 71 },
]

const behaviorFlags = [
  { date: 'Jun 2, 2026',  flag: 'Missed 3 consecutive classes', type: 'attendance' },
  { date: 'May 28, 2026', flag: 'Late submission on Physics lab', type: 'academic'  },
  { date: 'May 15, 2026', flag: 'Score dropped below 60% in Physics', type: 'academic' },
]

const recentSubmissions = [
  { title: 'Algebra Problem Set', subject: 'Math',    score: 55, date: 'Jun 5' },
  { title: 'Titration Report',    subject: 'Chem',    score: 61, date: 'May 20' },
  { title: 'Newton Laws Report',  subject: 'Physics', score: 48, date: 'May 28' },
]

function trendIcon(t: string) {
  if (t === 'up')   return <span className="text-green-500 text-xs">↑</span>
  if (t === 'down') return <span className="text-red-500 text-xs">↓</span>
  return <span className="text-muted text-xs">—</span>
}

export default function StudentDetailViewPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="students"
      onNavigate={onNavigate}
      title="Student Detail"
      nav={[
        { label: 'Dashboard',   icon: BookOpen,     page: 'teacher-dashboard'  },
        { label: 'My Classes',  icon: BookOpen,     page: 'classes'            },
        { label: 'Students',    icon: BookOpen,     page: 'students'           },
        { label: 'Performance', icon: TrendingUp,   page: 'class-performance'  },
        { label: 'Behavior',    icon: AlertCircle,  page: 'behavior-analytics' },
        { label: 'Settings',    icon: Calendar,     page: 'settings'           },
      ]}
      user={{ name: 'Mr Johnson', role: 'Teacher', initials: 'MJ' }}
    >
      <div className="flex flex-col gap-5 max-w-[920px]">
        <button onClick={() => onNavigate('students')} className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Students
        </button>

        {/* Header */}
        <div className="bg-surface rounded-card shadow-sm p-6 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-primary/10 text-primary text-xl font-bold flex items-center justify-center">
              {student.initials}
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{student.name}</h1>
              <p className="text-sm text-muted">{student.class} · {student.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <AlertCircle size={10} /> {student.risk}
                </span>
                <span className="text-xs text-muted">Last active {student.lastActive}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('teacher-messages')}
              className="flex items-center gap-2 h-9 px-4 bg-primary text-white text-xs font-bold rounded-full shadow-primary hover:bg-primary-deep transition-colors"
            >
              <MessageSquare size={13} /> Message
            </button>
            <button className="h-9 px-4 border border-black/20 text-xs font-semibold rounded-full hover:bg-canvas transition-colors">
              View Full Profile
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'GPA',        value: student.gpa,         Icon: Award,       color: 'bg-amber-50 text-amber-600'  },
            { label: 'Class Rank', value: `#${student.rank}`,  Icon: TrendingUp,  color: 'bg-primary/10 text-primary'  },
            { label: 'Attendance', value: student.attendance,  Icon: Calendar,    color: 'bg-red-50 text-red-500'      },
            { label: 'Study Streak', value: `${student.streak}d`, Icon: Clock,   color: 'bg-canvas text-muted'        },
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Subject scores */}
          <div className="bg-surface rounded-card shadow-sm p-5">
            <h2 className="text-sm font-bold text-foreground mb-4">Subject Performance</h2>
            <div className="flex flex-col gap-3">
              {subjectScores.map(s => (
                <div key={s.subject} className="flex items-center gap-3">
                  <p className="text-xs text-muted w-32 shrink-0">{s.subject}</p>
                  <div className="flex-1 h-2 bg-canvas rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.score >= 70 ? 'bg-green-500' : s.score >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${s.score}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold w-8 text-right ${s.score < 60 ? 'text-red-500' : 'text-foreground'}`}>{s.score}</span>
                  {trendIcon(s.trend)}
                </div>
              ))}
            </div>
          </div>

          {/* Attendance chart */}
          <div className="bg-surface rounded-card shadow-sm p-5">
            <h2 className="text-sm font-bold text-foreground mb-4">Attendance Trend (2026)</h2>
            <div className="flex items-end gap-3 h-24">
              {attendanceMonths.map(({ month, pct }) => (
                <div key={month} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[9px] text-muted">{pct}%</span>
                  <div
                    className={`w-full rounded-t ${pct < 70 ? 'bg-red-400' : 'bg-primary'}`}
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-[9px] text-muted">{month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-red-500 mt-3 font-semibold flex items-center gap-1">
              <AlertCircle size={11} /> Attendance declining — below 75% threshold
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Behavior flags */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/6">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <AlertCircle size={13} className="text-red-500" /> Behavior Flags
              </h2>
            </div>
            <div className="divide-y divide-black/4">
              {behaviorFlags.map((f, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`size-2 rounded-full mt-2 shrink-0 ${f.type === 'attendance' ? 'bg-red-400' : 'bg-amber-400'}`} />
                  <div>
                    <p className="text-sm text-foreground">{f.flag}</p>
                    <p className="text-xs text-muted mt-0.5">{f.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent submissions */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-black/6">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen size={13} className="text-primary" /> Recent Submissions
              </h2>
            </div>
            <div className="divide-y divide-black/4">
              {recentSubmissions.map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                    <p className="text-xs text-muted">{r.subject} · {r.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${r.score < 60 ? 'text-red-500' : 'text-foreground'}`}>{r.score}/100</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
