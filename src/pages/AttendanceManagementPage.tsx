import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, ChevronDown, Save } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }
type Status = 'present' | 'absent' | 'late' | null

const students = [
  'Olive Princely', 'Yetunde Adesanya', 'Fatima Al-Rashid', 'Kofi Asante',
  'James Owusu', 'Amira Hassan', 'Emmanuel Osei', 'Chidera Nwachukwu',
  'Zainab Usman', 'David Mensah', 'Priya Nair', 'Samuel Adeyemi',
]

const classes = ['Physics 101 · SS1A', 'Mathematics · SS2B', 'Physics 101 · SS3A']

export default function AttendanceManagementPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [selectedClass, setSelectedClass] = useState(classes[0])
  const [attendance, setAttendance] = useState<Record<string, Status>>({})
  const [saved, setSaved] = useState(false)

  function mark(student: string, status: Status) {
    setAttendance(prev => ({ ...prev, [student]: prev[student] === status ? null : status }))
    setSaved(false)
  }

  function markAll(status: Status) {
    const next: Record<string, Status> = {}
    students.forEach(s => { next[s] = status })
    setAttendance(next)
    setSaved(false)
  }

  const present = students.filter(s => attendance[s] === 'present').length
  const absent  = students.filter(s => attendance[s] === 'absent').length
  const late    = students.filter(s => attendance[s] === 'late').length

  return (
    <DashboardLayout
      activePage="attendance"
      onNavigate={onNavigate}
      title="Attendance"
      subtitle="Record and manage class attendance"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[900px] flex flex-col gap-6">

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="h-11 pl-4 pr-10 border border-black/20 rounded-input text-sm font-semibold text-foreground bg-surface outline-none focus:border-primary appearance-none"
            >
              {classes.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          <input
            type="date"
            defaultValue="2026-06-07"
            className="h-11 px-4 border border-black/20 rounded-input text-sm text-foreground bg-surface outline-none focus:border-primary"
          />

          <div className="flex gap-2 ml-auto">
            <button onClick={() => markAll('present')} className="h-9 px-4 text-xs font-semibold text-green-700 bg-green-50 rounded-pill hover:bg-green-100 transition-colors">Mark All Present</button>
            <button onClick={() => markAll('absent')}  className="h-9 px-4 text-xs font-semibold text-red-600 bg-red-50 rounded-pill hover:bg-red-100 transition-colors">Mark All Absent</button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-card p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{present}</p>
            <p className="text-xs text-green-600 mt-0.5">Present</p>
          </div>
          <div className="bg-red-50 rounded-card p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{absent}</p>
            <p className="text-xs text-red-500 mt-0.5">Absent</p>
          </div>
          <div className="bg-amber-50 rounded-card p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{late}</p>
            <p className="text-xs text-amber-500 mt-0.5">Late</p>
          </div>
        </div>

        {/* Attendance list */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/6">
            <h2 className="text-base font-bold text-foreground">Student Roll</h2>
            <span className="text-xs text-muted">{students.length} students</span>
          </div>
          <div className="divide-y divide-black/4">
            {students.map((s, i) => {
              const status = attendance[s]
              return (
                <div key={s} className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-sm text-muted w-6 text-right shrink-0">{i + 1}</span>
                  <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {s.charAt(0)}
                  </div>
                  <p className="flex-1 text-sm font-medium text-foreground">{s}</p>
                  {/* Status buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => mark(s, 'present')}
                      className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                        status === 'present' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      <CheckCircle2 size={12} /> Present
                    </button>
                    <button
                      onClick={() => mark(s, 'absent')}
                      className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                        status === 'absent' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      <XCircle size={12} /> Absent
                    </button>
                    <button
                      onClick={() => mark(s, 'late')}
                      className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-colors ${
                        status === 'late' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      }`}
                    >
                      <Clock size={12} /> Late
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={() => setSaved(true)}
          className={`flex items-center gap-2 h-12 px-6 rounded-pill text-sm font-semibold transition-colors self-start ${
            saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-deep shadow-primary'
          }`}
        >
          <Save size={15} />
          {saved ? 'Attendance Saved!' : 'Save Attendance'}
        </button>

      </div>
    </DashboardLayout>
  )
}
