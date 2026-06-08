import { ChevronLeft, ChevronDown, Search } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dates = [
  [null, null, null, null, null, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 1, 2],
]
const highlighted: Record<number, string> = { 5: 'bg-primary text-white', 11: 'bg-amber-400 text-white', 19: 'bg-red-400 text-white', 29: 'bg-primary text-white' }

const activities = [
  { title: 'Mathematics Assignment Due', time: '10:00 AM', sub: 'Grade 6 Mathematics', color: 'bg-pink-400' },
  { title: 'Continuous Assessment',       time: '10:00 AM', sub: 'Basic Science',        color: 'bg-primary' },
]

export default function ParentCalendarPage({ onNavigate }: Props) {
  return (
    <MobileLayout activePage="parent/calendar" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        <div className="flex items-center justify-between mb-1">
          <button onClick={() => onNavigate('parent/home')}><ChevronLeft size={22} /></button>
          <button><Search size={18} className="text-foreground" /></button>
        </div>

        <h1 className="text-2xl font-bold text-primary mt-2 mb-1">Calendar</h1>
        <p className="text-xs text-muted mb-5">Stay informed about your child's academic schedule, events, and important school activities.</p>

        {/* Calendar card */}
        <div className="bg-white border border-black/8 rounded-2xl p-4 mb-5 shadow-sm">
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
            February <ChevronDown size={14} />
          </button>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {days.map(d => <p key={d} className="text-center text-[10px] font-bold text-muted">{d}</p>)}
          </div>
          {dates.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((d, di) => {
                if (!d) return <div key={di} />
                const hl = highlighted[d]
                return (
                  <div key={di} className={`h-8 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer ${hl ?? 'text-foreground hover:bg-canvas'}`}>
                    {d}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Today's Activities */}
        <p className="text-base font-bold text-foreground mb-1">Today's Activities</p>
        <p className="text-xs text-muted mb-3">Events and academic activities scheduled for today.</p>
        <div className="flex flex-col gap-3">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-black/6 rounded-2xl p-4 shadow-sm">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{a.title}</p>
                <p className="text-base font-bold text-foreground mt-0.5">{a.time}</p>
                <p className="text-xs text-muted">{a.sub}</p>
              </div>
              <div className={`size-10 rounded-full ${a.color}`} />
            </div>
          ))}
        </div>

      </div>
    </MobileLayout>
  )
}
