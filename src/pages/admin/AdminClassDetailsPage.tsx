import { ArrowLeft, Users, BookOpen, ClipboardCheck, TrendingUp, Award } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

interface ClassMeta {
  id: string; name: string; level: string | null; arm: string | null
  teacher: string | null; students: number; subjects: number
}

const mockStudents = [
  { name: 'Olive Princely',   avg: 82, attendance: 94, status: 'Good'     },
  { name: 'Yetunde Adesanya', avg: 91, attendance: 100,'status': 'Excellent'},
  { name: 'Kofi Asante',      avg: 63, attendance: 72, status: 'At Risk'  },
  { name: 'Moses Yakubu',     avg: 55, attendance: 60, status: 'Critical' },
  { name: 'Sandra Ogbu',      avg: 78, attendance: 90, status: 'Good'     },
]

const statusStyle: Record<string, string> = {
  Excellent: 'bg-green-50 text-green-700',
  Good:      'bg-primary/10 text-primary',
  'At Risk': 'bg-orange-50 text-orange-600',
  Critical:  'bg-red-50 text-red-600',
}

export default function AdminClassDetailsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)

  const raw = sessionStorage.getItem('learnora_admin_class')
  const cls: ClassMeta | null = raw ? JSON.parse(raw) : null

  if (!cls) {
    return (
      <DashboardLayout activePage="classes-management" onNavigate={onNavigate} title="Class Details" nav={adminNav} user={sidebarUser}>
        <div className="text-center py-20 text-muted">
          <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No class selected. Go back and click "View Details" on a class.</p>
          <button onClick={() => onNavigate('classes-management')} className="mt-4 text-sm text-primary hover:underline">Back to Classes</button>
        </div>
      </DashboardLayout>
    )
  }

  const avgAttendance = Math.round(mockStudents.reduce((s, st) => s + st.attendance, 0) / mockStudents.length)
  const avgScore = Math.round(mockStudents.reduce((s, st) => s + st.avg, 0) / mockStudents.length)

  return (
    <DashboardLayout
      activePage="classes-management"
      onNavigate={onNavigate}
      title={`Class ${cls.name}`}
      subtitle={`${cls.level ?? ''} · Arm ${cls.arm ?? ''}`}
      nav={adminNav}
      user={sidebarUser}
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        <button onClick={() => onNavigate('classes-management')} className="flex items-center gap-2 text-sm text-muted hover:text-foreground w-fit">
          <ArrowLeft size={14} /> Back to Classes
        </button>

        {/* Header card */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{cls.name}</h2>
              <p className="text-sm text-muted mt-1">{cls.level} · Arm {cls.arm}</p>
              <p className="text-sm text-muted mt-0.5">
                Form Teacher: <span className={cls.teacher ? 'font-semibold text-foreground' : 'text-red-500 font-semibold'}>
                  {cls.teacher ?? 'Not assigned'}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onNavigate('admin-attendance')} className="h-9 px-4 border border-primary text-primary text-sm font-semibold rounded-pill hover:bg-primary hover:text-white transition-colors flex items-center gap-1.5">
                <ClipboardCheck size={14} /> View Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Students',       value: cls.students,    icon: Users,        color: 'text-primary bg-primary/10'    },
            { label: 'Subjects',       value: cls.subjects,    icon: BookOpen,     color: 'text-foreground bg-canvas'     },
            { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: ClipboardCheck, color: 'text-green-600 bg-green-50' },
            { label: 'Avg Score',      value: `${avgScore}%`,  icon: TrendingUp,   color: 'text-amber-600 bg-amber-50'    },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
                <div className={`size-9 rounded-full flex items-center justify-center mb-2 ${s.color}`}>
                  <Icon size={16} />
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted mt-0.5">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Students table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users size={15} className="text-primary" /> Students
            </h3>
            <span className="text-xs text-muted">Sample data — wire to Supabase in Phase 2</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-black/6 bg-canvas/40">
                  {['Student', 'Avg Score', 'Attendance', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/4">
                {mockStudents.map((s, i) => (
                  <tr key={i} className="hover:bg-canvas/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-canvas rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.avg >= 70 ? 'bg-green-500' : s.avg >= 60 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${s.avg}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${s.avg < 60 ? 'text-red-500' : 'text-foreground'}`}>{s.avg}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold ${s.attendance < 75 ? 'text-red-500' : 'text-green-600'}`}>{s.attendance}%</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status]}`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance bar */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Award size={15} className="text-amber-500" /> Performance Overview
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Above 70%',    count: mockStudents.filter(s => s.avg >= 70).length, color: 'bg-green-500'  },
              { label: '60–69%',       count: mockStudents.filter(s => s.avg >= 60 && s.avg < 70).length, color: 'bg-amber-400' },
              { label: 'Below 60%',   count: mockStudents.filter(s => s.avg < 60).length, color: 'bg-red-400'    },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3">
                <p className="text-xs text-muted w-20 shrink-0">{b.label}</p>
                <div className="flex-1 h-2 bg-canvas rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${(b.count / mockStudents.length) * 100}%` }} />
                </div>
                <span className="text-xs font-bold text-foreground w-6">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
