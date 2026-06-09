import { useState } from 'react'
import { Send, ChevronLeft, ChevronRight } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

interface Teacher {
  id: number; name: string; subject: string; class: string; initials: string
  lastMessage?: string; time?: string; unread?: number
}

const teachers: Teacher[] = [
  { id: 1, name: 'Mr Daniel Johnson', subject: 'Physics',     class: 'SS2A', initials: 'DJ', lastMessage: 'Good afternoon ma, I\'ll share the results tomorrow.', time: '2:30 PM', unread: 0 },
  { id: 2, name: 'Mrs Nnduka Kisha',  subject: 'Mathematics', class: 'SS1A', initials: 'NK', lastMessage: 'Emeka needs to revise Chapter 4.', time: 'Yesterday', unread: 1 },
  { id: 3, name: 'Mrs Gloria Ewa',    subject: 'English',     class: 'SS2A', initials: 'GE', lastMessage: 'Please remind Emeka about the essay.',                time: 'Jun 5',   unread: 0 },
]

const mockMessages: Record<number, { from: 'me' | 'them'; text: string; time: string }[]> = {
  1: [
    { from: 'them', text: 'Good afternoon ma, I\'m Mr Johnson, Emeka\'s Physics teacher.', time: '10:00 AM' },
    { from: 'me',   text: 'Good afternoon sir, how is Emeka doing in class?', time: '10:15 AM' },
    { from: 'them', text: 'He\'s doing well! His last test score was 85%. He could improve on experiments.', time: '10:20 AM' },
    { from: 'me',   text: 'Thank you. I\'ll encourage him at home.', time: '2:00 PM' },
    { from: 'them', text: 'Good afternoon ma, I\'ll share the results tomorrow.', time: '2:30 PM' },
  ],
  2: [
    { from: 'them', text: 'Good morning ma. Emeka needs to revise Chapter 4 before the upcoming test.', time: 'Yesterday' },
  ],
}

export default function ParentMessageTeacherPage({ onNavigate }: Props) {
  const [selected, setSelected] = useState<Teacher | null>(null)
  const [draft, setDraft]       = useState('')

  const msgs = selected ? (mockMessages[selected.id] ?? []) : []

  function send() {
    if (!draft.trim()) return
    setDraft('')
  }

  if (selected) {
    return (
      <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-black/8 bg-white">
            <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground">
              <ChevronLeft size={20} />
            </button>
            <div className="size-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
              {selected.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{selected.name}</p>
              <p className="text-xs text-muted">{selected.subject} · {selected.class}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-canvas/30">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.from === 'me'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white text-foreground rounded-bl-sm shadow-sm'
                }`}>
                  {m.text}
                  <p className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-white/60' : 'text-muted'}`}>{m.time}</p>
                </div>
              </div>
            ))}
            {msgs.length === 0 && (
              <div className="text-center py-8 text-muted">
                <p className="text-sm">Start a conversation with {selected.name}</p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-black/8 bg-white flex items-end gap-2 pb-[80px]">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none px-4 py-2.5 bg-canvas border border-black/12 rounded-2xl text-sm outline-none focus:border-primary"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="size-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-4 pt-5 pb-24">
        <button onClick={() => onNavigate('parent/chat')} className="mb-4 text-muted">
          <ChevronLeft size={20} />
        </button>

        <h1 className="text-lg font-bold text-foreground mb-1">Message a Teacher</h1>
        <p className="text-sm text-muted mb-5">Contact Emeka's subject teachers directly.</p>

        <div className="flex flex-col gap-3">
          {teachers.map(t => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className="w-full bg-white border border-black/8 rounded-2xl p-4 text-left shadow-sm flex items-center gap-3"
            >
              <div className="size-11 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                {t.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted mt-0.5">{t.subject} · {t.class}</p>
                {t.lastMessage && (
                  <p className="text-xs text-muted truncate mt-1">{t.lastMessage}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {t.time && <span className="text-[10px] text-muted">{t.time}</span>}
                {t.unread ? (
                  <span className="size-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{t.unread}</span>
                ) : (
                  <ChevronRight size={14} className="text-muted" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  )
}
