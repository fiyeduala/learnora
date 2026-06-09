import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, Download } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

interface StudentRow {
  id:      number
  name:    string
  initials:string
  score:   string
  comment: string
}

const initialRows: StudentRow[] = [
  { id: 1, name: 'Amara Osei',        initials: 'AO', score: '', comment: '' },
  { id: 2, name: 'Kofi Asante',       initials: 'KA', score: '', comment: '' },
  { id: 3, name: 'Fatima Al-Rashid',  initials: 'FA', score: '', comment: '' },
  { id: 4, name: 'James Owusu',       initials: 'JO', score: '', comment: '' },
  { id: 5, name: 'Akosua Mensah',     initials: 'AM', score: '', comment: '' },
  { id: 6, name: 'Chisom Eze',        initials: 'CE', score: '', comment: '' },
  { id: 7, name: 'Emmanuel Boateng',  initials: 'EB', score: '', comment: '' },
  { id: 8, name: 'Yetunde Adesanya',  initials: 'YA', score: '', comment: '' },
]

function gradeTag(score: number | null) {
  if (score === null) return null
  if (score >= 90) return { label: 'A+', cls: 'bg-green-50 text-green-700' }
  if (score >= 80) return { label: 'A',  cls: 'bg-green-50 text-green-700' }
  if (score >= 70) return { label: 'B',  cls: 'bg-blue-50 text-blue-700'   }
  if (score >= 60) return { label: 'C',  cls: 'bg-amber-50 text-amber-700' }
  return                 { label: 'F',  cls: 'bg-red-50 text-red-700'     }
}

export default function BulkGradePage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [assignment, setAssignment] = useState('Physics — Lab Report: Gravity')
  const [totalMarks, setTotalMarks] = useState(30)
  const [rows, setRows] = useState<StudentRow[]>(initialRows)
  const [saved, setSaved] = useState(false)

  function updateRow(id: number, patch: Partial<StudentRow>) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  function fillAll(val: string) {
    setRows(prev => prev.map(r => ({ ...r, score: val })))
  }

  const graded = rows.filter(r => r.score !== '').length

  return (
    <DashboardLayout
      activePage="gradebook"
      onNavigate={onNavigate}
      title="Bulk Grade"
      subtitle="Enter scores for all students in one go"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-5 max-w-[860px]">

        {/* Assignment selector */}
        <div className="bg-surface rounded-card shadow-sm p-5 flex flex-col gap-4">
          <p className="text-sm font-bold text-foreground">Assignment Details</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted mb-1 block">Assignment</label>
              <div className="relative">
                <select
                  value={assignment}
                  onChange={e => setAssignment(e.target.value)}
                  className="w-full h-10 pl-3 pr-8 border border-black/20 rounded-card text-sm outline-none focus:border-primary appearance-none"
                >
                  {[
                    'Physics — Lab Report: Gravity',
                    'Mathematics — Algebra Test',
                    'English — Essay on Shakespeare',
                    'Government — Constitutional Review',
                  ].map(a => <option key={a}>{a}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted mb-1 block">Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={e => setTotalMarks(Number(e.target.value))}
                className="w-full h-10 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-black/6">
            <p className="text-xs text-muted">{graded} / {rows.length} students graded</p>
            <div className="flex gap-2">
              <button
                onClick={() => fillAll(String(totalMarks))}
                className="h-8 px-3 text-xs font-semibold text-muted border border-black/15 rounded-full hover:border-primary hover:text-primary transition-colors"
              >
                Fill All Max
              </button>
              <button
                onClick={() => fillAll('')}
                className="h-8 px-3 text-xs font-semibold text-muted border border-black/15 rounded-full hover:border-red-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Grade table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Student</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider w-32">Score / {totalMarks}</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wider w-20">Grade</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Feedback (optional)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => {
                  const scoreNum = r.score !== '' ? Number(r.score) : null
                  const pct      = scoreNum !== null ? Math.round((scoreNum / totalMarks) * 100) : null
                  const tag      = gradeTag(pct)
                  return (
                    <tr key={r.id} className="border-b border-black/4 last:border-0 hover:bg-canvas/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {r.initials}
                          </div>
                          <span className="font-medium text-foreground">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={r.score}
                          min={0}
                          max={totalMarks}
                          onChange={e => updateRow(r.id, { score: e.target.value })}
                          placeholder="—"
                          className="w-full h-9 px-2 border border-black/15 rounded-card text-sm outline-none focus:border-primary text-center"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tag ? (
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-xs ${tag.cls}`}>{tag.label}</span>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={r.comment}
                          onChange={e => updateRow(r.id, { comment: e.target.value })}
                          placeholder="Add comment…"
                          className="w-full h-9 px-3 border border-black/15 rounded-card text-sm outline-none focus:border-primary"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            <Save size={15} /> Save & Publish Grades
          </button>
          <button className="flex items-center gap-2 h-11 px-5 border border-black/20 rounded-pill text-sm font-semibold text-foreground hover:bg-canvas transition-colors">
            <Download size={14} /> Export CSV
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
              <CheckCircle2 size={15} /> Grades published!
            </span>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
