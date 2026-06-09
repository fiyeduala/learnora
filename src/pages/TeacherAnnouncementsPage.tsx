import { useState, useEffect } from 'react'
import { Megaphone, Search, ChevronRight, Pin, Plus } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface Announcement {
  id: string; title: string; body: string
  is_pinned: boolean; category: string | null
  created_at: string
  profiles: { full_name: string | null; role: string } | null
}

const categoryColor: Record<string, string> = {
  Academic: 'bg-primary/10 text-primary',
  General:  'bg-canvas text-muted border border-black/10',
  Finance:  'bg-amber-50 text-amber-700',
  Event:    'bg-green-50 text-green-700',
  Resource: 'bg-teal-50 text-teal-700',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TeacherAnnouncementsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [search,        setSearch]        = useState('')
  const [loading,       setLoading]       = useState(true)

  useEffect(() => { if (profile?.school_id) loadAnnouncements() }, [profile?.school_id])

  async function loadAnnouncements() {
    setLoading(true)
    const { data } = await supabase
      .from('announcements')
      .select('id, title, body, is_pinned, category, created_at, profiles!author_id(full_name, role)')
      .eq('school_id', profile!.school_id)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)
    setAnnouncements((data ?? []) as unknown as Announcement[])
    setLoading(false)
  }

  const q        = search.toLowerCase()
  const filtered = announcements.filter(a =>
    !q ||
    a.title.toLowerCase().includes(q) ||
    a.body.toLowerCase().includes(q)
  )

  function openAnnouncement(id: string) {
    localStorage.setItem('learnora_selected_announcement', id)
    onNavigate('announcement-details')
  }

  return (
    <DashboardLayout
      activePage="teacher-announcements"
      onNavigate={onNavigate}
      title="Announcements"
      subtitle="School notices from administration"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[860px] flex flex-col gap-6">

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full h-11 pl-9 pr-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => onNavigate('compose-announcement')}
            className="flex items-center gap-2 h-11 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary shrink-0"
          >
            <Plus size={14} /> Post Notice
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted">Loading…</div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(a => {
              const cat = a.category ?? 'General'
              return (
                <button
                  key={a.id}
                  onClick={() => openAnnouncement(a.id)}
                  className="bg-surface rounded-card shadow-sm p-6 text-left hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {a.is_pinned && <Pin size={14} className="text-primary mt-1 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-foreground">{a.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor[cat] ?? categoryColor['General']}`}>{cat}</span>
                        {a.is_pinned && <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Pinned</span>}
                      </div>
                      <p className="text-sm text-muted line-clamp-2 leading-relaxed">{a.body}</p>
                    </div>
                    <ChevronRight size={16} className="text-muted shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                      {(a.profiles?.full_name ?? 'A').charAt(0)}
                    </div>
                    <span>{a.profiles?.full_name ?? 'Admin'} · {a.profiles?.role ?? '—'}</span>
                    <span>·</span>
                    <span>{fmtDate(a.created_at)}</span>
                  </div>
                </button>
              )
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted">
                <Megaphone size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No announcements found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
