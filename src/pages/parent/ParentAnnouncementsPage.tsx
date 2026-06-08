import { useState } from 'react'
import { Bell, Pin, Search, ChevronRight } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

interface Announcement {
  id:       string
  title:    string
  body:     string
  date:     string
  category: string
  pinned:   boolean
  read:     boolean
}

const announcements: Announcement[] = [
  {
    id: '1',
    title: 'End of Term Exams — Schedule Released',
    body: 'The end of first term examinations will commence on Monday July 7, 2026. A full subject schedule has been published on the portal. Students are expected to arrive by 7:30 AM daily during the exam period. All phones must be deposited at the gate.',
    date: 'Jun 6, 2026',
    category: 'Exams',
    pinned: true,
    read: false,
  },
  {
    id: '2',
    title: 'School Fees Payment Reminder',
    body: 'This is a reminder that the second installment of school fees is due by June 20, 2026. Late payments will attract a 5% surcharge. Please log in to the parent portal to make payment.',
    date: 'Jun 4, 2026',
    category: 'Finance',
    pinned: true,
    read: false,
  },
  {
    id: '3',
    title: 'Inter-House Sports Day — June 28',
    body: 'The annual Inter-House Sports Day will hold on Saturday June 28, 2026. Parents are warmly invited to attend. Gates open at 8:00 AM. Students should arrive in their house colours. Kindly note that only registered parents will be admitted.',
    date: 'Jun 2, 2026',
    category: 'Events',
    pinned: false,
    read: false,
  },
  {
    id: '4',
    title: 'New Library Books Available',
    body: 'The school library has been stocked with over 200 new books covering Mathematics, Sciences, and Literature. Students are encouraged to borrow books during free periods.',
    date: 'May 29, 2026',
    category: 'General',
    pinned: false,
    read: true,
  },
  {
    id: '5',
    title: 'Parent-Teacher Meeting — July 5',
    body: "The mid-term Parent-Teacher Meeting will take place on Saturday July 5, 2026, from 9 AM to 1 PM. You will receive your child's progress report and have the opportunity to meet their teachers. Please confirm attendance through the portal.",
    date: 'May 25, 2026',
    category: 'Events',
    pinned: false,
    read: true,
  },
  {
    id: '6',
    title: 'Update to School Uniform Policy',
    body: 'Starting next term, all students are required to wear the new school uniform with the updated logo badge. Uniforms are available for purchase from the school store. The old uniform will be accepted until end of current term only.',
    date: 'May 15, 2026',
    category: 'General',
    pinned: false,
    read: true,
  },
]

const categoryColors: Record<string, string> = {
  Exams:   'bg-red-50 text-red-600',
  Finance: 'bg-green-50 text-green-700',
  Events:  'bg-primary/10 text-primary',
  General: 'bg-canvas text-muted',
}

export default function ParentAnnouncementsPage({ onNavigate }: Props) {
  const [query,    setQuery]    = useState('')
  const [selected, setSelected] = useState<Announcement | null>(null)
  const [read,     setRead]     = useState<Set<string>>(new Set(announcements.filter(a => a.read).map(a => a.id)))

  function open(a: Announcement) {
    setSelected(a)
    setRead(prev => new Set([...prev, a.id]))
  }

  const filtered = query
    ? announcements.filter(a => a.title.toLowerCase().includes(query.toLowerCase()))
    : announcements

  const pinned = filtered.filter(a => a.pinned)
  const rest   = filtered.filter(a => !a.pinned)

  if (selected) {
    return (
      <MobileLayout activePage="parent/announcements" onNavigate={onNavigate} nav={parentMobileNav}>
        <div className="px-4 pt-5 pb-24">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-primary font-semibold mb-5">
            ← Back
          </button>
          <div className="flex items-center gap-2 mb-2">
            {selected.pinned && <Pin size={12} className="text-primary" />}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[selected.category]}`}>{selected.category}</span>
          </div>
          <h2 className="text-base font-bold text-foreground mb-1 leading-snug">{selected.title}</h2>
          <p className="text-xs text-muted mb-5">{selected.date} · Greenfield Academy</p>
          <p className="text-sm text-foreground leading-relaxed">{selected.body}</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout activePage="parent/announcements" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-4 pt-5 pb-24">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold text-foreground">Announcements</h1>
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center relative">
            <Bell size={15} className="text-primary" />
            {announcements.some(a => !read.has(a.id)) && (
              <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-red-500 rounded-full border-2 border-surface" />
            )}
          </div>
        </div>
        <p className="text-sm text-muted mb-4">From Greenfield Academy</p>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search announcements..."
            className="w-full h-10 pl-9 pr-4 bg-surface border border-black/15 rounded-full text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Pinned</p>
            <div className="flex flex-col gap-2">
              {pinned.map(a => (
                <button key={a.id} onClick={() => open(a)} className="w-full bg-surface rounded-card shadow-sm p-4 text-left flex items-start gap-3 border border-primary/15">
                  <Pin size={13} className="text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold leading-snug ${read.has(a.id) ? 'text-muted' : 'text-foreground'}`}>{a.title}</p>
                      {!read.has(a.id) && <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{a.body}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColors[a.category]}`}>{a.category}</span>
                      <span className="text-[10px] text-muted">{a.date}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-muted shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div>
            {pinned.length > 0 && <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">All Announcements</p>}
            <div className="flex flex-col gap-2">
              {rest.map(a => (
                <button key={a.id} onClick={() => open(a)} className="w-full bg-surface rounded-card shadow-sm p-4 text-left flex items-start gap-3">
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${categoryColors[a.category]}`}>
                    <Bell size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-snug ${read.has(a.id) ? 'text-muted' : 'text-foreground'}`}>{a.title}</p>
                      {!read.has(a.id) && <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-xs text-muted mt-0.5 truncate">{a.body}</p>
                    <p className="text-[10px] text-muted mt-1.5">{a.date}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted shrink-0 mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Bell size={24} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No announcements found</p>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
