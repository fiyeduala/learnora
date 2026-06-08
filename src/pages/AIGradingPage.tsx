import { useState } from 'react'
import { Send, Upload, Mic, Sparkles } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const quickActions = [
  'Explain Topic',
  'Summarize Notes',
  'Generate Quiz',
  'Solve Question',
  'Create Flashcards',
]

const recentChats = [
  { title: 'Biology Quiz Help',         time: '2 hours ago' },
  { title: 'Mathematics Quiz Question', time: '3 hours ago' },
  { title: 'Note explanation',          time: '4 hours ago' },
  { title: 'Biology Quiz Help',         time: '5 hours ago' },
]

type Message = { role: 'user' | 'ai'; text: string }

export default function AIGradingPage({ onNavigate }: Props) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [
      ...prev,
      { role: 'user', text },
      { role: 'ai', text: `I've analyzed the assignment related to "${text}". Here are my grading suggestions based on the rubric and student submissions. This is where Learnova AI would provide detailed feedback and grade recommendations.` },
    ])
    setInput('')
  }

  function handleQuickAction(label: string) {
    setInput(`${label}: `)
  }

  return (
    <DashboardLayout
      activePage="ai-assistant"
      onNavigate={onNavigate}
      title="Learnova AI Review"
      subtitle="AI analyzed this assignment and generated grading suggestions"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="flex flex-col gap-5 max-w-[1200px]">

        {/* AI note banner */}
        <div className="flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-card p-4">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">AI analyzed this assignment and generated grading suggestions</p>
            <p className="text-xs text-muted mt-0.5">Review suggestions below and accept or override grades before publishing.</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden flex flex-col" style={{ minHeight: '380px' }}>
          {/* Message box */}
          <div className="flex-1 p-6 flex flex-col gap-4 min-h-[240px] max-h-[380px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-6">
                <div className="size-14 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <p className="text-lg font-semibold text-foreground">Ask Learnova Anything</p>
                <p className="text-sm text-muted max-w-sm">Ask for grading help, rubric suggestions, or student feedback generation.</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'ai' && (
                    <div className="size-8 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`
                    max-w-[72%] rounded-card px-4 py-3 text-sm leading-relaxed
                    ${m.role === 'user'
                      ? 'bg-primary text-white rounded-br-xs'
                      : 'bg-canvas text-foreground rounded-bl-xs'}
                  `}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick action chips */}
          <div className="px-6 pb-3 flex flex-wrap gap-2 border-t border-black/4 pt-4">
            {quickActions.map(label => (
              <button
                key={label}
                onClick={() => handleQuickAction(label)}
                className="px-3 py-1.5 bg-canvas border border-black/8 rounded-input text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="px-6 pb-5 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 h-11 px-4 bg-canvas border border-black/8 rounded-input">
                <input
                  type="text"
                  placeholder="Ask AI to help with grading, feedback, or rubrics…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
                />
              </div>
              <button className="flex items-center gap-2 h-11 px-3 border border-black/8 bg-canvas rounded-input text-xs font-medium text-muted hover:border-primary hover:text-primary transition-colors">
                <Upload size={14} />
                Upload File
              </button>
              <button className="flex items-center gap-2 h-11 px-3 border border-black/8 bg-canvas rounded-input text-xs font-medium text-muted hover:border-primary hover:text-primary transition-colors">
                <Mic size={14} />
                Voice
              </button>
              <button
                onClick={handleSend}
                className="size-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-deep transition-colors shadow-primary shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Recent conversations */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-black/6">
            <h3 className="text-base font-bold text-foreground">Recent</h3>
          </div>
          <div className="divide-y divide-black/4">
            {recentChats.map((c, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-canvas/60 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles size={14} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{c.title}</span>
                </div>
                <span className="text-xs text-muted shrink-0">{c.time}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
