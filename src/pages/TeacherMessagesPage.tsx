import { useState } from 'react'
import { Search, Send, Users, User, ChevronRight } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }
type ContactType = 'student' | 'parent'

interface Contact {
  id: number; name: string; type: ContactType; class: string
  lastMessage: string; time: string; unread: number
}

const contacts: Contact[] = [
  { id: 1, name: 'Emeka Okafor',       type: 'student', class: 'SS2A', lastMessage: 'Thank you for the notes, sir!',          time: '2:30 PM', unread: 0 },
  { id: 2, name: 'Mrs Okafor (Parent)',type: 'parent',  class: 'SS2A', lastMessage: 'Good afternoon, please when is...',      time: '11:15 AM',unread: 2 },
  { id: 3, name: 'Aisha Bello',        type: 'student', class: 'SS2A', lastMessage: 'I don\'t understand question 3',         time: 'Yesterday',unread: 1 },
  { id: 4, name: 'Mr Bello (Parent)',  type: 'parent',  class: 'SS2A', lastMessage: 'Thank you for the progress update.',     time: 'Yesterday',unread: 0 },
  { id: 5, name: 'Chidi Nwosu',        type: 'student', class: 'SS2A', lastMessage: 'My assignment is ready, sir.',           time: 'Jun 6',   unread: 0 },
  { id: 6, name: 'Fatima Garba',       type: 'student', class: 'SS2A', lastMessage: 'Please can I get an extension?',         time: 'Jun 5',   unread: 0 },
]

const mockMessages: Record<number, { from: 'me' | 'them'; text: string; time: string }[]> = {
  1: [
    { from: 'them', text: 'Good morning sir, I need help with the Forces exercise.', time: '10:00 AM' },
    { from: 'me',   text: 'Good morning Emeka. Which specific question?', time: '10:05 AM' },
    { from: 'them', text: 'Question 4 about equilibrium.', time: '10:07 AM' },
    { from: 'me',   text: 'Okay, I\'ll explain it during class tomorrow. Review page 84 tonight.', time: '10:10 AM' },
    { from: 'them', text: 'Thank you for the notes, sir!', time: '2:30 PM' },
  ],
  2: [
    { from: 'them', text: 'Good afternoon sir, please when is the next parent-teacher meeting?', time: '11:00 AM' },
    { from: 'me',   text: 'Good afternoon ma. The meeting is scheduled for July 5.', time: '11:10 AM' },
    { from: 'them', text: 'Good afternoon, please when is...', time: '11:15 AM' },
  ],
}

export default function TeacherMessagesPage({ onNavigate }: Props) {
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<Contact | null>(null)
  const [filter,   setFilter]   = useState<'all' | 'student' | 'parent'>('all')
  const [draft,    setDraft]    = useState('')

  const visible = contacts.filter(c =>
    (filter === 'all' || c.type === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const msgs = selected ? (mockMessages[selected.id] ?? []) : []

  function sendMsg() {
    if (!draft.trim()) return
    setDraft('')
  }

  return (
    <DashboardLayout
      activePage="messages"
      onNavigate={onNavigate}
      title="Messages"
      subtitle="Message your students and their parents"
      nav={teacherNav}
      user={{ name: 'Mr Johnson', role: 'Teacher', initials: 'MJ' }}
      mainClassName="flex-1 overflow-hidden flex flex-col"
    >
      <div className="flex flex-1 min-h-0 gap-0 overflow-hidden rounded-card shadow-sm bg-surface mx-4 md:mx-8 mb-4 md:mb-8">

        {/* Contact list */}
        <div className={`flex flex-col border-r border-black/8 ${selected ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] shrink-0`}>
          {/* Search + filter */}
          <div className="p-4 border-b border-black/8 flex flex-col gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full h-9 pl-9 pr-3 border border-black/15 rounded-input text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex gap-1 bg-canvas rounded-md p-1">
              {(['all','student','parent'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`flex-1 h-7 text-xs font-semibold rounded transition-colors capitalize ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}>
                  {f === 'all' ? 'All' : f === 'student' ? 'Students' : 'Parents'}
                </button>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto divide-y divide-black/4">
            {visible.map(c => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-canvas/50 transition-colors ${selected?.id === c.id ? 'bg-primary/5' : ''}`}>
                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${c.type === 'parent' ? 'bg-amber-50 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                  {c.type === 'parent' ? <User size={14} /> : c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                    <span className="text-[10px] text-muted shrink-0 ml-2">{c.time}</span>
                  </div>
                  <p className="text-xs text-muted truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="size-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}

            {visible.length === 0 && (
              <div className="py-10 text-center text-muted">
                <Users size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No contacts found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        {selected ? (
          <div className="flex flex-col flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/8">
              <button onClick={() => setSelected(null)} className="md:hidden text-muted hover:text-foreground">
                <ChevronRight size={18} className="rotate-180" />
              </button>
              <div className={`size-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${selected.type === 'parent' ? 'bg-amber-50 text-amber-700' : 'bg-primary/10 text-primary'}`}>
                {selected.type === 'parent' ? <User size={14} /> : selected.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{selected.name}</p>
                <p className="text-xs text-muted">{selected.class} · {selected.type === 'parent' ? 'Parent' : 'Student'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === 'me'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-canvas text-foreground rounded-bl-sm'
                  }`}>
                    {m.text}
                    <p className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-white/60' : 'text-muted'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-black/8 flex items-end gap-3">
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg() } }}
                placeholder={`Message ${selected.name}…`}
                rows={1}
                className="flex-1 resize-none px-4 py-2.5 border border-black/15 rounded-2xl text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
              />
              <button
                onClick={sendMsg}
                disabled={!draft.trim()}
                className="size-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-deep transition-colors disabled:opacity-40 shrink-0"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-muted flex-col gap-3">
            <Users size={40} className="opacity-20" />
            <p className="text-sm">Select a student or parent to start messaging</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
