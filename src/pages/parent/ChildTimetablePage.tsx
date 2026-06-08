import { useState } from 'react'
import { Clock, BookOpen } from 'lucide-react'
import MobileLayout from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const parentMobileNav = [
  { label: 'Home',     page: 'parent/dashboard' },
  { label: 'Progress', page: 'parent/progress'  },
  { label: 'Payments', page: 'parent/payments'  },
  { label: 'Messages', page: 'parent/chat'      },
]

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

type Period = { time: string; subject: string; teacher: string; room: string; color: string }
type DaySchedule = { [day: string]: Period[] }

const schedule: DaySchedule = {
  Mon: [
    { time: '08:00 – 08:40', subject: 'Mathematics',      teacher: 'Mr Taiwo',      room: 'Block A – R1', color: 'bg-primary/10 text-primary'     },
    { time: '08:40 – 09:20', subject: 'English Language', teacher: 'Mrs Eze',       room: 'Block A – R2', color: 'bg-green-50 text-green-700'      },
    { time: '09:40 – 10:20', subject: 'Physics',          teacher: 'Mr Adeyemi',    room: 'Block B – Lab', color: 'bg-amber-50 text-amber-700'    },
    { time: '10:20 – 11:00', subject: 'Chemistry',        teacher: 'Mrs Okonkwo',   room: 'Block B – Lab', color: 'bg-red-50 text-red-600'        },
    { time: '11:20 – 12:00', subject: 'Biology',          teacher: 'Mr Suleiman',   room: 'Block C – R3', color: 'bg-purple-50 text-purple-700'   },
  ],
  Tue: [
    { time: '08:00 – 08:40', subject: 'Economics',        teacher: 'Mrs Bakare',    room: 'Block A – R4', color: 'bg-teal-50 text-teal-700'       },
    { time: '08:40 – 09:20', subject: 'Mathematics',      teacher: 'Mr Taiwo',      room: 'Block A – R1', color: 'bg-primary/10 text-primary'     },
    { time: '09:40 – 10:20', subject: 'English Language', teacher: 'Mrs Eze',       room: 'Block A – R2', color: 'bg-green-50 text-green-700'      },
    { time: '10:20 – 12:00', subject: 'Library / Free',   teacher: '—',             room: 'Library',      color: 'bg-canvas text-muted'           },
  ],
  Wed: [
    { time: '08:00 – 08:40', subject: 'Physics',          teacher: 'Mr Adeyemi',    room: 'Block B – Lab', color: 'bg-amber-50 text-amber-700'   },
    { time: '08:40 – 09:20', subject: 'Chemistry',        teacher: 'Mrs Okonkwo',   room: 'Block B – Lab', color: 'bg-red-50 text-red-600'       },
    { time: '09:40 – 10:20', subject: 'Mathematics',      teacher: 'Mr Taiwo',      room: 'Block A – R1', color: 'bg-primary/10 text-primary'    },
    { time: '10:20 – 11:00', subject: 'Biology',          teacher: 'Mr Suleiman',   room: 'Block C – R3', color: 'bg-purple-50 text-purple-700'  },
    { time: '11:20 – 12:00', subject: 'Economics',        teacher: 'Mrs Bakare',    room: 'Block A – R4', color: 'bg-teal-50 text-teal-700'      },
  ],
  Thu: [
    { time: '08:00 – 08:40', subject: 'English Language', teacher: 'Mrs Eze',       room: 'Block A – R2', color: 'bg-green-50 text-green-700'    },
    { time: '08:40 – 09:20', subject: 'Mathematics',      teacher: 'Mr Taiwo',      room: 'Block A – R1', color: 'bg-primary/10 text-primary'    },
    { time: '09:40 – 10:20', subject: 'Biology',          teacher: 'Mr Suleiman',   room: 'Block C – R3', color: 'bg-purple-50 text-purple-700'  },
    { time: '11:20 – 12:00', subject: 'Chemistry',        teacher: 'Mrs Okonkwo',   room: 'Block B – Lab', color: 'bg-red-50 text-red-600'      },
  ],
  Fri: [
    { time: '08:00 – 08:40', subject: 'Mathematics',      teacher: 'Mr Taiwo',      room: 'Block A – R1', color: 'bg-primary/10 text-primary'    },
    { time: '08:40 – 09:20', subject: 'Economics',        teacher: 'Mrs Bakare',    room: 'Block A – R4', color: 'bg-teal-50 text-teal-700'      },
    { time: '09:40 – 10:20', subject: 'English Language', teacher: 'Mrs Eze',       room: 'Block A – R2', color: 'bg-green-50 text-green-700'    },
    { time: '11:20 – 12:00', subject: 'Assembly / Clubs', teacher: '—',             room: 'Assembly Hall', color: 'bg-canvas text-muted'         },
  ],
}

const dayOfWeek = new Date().getDay()
const todayIndex = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek - 1 : 0

export default function ChildTimetablePage({ onNavigate }: Props) {
  const [activeDay, setActiveDay] = useState(days[todayIndex])

  const periods = schedule[activeDay] || []

  return (
    <MobileLayout activePage="parent/dashboard" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-4 pt-5 pb-24">
        <h1 className="text-lg font-bold text-foreground mb-1">Chidi's Timetable</h1>
        <p className="text-sm text-muted mb-5">Current week · SS2A</p>

        {/* Day selector */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {days.map((d, i) => (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`flex-shrink-0 h-9 px-4 rounded-full text-xs font-semibold transition-colors ${activeDay === d ? 'bg-primary text-white' : 'bg-surface text-muted shadow-sm'} ${i === todayIndex ? 'ring-2 ring-primary/30' : ''}`}
            >
              {d}
              {i === todayIndex && <span className="ml-1 text-[8px] align-super">today</span>}
            </button>
          ))}
        </div>

        {/* Periods */}
        <div className="flex flex-col gap-3">
          {periods.map((p, i) => (
            <div key={i} className="bg-surface rounded-card shadow-sm p-4 flex gap-3">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={`size-9 rounded-full flex items-center justify-center ${p.color}`}>
                  <BookOpen size={14} />
                </div>
                {i < periods.length - 1 && <div className="w-px flex-1 bg-black/8 my-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{p.subject}</p>
                <p className="text-xs text-muted mt-0.5">{p.teacher}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Clock size={10} /> {p.time}
                  </span>
                  <span className="text-xs text-muted bg-canvas px-2 py-0.5 rounded-full">{p.room}</span>
                </div>
              </div>
            </div>
          ))}
          {periods.length === 0 && (
            <div className="text-center py-12 text-muted text-sm">No classes scheduled.</div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-surface rounded-card p-4 shadow-sm">
          <p className="text-xs font-bold text-muted mb-3">SUBJECT KEY</p>
          <div className="grid grid-cols-2 gap-2">
            {['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics'].map(s => (
              <p key={s} className="text-xs text-foreground flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary/40 inline-block" /> {s}
              </p>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}
