import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Clock, ChevronLeft, AlertCircle } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }
type DayStatus = 'present' | 'absent' | 'late' | 'holiday'

interface AttendanceRecord { date: string; status: DayStatus }

const statusConfig: Record<DayStatus, { Icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  present: { Icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Present' },
  absent:  { Icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50',   label: 'Absent'  },
  late:    { Icon: Clock,        color: 'text-amber-600', bg: 'bg-amber-50', label: 'Late'    },
  holiday: { Icon: AlertCircle,  color: 'text-muted',     bg: 'bg-canvas',   label: 'Holiday' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function ChildAttendancePage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [records,   setRecords]   = useState<AttendanceRecord[]>([])
  const [childName, setChildName] = useState('')
  const [className, setClassName] = useState('')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => { if (profile?.id) loadData() }, [profile?.id])

  async function loadData() {
    setLoading(true)
    const childId = localStorage.getItem('learnora_selected_child') ?? profile!.id

    const [childRes, ceRes, arRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', childId).maybeSingle(),
      supabase.from('class_enrollments').select('classes(name)').eq('student_id', childId).limit(1).maybeSingle(),
      supabase.from('attendance_records')
        .select('date, status')
        .eq('student_id', childId)
        .order('date', { ascending: false })
        .limit(30),
    ])

    setChildName((childRes.data as { full_name: string | null } | null)?.full_name ?? '')
    const ce = ceRes.data as unknown as { classes: { name: string } | null } | null
    setClassName(ce?.classes?.name ?? '')
    setRecords((arRes.data ?? []) as AttendanceRecord[])
    setLoading(false)
  }

  const present = records.filter(a => a.status === 'present').length
  const absent  = records.filter(a => a.status === 'absent').length
  const late    = records.filter(a => a.status === 'late').length
  const total   = records.filter(a => a.status !== 'holiday').length
  const rate    = total > 0 ? Math.round((present / total) * 100) : 0

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        <button onClick={() => onNavigate('parent/home')} className="mb-4">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold text-primary mb-1">Attendance</h1>
        <p className="text-xs text-muted mb-5">{childName}{className ? ` · ${className}` : ''}</p>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted">Loading…</div>
        ) : (
          <>
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

            {absent > 1 && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
                <AlertCircle size={14} className="text-amber-600 shrink-0" />
                <p className="text-foreground text-xs">{absent} absence{absent !== 1 ? 's' : ''} this period. Contact your child's teacher if needed.</p>
              </div>
            )}

            {records.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">No attendance records found.</p>
            ) : (
              <>
                <p className="text-base font-bold text-foreground mb-3">Daily Records</p>
                <div className="flex flex-col gap-2">
                  {records.map((a, i) => {
                    const cfg  = statusConfig[a.status] ?? statusConfig.present
                    const Icon = cfg.Icon
                    return (
                      <div key={i} className="flex items-center gap-3 bg-white border border-black/6 rounded-2xl px-4 py-3 shadow-sm">
                        <div className={`size-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                          <Icon size={16} className={cfg.color} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{fmtDate(a.date)}</p>
                          <p className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </MobileLayout>
  )
}
