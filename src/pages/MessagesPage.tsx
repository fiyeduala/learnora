import { useState } from 'react'
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const chats = [
  { id: 1, name: 'Mrs Monica Johnson',  role: 'English Teacher',    lastMsg: 'Your assignment was submitted on time. Good job!',  time: '10:24 AM', unread: 2 },
  { id: 2, name: 'Study Group — SS2A',  role: '12 members',          lastMsg: 'Kofi: Anyone have the notes for today?',             time: 'Yesterday', unread: 0 },
  { id: 3, name: 'Mr. Daniel Johnson',  role: 'Physics Teacher',     lastMsg: 'The lab report is due Friday.',                     time: 'Yesterday', unread: 0 },
  { id: 4, name: 'Mrs Nnduka Kisha',    role: 'Mathematics Teacher', lastMsg: 'See you in class tomorrow.',                        time: 'Mon',       unread: 0 },
  { id: 5, name: 'Mr Boris Johnson',    role: 'Government Teacher',  lastMsg: 'Read chapter 5 before Thursday.',                   time: 'Sun',       unread: 0 },
]

const messages = [
  { id: 1, from: 'them', text: 'Hello Olive! I wanted to check in about your last English essay.',                                  time: '5:20 PM' },
  { id: 2, from: 'me',   text: 'Hi Mrs Johnson! I submitted it yesterday through the portal.',                                      time: '5:22 PM' },
  { id: 3, from: 'them', text: 'Yes, I saw it. Your structure was great. One thing — try to expand on your thesis in the conclusion.', time: '5:24 PM' },
  { id: 4, from: 'me',   text: 'Thank you for the feedback! I\'ll keep that in mind for the next one.',                              time: '5:25 PM' },
  { id: 5, from: 'them', text: 'Your assignment was submitted on time. Good job!',                                                   time: '6:24 PM' },
]

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('')
}

export default function MessagesPage({ onNavigate }: Props) {
  const [activeChat, setActiveChat] = useState(1)
  const [tab, setTab] = useState<'all' | 'unread'>('all')
  const [input, setInput] = useState('')

  const active = chats.find(c => c.id === activeChat)!

  return (
    <DashboardLayout
      activePage="messages"
      onNavigate={onNavigate}
      title="Messages"
      mainClassName="flex-1 flex overflow-hidden"
    >
      {/* ── Left: chat list ── */}
      <div className="w-[360px] shrink-0 bg-surface border-r border-black/6 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-black/6 shrink-0">
          <h2 className="text-lg font-bold text-foreground mb-4">Chat Room</h2>

          <div className="flex items-center gap-2.5 h-10 px-4 bg-canvas border border-black/8 rounded-input">
            <Search size={15} className="text-muted shrink-0" />
            <input
              type="search"
              placeholder="Search or start a new chat"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>

          <div className="flex gap-1 mt-4">
            {(['all', 'unread'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 h-9 text-sm font-semibold rounded-md capitalize transition-colors
                  ${tab === t ? 'bg-primary text-white' : 'text-muted hover:bg-canvas'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats
            .filter(c => tab === 'all' || c.unread > 0)
            .map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full flex items-start gap-3 px-5 py-4 border-b border-black/4 last:border-0 text-left transition-colors
                  ${activeChat === chat.id ? 'bg-primary/6' : 'hover:bg-canvas/60'}`}
              >
                <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials(chat.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-foreground truncate">{chat.name}</p>
                    <span className="text-xs text-muted shrink-0 ml-2">{chat.time}</span>
                  </div>
                  <p className="text-xs text-muted truncate">{chat.lastMsg}</p>
                </div>
                {chat.unread > 0 && (
                  <span className="size-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {chat.unread}
                  </span>
                )}
              </button>
            ))}
        </div>
      </div>

      {/* ── Right: active chat ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-canvas">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-surface border-b border-black/6 shrink-0">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {initials(active.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{active.name}</p>
            <p className="text-xs text-muted">{active.role}</p>
          </div>
          <button className="p-2 text-muted hover:text-foreground transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 max-w-[65%]
                ${msg.from === 'me' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div
                className={`px-4 py-3 text-sm leading-relaxed
                  ${msg.from === 'me'
                    ? 'bg-primary text-white rounded-card rounded-br-xs'
                    : 'bg-surface text-foreground rounded-card rounded-bl-xs shadow-sm'}`}
              >
                {msg.text}
              </div>
              <span className="text-xs text-muted">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-6 py-4 bg-surface border-t border-black/6 shrink-0">
          <div className="flex items-center gap-3 h-12 px-4 bg-canvas border border-black/8 rounded-pill">
            <button className="p-1 text-muted hover:text-foreground transition-colors shrink-0">
              <Paperclip size={16} />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && input.trim()) setInput('') }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
            <button
              onClick={() => setInput('')}
              disabled={!input.trim()}
              className="size-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-deep disabled:opacity-40 transition-colors shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
