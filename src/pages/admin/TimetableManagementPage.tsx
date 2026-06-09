import { useState } from 'react'
import { Plus, Save, ChevronDown } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

const days    = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const periods = ['8:00–8:45', '8:45–9:30', '10:00–10:45', '10:45–11:30', '12:00–12:45', '1:45–2:30', '2:30–3:15']
const classes = ['SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B']
const subjects = ['Physics', 'Mathematics', 'English', 'Chemistry', 'Biology', 'Economics', 'Agric', 'CRS', 'P.E.', 'Free']

type Cell = { subject: string; teacher: string }
type Grid = Record<string, Cell>

const colors: Record<string, string> = {
  Physics:     'bg-primary/15 text-primary',
  Mathematics: 'bg-accent-mint/15 text-accent-mint',
  English:     'bg-amber-100 text-amber-700',
  Chemistry:   'bg-red-100 text-red-600',
  Biology:     'bg-green-100 text-green-700',
  Economics:   'bg-purple-100 text-purple-600',
  Agric:       'bg-lime-100 text-lime-700',
  CRS:         'bg-sky-100 text-sky-700',
  'P.E.':      'bg-orange-100 text-orange-600',
  Free:        'bg-canvas text-muted',
}

const seedGrid: Grid = {
  'Monday-0': { subject: 'Mathematics', teacher: 'Mrs Bello'   },
  'Monday-1': { subject: 'Physics',     teacher: 'Mr Adeyemi'  },
  'Monday-2': { subject: 'English',     teacher: 'Mr Okafor'   },
  'Monday-3': { subject: 'Chemistry',   teacher: 'Mrs Aliyu'   },
  'Monday-4': { subject: 'Free',        teacher: ''            },
  'Monday-5': { subject: 'Biology',     teacher: 'Dr Eze'      },
  'Monday-6': { subject: 'Economics',   teacher: 'Mr Chukwu'   },
  'Tuesday-0': { subject: 'English',    teacher: 'Mr Okafor'   },
  'Tuesday-1': { subject: 'Mathematics',teacher: 'Mrs Bello'   },
  'Tuesday-2': { subject: 'Biology',    teacher: 'Dr Eze'      },
  'Tuesday-3': { subject: 'Physics',    teacher: 'Mr Adeyemi'  },
  'Tuesday-4': { subject: 'CRS',        teacher: 'Mr Badmus'   },
  'Tuesday-5': { subject: 'Chemistry',  teacher: 'Mrs Aliyu'   },
  'Tuesday-6': { subject: 'P.E.',       teacher: 'Coach Musa'  },
}

export default function TimetableManagementPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [cls,   setCls]   = useState(classes[0])
  const [grid,  setGrid]  = useState<Grid>(seedGrid)
  const [saved, setSaved] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)

  const key = (day: string, pi: number) => `${day}-${pi}`

  function setCell(k: string, subject: string) {
    setGrid(prev => ({ ...prev, [k]: { subject, teacher: prev[k]?.teacher ?? '' } }))
    setEditing(null)
  }

  return (
    <DashboardLayout
      activePage="timetable"
      onNavigate={onNavigate}
      title="Timetable Management"
      subtitle="Manage class schedules across all periods"
      nav={adminNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-5">
        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <select
              value={cls}
              onChange={e => setCls(e.target.value)}
              className="h-10 pl-4 pr-8 border border-black/20 rounded-pill text-sm font-semibold text-foreground bg-white outline-none focus:border-primary appearance-none"
            >
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 h-10 px-4 border border-black/20 rounded-pill text-sm font-semibold text-foreground hover:bg-canvas transition-colors">
            <Plus size={14} /> Add Period
          </button>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
            className="flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            <Save size={14} /> Save Timetable
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
        </div>

        {/* Grid */}
        <div className="bg-surface rounded-card shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-canvas">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted w-28">Period</th>
                {days.map(d => (
                  <th key={d} className="px-3 py-3 text-center text-xs font-semibold text-muted">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/4">
              {periods.map((period, pi) => (
                <tr key={pi} className="hover:bg-canvas/40 transition-colors">
                  <td className="px-4 py-2.5 text-xs text-muted font-medium">{period}</td>
                  {days.map(day => {
                    const k   = key(day, pi)
                    const cell = grid[k]
                    const isEdit = editing === k
                    return (
                      <td key={day} className="px-2 py-2 text-center">
                        {isEdit ? (
                          <select
                            autoFocus
                            defaultValue={cell?.subject ?? ''}
                            onBlur={() => setEditing(null)}
                            onChange={e => setCell(k, e.target.value)}
                            className="w-full h-8 px-2 border border-primary rounded text-xs outline-none bg-white"
                          >
                            {subjects.map(s => <option key={s}>{s}</option>)}
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditing(k)}
                            className={`w-full rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${cell ? colors[cell.subject] ?? 'bg-canvas text-muted' : 'bg-black/4 text-muted/50 hover:bg-primary/8 hover:text-primary'}`}
                          >
                            {cell?.subject ?? '—'}
                          </button>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
