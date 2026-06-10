import { useState, useEffect } from 'react'
import { ChevronLeft, Bell } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface Notif {
  id:    string
  title: string
  body:  string
  type:  string
  time:  string
  read:  boolean
}

const tabs = ['All', 'Academics', 'Attendance', 'Assignments', 'School'] as const
type Tab = typeof tabs[number]

const typeMap: Record<Tab, string[] | null> = {
  All:         null,
  Academics:   ['grade'],
  Attendance:  ['attendance'],
  Assignments: ['assignment'],
  School:      ['announcement', 'system', 'general'],
}

function fmtTime(iso: string) {
  const d    = new Date(iso)
  const now  = new Date()
  const diff = (now.getTime() - d.getTime()) / 60000
  if (diff < 60)  return `${Math.round(diff)} mins ago`
  if (diff < 1440) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function ParentNotificationsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [notifs,     setNotifs]     = useState<Notif[]>([])
  const [activeTab,  setActiveTab]  = useState<Tab>('All')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => { if (profile?.id) loadNotifs() }, [profile?.id])

  async function loadNotifs() {
    setLoading(true)
    const { data } = await supabase
      .from('notifications')
      .select('id, title, body, type, read, created_at')
      .eq('user_id', profile!.id)
      .order('created_at', { ascending: false })
      .limit(50)

    setNotifs((data ?? []).map((n: {
      id: string; title: string; body: string | null; type: string | null; read: boolean | null; created_at: string | null
    }) => ({
      id:    n.id,
      title: n.title,
      body:  n.body ?? '',
      type:  n.type ?? 'general',
      time:  n.created_at ? fmtTime(n.created_at) : '—',
      read:  n.read ?? false,
    })))
    setLoading(false)
  }

  async function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    await supabase.from('notifications').update({ read: true }).eq('id', id)
  }

  const types = typeMap[activeTab]
  const visible = types ? notifs.filter(n => types.includes(n.type)) : notifs

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-24">

        <button onClick={() => onNavigate('parent/home')} className="mb-4"><ChevronLeft size={22} /></button>

        <h1 className="text-2xl font-bold text-primary mb-1">Notifications</h1>
        <p className="text-xs text-muted mb-5">Stay informed about your child's learning activities and school updates.</p>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 h-9 px-4 rounded-full text-xs font-semibold border transition-colors ${activeTab === tab ? 'bg-primary text-white border-primary' : 'bg-white text-foreground border-black/12'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted">Loading…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <Bell size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {visible.map(n => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className="flex items-start gap-4 text-left w-full"
              >
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-canvas border border-black/8' : 'bg-primary/10'}`}>
                  <Bell size={16} className={n.read ? 'text-muted' : 'text-primary'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <p className={`text-sm font-bold leading-snug ${n.read ? 'text-muted' : 'text-foreground'}`}>{n.title}</p>
                    <span className="text-[10px] text-muted shrink-0 whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{n.body}</p>
                </div>
                {!n.read && <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
