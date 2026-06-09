import { useState } from 'react'
import { Search, Download, CheckCircle2, ChevronDown, Save } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type ScoreCategory = 'assignment' | 'ca1' | 'ca2' | 'midterm' | 'exam'

interface StudentRow {
  id: number; name: string
  scores: Record<ScoreCategory, number | ''>
}

const catConfig: { key: ScoreCategory; label: string; max: number }[] = [
  { key: 'assignment', label: 'Assignment',  max: 10 },
  { key: 'ca1',        label: 'CA Test 1',   max: 10 },
  { key: 'ca2',        label: 'CA Test 2',   max: 10 },
  { key: 'midterm',    label: 'Mid-Term',    max: 20 },
  { key: 'exam',       label: 'Exam',        max: 50 },
]

const totalMax = catConfig.reduce((s, c) => s + c.max, 0) // 100

function computeTotal(scores: Record<ScoreCategory, number | ''>) {
  return catConfig.reduce((s, c) => {
    const v = scores[c.key]
    return s + (v === '' || isNaN(Number(v)) ? 0 : Number(v))
  }, 0)
}

function gradeLabel(score: number): { label: string; cls: string } {
  if (score >= 90) return { label: 'A+', cls: 'bg-green-50 text-green-700' }
  if (score >= 80) return { label: 'A',  cls: 'bg-green-50 text-green-700' }
  if (score >= 70) return { label: 'B',  cls: 'bg-blue-50 text-blue-700'   }
  if (score >= 60) return { label: 'C',  cls: 'bg-amber-50 text-amber-700' }
  if (score >= 50) return { label: 'D',  cls: 'bg-orange-50 text-orange-600' }
  return                   { label: 'F',  cls: 'bg-red-50 text-red-700'     }
}

const initStudents: StudentRow[] = [
  { id: 1, name: 'Amara Osei',        scores: { assignment: 9, ca1: 8, ca2: 7, midterm: 16, exam: 42 } },
  { id: 2, name: 'Kofi Asante',       scores: { assignment: 7, ca1: 6, ca2: '',midterm: 12, exam: 38 } },
  { id: 3, name: 'Fatima Al-Rashid',  scores: { assignment: 10,ca1: 9, ca2: 9, midterm: 18, exam: 47 } },
  { id: 4, name: 'James Owusu',       scores: { assignment: 5, ca1: 4, ca2: 5, midterm: 10, exam: 32 } },
  { id: 5, name: 'Akosua Mensah',     scores: { assignment: 8, ca1: 7, ca2: 7, midterm: 15, exam: 40 } },
  { id: 6, name: 'Chisom Eze',        scores: { assignment: 9, ca1: 8, ca2: 9, midterm: 17, exam: 45 } },
  { id: 7, name: 'Emmanuel Boateng',  scores: { assignment: 7, ca1: 6, ca2: 7, midterm: 13, exam: 37 } },
  { id: 8, name: 'Yetunde Adesanya',  scores: { assignment: 10,ca1: 10,ca2: 9, midterm: 19, exam: 49 } },
]

const classes  = ['SS2A', 'SS1A', 'SS2B', 'SS3A']
const subjects = ['Mathematics', 'Physics', 'English', 'Government']

export default function GradeBookPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [students, setStudents] = useState<StudentRow[]>(initStudents)
  const [search,   setSearch]   = useState('')
  const [saved,    setSaved]    = useState(false)
  const [exported, setExported] = useState(false)
  const [selClass,  setSelClass]  = useState(classes[0])
  const [selSubject,setSelSubject]= useState(subjects[0])

  const visible = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  function updateScore(id: number, key: ScoreCategory, raw: string) {
    const num = raw === '' ? '' : Math.min(catConfig.find(c => c.key === key)!.max, Math.max(0, Number(raw)))
    setStudents(prev => prev.map(s => s.id === id ? { ...s, scores: { ...s.scores, [key]: num } } : s))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function exportCSV() {
    const header = ['Student', ...catConfig.map(c => `${c.label} (/${c.max})`), 'Total', 'Grade'].join(',')
    const rows = students.map(s => {
      const total = computeTotal(s.scores)
      const { label } = gradeLabel(total)
      return [s.name, ...catConfig.map(c => s.scores[c.key] ?? ''), total, label].join(',')
    })
    const csv  = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `gradebook-${selClass}-${selSubject}.csv`; a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  const classAvg = Math.round(students.reduce((s, st) => s + computeTotal(st.scores), 0) / students.length)

  return (
    <DashboardLayout
      activePage="gradebook"
      onNavigate={onNavigate}
      title="Gradebook"
      subtitle="Enter and track scores by category for each student"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-5 max-w-[1200px]">

        {/* Class/subject selectors + search */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select value={selClass} onChange={e => setSelClass(e.target.value)}
              className="h-10 pl-4 pr-8 border border-black/15 rounded-input text-sm bg-white outline-none focus:border-primary appearance-none">
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <div className="relative">
            <select value={selSubject} onChange={e => setSelSubject(e.target.value)}
              className="h-10 pl-4 pr-8 border border-black/15 rounded-input text-sm bg-white outline-none focus:border-primary appearance-none">
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search student..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 h-10 px-4 border border-black/15 rounded-pill text-sm text-muted hover:text-foreground hover:border-primary transition-colors"
            >
              <Download size={13} />
              {exported ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={13} /> Exported</span> : 'Export CSV'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
            >
              <Save size={13} />
              {saved ? <span className="flex items-center gap-1"><CheckCircle2 size={13} /> Saved</span> : 'Save'}
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Class Average', value: `${classAvg}%`   },
            { label: 'Students',      value: students.length    },
            { label: 'Passing (≥50%)',value: students.filter(s => computeTotal(s.scores) >= 50).length },
            { label: 'At Risk (<50%)',value: students.filter(s => computeTotal(s.scores) < 50).length  },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-4">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Gradebook table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          {/* Score category headers */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: '780px' }}>
              <thead>
                {/* Category header */}
                <tr className="bg-canvas/60 border-b border-black/6">
                  <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted w-[180px]">Student</th>
                  {catConfig.map(c => (
                    <th key={c.key} className="px-3 py-2.5 text-center text-xs font-semibold text-muted">
                      <div>{c.label}</div>
                      <div className="text-[10px] text-muted/60 font-normal">/{c.max}</div>
                    </th>
                  ))}
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted">Total<div className="text-[10px] font-normal">/{totalMax}</div></th>
                  <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/4">
                {visible.map(s => {
                  const total = computeTotal(s.scores)
                  const { label, cls } = gradeLabel(total)
                  return (
                    <tr key={s.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground text-sm">{s.name}</span>
                        </div>
                      </td>
                      {catConfig.map(c => (
                        <td key={c.key} className="px-3 py-2.5 text-center">
                          <input
                            type="number"
                            value={s.scores[c.key]}
                            min={0} max={c.max}
                            onChange={e => updateScore(s.id, c.key, e.target.value)}
                            className="w-14 h-8 text-center border border-black/15 rounded-md text-sm outline-none focus:border-primary bg-canvas/50 font-semibold"
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-center">
                        <span className={`font-bold text-sm ${total >= 50 ? 'text-foreground' : 'text-red-500'}`}>{total}</span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cls}`}>{label}</span>
                      </td>
                    </tr>
                  )
                })}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={catConfig.length + 3} className="px-5 py-10 text-center text-sm text-muted">
                      No students match your search.
                    </td>
                  </tr>
                )}
              </tbody>

              {/* Max row */}
              <tfoot>
                <tr className="bg-canvas/30 border-t border-black/8">
                  <td className="px-5 py-2.5 text-xs font-semibold text-muted">Max Marks</td>
                  {catConfig.map(c => (
                    <td key={c.key} className="px-3 py-2.5 text-center text-xs font-semibold text-muted">{c.max}</td>
                  ))}
                  <td className="px-3 py-2.5 text-center text-xs font-semibold text-muted">{totalMax}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <p className="text-xs text-muted">Grades: A+ ≥90 · A ≥80 · B ≥70 · C ≥60 · D ≥50 · F &lt;50. Total is out of {totalMax} marks.</p>
      </div>
    </DashboardLayout>
  )
}
