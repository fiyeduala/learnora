import { useState } from 'react'
import { Search, Download, CheckCircle2, Clock, AlertCircle, ChevronDown } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type FilterStatus = 'All' | 'Submitted' | 'Pending' | 'Late'

const submissions = [
  { student: 'Olive Princely',   assignment: "Newton's Laws Quiz",    submitted: 'Jun 5, 2026 · 9:14 AM',  score: 87,  status: 'Submitted', graded: true  },
  { student: 'Yetunde Adesanya', assignment: "Newton's Laws Quiz",    submitted: 'Jun 5, 2026 · 11:02 AM', score: 79,  status: 'Submitted', graded: true  },
  { student: 'Fatima Al-Rashid', assignment: "Newton's Laws Quiz",    submitted: 'Jun 5, 2026 · 8:47 AM',  score: 94,  status: 'Submitted', graded: true  },
  { student: 'Kofi Asante',      assignment: "Newton's Laws Quiz",    submitted: '—',                      score: null, status: 'Pending',   graded: false },
  { student: 'James Owusu',      assignment: "Newton's Laws Quiz",    submitted: 'Jun 6, 2026 · 3:20 PM',  score: null, status: 'Late',      graded: false },
  { student: 'Amira Hassan',     assignment: "Newton's Laws Quiz",    submitted: 'Jun 5, 2026 · 10:30 AM', score: null, status: 'Submitted', graded: false },
  { student: 'Emmanuel Osei',    assignment: "Newton's Laws Quiz",    submitted: 'Jun 5, 2026 · 7:55 AM',  score: null, status: 'Submitted', graded: false },
  { student: 'Chidera Nwachukwu','assignment': "Newton's Laws Quiz",  submitted: '—',                      score: null, status: 'Pending',   graded: false },
]

const statusStyle: Record<FilterStatus, string> = {
  All:       '',
  Submitted: 'bg-green-50 text-green-700',
  Pending:   'bg-amber-50 text-amber-700',
  Late:      'bg-red-50 text-red-600',
}

export default function SubmissionsInboxPage({ onNavigate }: Props) {
  const [filter, setFilter] = useState<FilterStatus>('All')
  const [search, setSearch] = useState('')

  const filtered = submissions.filter(s =>
    (filter === 'All' || s.status === filter) &&
    s.student.toLowerCase().includes(search.toLowerCase())
  )

  const submitted = submissions.filter(s => s.status === 'Submitted').length
  const pending   = submissions.filter(s => s.status === 'Pending').length
  const late      = submissions.filter(s => s.status === 'Late').length

  return (
    <DashboardLayout
      activePage="teacher-assignments"
      onNavigate={onNavigate}
      title="Submissions Inbox"
      subtitle="Newton's Laws Quiz — Physics 101, SS1A"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-card p-5">
            <p className="text-3xl font-bold text-green-700">{submitted}</p>
            <p className="text-sm text-green-600 mt-0.5">Submitted</p>
          </div>
          <div className="bg-amber-50 rounded-card p-5">
            <p className="text-3xl font-bold text-amber-600">{pending}</p>
            <p className="text-sm text-amber-500 mt-0.5">Pending</p>
          </div>
          <div className="bg-red-50 rounded-card p-5">
            <p className="text-3xl font-bold text-red-600">{late}</p>
            <p className="text-sm text-red-500 mt-0.5">Late</p>
          </div>
        </div>

        {/* Filters + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by student name..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-1 bg-canvas rounded-card p-1">
            {(['All', 'Submitted', 'Pending', 'Late'] as FilterStatus[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 h-8 text-xs font-semibold rounded-md transition-colors ${
                  filter === f ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'
                }`}>{f}</button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 h-10 px-4 border border-black/15 rounded-pill text-sm text-muted hover:text-foreground transition-colors">
            <Download size={14} /> Export
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/40">
                  {['Student', 'Submitted At', 'Status', 'Score', 'Action'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{s.student.charAt(0)}</div>
                        <span className="font-medium text-foreground">{s.student}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-muted text-xs">{s.submitted}</td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${statusStyle[s.status as FilterStatus]}`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      {s.score !== null
                        ? <span className="font-bold text-green-600">{s.score}/100</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td className="px-6 py-3.5">
                      {s.status === 'Submitted' && !s.graded && (
                        <button onClick={() => onNavigate('grading-screen')} className="text-xs bg-primary text-white font-semibold px-3 py-1.5 rounded-xs hover:bg-primary-deep transition-colors">
                          Grade
                        </button>
                      )}
                      {s.graded && (
                        <button className="text-xs text-primary font-semibold hover:underline">View</button>
                      )}
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
