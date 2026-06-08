import { Sparkles, MessageSquare, Trash2, ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const conversations = [
  { id: 1, title: "Newton's Laws Explained",           preview: 'F = ma — the Second Law states that...', date: 'Today, 2:06 PM',    messages: 12, subject: 'Physics'     },
  { id: 2, title: 'Quadratic Formula Help',            preview: 'Using the discriminant b² - 4ac to...', date: 'Yesterday',          messages: 8,  subject: 'Mathematics' },
  { id: 3, title: 'Essay Structure for WAEC',          preview: 'Introduction should capture the reader...', date: 'Jun 4, 2026',    messages: 15, subject: 'English'     },
  { id: 4, title: 'Photosynthesis Deep Dive',          preview: 'Chlorophyll absorbs light primarily...', date: 'Jun 3, 2026',        messages: 10, subject: 'Biology'     },
  { id: 5, title: 'Organic Chemistry Basics',         preview: 'Alkanes follow the formula CnH2n+2...', date: 'Jun 1, 2026',         messages: 18, subject: 'Chemistry'   },
  { id: 6, title: 'Trigonometry Identities Review',  preview: 'sin²θ + cos²θ = 1 is the Pythagorean...', date: 'May 28, 2026',      messages: 7,  subject: 'Mathematics' },
]

const subjectColor: Record<string, string> = {
  Physics:     'bg-primary/10 text-primary',
  Mathematics: 'bg-accent-mint/10 text-accent-mint',
  English:     'bg-amber-50 text-amber-600',
  Biology:     'bg-green-50 text-green-600',
  Chemistry:   'bg-red-50 text-red-500',
}

export default function AISavedConversationsPage({ onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [list,  setList]  = useState(conversations)

  const filtered = query
    ? list.filter(c => c.title.toLowerCase().includes(query.toLowerCase()))
    : list

  function remove(id: number) {
    setList(prev => prev.filter(c => c.id !== id))
  }

  return (
    <DashboardLayout activePage="ai-tutor" onNavigate={onNavigate} title="Saved Conversations" subtitle="Your AI Tutor chat history">
      <div className="max-w-[720px] flex flex-col gap-5">

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-11 pl-10 pr-4 border border-black/20 rounded-pill text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
          />
        </div>

        {/* List */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-black/4">
              {filtered.map(conv => (
                <div key={conv.id} className="flex items-start gap-4 px-5 py-4 hover:bg-canvas/50 transition-colors group">
                  <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={15} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onNavigate('ai-chat')}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{conv.title}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${subjectColor[conv.subject] ?? 'bg-canvas text-muted'}`}>
                        {conv.subject}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate">{conv.preview}</p>
                    <p className="text-xs text-muted mt-1">{conv.date} · {conv.messages} messages</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => remove(conv.id)}
                      className="size-8 rounded-full flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                    <button onClick={() => onNavigate('ai-chat')} className="size-8 rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
