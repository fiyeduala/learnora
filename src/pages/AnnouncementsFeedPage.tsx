import { useState } from 'react'
import { Megaphone, Plus, Search, ChevronRight, Pin } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

type Announcement = {
  id: number; pinned: boolean; title: string; body: string;
  author: string; role: string; date: string; category: string;
}

const announcements: Announcement[] = []

const categoryColor: Record<string, string> = {
  Event:    'bg-primary/10 text-primary',
  Academic: 'bg-accent-mint/20 text-accent-mint',
  Finance:  'bg-amber-50 text-amber-700',
  Resource: 'bg-green-50 text-green-700',
}

export default function AnnouncementsFeedPage({ onNavigate }: Props) {
  const [search, setSearch] = useState('')

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout
      activePage="announcements"
      onNavigate={onNavigate}
      title="Announcements"
      subtitle="School-wide announcements and notices"
    >
      <div className="max-w-[860px] flex flex-col gap-6">

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full h-11 pl-9 pr-4 border border-black/15 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => onNavigate('compose-announcement')}
            className="flex items-center gap-2 h-11 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary shrink-0"
          >
            <Plus size={14} /> New Announcement
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {filtered.map(a => (
            <button
              key={a.id}
              onClick={() => onNavigate('notification-details')}
              className="bg-surface rounded-card shadow-sm p-6 text-left hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                {a.pinned && <Pin size={14} className="text-primary mt-1 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-foreground">{a.title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor[a.category]}`}>{a.category}</span>
                    {a.pinned && <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Pinned</span>}
                  </div>
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">{a.body}</p>
                </div>
                <ChevronRight size={16} className="text-muted shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted">
                <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">{a.author.charAt(0)}</div>
                <span>{a.author} · {a.role}</span>
                <span>·</span>
                <span>{a.date}</span>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted">
              <Megaphone size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No announcements found.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
