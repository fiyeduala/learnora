import { Search, ChevronDown, Users, BookOpen, ClipboardList, TrendingUp } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const stats = [
  { label: 'Total Students',   value: '—', icon: Users,         color: 'text-primary'    },
  { label: 'Avg. Attendance',  value: '—', icon: BookOpen,      color: 'text-green-600'  },
  { label: 'Top Performers',   value: '—', icon: ClipboardList, color: 'text-foreground' },
  { label: 'At-Risk Students', value: '—', icon: TrendingUp,    color: 'text-red-600'    },
]

type StatusKey = 'Excellent' | 'Average' | 'At Risk' | 'Good'

const students: { name: string; class: string; attendance: string; avgScore: string; status: StatusKey }[] = []

const statusBadge: Record<StatusKey, string> = {
  Excellent: 'bg-green-50 text-green-700',
  Average:   'bg-amber-50 text-amber-700',
  'At Risk': 'bg-red-50 text-red-700',
  Good:      'bg-primary/10 text-primary',
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return (
    <div className="size-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
      {initials}
    </div>
  )
}

export default function StudentsManagementPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="students"
      onNavigate={onNavigate}
      title="Students"
      subtitle="Manage and monitor student performance and activity."
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="flex flex-col gap-6 max-w-[1300px]">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-surface rounded-card shadow-sm p-5 flex items-start gap-3">
                <div className="size-[35px] rounded-md bg-canvas flex items-center justify-center text-primary shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted mt-0.5 leading-snug">{s.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search + filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 h-11 px-4 bg-surface border border-black/8 rounded-input flex-1 min-w-[200px] max-w-lg shadow-sm">
            <Search size={15} className="text-muted shrink-0" />
            <input
              type="search"
              placeholder="Search Courses"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>
          <button className="flex items-center gap-2 h-11 px-4 bg-surface border border-black/8 rounded-input text-sm text-foreground shadow-sm hover:border-primary hover:text-primary transition-colors shrink-0">
            All Courses
            <ChevronDown size={14} className="text-muted" />
          </button>
        </div>

        {/* Students table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/60">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Class</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Attendance</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Average Score</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-muted">No students yet.</td></tr>
                ) : students.map((s, i) => (
                  <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} />
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">{s.class}</td>
                    <td className="px-6 py-4 text-foreground">{s.attendance}</td>
                    <td className="px-6 py-4 text-foreground">{s.avgScore}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${statusBadge[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onNavigate('student-profile')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination stub */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-black/4">
            <button className="size-8 rounded-md border border-black/10 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
              ‹
            </button>
            <span className="text-sm text-foreground font-semibold px-2">1</span>
            <button className="size-8 rounded-md border border-black/10 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
              ›
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
