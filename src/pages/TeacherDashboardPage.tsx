import { Plus, Play, Upload, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const stats = [
  { label: 'Active Classes',      value: '35',   color: 'text-primary'   },
  { label: 'Total Students',      value: '100',  color: 'text-foreground' },
  { label: 'Pending Submissions', value: '20',   color: 'text-amber-600' },
  { label: 'Attendance Rate',     value: '90%',  color: 'text-green-600' },
]

const schedule = [
  { time: '8:00 AM',  subject: 'Physics 101',   class: 'SS1A', type: 'Lecture'  },
  { time: '10:00 AM', subject: 'Mathematics',    class: 'SS2B', type: 'Lab'      },
  { time: '12:30 PM', subject: 'Physics 101',   class: 'SS3A', type: 'Lecture'  },
  { time: '2:00 PM',  subject: 'Mathematics',    class: 'SS1A', type: 'Tutorial' },
]

const myClasses = [
  { name: 'Physics 101',  class: 'SS1A', students: 32, progress: 68 },
  { name: 'Mathematics',  class: 'SS2B', students: 28, progress: 45 },
  { name: 'Physics 101',  class: 'SS3A', students: 30, progress: 82 },
  { name: 'Mathematics',  class: 'SS1A', students: 27, progress: 31 },
]

const recentAssignments = [
  { title: 'Algebra Quiz',    class: 'SS1A', deadline: 'Tomorrow',  submissions: '28/32', status: 'Active'    },
  { title: 'Physics Report',  class: 'SS1A', deadline: 'May 30',    submissions: '18/20', status: 'Pending'   },
  { title: 'Chemistry Notes', class: 'SS3A', deadline: 'Today',     submissions: '32/32', status: 'Completed' },
]

const recentActivity = [
  { student: 'Yetunde Adesanya', action: 'submitted Physics assignment',    time: '5 min ago'  },
  { student: 'Fatima Al-Rashid', action: 'scored 97% on Algebra Quiz',     time: '12 min ago' },
  { student: 'Kofi Asante',      action: 'joined Physics 101 live class',   time: '1 hr ago'   },
  { student: 'James Owusu',      action: 'assignment deadline passed',      time: '2 hr ago'   },
]

const statusBadge: Record<string, string> = {
  Active:    'bg-primary/10 text-primary',
  Pending:   'bg-amber-50 text-amber-700',
  Completed: 'bg-green-50 text-green-700',
}

export default function TeacherDashboardPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="teacher-dashboard"
      onNavigate={onNavigate}
      title="Dashboard"
      subtitle="Here's what's happening across your classes today"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="flex flex-col gap-6 max-w-[1300px]">

        {/* Welcome banner */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Welcome Back, Daniel!</h2>
              <p className="text-sm text-muted mt-1">Here's what's happening across your classes today.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('assignment-builder')}
                className="flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
              >
                <Plus size={14} />
                Create Assignment
              </button>
              <button
                onClick={() => onNavigate('teacher-live-classes')}
                className="flex items-center gap-2 h-10 px-4 border border-muted text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors"
              >
                <Play size={14} className="fill-current" />
                Start Live Class
              </button>
              <button
                onClick={() => onNavigate('resources')}
                className="flex items-center gap-2 h-10 px-4 border border-muted text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors"
              >
                <Upload size={14} />
                Upload Resource
              </button>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Schedule + My Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Today's Schedule */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-foreground">Today's Schedule</h3>
              <button
                onClick={() => onNavigate('teacher-calendar')}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
              >
                View full calendar <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-card bg-canvas/60">
                  <div className="shrink-0 text-center min-w-[64px]">
                    <p className="text-xs font-semibold text-primary">{s.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{s.subject}</p>
                    <p className="text-xs text-muted">{s.class} · {s.type}</p>
                  </div>
                  <button
                    onClick={() => onNavigate('teacher-live-classes')}
                    className="text-xs text-primary font-semibold hover:underline shrink-0"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* My Classes */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-foreground">My Classes</h3>
              <button
                onClick={() => onNavigate('classes')}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {myClasses.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-card bg-canvas/60">
                  <div className="size-9 rounded-card bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted">{c.class} · {c.students} students</p>
                    <div className="h-1.5 bg-black/8 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-foreground shrink-0">{c.progress}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Assignment Overview + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Assignment Overview */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/6">
              <h3 className="text-base font-bold text-foreground">Assignment Overview</h3>
              <button
                onClick={() => onNavigate('teacher-assignments')}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/6 bg-canvas/40">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Title</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Class</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Deadline</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Submissions</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssignments.map((a, i) => (
                    <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-foreground">{a.title}</td>
                      <td className="px-6 py-3.5 text-muted">{a.class}</td>
                      <td className="px-6 py-3.5 text-muted">{a.deadline}</td>
                      <td className="px-6 py-3.5 text-foreground">{a.submissions}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${statusBadge[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
              <button
                onClick={() => onNavigate('students')}
                className="text-sm text-primary font-semibold hover:underline"
              >
                View all
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {a.student.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">
                      <span className="font-semibold">{a.student}</span>{' '}
                      {a.action}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-6 pt-5 border-t border-black/6">
              <p className="text-sm font-bold text-foreground mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Grade Work',    icon: CheckCircle2, page: 'gradebook'     },
                  { label: 'Take Attendance', icon: Clock,       page: 'attendance'    },
                  { label: 'View Analytics',  icon: AlertCircle, page: 'analytics'     },
                  { label: 'Post Announcement', icon: Plus,      page: 'teacher-announcements' },
                ].map(a => {
                  const Icon = a.icon
                  return (
                    <button
                      key={a.label}
                      onClick={() => onNavigate(a.page)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-card bg-canvas hover:bg-primary/6 hover:text-primary text-muted transition-colors text-center"
                    >
                      <Icon size={16} />
                      <span className="text-xs font-medium leading-tight">{a.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
