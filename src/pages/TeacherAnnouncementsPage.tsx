import { useState } from 'react'
import { Megaphone, Search, ChevronRight, Pin, Plus } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const announcements = [
  { id: 1, pinned: true,  title: 'Staff Meeting — Thursday 3 PM',         body: 'All teaching and non-teaching staff are required to attend the monthly staff meeting on Thursday June 12 at 3 PM in the main hall.', author: 'Admin Okafor', role: 'School Admin', date: 'Jun 6, 2026', category: 'General' },
  { id: 2, pinned: false, title: 'Second Term Examination Timetable',      body: 'The examination timetable for the second term has been published. Students should collect timetables from the office or download from the portal.', author: 'Admin Okafor', role: 'School Admin', date: 'Jun 4, 2026', category: 'Academic' },
  { id: 3, pinned: false, title: 'Inter-House Sports Day — June 28',       body: 'The annual Inter-House Sports Day will hold on Saturday June 28. All students must participate in at least one event.', author: 'Principal Adebayo', role: 'Principal', date: 'May 28, 2026', category: 'Event' },
  { id: 4, pinned: false, title: 'Library Hours Extended',                  body: 'The school library will now be open until 7:00 PM on weekdays to support students preparing for examinations.', author: 'Mrs Okonkwo', role: 'Head Librarian', date: 'May 20, 2026', category: 'Resource' },
]

const categoryColor: Record<string, string> = {
  Academic: 'bg-primary/10 text-primary',
  General:  'bg-canvas text-muted border border-black/10',
  Finance:  'bg-amber-50 text-amber-700',
  Event:    'bg-green-50 text-green-700',
  Resource: 'bg-teal-50 text-teal-700',
}

export default function TeacherAnnouncementsPage({ onNavigate }: Props) {
  const [search, setSearch] = useState('')

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout
      activePage="teacher-announcements"
      onNavigate={onNavigate}
      title="Announcements"
      subtitle="School notices from administration"
      nav={teacherNav}
      user={{ name: 'Mr Johnson', role: 'Teacher', initials: 'MJ' }}
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
