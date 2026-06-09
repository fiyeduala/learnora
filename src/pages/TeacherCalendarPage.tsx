import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Video, FileText, ClipboardCheck, Calendar } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type EventType = 'live-class' | 'assessment' | 'attendance' | 'meeting'

interface CalEvent {
  id: number; day: number; title: string; time: string
  type: EventType; class: string; color: string
}

const eventTypeStyle: Record<EventType, string> = {
  'live-class':  'bg-primary/10 text-primary border-primary/20',
  'assessment':  'bg-amber-50 text-amber-700 border-amber-200',
  'attendance':  'bg-green-50 text-green-700 border-green-200',
  'meeting':     'bg-purple-50 text-purple-700 border-purple-200',
}

const eventIcon: Record<EventType, typeof Video> = {
  'live-class': Video,
  'assessment': FileText,
  'attendance': ClipboardCheck,
  'meeting':    Calendar,
}

const monthEvents: CalEvent[] = [
  { id: 1,  day: 8,  title: 'Physics Live Class',           time: '2:00 PM',  type: 'live-class',  class: 'SS2A', color: '' },
  { id: 2,  day: 8,  title: 'Mathematics Quiz',             time: '9:00 AM',  type: 'assessment',  class: 'SS1A', color: '' },
  { id: 3,  day: 10, title: 'Mark Attendance – SS2A',       time: '8:00 AM',  type: 'attendance',  class: 'SS2A', color: '' },
  { id: 4,  day: 11, title: 'Physics Live Class',           time: '2:00 PM',  type: 'live-class',  class: 'SS2B', color: '' },
  { id: 5,  day: 13, title: 'Department Meeting',           time: '11:00 AM', type: 'meeting',     class: 'Staff', color: '' },
  { id: 6,  day: 15, title: 'End-of-Term Exam – Math',      time: '10:00 AM', type: 'assessment',  class: 'SS2A', color: '' },
  { id: 7,  day: 16, title: 'Physics Live Class',           time: '2:00 PM',  type: 'live-class',  class: 'SS2A', color: '' },
  { id: 8,  day: 18, title: 'Parent-Teacher Meeting',       time: '9:00 AM',  type: 'meeting',     class: 'All', color: '' },
  { id: 9,  day: 20, title: 'Assignment Submission Review', time: '3:00 PM',  type: 'attendance',  class: 'SS1A', color: '' },
  { id: 10, day: 22, title: 'Physics Live Class',           time: '2:00 PM',  type: 'live-class',  class: 'SS2A', color: '' },
  { id: 11, day: 25, title: 'Exam Results Review',          time: '1:00 PM',  type: 'assessment',  class: 'SS2A', color: '' },
  { id: 12, day: 28, title: 'Physics Live Class',           time: '2:00 PM',  type: 'live-class',  class: 'SS2B', color: '' },
]

const daysInMonth = 30
const firstDay = 0 // June 2026 starts on Monday
const today = 8
const monthName = 'June 2026'
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function TeacherCalendarPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [selectedDay, setSelectedDay] = useState<number | null>(today)
  const [view, setView] = useState<'month' | 'week'>('month')

  const dayEvents = (day: number) => monthEvents.filter(e => e.day === day)
  const selectedEvents = selectedDay ? monthEvents.filter(e => e.day === selectedDay) : []

  return (
    <DashboardLayout
      activePage="teacher-calendar"
      onNavigate={onNavigate}
      title="Calendar"
      subtitle="Your teaching schedule and upcoming events"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="flex flex-col gap-5 max-w-[1100px]">

        {/* Header row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-full border border-black/15 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
              <ChevronLeft size={15} />
            </button>
            <span className="text-base font-bold text-foreground min-w-[120px] text-center">{monthName}</span>
            <button className="size-9 rounded-full border border-black/15 flex items-center justify-center text-muted hover:border-primary hover:text-primary transition-colors">
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="flex gap-1 bg-canvas rounded-card p-1 ml-auto">
            {(['month', 'week'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 h-8 text-xs font-semibold rounded-md transition-colors capitalize ${view === v ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('schedule-class')}
            className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            <Plus size={13} /> Schedule Class
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          {/* Calendar grid */}
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-black/8">
              {weekDays.map(d => (
                <div key={d} className="py-3 text-center text-xs font-semibold text-muted">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {/* Leading empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-[90px] border-b border-r border-black/4 bg-canvas/30" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const events = dayEvents(day)
                const isToday = day === today
                const isSelected = day === selectedDay
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-[90px] border-b border-r border-black/4 p-1.5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/5' : 'hover:bg-canvas/60'
                    }`}
                  >
                    <div className={`text-xs font-bold mb-1 size-5 flex items-center justify-center rounded-full ${
                      isToday ? 'bg-primary text-white' : 'text-foreground'
                    }`}>
                      {day}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {events.slice(0, 2).map(ev => {
                        const style = eventTypeStyle[ev.type]
                        return (
                          <div key={ev.id} className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate border ${style}`}>
                            {ev.title}
                          </div>
                        )
                      })}
                      {events.length > 2 && (
                        <div className="text-[9px] text-muted font-semibold">+{events.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected day panel */}
          <div className="bg-surface rounded-card shadow-sm">
            <div className="px-5 py-4 border-b border-black/6">
              <p className="text-sm font-bold text-foreground">
                {selectedDay ? `June ${selectedDay}, 2026` : 'Select a day'}
              </p>
              <p className="text-xs text-muted mt-0.5">{selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {selectedEvents.length === 0 ? (
                <div className="py-8 text-center">
                  <Calendar size={28} className="mx-auto mb-2 text-muted opacity-30" />
                  <p className="text-sm text-muted">No events this day.</p>
                  <button
                    onClick={() => onNavigate('schedule-class')}
                    className="mt-3 text-xs text-primary font-semibold hover:underline flex items-center gap-1 mx-auto"
                  >
                    <Plus size={11} /> Schedule something
                  </button>
                </div>
              ) : (
                selectedEvents.map(ev => {
                  const Icon = eventIcon[ev.type]
                  const style = eventTypeStyle[ev.type]
                  return (
                    <div key={ev.id} className={`p-3 rounded-card border ${style}`}>
                      <div className="flex items-start gap-2.5">
                        <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${style}`}>
                          <Icon size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-snug">{ev.title}</p>
                          <p className="text-xs opacity-70 mt-0.5">{ev.time} · {ev.class}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Legend */}
            <div className="px-5 pb-5 pt-2 border-t border-black/6">
              <p className="text-xs font-semibold text-muted mb-2">Legend</p>
              <div className="flex flex-col gap-1.5">
                {(Object.entries(eventTypeStyle) as [EventType, string][]).map(([type, style]) => {
                  const Icon = eventIcon[type]
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`size-5 rounded flex items-center justify-center border ${style}`}>
                        <Icon size={10} />
                      </div>
                      <span className="text-xs text-muted capitalize">{type.replace('-', ' ')}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
