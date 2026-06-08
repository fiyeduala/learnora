import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const tabs = ['All', 'Academics', 'Attendance', 'Assignments', 'School']

const notifications = [
  { title: 'Assignment Completed', body: 'Daniel successfully submitted his Mathematics homework.', time: '2 mins ago' },
  { title: 'Present Today',        body: "Daniel has been marked present for today's classes.",   time: '8:15 AM' },
  { title: 'Great Progress',       body: "Daniel's Science score improved by 12% this week.",     time: 'Yesterday' },
]

export default function ParentNotificationsPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        <button onClick={() => onNavigate('parent/home')} className="mb-4"><ChevronLeft size={22} /></button>

        <h1 className="text-2xl font-bold text-primary mb-1">Notification</h1>
        <p className="text-xs text-muted mb-5">Stay informed about your child's learning activities and school updates.</p>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 h-9 px-4 rounded-full text-xs font-semibold border transition-colors ${
                activeTab === i ? 'bg-primary text-white border-primary' : 'bg-white text-foreground border-black/12'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification list */}
        <div className="flex flex-col gap-5">
          {notifications.map((n, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="size-12 rounded-full bg-canvas border border-black/8 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p className="text-sm font-bold text-foreground leading-snug">{n.title}</p>
                  <span className="text-[10px] text-muted shrink-0 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{n.body}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </MobileLayout>
  )
}
