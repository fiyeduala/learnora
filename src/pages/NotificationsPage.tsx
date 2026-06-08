import { useState } from 'react'
import {
  Bell, CheckCircle2, AlertCircle, BookOpen, DollarSign,
  Video, Megaphone, UserPlus, Clock, Check,
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { studentNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type NType = 'fee' | 'assignment' | 'grade' | 'announcement' | 'live' | 'system' | 'invite'

type Notif = {
  id:    number
  type:  NType
  title: string
  body:  string
  time:  string
  read:  boolean
  page?: string
}

const iconMap: Record<NType, { icon: typeof Bell; bg: string; color: string }> = {
  fee:          { icon: DollarSign,   bg: 'bg-amber-50',   color: 'text-amber-600' },
  assignment:   { icon: BookOpen,     bg: 'bg-blue-50',    color: 'text-blue-600'  },
  grade:        { icon: CheckCircle2, bg: 'bg-green-50',   color: 'text-green-600' },
  announcement: { icon: Megaphone,    bg: 'bg-primary/10', color: 'text-primary'   },
  live:         { icon: Video,        bg: 'bg-red-50',     color: 'text-red-500'   },
  system:       { icon: AlertCircle,  bg: 'bg-canvas',     color: 'text-muted'     },
  invite:       { icon: UserPlus,     bg: 'bg-teal-50',    color: 'text-teal-600'  },
}

const initNotifs: Notif[] = [
  { id: 1,  type: 'fee',          title: 'School Fee Due',             body: '₦17,500 outstanding for Second Term 2025/2026. Due Jun 30, 2026.',                  time: '2 hr ago',   read: false, page: 'parent/fees'         },
  { id: 2,  type: 'live',         title: 'Live Class Starting',        body: 'Physics 101 (SS1A) with Mr. Daniel is starting in 10 minutes.',                    time: '4 hr ago',   read: false, page: 'live-classes'        },
  { id: 3,  type: 'assignment',   title: 'New Assignment Posted',      body: 'Algebra Quiz due tomorrow. Class: SS1A Mathematics.',                               time: 'Yesterday',  read: false, page: 'assignments'         },
  { id: 4,  type: 'grade',        title: 'Assignment Graded',          body: 'Your Physics Report was graded: 87/100. View your feedback.',                      time: 'Yesterday',  read: true,  page: 'gradebook'           },
  { id: 5,  type: 'announcement', title: 'School Announcement',        body: 'End-of-term examination timetable has been released. Check the calendar.',         time: '2 days ago', read: true,  page: 'announcements'       },
  { id: 6,  type: 'system',       title: 'Password Changed',           body: "Your Learnora account password was changed. If this wasn't you, contact support.", time: '3 days ago', read: true                              },
  { id: 7,  type: 'grade',        title: 'Term Report Ready',          body: 'Your Second Term 2025/2026 report card is now available.',                         time: '4 days ago', read: true,  page: 'academic-history'    },
  { id: 8,  type: 'assignment',   title: 'Submission Deadline Passed', body: 'Chemistry Notes (SS3A) deadline passed. 32/32 students submitted.',                time: '5 days ago', read: true,  page: 'teacher-assignments' },
  { id: 9,  type: 'invite',       title: 'Parent Joined',              body: 'Mr. Olive Johnson accepted the invite and joined as a parent.',                    time: '1 week ago', read: true,  page: 'user-management'     },
  { id: 10, type: 'announcement', title: 'Platform Maintenance',       body: 'Learnora will undergo scheduled maintenance Jun 14, 02:00–04:00 WAT.',             time: '1 week ago', read: true                              },
]

type Filter = 'All' | 'Unread' | 'Fee' | 'Assignments' | 'Grades' | 'Announcements'

const filterTypes: Record<Filter, NType[] | null> = {
  'All':           null,
  'Unread':        null,
  'Fee':           ['fee'],
  'Assignments':   ['assignment'],
  'Grades':        ['grade'],
  'Announcements': ['announcement', 'live'],
}

export default function NotificationsPage({ onNavigate }: Props) {
  const [notifs, setNotifs] = useState<Notif[]>(initNotifs)
  const [filter, setFilter] = useState<Filter>('All')

  const unreadCount = notifs.filter(n => !n.read).length

  function markRead(id: number) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  function handleClick(n: Notif) {
    markRead(n.id)
    if (n.page) onNavigate(n.page)
  }

  const visible = notifs.filter(n => {
    if (filter === 'Unread') return !n.read
    const types = filterTypes[filter]
    return types === null || types.includes(n.type)
  })

  return (
    <DashboardLayout
      activePage="notifications"
      onNavigate={onNavigate}
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
      nav={studentNav}
      user={{ name: 'Olive Princely', role: 'Student', initials: 'O' }}
    >
      <div className="max-w-[720px] flex flex-col gap-4">

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-1 bg-canvas rounded-card p-1 overflow-x-auto">
            {(['All', 'Unread', 'Fee', 'Assignments', 'Grades', 'Announcements'] as Filter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 h-8 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>
                {f}
                {f === 'Unread' && unreadCount > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0">
              <Check size={12} /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <div className="bg-surface rounded-card shadow-sm p-12 text-center">
            <Bell size={32} className="text-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted">No notifications here.</p>
          </div>
        ) : (
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="divide-y divide-black/4">
              {visible.map(n => {
                const meta = iconMap[n.type]
                const Icon = meta.icon
                return (
                  <div key={n.id} onClick={() => handleClick(n)}
                    className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${n.read ? 'hover:bg-canvas/40' : 'bg-primary/3 hover:bg-primary/5'}`}>
                    <div className={`size-10 rounded-full ${meta.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={16} className={meta.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${n.read ? 'font-medium text-foreground' : 'font-bold text-foreground'}`}>
                          {n.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-muted flex items-center gap-1 whitespace-nowrap">
                            <Clock size={10} /> {n.time}
                          </span>
                          {!n.read && <span className="size-2 rounded-full bg-primary shrink-0" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted mt-0.5 leading-relaxed">{n.body}</p>
                      {n.page && <p className="text-xs text-primary font-semibold mt-1.5">Tap to view →</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
