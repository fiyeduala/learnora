import { useState } from 'react'
import { Search, ChevronDown, CheckCircle2, Clock, AlertCircle, Save, X } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }
type Status = 'Pending' | 'Completed' | 'Overdue'

interface Assignment {
  id:       number
  subject:  string
  title:    string
  deadline: string
  marks:    number
  status:   Status
}

const initialAssignments: Assignment[] = [
  { id: 1,  subject: 'Mathematics',    title: 'Algebra Test',            deadline: 'Tomorrow · 11:30 PM',       marks: 20, status: 'Pending'   },
  { id: 2,  subject: 'Basic Science',  title: 'Titration Report',        deadline: '07/08/2026 · 11:30 PM',     marks: 20, status: 'Completed' },
  { id: 3,  subject: 'English',        title: 'Essay on Shakespeare',    deadline: '07/08/2026 · 11:30 PM',     marks: 20, status: 'Overdue'   },
  { id: 4,  subject: 'Government',     title: 'Constitutional Review',   deadline: '07/08/2026 · 11:30 PM',     marks: 20, status: 'Overdue'   },
  { id: 5,  subject: 'Physics',        title: 'Lab Report — Gravity',    deadline: '12/08/2026 · 11:30 PM',     marks: 30, status: 'Pending'   },
  { id: 6,  subject: 'Mathematics',    title: 'Geometry Problem Set',    deadline: '15/08/2026 · 11:30 PM',     marks: 25, status: 'Pending'   },
]

const statusConfig: Record<Status, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  Pending:   { label: 'Pending',   cls: 'bg-amber-50 text-amber-700',  icon: Clock        },
  Completed: { label: 'Completed', cls: 'bg-green-50 text-green-700',  icon: CheckCircle2 },
  Overdue:   { label: 'Overdue',   cls: 'bg-red-50   text-red-700',    icon: AlertCircle  },
}

export default function AssignmentsPage({ onNavigate }: Props) {
  const [assignments,  setAssignments]  = useState<Assignment[]>(initialAssignments)
  const [submitting,   setSubmitting]   = useState<number | null>(null)
  const [draftText,    setDraftText]    = useState('')
  const [draftSaved,   setDraftSaved]   = useState(false)
  const [search,       setSearch]       = useState('')
  const [flashId,      setFlashId]      = useState<number | null>(null)

  const pending   = assignments.filter(a => a.status === 'Pending').length
  const completed = assignments.filter(a => a.status === 'Completed').length
  const overdue   = assignments.filter(a => a.status === 'Overdue').length

  const visible = assignments.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase())
  )

  function saveDraft() {
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2000)
  }

  function handleSubmit(id: number) {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'Completed' } : a))
    setFlashId(id)
    setSubmitting(null)
    setDraftText('')
    setTimeout(() => setFlashId(null), 3500)
  }

  return (
    <DashboardLayout
      activePage="assignments"
      onNavigate={onNavigate}
      title="Assignments"
      subtitle="Track, complete and submit assignments"
    >
      <div className="flex flex-col gap-6 max-w-[1200px]">

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {[
            { label: 'Total',     value: assignments.length, color: 'text-foreground' },
            { label: 'Pending',   value: pending,            color: 'text-amber-600'  },
            { label: 'Completed', value: completed,          color: 'text-green-600'  },
            { label: 'Overdue',   value: overdue,            color: 'text-red-600'    },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Submission success flash */}
        {flashId !== null && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-card px-5 py-3.5">
            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-green-800">Assignment submitted successfully!</p>
              <p className="text-xs text-green-700">Your teacher will review and grade your submission.</p>
            </div>
            <button onClick={() => setFlashId(null)} className="text-green-500 hover:text-green-700">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Filter row */}
        <div className="bg-surface rounded-card shadow-sm p-4 md:p-5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2.5 h-10 px-4 bg-canvas border border-black/8 rounded-input flex-1 min-w-[180px] max-w-sm">
              <Search size={15} className="text-muted shrink-0" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Assignments"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
              />
            </div>

            <button className="flex items-center gap-2 h-10 px-4 border border-black/8 bg-canvas rounded-input text-sm text-foreground hover:border-primary hover:text-primary transition-colors shrink-0">
              All Subjects <ChevronDown size={14} className="text-muted" />
            </button>

            <button className="flex items-center gap-2 h-10 px-4 border border-black/8 bg-canvas rounded-input text-sm text-foreground hover:border-primary hover:text-primary transition-colors shrink-0">
              Newest <ChevronDown size={14} className="text-muted" />
            </button>
          </div>
        </div>

        {/* Inline submit panel */}
        {submitting !== null && (() => {
          const a = assignments.find(x => x.id === submitting)!
          return (
            <div className="bg-surface rounded-card shadow-sm border-2 border-primary/20 p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">{a.subject} — {a.title}</p>
                  <p className="text-xs text-muted mt-0.5">Due: {a.deadline} · {a.marks} marks</p>
                </div>
                <button onClick={() => setSubmitting(null)} className="text-muted hover:text-foreground">
                  <X size={16} />
                </button>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted mb-1.5 block">Your Answer / Upload Response</label>
                <textarea
                  value={draftText}
                  onChange={e => setDraftText(e.target.value)}
                  rows={5}
                  placeholder="Type your answer or paste your response here…"
                  className="w-full resize-none border border-black/20 rounded-card p-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => handleSubmit(submitting)}
                  className="h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
                >
                  Submit Assignment
                </button>
                <button
                  onClick={saveDraft}
                  className="flex items-center gap-1.5 h-10 px-4 border border-black/20 rounded-pill text-sm font-semibold text-foreground hover:bg-canvas transition-colors"
                >
                  <Save size={14} /> {draftSaved ? 'Draft saved!' : 'Save Draft'}
                </button>
              </div>
            </div>
          )
        })()}

        {/* Assignments table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/60">
                  <th className="text-left px-4 md:px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Subject</th>
                  <th className="text-left px-4 md:px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Assignment</th>
                  <th className="text-left px-4 md:px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider hidden sm:table-cell">Deadline</th>
                  <th className="text-center px-4 md:px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Marks</th>
                  <th className="text-left px-4 md:px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 md:px-6 py-4 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => {
                  const s = statusConfig[a.status]
                  const StatusIcon = s.icon
                  const isFlashing = flashId === a.id
                  return (
                    <tr key={a.id} className={`border-b border-black/4 last:border-0 transition-colors ${isFlashing ? 'bg-green-50' : 'hover:bg-canvas/40'}`}>
                      <td className="px-4 md:px-6 py-4 font-medium text-foreground">{a.subject}</td>
                      <td className="px-4 md:px-6 py-4 text-foreground">{a.title}</td>
                      <td className="px-4 md:px-6 py-4 text-muted whitespace-nowrap hidden sm:table-cell">{a.deadline}</td>
                      <td className="px-4 md:px-6 py-4 text-center text-foreground hidden md:table-cell">{a.marks}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xs ${s.cls}`}>
                          <StatusIcon size={11} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        {a.status === 'Completed' ? (
                          <button
                            onClick={() => onNavigate('assignment-details')}
                            className="text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors text-primary hover:bg-primary/8"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => { setSubmitting(a.id); setDraftText('') }}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors ${
                              a.status === 'Overdue' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-primary text-white hover:bg-primary-deep'
                            }`}
                          >
                            Submit
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
