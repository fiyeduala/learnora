import { Plus, Search } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const exams = [
  { title: 'Algebra Quiz',    class: 'SS1A', deadline: 'Tomorrow',   submissions: '28/32', status: 'Active',    action: 'Review'  },
  { title: 'Physics Report',  class: 'SS1A', deadline: 'May 30',     submissions: '18/20', status: 'Pending',   action: 'Grade'   },
  { title: 'Chemistry Notes', class: 'SS3A', deadline: 'Today',      submissions: '32/32', status: 'Completed', action: 'View'    },
  { title: 'Biology Test',    class: 'SS2B', deadline: 'June 15',    submissions: '0/28',  status: 'Upcoming',  action: 'Preview' },
  { title: 'History Essay',   class: 'SS2A', deadline: 'June 20',    submissions: '0/25',  status: 'Upcoming',  action: 'Preview' },
  { title: 'Government MCQ',  class: 'SS3B', deadline: 'June 25',    submissions: '0/30',  status: 'Upcoming',  action: 'Preview' },
]

const statusStyle: Record<string, string> = {
  Active:    'bg-primary/10 text-primary',
  Pending:   'bg-amber-50 text-amber-700',
  Completed: 'bg-green-50 text-green-700',
  Upcoming:  'bg-gray-100 text-gray-500',
}

const actionStyle: Record<string, string> = {
  Review:  'bg-amber-500 text-white hover:bg-amber-600',
  Grade:   'bg-primary text-white hover:bg-primary-deep',
  View:    'text-primary hover:bg-primary/8',
  Preview: 'text-muted hover:bg-canvas',
}

export default function ExaminationsPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="examinations"
      onNavigate={onNavigate}
      title="Examinations"
      subtitle="Manage assessments and track student submissions"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="flex flex-col gap-6 max-w-[1200px]">

        {/* Header */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-foreground">Assessment Management</h2>
              <p className="text-sm text-muted mt-1">
                Create, distribute, and review examinations and assignments for your classes.
              </p>
            </div>
            <button className="flex items-center gap-2 h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary shrink-0">
              <Plus size={15} />
              New Assessment
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Total',     value: `${exams.length}`, color: 'text-foreground' },
              { label: 'Active',    value: '1',               color: 'text-primary' },
              { label: 'Pending',   value: '1',               color: 'text-amber-600' },
              { label: 'Completed', value: '1',               color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="bg-canvas rounded-card p-4">
                <p className="text-xs text-muted">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2.5 h-10 px-4 bg-canvas border border-black/8 rounded-input mt-5 max-w-sm">
            <Search size={15} className="text-muted shrink-0" />
            <input
              type="search"
              placeholder="Search assessments..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>
        </div>

        {/* Examinations table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/60">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Assignment</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Class</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Deadline</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Submission</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, i) => (
                  <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{exam.title}</td>
                    <td className="px-6 py-4 text-muted">{exam.class}</td>
                    <td className="px-6 py-4 text-muted">{exam.deadline}</td>
                    <td className="px-6 py-4 text-foreground">{exam.submissions}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${statusStyle[exam.status]}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors ${actionStyle[exam.action]}`}
                      >
                        {exam.action}
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
