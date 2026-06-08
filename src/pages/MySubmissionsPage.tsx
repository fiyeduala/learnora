import { useState } from 'react'
import { FileText, CheckCircle2, Clock, XCircle, Search, ChevronRight, Star } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }
type Filter = 'All' | 'Graded' | 'Submitted' | 'Late' | 'Returned'

interface Submission {
  id:         number
  title:      string
  subject:    string
  submittedOn: string
  dueDate:    string
  status:     'Graded' | 'Submitted' | 'Late' | 'Returned'
  score?:     number
  maxScore?:  number
  feedback?:  string
  late:       boolean
}

const submissions: Submission[] = [
  { id: 1,  title: 'Quadratic Equations Problem Set',    subject: 'Mathematics',      submittedOn: 'Jun 5, 2026',  dueDate: 'Jun 5, 2026',  status: 'Graded',    score: 88,  maxScore: 100, feedback: 'Great work on factorisation. Review completing the square.',       late: false },
  { id: 2,  title: 'English Essay — My Hero',            subject: 'English Language', submittedOn: 'Jun 3, 2026',  dueDate: 'Jun 3, 2026',  status: 'Graded',    score: 74,  maxScore: 100, feedback: 'Good structure but needs stronger vocabulary in paragraphs 2–3.',   late: false },
  { id: 3,  title: 'Newton Laws Practical Report',       subject: 'Physics',          submittedOn: 'May 28, 2026', dueDate: 'May 27, 2026', status: 'Graded',    score: 81,  maxScore: 100, feedback: 'Solid analysis. Slight error in the friction calculation.',          late: true  },
  { id: 4,  title: 'Titration Lab Report',               subject: 'Chemistry',        submittedOn: 'May 20, 2026', dueDate: 'May 20, 2026', status: 'Graded',    score: 92,  maxScore: 100, feedback: 'Excellent precision and clear methodology.',                        late: false },
  { id: 5,  title: 'Cell Division Diagram',              subject: 'Biology',          submittedOn: 'Jun 6, 2026',  dueDate: 'Jun 7, 2026',  status: 'Submitted', late: false },
  { id: 6,  title: 'Demand & Supply Essay',              subject: 'Economics',        submittedOn: 'Jun 4, 2026',  dueDate: 'Jun 3, 2026',  status: 'Late',      late: true  },
  { id: 7,  title: 'Algebra Test Paper',                 subject: 'Mathematics',      submittedOn: 'May 10, 2026', dueDate: 'May 10, 2026', status: 'Returned',  score: 65,  maxScore: 100, feedback: 'Returned for revision — please redo questions 4, 7, and 9.',       late: false },
  { id: 8,  title: 'Reading Comprehension — Passage B',  subject: 'English Language', submittedOn: 'May 2, 2026',  dueDate: 'May 2, 2026',  status: 'Graded',    score: 79,  maxScore: 100, feedback: 'Good inference skills. Work on your concluding statements.',        late: false },
]

const statusConfig: Record<string, { color: string; icon: typeof FileText; label: string }> = {
  Graded:    { color: 'bg-green-50 text-green-700',  icon: CheckCircle2, label: 'Graded'    },
  Submitted: { color: 'bg-primary/10 text-primary',  icon: Clock,        label: 'Submitted' },
  Late:      { color: 'bg-amber-50 text-amber-700',  icon: Clock,        label: 'Late'      },
  Returned:  { color: 'bg-red-50 text-red-600',      icon: XCircle,      label: 'Returned'  },
}

function scoreColor(score: number) {
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-primary'
  return 'text-amber-600'
}

export default function MySubmissionsPage({ onNavigate }: Props) {
  const [filter,   setFilter]   = useState<Filter>('All')
  const [query,    setQuery]    = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = submissions.filter(s =>
    (filter === 'All' || s.status === filter) &&
    (!query || s.title.toLowerCase().includes(query.toLowerCase()) || s.subject.toLowerCase().includes(query.toLowerCase()))
  )

  const graded   = submissions.filter(s => s.status === 'Graded')
  const avgScore = graded.length
    ? Math.round(graded.reduce((sum, s) => sum + (s.score ?? 0), 0) / graded.length)
    : 0

  return (
    <DashboardLayout
      activePage="assignments"
      onNavigate={onNavigate}
      title="My Submissions"
      subtitle="All your submitted assignments and grades"
    >
      <div className="flex flex-col gap-5 max-w-[860px]">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Submitted', value: submissions.length },
            { label: 'Graded',          value: graded.length },
            { label: 'Average Score',   value: `${avgScore}%` },
            { label: 'Late',            value: submissions.filter(s => s.late).length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-4">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search submissions…"
              className="h-9 pl-9 pr-4 border border-black/20 rounded-full text-sm outline-none focus:border-primary w-52"
            />
          </div>
          <div className="flex gap-1.5">
            {(['All', 'Graded', 'Submitted', 'Late', 'Returned'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-foreground shadow-sm'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="divide-y divide-black/4">
            {filtered.map(sub => {
              const cfg  = statusConfig[sub.status]
              const Icon = cfg.icon
              const open = expanded === sub.id
              return (
                <div key={sub.id}>
                  <button
                    onClick={() => setExpanded(open ? null : sub.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-canvas/50 transition-colors"
                  >
                    <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${cfg.color}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{sub.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted flex-wrap">
                        <span>{sub.subject}</span>
                        <span>·</span>
                        <span>Submitted {sub.submittedOn}</span>
                        {sub.late && <span className="text-amber-600 font-semibold">· Late</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {sub.score !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400" fill="#fbbf24" />
                          <span className={`text-sm font-bold ${scoreColor(sub.score)}`}>{sub.score}/{sub.maxScore}</span>
                        </div>
                      )}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                      <ChevronRight size={14} className={`text-muted transition-transform ${open ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {open && (
                    <div className="px-5 pb-4 pt-0 ml-[52px]">
                      <div className="bg-canvas rounded-card p-4 text-sm">
                        <div className="flex justify-between text-xs text-muted mb-2">
                          <span>Due: {sub.dueDate}</span>
                          <span>Submitted: {sub.submittedOn}</span>
                        </div>
                        {sub.feedback && (
                          <div>
                            <p className="text-xs font-bold text-muted mb-1">Teacher Feedback</p>
                            <p className="text-sm text-foreground leading-relaxed">{sub.feedback}</p>
                          </div>
                        )}
                        {sub.status === 'Submitted' && (
                          <p className="text-xs text-muted italic">Awaiting teacher review.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">
              <FileText size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No submissions match your filter</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
