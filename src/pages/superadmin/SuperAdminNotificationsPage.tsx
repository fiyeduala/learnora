import { useState } from 'react'
import {
  Bell, AlertCircle, Building2, CreditCard,
  Megaphone, UserPlus, Clock, Check,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type NType = 'school' | 'billing' | 'system' | 'announcement' | 'invite'

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
  school:       { icon: Building2,  bg: 'bg-primary/10', color: 'text-primary'   },
  billing:      { icon: CreditCard, bg: 'bg-amber-50',   color: 'text-amber-600' },
  system:       { icon: AlertCircle,bg: 'bg-canvas',     color: 'text-muted'     },
  announcement: { icon: Megaphone,  bg: 'bg-blue-50',    color: 'text-blue-600'  },
  invite:       { icon: UserPlus,   bg: 'bg-teal-50',    color: 'text-teal-600'  },
}

const initNotifs: Notif[] = []

type Filter = 'All' | 'Unread' | 'Schools' | 'Billing' | 'System'

export default function SuperAdminNotificationsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)
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

  const filterTypes: Record<Filter, NType[] | null> = {
    'All':        null,
    'Unread':     null,
    'Schools':    ['school', 'invite'],
    'Billing':    ['billing'],
    'System':     ['system', 'announcement'],
  }

  const visible = notifs.filter(n => {
    if (filter === 'Unread') return !n.read
    const types = filterTypes[filter]
    return types === null || types.includes(n.type)
  })

  return (
    <DashboardLayout
      activePage="super-notifications"
      onNavigate={onNavigate}
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
      nav={superAdminNav}
      user={sidebarUser}
    >
      <div className="max-w-[720px] flex flex-col gap-4">

        {/* Controls */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-1 bg-canvas rounded-card p-1 overflow-x-auto">
            {(['All', 'Unread', 'Schools', 'Billing', 'System'] as Filter[]).map(f => (
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
            <p className="text-sm text-muted">No notifications yet.</p>
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
                        <span className="text-[11px] text-muted flex items-center gap-1 whitespace-nowrap shrink-0">
                          <Clock size={10} /> {n.time}
                        </span>
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
