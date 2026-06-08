import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, Users } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }
type Status = 'present' | 'absent' | 'late'

const initialStudents = [
  { name: 'Olive Princely',   joined: '13:58', status: 'present' as Status },
  { name: 'Fatima Al-Rashid', joined: '14:00', status: 'present' as Status },
  { name: 'Emeka Nwosu',      joined: '14:02', status: 'late'    as Status },
  { name: 'Chisom Okeke',     joined: '—',     status: 'absent'  as Status },
  { name: 'Yusuf Abubakar',   joined: '13:59', status: 'present' as Status },
  { name: 'Amina Lawal',      joined: '14:01', status: 'present' as Status },
  { name: 'Tobenna Obi',      joined: '—',     status: 'absent'  as Status },
  { name: 'Sade Fashola',     joined: '14:00', status: 'present' as Status },
]

export default function InClassAttendancePage({ onNavigate }: Props) {
  const [students, setStudents] = useState(initialStudents)
  const [saved, setSaved] = useState(false)

  function setStatus(i: number, status: Status) {
    setStudents(prev => prev.map((s, j) => j === i ? { ...s, status } : s))
  }

  const present = students.filter(s => s.status === 'present').length
  const late    = students.filter(s => s.status === 'late').length
  const absent  = students.filter(s => s.status === 'absent').length

  return (
    <DashboardLayout
      activePage="live-classes"
      onNavigate={onNavigate}
      title="In-Class Attendance"
      subtitle="Newton's Laws — Live Revision · Physics · SS1A"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[720px] flex flex-col gap-5">

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Present', count: present, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Late',    count: late,    color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Absent',  count: absent,  color: 'text-red-500',   bg: 'bg-red-50'   },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`${bg} rounded-card p-4 text-center`}>
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Student list */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center gap-3">
            <Users size={15} className="text-muted" />
            <h2 className="text-base font-bold text-foreground">{students.length} Students</h2>
          </div>
          <div className="divide-y divide-black/4">
            {students.map((s, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {s.name.split(' ').map(p => p[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  {s.joined !== '—' && (
                    <p className="text-xs text-muted flex items-center gap-1"><Clock size={10} /> Joined {s.joined}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {(['present', 'late', 'absent'] as Status[]).map(st => (
                    <button
                      key={st}
                      onClick={() => setStatus(i, st)}
                      className={`h-8 px-3 rounded-full text-xs font-semibold capitalize transition-colors ${
                        s.status === st
                          ? st === 'present' ? 'bg-green-500 text-white'
                          : st === 'late'    ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                          : 'bg-canvas text-muted hover:bg-black/8'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSaved(true)}
            className="h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            Save Attendance
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <CheckCircle2 size={16} /> Saved
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
