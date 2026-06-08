import { useState } from 'react'
import { Award, CheckCircle2, Clock, AlertCircle, Eye, Globe, X, ChevronRight } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type SubmissionStatus = 'pending' | 'submitted' | 'published'

interface ClassResult {
  id:        string
  class:     string
  teacher:   string
  students:  number
  submitted: number
  status:    SubmissionStatus
  term:      string
}

const initialClasses: ClassResult[] = [
  { id: 'ss1a', class: 'SS1A', teacher: 'Mr Johnson',     students: 38, submitted: 38, status: 'submitted', term: 'Second Term 2025/2026' },
  { id: 'ss2a', class: 'SS2A', teacher: 'Mrs Elena',      students: 35, submitted: 35, status: 'published', term: 'Second Term 2025/2026' },
  { id: 'ss2b', class: 'SS2B', teacher: 'Mr Okonkwo',     students: 32, submitted: 32, status: 'submitted', term: 'Second Term 2025/2026' },
  { id: 'ss3a', class: 'SS3A', teacher: 'Mrs Adeyemi',    students: 30, submitted: 30, status: 'submitted', term: 'Second Term 2025/2026' },
  { id: 'jss1', class: 'JSS1', teacher: 'Mr Bello',       students: 42, submitted: 40, status: 'pending',   term: 'Second Term 2025/2026' },
  { id: 'jss2', class: 'JSS2', teacher: 'Mrs Okafor',     students: 39, submitted: 39, status: 'submitted', term: 'Second Term 2025/2026' },
  { id: 'jss3', class: 'JSS3', teacher: 'Mr Ibrahim',     students: 36, submitted: 0,  status: 'pending',   term: 'Second Term 2025/2026' },
]

const sampleGrades = [
  { student: 'Olive Princely',    maths: 92, english: 75, physics: 88, govt: 65, avg: 80,  grade: 'A'  },
  { student: 'Fatima Al-Rashid',  maths: 98, english: 94, physics: 95, govt: 91, avg: 94,  grade: 'A+' },
  { student: 'James Owusu',       maths: 71, english: 68, physics: 74, govt: 79, avg: 73,  grade: 'B'  },
  { student: 'Amira Hassan',      maths: 85, english: 88, physics: 80, govt: 76, avg: 82,  grade: 'A'  },
  { student: 'Chidera Eze',       maths: 60, english: 72, physics: 65, govt: 70, avg: 67,  grade: 'C'  },
]

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground"><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function AdminResultsPage({ onNavigate }: Props) {
  const [classes,    setClasses]    = useState<ClassResult[]>(initialClasses)
  const [reviewing,  setReviewing]  = useState<ClassResult | null>(null)
  const [publishing, setPublishing] = useState<ClassResult | null>(null)
  const [flash,      setFlash]      = useState('')

  function showFlash(msg: string) {
    setFlash(msg)
    setTimeout(() => setFlash(''), 3500)
  }

  function publishClass(id: string) {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, status: 'published' } : c))
    setPublishing(null)
    setReviewing(null)
    showFlash('Results published — students and parents can now view their report cards.')
  }

  const submitted  = classes.filter(c => c.status === 'submitted').length
  const published  = classes.filter(c => c.status === 'published').length
  const pending    = classes.filter(c => c.status === 'pending').length

  const statusConfig: Record<SubmissionStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
    pending:   { label: 'Grades Pending',    cls: 'bg-amber-50 text-amber-700',  icon: Clock         },
    submitted: { label: 'Ready to Publish',  cls: 'bg-blue-50  text-blue-700',   icon: AlertCircle   },
    published: { label: 'Published',         cls: 'bg-green-50 text-green-700',  icon: CheckCircle2  },
  }

  return (
    <DashboardLayout
      activePage="admin-results"
      onNavigate={onNavigate}
      title="Results Management"
      subtitle="Review and publish end-of-term results"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        {/* Flash toast */}
        {flash && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white text-sm font-semibold px-5 py-3.5 rounded-card shadow-lg">
            <CheckCircle2 size={16} /> {flash}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-surface rounded-card shadow-sm p-5">
            <p className="text-3xl font-bold text-amber-500">{pending}</p>
            <p className="text-sm text-muted mt-1">Grades Pending</p>
          </div>
          <div className="bg-surface rounded-card shadow-sm p-5">
            <p className="text-3xl font-bold text-blue-500">{submitted}</p>
            <p className="text-sm text-muted mt-1">Ready to Publish</p>
          </div>
          <div className="bg-surface rounded-card shadow-sm p-5">
            <p className="text-3xl font-bold text-green-600">{published}</p>
            <p className="text-sm text-muted mt-1">Published</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-primary/6 border border-primary/20 rounded-card px-5 py-3.5 text-sm text-primary font-medium flex items-center gap-3">
          <Award size={16} className="shrink-0" />
          <span>Once published, students and parents can view report cards in their dashboard. This action cannot be undone.</span>
        </div>

        {/* Classes table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/6">
            <h3 className="text-base font-bold text-foreground">Classes — Second Term 2025/2026</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/50">
                  {['Class', 'Class Teacher', 'Students', 'Grades', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map(c => {
                  const sc = statusConfig[c.status]
                  const StatusIcon = sc.icon
                  return (
                    <tr key={c.id} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-foreground">{c.class}</td>
                      <td className="px-5 py-4 text-muted">{c.teacher}</td>
                      <td className="px-5 py-4 text-foreground">{c.students}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold ${c.status === 'pending' ? 'text-amber-600' : 'text-green-600'}`}>
                          {c.submitted}/{c.students} submitted
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xs ${sc.cls}`}>
                          <StatusIcon size={11} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {c.status !== 'pending' && (
                            <button onClick={() => setReviewing(c)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                              <Eye size={12} /> Review
                            </button>
                          )}
                          {c.status === 'submitted' && (
                            <>
                              <span className="text-black/15">|</span>
                              <button onClick={() => setPublishing(c)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:underline">
                                <Globe size={12} /> Publish
                              </button>
                            </>
                          )}
                          {c.status === 'published' && (
                            <>
                              <span className="text-black/15">|</span>
                              <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                <CheckCircle2 size={11} /> Live
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Publish all ready button */}
        {submitted > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                setClasses(prev => prev.map(c => c.status === 'submitted' ? { ...c, status: 'published' } : c))
                showFlash(`Published results for ${submitted} class${submitted > 1 ? 'es' : ''}.`)
              }}
              className="h-11 px-6 bg-green-600 text-white text-sm font-semibold rounded-pill hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Globe size={15} /> Publish All Ready ({submitted})
            </button>
          </div>
        )}

      </div>

      {/* Review modal */}
      {reviewing && (
        <Modal onClose={() => setReviewing(null)} title={`Review Grades — ${reviewing.class} (${reviewing.term})`}>
          <div className="p-6">
            <p className="text-sm text-muted mb-4">Class Teacher: <span className="font-semibold text-foreground">{reviewing.teacher}</span></p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/8 bg-canvas/40">
                    {['Student', 'Maths', 'English', 'Physics', 'Govt', 'Avg', 'Grade'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleGrades.map((g, i) => (
                    <tr key={i} className="border-b border-black/4 last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{g.student}</td>
                      <td className="px-4 py-3 text-center text-muted">{g.maths}</td>
                      <td className="px-4 py-3 text-center text-muted">{g.english}</td>
                      <td className="px-4 py-3 text-center text-muted">{g.physics}</td>
                      <td className="px-4 py-3 text-center text-muted">{g.govt}</td>
                      <td className="px-4 py-3 text-center font-bold text-foreground">{g.avg}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-xs ${
                          g.grade.startsWith('A') ? 'bg-green-50 text-green-700' :
                          g.grade === 'B'         ? 'bg-blue-50 text-blue-700'   :
                          'bg-amber-50 text-amber-700'
                        }`}>{g.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reviewing.status === 'submitted' && (
              <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-black/8">
                <button onClick={() => setReviewing(null)}
                  className="h-10 px-5 border border-black/15 rounded-pill text-sm font-semibold text-muted hover:text-foreground transition-colors">
                  Close
                </button>
                <button onClick={() => setPublishing(reviewing)}
                  className="h-10 px-5 bg-green-600 text-white text-sm font-semibold rounded-pill hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Globe size={14} /> Publish Results
                </button>
              </div>
            )}
            {reviewing.status === 'published' && (
              <div className="mt-5 pt-5 border-t border-black/8 flex items-center gap-2 text-green-600 text-sm font-semibold">
                <CheckCircle2 size={16} /> Results are live — students and parents can view them.
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Publish confirm modal */}
      {publishing && !reviewing && (
        <Modal onClose={() => setPublishing(null)} title={`Publish Results — ${publishing.class}`}>
          <div className="p-6 flex flex-col gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-card p-4 text-sm text-amber-800">
              <p className="font-bold mb-1">This action cannot be undone.</p>
              <p>Publishing will make results visible to all {publishing.students} students in <span className="font-semibold">{publishing.class}</span> and their parents.</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={() => setPublishing(null)}
                className="flex-1 h-11 border border-black/15 rounded-pill text-sm font-semibold text-muted hover:text-foreground transition-colors">
                Cancel
              </button>
              <button onClick={() => publishClass(publishing.id)}
                className="flex-1 h-11 bg-green-600 text-white text-sm font-semibold rounded-pill hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Globe size={14} /> Publish Now
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}
