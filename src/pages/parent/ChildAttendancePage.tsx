import { CheckCircle2, XCircle, Clock, ChevronLeft, AlertCircle } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

type DayStatus = 'present' | 'absent' | 'late' | 'holiday'

const attendance: { day: string; date: string; status: DayStatus }[] = [
  { day: 'Mon', date: 'Jun 2',  status: 'present' },
  { day: 'Tue', date: 'Jun 3',  status: 'present' },
  { day: 'Wed', date: 'Jun 4',  status: 'absent'  },
  { day: 'Thu', date: 'Jun 5',  status: 'late'    },
  { day: 'Fri', date: 'Jun 6',  status: 'present' },
  { day: 'Mon', date: 'May 26', status: 'present' },
  { day: 'Tue', date: 'May 27', status: 'present' },
  { day: 'Wed', date: 'May 28', status: 'present' },
  { day: 'Thu', date: 'May 29', status: 'present' },
  { day: 'Fri', date: 'May 30', status: 'holiday' },
]

const statusConfig: Record<DayStatus, { Icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  present: { Icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50',   label: 'Present' },
  absent:  { Icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50',     label: 'Absent'  },
  late:    { Icon: Clock,        color: 'text-amber-600', bg: 'bg-amber-50',   label: 'Late'    },
  holiday: { Icon: AlertCircle,  color: 'text-muted',     bg: 'bg-canvas',     label: 'Holiday' },
}

export default function ChildAttendancePage({ onNavigate }: Props) {
  const present  = attendance.filter(a => a.status === 'present').length
  const absent   = attendance.filter(a => a.status === 'absent').length
  const late     = attendance.filter(a => a.status === 'late').length
  const total    = attendance.filter(a => a.status !== 'holiday').length
  const rate     = Math.round((present / total) * 100)

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        {/* Header */}
        <button onClick={() => onNavigate('parent/home')} className="mb-4">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold text-primary mb-1">Attendance</h1>
        <p className="text-xs text-muted mb-5">Olive Princely Ashuma · Primary 5A</p>

        {/* Summary card */}
        <div className="bg-primary rounded-3xl p-5 mb-6">
          <p className="text-xs text-white/70 mb-1">Attendance Rate</p>
          <p className="text-4xl font-bold text-white mb-3">{rate}%</p>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-white rounded-full" style={{ width: `${rate}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xl font-bold text-white">{present}</p>
              <p className="text-[10px] text-white/70">Present</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{absent}</p>
              <p className="text-[10px] text-white/70">Absent</p>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{late}</p>
              <p className="text-[10px] text-white/70">Late</p>
            </div>
          </div>
        </div>

        {/* Alert if poor attendance */}
        {absent > 1 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5 text-sm">
            <AlertCircle size={14} className="text-amber-600 shrink-0" />
            <p className="text-foreground text-xs">{absent} absence{absent > 1 ? 's' : ''} this period. Contact your child's teacher if needed.</p>
          </div>
        )}

        {/* Daily records */}
        <p className="text-base font-bold text-foreground mb-3">Daily Records</p>
        <div className="flex flex-col gap-2">
          {attendance.map((a, i) => {
            const cfg = statusConfig[a.status]
            const Icon = cfg.Icon
            return (
              <div key={i} className="flex items-center gap-3 bg-white border border-black/6 rounded-2xl px-4 py-3 shadow-sm">
                <div className={`size-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={cfg.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.day}, {a.date}</p>
                  <p className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </MobileLayout>
  )
}
