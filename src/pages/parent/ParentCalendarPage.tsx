import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface Activity {
  title: string
  time:  string
  sub:   string
  color: string
}

const MONTHS     = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const COLORS     = ['bg-pink-400','bg-primary','bg-amber-400','bg-green-500','bg-purple-500','bg-teal-500']

function buildWeeks(year: number, month: number): (number | null)[][] {
  const firstDOW = new Date(year, month, 1).getDay()
  const total    = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDOW).fill(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function fmtDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const now = new Date()
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1)
  if (d.toDateString() === now.toDateString()) return 'Due Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Due Tomorrow'
  return 'Due ' + d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export default function ParentCalendarPage({ onNavigate }: Props) {
  const { profile } = useAuth()

  const now   = new Date()
  const [year,        setYear]        = useState(now.getFullYear())
  const [month,       setMonth]       = useState(now.getMonth())
  const [selectedDay, setSelectedDay] = useState(now.getDate())
  const [allAsgn,     setAllAsgn]     = useState<any[]>([])
  const [highlighted, setHighlighted] = useState<Record<number, string>>({})
  const [activities,  setActivities]  = useState<Activity[]>([])
  const [childName,   setChildName]   = useState('')
  const [loading,     setLoading]     = useState(true)

  const childId = sessionStorage.getItem('learnora_selected_child') ?? profile?.id ?? ''

  useEffect(() => { if (profile?.id) loadData() }, [profile?.id, year, month])
  useEffect(() => { updateDay(selectedDay) }, [allAsgn, selectedDay])

  async function loadData() {
    setLoading(true)
    const schoolId = profile!.school_id!

    const [childRes, ceRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', childId).maybeSingle(),
      supabase.from('class_enrollments').select('class_id').eq('student_id', childId),
    ])

    setChildName((childRes.data as { full_name: string | null } | null)?.full_name ?? '')
    const classIds = (ceRes.data ?? []).map((r: any) => r.class_id)

    if (classIds.length === 0) { setLoading(false); return }

    const monthStr = String(month + 1).padStart(2, '0')
    const startStr = `${year}-${monthStr}-01`
    const endStr   = `${year}-${monthStr}-${new Date(year, month + 1, 0).getDate().toString().padStart(2, '0')}`

    const { data } = await supabase
      .from('assignments')
      .select('id, title, due_date, subjects(name)')
      .eq('school_id', schoolId)
      .in('class_id', classIds)
      .gte('due_date', startStr)
      .lte('due_date', endStr)
      .order('due_date')

    const asgns = data ?? []
    setAllAsgn(asgns)

    const hl: Record<number, string> = {}
    asgns.forEach((a: any, i: number) => {
      if (a.due_date) hl[new Date(a.due_date + 'T00:00:00').getDate()] = COLORS[i % COLORS.length]
    })
    setHighlighted(hl)
    setLoading(false)
  }

  function updateDay(day: number) {
    const dayAsgns = allAsgn.filter((a: any) => {
      if (!a.due_date) return false
      const d = new Date(a.due_date + 'T00:00:00')
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
    setActivities(dayAsgns.map((a: any, i: number) => ({
      title: a.title,
      time:  fmtDate(a.due_date),
      sub:   (a as any).subjects?.name ?? '',
      color: COLORS[i % COLORS.length],
    })))
  }

  function selectDay(day: number) {
    setSelectedDay(day)
  }

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const weeks = buildWeeks(year, month)
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  return (
    <MobileLayout activePage="parent/calendar" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-24">

        <div className="flex items-center justify-between mb-1">
          <button onClick={() => onNavigate('parent/home')}><ChevronLeft size={22} /></button>
          <button><Search size={18} className="text-foreground" /></button>
        </div>

        <h1 className="text-2xl font-bold text-primary mt-2 mb-1">Calendar</h1>
        <p className="text-xs text-muted mb-5">
          {childName ? `${childName}'s schedule — assignment deadlines and academic activities.` : "Your child's academic schedule and upcoming activities."}
        </p>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prev} className="text-muted hover:text-primary transition-colors"><ChevronLeft size={18} /></button>
          <span className="text-sm font-bold text-foreground">{MONTHS[month]} {year}</span>
          <button onClick={next} className="text-muted hover:text-primary transition-colors"><ChevronRight size={18} /></button>
        </div>

        {/* Calendar card */}
        <div className="bg-white border border-black/8 rounded-2xl p-4 mb-5 shadow-sm">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_SHORT.map(d => <p key={d} className="text-center text-[10px] font-bold text-muted">{d}</p>)}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((d, di) => {
                if (!d) return <div key={di} className="h-9" />
                const isToday = isCurrentMonth && d === now.getDate()
                const isSel   = d === selectedDay
                const hl      = highlighted[d]
                return (
                  <button
                    key={di}
                    onClick={() => selectDay(d)}
                    className={`h-9 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition-colors
                      ${isToday ? 'bg-primary text-white' : isSel ? 'bg-primary/15 text-primary font-bold' : hl ? `${hl} text-white` : 'text-foreground hover:bg-canvas'}`}
                  >
                    {d}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Activities for selected day */}
        {loading ? (
          <div className="text-center py-8 text-sm text-muted">Loading…</div>
        ) : activities.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted">No assignments due on {MONTHS[month]} {selectedDay}.</div>
        ) : (
          <>
            <p className="text-sm font-bold text-foreground mb-3">{MONTHS[month]} {selectedDay}</p>
            <div className="flex flex-col gap-3">
              {activities.map((a, i) => (
                <div key={i} className="bg-white border border-black/8 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                  <div className={`w-1.5 self-stretch rounded-full ${a.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="text-xs text-muted mt-0.5">{a.time}{a.sub ? ` · ${a.sub}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  )
}
