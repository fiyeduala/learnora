import { useState } from 'react'
import { ChevronLeft, Search } from 'lucide-react'
import MobileLayout, { studentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const tabs = ['All Messages', 'Class Teacher', 'Subject Teachers']

const conversations = [
  { name: 'Master Donald Duke', role: 'Maths Teacher',   time: '10:22', preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod', unread: 1, initials: 'MD', color: 'bg-green-500' },
  { name: 'Master Donald Duke', role: 'Eng Tutor',       time: '10:22', preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod', unread: 1, initials: 'MD', color: 'bg-orange-500' },
  { name: 'Master Donald Duke', role: 'Physics Teacher',  time: '10:22', preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod', unread: 1, initials: 'MD', color: 'bg-blue-500' },
]

export default function MobileStudentMessagesPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <MobileLayout activePage="m/messages" onNavigate={onNavigate} nav={studentMobileNav}>
      <div className="px-5 pt-6 pb-4">

        <button onClick={() => onNavigate('m/home')} className="mb-4 text-foreground">
          <ChevronLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold text-primary mb-1">Messages</h1>
        <p className="text-xs text-muted mb-5">Communicate directly with teachers<br />and school administrators.</p>

        {/* Search */}
        <div className="flex items-center gap-2 h-11 px-4 bg-canvas border border-black/8 rounded-full mb-5">
          <Search size={14} className="text-muted shrink-0" />
          <input type="search" placeholder="Search teachers, subjects, or conversations" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/70 outline-none" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`shrink-0 h-9 px-4 rounded-full text-xs font-semibold border transition-colors ${
                activeTab === i
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-foreground border-black/12'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Section heading */}
        <p className="text-sm font-bold text-foreground mb-3">Today</p>

        {/* Conversation list */}
        <div className="flex flex-col gap-4">
          {conversations.map((c, i) => (
            <button
              key={i}
              onClick={() => onNavigate('m/chat-room')}
              className="flex items-start gap-3 text-left"
            >
              <div className={`size-12 rounded-full ${c.color} flex items-center justify-center shrink-0 text-sm font-bold text-white`}>
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-foreground">{c.name}</span>
                  <span className="text-[10px] text-muted bg-canvas px-2 py-0.5 rounded-full shrink-0">{c.role}</span>
                </div>
                <p className="text-xs text-muted leading-snug line-clamp-2">{c.preview}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] text-muted">{c.time}</span>
                {c.unread > 0 && (
                  <span className="size-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {c.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

      </div>
    </MobileLayout>
  )
}
