import { useState } from 'react'
import { ChevronLeft, Send, Mic, Plus, Users, MoreVertical } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

type Msg = { id: number; sender: string; text: string; time: string; self: boolean }

const initialMessages: Msg[] = [
  { id: 1, sender: 'Mrs Nnduka Kisha',  text: 'Good morning class! Please remember that the Algebra assignment is due today by 11:59 PM.',                 time: '8:02 AM',  self: false },
  { id: 2, sender: 'Olive Johnson',     text: 'Good morning Ma. I have already submitted.',                                                               time: '8:15 AM',  self: true  },
  { id: 3, sender: 'Yetunde Adesanya',  text: 'Ma, do we need to show all workings for question 3?',                                                      time: '8:17 AM',  self: false },
  { id: 4, sender: 'Mrs Nnduka Kisha',  text: 'Yes, full workings are required. Marks will be awarded for method.',                                        time: '8:20 AM',  self: false },
  { id: 5, sender: 'Kofi Asante',       text: 'Please Ma, I am having trouble submitting through the portal. It keeps giving an error.',                   time: '8:45 AM',  self: false },
  { id: 6, sender: 'Mrs Nnduka Kisha',  text: 'Kofi, please send it to my email as an attachment. I will note the time you sent it.',                      time: '8:47 AM',  self: false },
]

export default function GroupChatPage({ onNavigate }: Props) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages)
  const [input, setInput]       = useState('')

  function send() {
    if (!input.trim()) return
    setMessages(msgs => [...msgs, {
      id: msgs.length + 1, sender: 'You', text: input, time: 'Now', self: true,
    }])
    setInput('')
  }

  return (
    <DashboardLayout
      activePage="messages"
      onNavigate={onNavigate}
      title="SS1A Mathematics"
      subtitle="Class group chat · 32 members"
      mainClassName="flex-1 overflow-hidden flex flex-col"
    >
      <div className="flex flex-1 min-h-0 max-w-[900px] w-full flex-col bg-surface rounded-card shadow-sm overflow-hidden">

        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/6 bg-canvas/40">
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('messages')} className="text-muted hover:text-foreground transition-colors mr-1">
              <ChevronLeft size={18} />
            </button>
            <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">M</div>
            <div>
              <p className="text-sm font-bold text-foreground">SS1A Mathematics</p>
              <p className="text-xs text-muted flex items-center gap-1"><Users size={10} /> 32 members</p>
            </div>
          </div>
          <button className="text-muted hover:text-foreground transition-colors"><MoreVertical size={18} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-2.5 ${m.self ? 'flex-row-reverse' : ''}`}>
              {!m.self && (
                <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-1">
                  {m.sender.charAt(0)}
                </div>
              )}
              <div className={`max-w-[70%] ${m.self ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {!m.self && <p className="text-xs font-semibold text-muted px-1">{m.sender}</p>}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.self ? 'bg-primary text-white rounded-tr-sm' : 'bg-canvas text-foreground rounded-tl-sm'
                }`}>
                  {m.text}
                </div>
                <p className="text-[10px] text-muted/60 px-1">{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-black/6 bg-white">
          <button className="size-9 rounded-full border border-black/12 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors shrink-0">
            <Plus size={16} />
          </button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 text-sm text-foreground placeholder:text-muted outline-none"
          />
          <button className="size-9 rounded-full border border-black/12 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-colors shrink-0">
            <Mic size={15} />
          </button>
          <button
            onClick={send}
            disabled={!input.trim()}
            className="size-9 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-deep transition-colors disabled:opacity-40 shrink-0"
          >
            <Send size={14} />
          </button>
        </div>

      </div>
    </DashboardLayout>
  )
}
