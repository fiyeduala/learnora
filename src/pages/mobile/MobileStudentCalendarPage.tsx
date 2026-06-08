import { ChevronLeft, ChevronDown, Search } from 'lucide-react'
import MobileLayout, { studentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const dates = [
  [null, null, null, null, null, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 1, 2],
]
const highlighted = { 8: 'bg-amber-400 text-white', 18: 'bg-primary text-white', 24: 'bg-primary text-white' }
const today = 5

const activities = [
  { title: 'Mathematics Assignment Due', time: '10:00 AM', sub: 'Grade 6 Mathematics',    color: 'bg-pink-400' },
  { title: 'Continuous Assessment',       time: '10:00 AM', sub: 'Basic Science',           color: 'bg-primary' },
  { title: 'Parent-Teacher Meeting',      time: '4:00 PM',  sub: 'Virtual Session',         color: 'bg-amber-400' },
]

const deadlines = [
  { label: 'English Essay',  due: 'Due Tomorrow', status: 'Pending',   statusColor: 'bg-amber-100 text-amber-700' },
  { label: 'English Essay',  due: 'Due: August 10', status: 'Submitted', statusColor: 'bg-green-100 text-green-700' },
  { label: 'English Essay',  due: 'Due: August 10', status: 'In Progress',statusColor: 'bg-blue-100 text-blue-700' },
]

export default function MobileStudentCalendarPage({ onNavigate }: Props) {
  return (
    <MobileLayout activePage="m/calendar" onNavigate={onNavigate} nav={studentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        <div className="flex items-center justify-between mb-1">
          <button onClick={() => onNavigate('m/home')}><ChevronLeft size={22} /></button>
          <button><Search size={18} className="text-foreground" /></button>
        </div>

        <h1 className="text-2xl font-bold text-primary mb-1">Calendar</h1>
        <p className="text-xs text-muted mb-5">Stay informed about your academic schedule and upcoming activities.</p>

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
                const key = d as keyof typeof highlighted
                const isHighlighted = highlighted[key]
                const isToday = d === today
                return (
                  <div
                    key={di}
                    className={`h-8 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer
                      ${isHighlighted || (isToday ? 'bg-primary text-white' : 'text-foreground hover:bg-canvas')}`}
                  >
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
        <div className="flex flex-col gap-3 mb-6">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-black/6 rounded-2xl p-4 shadow-sm">
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{a.title}</p>
                <p className="text-base font-bold text-foreground mt-0.5">{a.time}</p>
                <p className="text-xs text-muted mt-0.5">{a.sub}</p>
              </div>
              <div className={`size-10 rounded-full ${a.color} flex items-center justify-center shrink-0`}>
                <span className="text-white text-xs font-bold">=</span>
              </div>
            </div>
          ))}
        </div>

        {/* Assignment Deadlines */}
        <p className="text-base font-bold text-foreground mb-1">Assignment Deadlines</p>
        <p className="text-xs text-muted mb-3">Track pending submissions and due dates.</p>
        <div className="flex flex-col gap-3 mb-6">
          {deadlines.map((d, i) => (
            <div key={i} className="bg-white border border-black/6 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-foreground">{d.label}</p>
                  <p className="text-xs text-muted">{d.due}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${d.statusColor}`}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Announcements */}
        <p className="text-base font-bold text-foreground mb-3">Recent Announcements</p>
        <div className="flex flex-col gap-3 mb-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-bold text-amber-800 mb-1">School closes early on Friday due to staff training.</p>
            <p className="text-xs text-amber-700 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs text-amber-700 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.</p>
          </div>
        </div>

      </div>
    </MobileLayout>
  )
}
