import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

type CalEvent = { label: string; color: string }
type CalDay   = { date: number; month: 'prev' | 'current' | 'next'; events: CalEvent[] }

// April 2026 — starts Wednesday Apr 1; first cell is Sunday Mar 29
const calendarDays: CalDay[] = [
  { date: 29, month: 'prev',    events: [] },
  { date: 30, month: 'prev',    events: [] },
  { date: 31, month: 'prev',    events: [] },
  { date: 1,  month: 'current', events: [] },
  { date: 2,  month: 'current', events: [{ label: 'Physics Quiz',     color: 'bg-red-400' }] },
  { date: 3,  month: 'current', events: [] },
  { date: 4,  month: 'current', events: [] },

  { date: 5,  month: 'current', events: [] },
  { date: 6,  month: 'current', events: [] },
  { date: 7,  month: 'current', events: [] },
  { date: 8,  month: 'current', events: [{ label: 'Math Test',        color: 'bg-primary' }] },
  { date: 9,  month: 'current', events: [] },
  { date: 10, month: 'current', events: [{ label: 'English Due',      color: 'bg-accent-mint' }] },
  { date: 11, month: 'current', events: [] },

  { date: 12, month: 'current', events: [] },
  { date: 13, month: 'current', events: [] },
  { date: 14, month: 'current', events: [] },
  { date: 15, month: 'current', events: [{ label: 'Parent Meeting',   color: 'bg-green-500' }] },
  { date: 16, month: 'current', events: [] },
  { date: 17, month: 'current', events: [] },
  { date: 18, month: 'current', events: [] },

  { date: 19, month: 'current', events: [] },
  { date: 20, month: 'current', events: [] },
  { date: 21, month: 'current', events: [] },
  { date: 22, month: 'current', events: [{ label: 'Chemistry Exam',   color: 'bg-red-400' }] },
  { date: 23, month: 'current', events: [] },
  { date: 24, month: 'current', events: [] },
  { date: 25, month: 'current', events: [] },

  { date: 26, month: 'current', events: [] },
  { date: 27, month: 'current', events: [] },
  { date: 28, month: 'current', events: [] },
  { date: 29, month: 'current', events: [] },
  { date: 30, month: 'current', events: [] },
  { date: 1,  month: 'next',    events: [] },
  { date: 2,  month: 'next',    events: [] },
]

const upcomingEvents = [
  {
    title: 'Physics Quiz',
    date: 'Apr 2, 2026',
    time: '10:00 AM – 11:30 AM',
    card: 'bg-red-50 border border-red-100',
    dot: 'bg-red-400',
  },
  {
    title: 'Mathematics Test',
    date: 'Apr 8, 2026',
    time: '9:00 AM – 11:00 AM',
    card: 'bg-primary/5 border border-primary/15',
    dot: 'bg-primary',
  },
  {
    title: 'English Assignment Due',
    date: 'Apr 10, 2026',
    time: '11:59 PM',
    card: 'bg-accent-mint/8 border border-accent-mint/20',
    dot: 'bg-accent-mint',
  },
]

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="calendar"
      onNavigate={onNavigate}
      title="Calendar"
      subtitle="Academic Calendar · Track classes, deadlines and events"
    >
      <div className="flex gap-6 min-h-full">

        {/* Calendar grid */}
        <div className="flex-1 min-w-0 bg-surface rounded-card shadow-sm p-6 self-start">
          {/* Month header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-canvas rounded-md transition-colors">
                <ChevronLeft size={18} className="text-muted" />
              </button>
              <h2 className="text-xl font-bold text-foreground">April 2026</h2>
              <button className="p-1.5 hover:bg-canvas rounded-md transition-colors">
                <ChevronRight size={18} className="text-muted" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 h-9 px-4 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors">
                <Plus size={14} />
                Add events
              </button>
              <button className="h-9 px-4 border border-muted text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                Today
              </button>
              <button className="flex items-center gap-1.5 h-9 px-4 border border-muted text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-muted uppercase tracking-wide py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Grid cells */}
          <div className="grid grid-cols-7 border-t border-l border-black/6">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`
                  min-h-[100px] p-2 flex flex-col gap-1 border-r border-b border-black/6
                  ${day.month === 'current' ? 'bg-surface' : 'bg-canvas/50'}
                `}
              >
                <span
                  className={`
                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${day.month === 'current' ? 'text-foreground' : 'text-muted/40'}
                  `}
                >
                  {day.date}
                </span>
                {day.events.map((ev, ei) => (
                  <div
                    key={ei}
                    className={`${ev.color} text-white text-xs font-medium px-1.5 py-0.5 rounded truncate`}
                  >
                    {ev.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-72 shrink-0 flex flex-col gap-4 self-start">
          <div className="bg-surface rounded-card shadow-sm p-5">
            <h3 className="text-base font-bold text-foreground mb-4">Upcoming Events</h3>
            <div className="flex flex-col gap-3">
              {upcomingEvents.map((ev, i) => (
                <div key={i} className={`p-4 rounded-card ${ev.card} flex flex-col gap-1`}>
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${ev.dot} shrink-0`} />
                    <p className="text-sm font-semibold text-foreground">{ev.title}</p>
                  </div>
                  <p className="text-xs text-muted pl-4">{ev.date}</p>
                  <p className="text-xs text-muted pl-4">{ev.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-card shadow-sm p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Event Types</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Exam / Quiz',   color: 'bg-red-400' },
                { label: 'Test',          color: 'bg-primary' },
                { label: 'Assignment',    color: 'bg-accent-mint' },
                { label: 'Meeting',       color: 'bg-green-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className={`size-3 rounded-full ${item.color}`} />
                  <span className="text-xs text-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
