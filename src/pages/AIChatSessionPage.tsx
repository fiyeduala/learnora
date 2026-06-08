import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Mic, Paperclip, Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }
type Role = 'user' | 'ai'

interface Message { role: Role; text: string; time: string }

const initialMessages: Message[] = [
  { role: 'ai',   text: "Hi Olive! I'm your AI tutor. What would you like to learn today? You can ask me to explain a topic, quiz you, summarise notes, or help solve a problem.",  time: '14:05' },
  { role: 'user', text: 'Can you explain Newton\'s Second Law of Motion?', time: '14:06' },
  { role: 'ai',   text: "**Newton's Second Law of Motion** states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.\n\n**Formula:** F = ma\n\nWhere:\n- **F** = Net force (Newtons, N)\n- **m** = Mass (kilograms, kg)\n- **a** = Acceleration (m/s²)\n\n**Real-world example:** Pushing a shopping trolley. The harder you push (more force), the faster it accelerates. A fully loaded trolley (more mass) accelerates less for the same push.\n\nWould you like me to walk through some exam-style questions on this?", time: '14:06' },
]

const suggestions = ['Quiz me on this', 'Give me an exam question', 'Explain with a diagram', 'Summarise this topic']

export default function AIChatSessionPage({ onNavigate }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send(text: string) {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    setMessages(m => [...m, { role: 'user', text, time: now }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'ai',
        text: "Great question! Let me break this down for you...\n\nBased on what we've covered, here's a worked example:\n\nA 5 kg object is pushed with a force of 20 N. What is its acceleration?\n\n**Solution:**\nF = ma\n20 = 5 × a\na = 20 ÷ 5 = **4 m/s²**\n\nThe object accelerates at 4 m/s². Does this make sense? Would you like to try another one?",
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      }])
      setLoading(false)
    }, 1200)
  }

  return (
    <DashboardLayout
      activePage="ai-tutor"
      onNavigate={onNavigate}
      title=""
      mainClassName="flex-1 overflow-hidden flex flex-col"
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <button
            onClick={() => onNavigate('ai-tutor')}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="size-9 rounded-full bg-primary flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">AI Tutor</p>
            <p className="text-xs text-green-500 font-medium">● Online</p>
          </div>
          <button
            onClick={() => setMessages(initialMessages)}
            className="ml-auto flex items-center gap-1.5 h-8 px-3 text-xs text-muted border border-black/15 rounded-full hover:border-primary hover:text-primary transition-colors"
          >
            <RefreshCw size={11} /> New chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && (
                <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={13} className="text-white" />
                </div>
              )}
              <div className={`max-w-[70%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-surface shadow-sm text-foreground rounded-bl-sm border border-black/6'
                }`}>
                  {m.text}
                </div>
                <div className={`flex items-center gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] text-muted">{m.time}</span>
                  {m.role === 'ai' && (
                    <div className="flex items-center gap-1">
                      <button className="size-5 flex items-center justify-center text-muted hover:text-primary transition-colors">
                        <Copy size={10} />
                      </button>
                      <button className="size-5 flex items-center justify-center text-muted hover:text-green-500 transition-colors">
                        <ThumbsUp size={10} />
                      </button>
                      <button className="size-5 flex items-center justify-center text-muted hover:text-red-500 transition-colors">
                        <ThumbsDown size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <div className="bg-surface border border-black/6 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  {[0,1,2].map(i => (
                    <span key={i} className="size-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 flex-wrap py-3 shrink-0">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              className="h-8 px-3 bg-primary/8 text-primary text-xs font-semibold rounded-full hover:bg-primary/15 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="size-10 rounded-full bg-canvas flex items-center justify-center text-muted hover:text-primary transition-colors shrink-0">
            <Paperclip size={16} />
          </button>
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send(input)}
              placeholder="Ask me anything..."
              className="w-full h-11 px-4 pr-12 border border-black/20 rounded-pill text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
            <button
              onClick={() => setInput(input ? input : '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
            >
              <Mic size={16} />
            </button>
          </div>
          <button
            onClick={() => send(input)}
            className="size-11 rounded-full bg-primary flex items-center justify-center shadow-primary shrink-0 hover:bg-primary-deep transition-colors"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
