import { Search, Plus, Users, BookOpen, ClipboardList, TrendingUp } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const stats = [
  { label: 'Total Students',   value: '35',  icon: Users,         color: 'text-primary'    },
  { label: 'Avg. Attendance',  value: '100', icon: BookOpen,      color: 'text-green-600'  },
  { label: 'Top Performers',   value: '20',  icon: ClipboardList, color: 'text-foreground' },
  { label: 'At-Risk Students', value: '90%', icon: TrendingUp,    color: 'text-red-600'    },
]

type Status = 'Active' | 'Pending' | 'Completed'

const assignments = [
  { title: 'Algebra Quiz',     class: 'SS1A', deadline: 'Tomorrow', submissions: '28/32', status: 'Active'    as Status, action: 'Review' },
  { title: 'Physics Report',   class: 'SS1A', deadline: 'May 30',   submissions: '18/20', status: 'Pending'   as Status, action: 'Grade'  },
  { title: 'Chemistry Notes',  class: 'SS3A', deadline: 'Today',    submissions: '32/32', status: 'Completed' as Status, action: 'View'   },
  { title: 'Biology Essay',    class: 'SS2B', deadline: 'Jun 5',    submissions: '20/28', status: 'Active'    as Status, action: 'Review' },
  { title: 'Government MCQ',   class: 'SS1A', deadline: 'Jun 10',   submissions: '10/32', status: 'Pending'   as Status, action: 'Grade'  },
]

const statusBadge: Record<Status, string> = {
  Active:    'bg-primary/10 text-primary',
  Pending:   'bg-amber-50 text-amber-700',
  Completed: 'bg-green-50 text-green-700',
}

const actionStyle: Record<Status, string> = {
  Active:    'bg-primary text-white hover:bg-primary-deep',
  Pending:   'bg-amber-500 text-white hover:bg-amber-600',
  Completed: 'text-primary hover:bg-primary/8',
}

export default function TeacherAssignmentsPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="teacher-assignments"
      onNavigate={onNavigate}
      title="Assignments"
      subtitle="Create, review and manage student assignments efficiently"
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

        {/* Search + Create */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 h-11 px-4 bg-surface border border-black/8 rounded-input flex-1 min-w-[200px] max-w-lg shadow-sm">
            <Search size={15} className="text-muted shrink-0" />
            <input
              type="search"
              placeholder="Search assignments"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>
          <button
            onClick={() => onNavigate('examinations')}
            className="flex items-center gap-2 h-11 px-4 bg-primary text-white text-sm font-semibold rounded-input shadow-primary hover:bg-primary-deep transition-colors shrink-0"
          >
            <Plus size={15} />
            New Assignment
          </button>
        </div>

        {/* Assignments table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/6">
            <h3 className="text-base font-bold text-foreground">Assignment Table</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/60">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Assignments</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Class</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Deadline</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Submission</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, i) => (
                  <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{a.title}</td>
                    <td className="px-6 py-4 text-muted">{a.class}</td>
                    <td className="px-6 py-4 text-muted whitespace-nowrap">{a.deadline}</td>
                    <td className="px-6 py-4 text-foreground">{a.submissions}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${statusBadge[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onNavigate('gradebook')}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors ${actionStyle[a.status]}`}
                      >
                        {a.action}
                      </button>
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
