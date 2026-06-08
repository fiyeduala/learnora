import { useState } from 'react'
import { Plus, Search, Users, BookOpen, MoreHorizontal, X, CheckCircle2, ChevronDown } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const teacherOptions = [
  'Mrs Nnduka Kisha', 'Mr Daniel Johnson', 'Mrs Gloria Ewa',
  'Mr Boris Johnson', 'Mrs Elena Bright', 'Mr Emeka Eze', 'Unassigned',
]
const subjectOptions = ['Mathematics','Physics','English Language','Chemistry','Biology','Government','Economics','Literature','CRK','History']
const levelOptions   = ['JSS1','JSS2','JSS3','SS1','SS2','SS3']
const armOptions     = ['A','B','C','D']

const classes = [
  { id: 1, name: 'SS1A', level: 'SS1', arm: 'A', teacher: 'Mrs Nnduka Kisha',  students: 32, subjects: 8, status: 'Active'   },
  { id: 2, name: 'SS1B', level: 'SS1', arm: 'B', teacher: 'Mr Daniel Johnson', students: 30, subjects: 8, status: 'Active'   },
  { id: 3, name: 'SS2A', level: 'SS2', arm: 'A', teacher: 'Mrs Gloria Ewa',    students: 29, subjects: 9, status: 'Active'   },
  { id: 4, name: 'SS2B', level: 'SS2', arm: 'B', teacher: 'Mr Boris Johnson',  students: 28, subjects: 9, status: 'Active'   },
  { id: 5, name: 'SS3A', level: 'SS3', arm: 'A', teacher: 'Mrs Elena Bright',  students: 31, subjects: 9, status: 'Active'   },
  { id: 6, name: 'SS3B', level: 'SS3', arm: 'B', teacher: 'Unassigned',        students: 27, subjects: 8, status: 'Inactive' },
  { id: 7, name: 'JSS1', level: 'JSS1',arm: 'A', teacher: 'Mr Emeka Eze',      students: 35, subjects: 8, status: 'Active'   },
]

export default function ClassesManagementPage({ onNavigate }: Props) {
  const [search,      setSearch]      = useState('')
  const [showCreate,  setShowCreate]  = useState(false)
  const [created,     setCreated]     = useState(false)
  const [newLevel,    setNewLevel]    = useState('SS1')
  const [newArm,      setNewArm]      = useState('A')
  const [newTeacher,  setNewTeacher]  = useState('Unassigned')
  const [newSubjects, setNewSubjects] = useState<string[]>(['Mathematics'])

  function toggleSubject(s: string) {
    setNewSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.teacher.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout
      activePage="classes-management"
      onNavigate={onNavigate}
      title="Classes Management"
      subtitle="Manage all school classes and form teachers"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Classes',  value: `${classes.length}` },
            { label: 'Total Students', value: `${classes.reduce((a, c) => a + c.students, 0)}` },
            { label: 'Unassigned',     value: `${classes.filter(c => c.teacher === 'Unassigned').length}` },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-[400px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search classes or teachers..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
          </div>
          <button
            onClick={() => { setShowCreate(true); setCreated(false) }}
            className="flex items-center gap-1.5 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary ml-auto"
          >
            <Plus size={13} /> New Class
          </button>
        </div>

        {/* Classes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-surface rounded-card shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{c.level} · Arm {c.arm}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    c.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                  }`}>{c.status}</span>
                  <button className="text-muted hover:text-foreground"><MoreHorizontal size={15} /></button>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 text-sm text-muted mb-4">
                <div className="flex items-center gap-2">
                  <Users size={13} />{c.students} students
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={13} />{c.subjects} subjects
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded-full bg-primary/10 text-primary text-[9px] font-bold flex items-center justify-center">{c.teacher.charAt(0)}</div>
                  <span className={c.teacher === 'Unassigned' ? 'text-red-500 font-semibold' : ''}>{c.teacher}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => onNavigate('class-details')} className="flex-1 h-8 border border-primary text-primary text-xs font-semibold rounded-pill hover:bg-primary hover:text-white transition-colors">
                  View Details
                </button>
                <button onClick={() => onNavigate('attendance')} className="flex-1 h-8 border border-black/15 text-muted text-xs font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                  Attendance
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Create Class Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreate(false)} />
          <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-foreground">{created ? 'Class Created' : 'Create New Class'}</h2>
              <button onClick={() => setShowCreate(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
            </div>

            {created ? (
              <div className="p-8 text-center">
                <div className="size-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{newLevel}{newArm} Created!</h3>
                <p className="text-sm text-muted mb-2">Form Teacher: <strong>{newTeacher}</strong></p>
                <p className="text-sm text-muted mb-6">Subjects: <strong>{newSubjects.join(', ')}</strong></p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => { setCreated(false) }} className="h-10 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Create Another
                  </button>
                  <button onClick={() => setShowCreate(false)} className="h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setCreated(true) }} className="p-6 flex flex-col gap-5">

                {/* Level + Arm */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Level <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select value={newLevel} onChange={e => setNewLevel(e.target.value)}
                        className="w-full h-11 pl-4 pr-8 border border-black/20 rounded-input text-sm bg-white outline-none focus:border-primary appearance-none">
                        {levelOptions.map(l => <option key={l}>{l}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Arm <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                      {armOptions.map(a => (
                        <button key={a} type="button" onClick={() => setNewArm(a)}
                          className={`flex-1 h-11 rounded-input border-2 text-sm font-bold transition-colors ${newArm === a ? 'border-primary bg-primary/8 text-primary' : 'border-black/15 text-muted hover:border-primary/40'}`}>
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-canvas rounded-card p-3 text-center">
                  <p className="text-sm text-muted">Class name: <strong className="text-foreground text-base">{newLevel}{newArm}</strong></p>
                </div>

                {/* Form teacher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Assign Form Teacher</label>
                  <p className="text-xs text-muted">Form teacher manages class admin. Subject teachers are assigned separately.</p>
                  <div className="relative">
                    <select value={newTeacher} onChange={e => setNewTeacher(e.target.value)}
                      className="w-full h-11 pl-4 pr-8 border border-black/20 rounded-input text-sm bg-white outline-none focus:border-primary appearance-none">
                      {teacherOptions.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Subjects */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Subjects Offered</label>
                  <div className="flex flex-wrap gap-2">
                    {subjectOptions.map(s => (
                      <button
                        key={s} type="button" onClick={() => toggleSubject(s)}
                        className={`h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${
                          newSubjects.includes(s)
                            ? 'border-primary bg-primary/8 text-primary'
                            : 'border-black/15 text-muted hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {newSubjects.length > 0 && (
                    <p className="text-xs text-muted">{newSubjects.length} subject{newSubjects.length > 1 ? 's' : ''} selected</p>
                  )}
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowCreate(false)}
                    className="h-11 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={newSubjects.length === 0}
                    className="flex-1 h-11 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary disabled:opacity-50">
                    Create Class
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  )
}
