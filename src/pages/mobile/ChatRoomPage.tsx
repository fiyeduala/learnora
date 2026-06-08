import { useState } from 'react'
import { ChevronLeft, MoreVertical, Plus, Mic, Send } from 'lucide-react'

type Props = { onNavigate: (page: string) => void; backPage?: string }

const quickChips = ['Is my son in school', 'How is he doing?', 'When is the next exam?']

const initialMessages = [
  { id: 1, text: 'David submitted his assignment today and performed very well.', from: 'other', time: '1:20PM' },
  { id: 2, text: 'Thank you for the update.', from: 'me', time: '1:20PM' },
]

export default function ChatRoomPage({ onNavigate, backPage = 'm/messages' }: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  function send() {
    if (!draft.trim()) return
    setMessages(prev => [...prev, { id: Date.now(), text: draft, from: 'me', time: 'Now' }])
    setDraft('')
  }

  return (
    <div className="h-screen bg-white flex flex-col max-w-[430px] mx-auto">

      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-black/6">
        <button onClick={() => onNavigate(backPage)}>
          <ChevronLeft size={22} className="text-foreground" />
        </button>
        <div className="size-9 rounded-full bg-orange-400 flex items-center justify-center text-sm font-bold text-white shrink-0">
          MD
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-foreground truncate">Master Donald Duke</p>
            <span className="text-[10px] text-muted bg-canvas px-2 py-0.5 rounded-full shrink-0">Maths Teacher</span>
          </div>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <button><MoreVertical size={18} className="text-muted" /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="bg-primary text-white text-xs font-medium px-4 py-1 rounded-full">Today</span>
        </div>

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'items-end gap-2'}`}>
            {msg.from === 'other' && (
              <div className="size-8 rounded-full bg-orange-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                MD
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.from === 'me'
                ? 'bg-primary text-white rounded-br-sm'
                : 'bg-white border border-black/8 text-foreground rounded-bl-sm shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-white/70 text-right' : 'text-muted text-right'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none">
        {quickChips.map(chip => (
          <button
            key={chip}
            onClick={() => setDraft(chip)}
            className="shrink-0 h-9 px-3 border border-black/15 rounded-full text-xs font-medium text-foreground"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-6 pt-2 border-t border-black/6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type Any Message Here"
            className="flex-1 text-sm text-foreground placeholder:text-muted/60 outline-none"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-3">
            <button><Plus size={20} className="text-muted" /></button>
            <button><Mic size={20} className="text-muted" /></button>
          </div>
          <button
            onClick={send}
            className="size-11 bg-primary rounded-full flex items-center justify-center shadow-primary"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>

    </div>
  )
}
