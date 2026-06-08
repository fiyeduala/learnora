import { useState } from 'react'
import { MessageSquare, ThumbsUp, ChevronDown, ChevronUp, Plus, Search, Pin } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

interface Reply  { id: number; author: string; initials: string; body: string; time: string; likes: number }
interface Thread {
  id:       number
  title:    string
  body:     string
  author:   string
  initials: string
  time:     string
  subject:  string
  likes:    number
  pinned:   boolean
  replies:  Reply[]
}

const threads: Thread[] = [
  {
    id: 1, pinned: true,
    title: "How do you remember Newton's 3 Laws easily?",
    body: "I keep mixing up the second and third laws during tests. Anyone have a trick or mnemonic that actually sticks?",
    author: 'Emeka Okafor', initials: 'EO', time: '2 hours ago', subject: 'Physics', likes: 14,
    replies: [
      { id: 1, author: 'Aisha Bello', initials: 'AB', body: 'I use: Lazy, Force=ma, Reaction. The L in lazy reminds me of inertia (laziness of objects)!', time: '1 hour ago', likes: 8 },
      { id: 2, author: 'Mr Adeyemi', initials: 'MA', body: 'Good question. Try associating each law with a real-world scenario you see daily — riding a bus, pushing a wall, etc.', time: '45 min ago', likes: 11 },
    ],
  },
  {
    id: 2, pinned: false,
    title: 'Can someone explain completing the square step by step?',
    body: "I got the quadratic formula but completing the square is confusing me. Our textbook explanation is terrible.",
    author: 'Fatima Garba', initials: 'FG', time: '5 hours ago', subject: 'Mathematics', likes: 9,
    replies: [
      { id: 3, author: 'Chidi Nwosu', initials: 'CN', body: 'You move the constant to the right, then add (b/2)² to both sides. Then factor the left as a perfect square. Works every time.', time: '4 hours ago', likes: 6 },
    ],
  },
  {
    id: 3, pinned: false,
    title: 'Best way to structure an economics essay?',
    body: "The teacher said my last essay lacked analysis. I'm not sure what she means — I defined everything and included examples.",
    author: 'Kemi Williams', initials: 'KW', time: '1 day ago', subject: 'Economics', likes: 5,
    replies: [],
  },
  {
    id: 4, pinned: false,
    title: 'Study group for end of term exams — who is in?',
    body: "Thinking of a Saturday session in the library, July 5. We can split subjects and teach each other. Interested?",
    author: 'Tobi Adeyemi', initials: 'TA', time: '1 day ago', subject: 'General', likes: 21,
    replies: [
      { id: 4, author: 'Emeka Okafor', initials: 'EO', body: 'Count me in! I can cover Maths and Physics.', time: '23 hours ago', likes: 3 },
      { id: 5, author: 'Fatima Garba', initials: 'FG', body: 'Yes! I will do English and Biology.', time: '22 hours ago', likes: 2 },
    ],
  },
]


export default function DiscussionForumPage({ onNavigate }: Props) {
  const [expanded, setExpanded] = useState<number | null>(1)
  const [liked,    setLiked]    = useState<Set<number>>(new Set())
  const [query,    setQuery]    = useState('')
  const [newPost,  setNewPost]  = useState(false)
  const [draft,    setDraft]    = useState({ title: '', body: '', subject: 'General' })

  function toggleLike(id: number) {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const visible = query
    ? threads.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.subject.toLowerCase().includes(query.toLowerCase()))
    : threads

  const pinned = visible.filter(t => t.pinned)
  const rest   = visible.filter(t => !t.pinned)

  return (
    <DashboardLayout
      activePage="courses"
      onNavigate={onNavigate}
      title="Discussion Forum"
      subtitle="Ask questions and discuss with classmates and teachers"
    >
      <div className="flex flex-col gap-5 max-w-[840px]">

        {/* Toolbar */}
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search discussions…"
              className="w-full h-10 pl-9 pr-4 border border-black/20 rounded-full text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => setNewPost(true)}
            className="flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors ml-auto"
          >
            <Plus size={14} /> New Post
          </button>
        </div>

        {/* New post form */}
        {newPost && (
          <div className="bg-surface rounded-card shadow-sm p-5 border-2 border-primary/20 flex flex-col gap-3">
            <p className="text-sm font-bold text-foreground">Start a Discussion</p>
            <select
              value={draft.subject}
              onChange={e => setDraft(d => ({ ...d, subject: e.target.value }))}
              className="w-44 h-9 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
            >
              {['General', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Economics'].map(s => <option key={s}>{s}</option>)}
            </select>
            <input
              value={draft.title}
              onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
              placeholder="Discussion title…"
              className="w-full h-10 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
            />
            <textarea
              value={draft.body}
              onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
              placeholder="Describe your question or topic…"
              rows={3}
              className="w-full resize-none border border-black/20 rounded-card p-3 text-sm outline-none focus:border-primary"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setNewPost(false)} className="h-9 px-4 text-sm text-muted hover:text-foreground">Cancel</button>
              <button
                onClick={() => setNewPost(false)}
                className="h-9 px-5 bg-primary text-white text-sm font-bold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* Pinned */}
        {pinned.length > 0 && (
          <div>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5"><Pin size={11} /> Pinned</p>
            {pinned.map(t => <ThreadCard key={t.id} thread={t} expanded={expanded} setExpanded={setExpanded} liked={liked} toggleLike={toggleLike} />)}
          </div>
        )}

        {/* All threads */}
        <div className="flex flex-col gap-3">
          {rest.length === 0 && !pinned.length && (
            <div className="text-center py-12 text-muted bg-surface rounded-card shadow-sm">
              <MessageSquare size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No discussions yet. Start one!</p>
            </div>
          )}
          {rest.map(t => <ThreadCard key={t.id} thread={t} expanded={expanded} setExpanded={setExpanded} liked={liked} toggleLike={toggleLike} />)}
        </div>
      </div>
    </DashboardLayout>
  )
}

function ThreadCard({
  thread, expanded, setExpanded, liked, toggleLike
}: {
  thread: Thread
  expanded: number | null
  setExpanded: (id: number | null) => void
  liked: Set<number>
  toggleLike: (id: number) => void
}) {
  const open = expanded === thread.id
  const subjectColor = ({ Physics: 'bg-amber-50 text-amber-700', Mathematics: 'bg-primary/10 text-primary', Economics: 'bg-teal-50 text-teal-700', General: 'bg-canvas text-muted' } as Record<string, string>)[thread.subject] ?? 'bg-canvas text-muted'

  return (
    <div className="bg-surface rounded-card shadow-sm overflow-hidden mb-3">
      <button
        onClick={() => setExpanded(open ? null : thread.id)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-canvas/50 transition-colors"
      >
        <div className="size-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
          {thread.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${subjectColor}`}>{thread.subject}</span>
            <span className="text-[10px] text-muted">{thread.author} · {thread.time}</span>
          </div>
          <p className="text-sm font-bold text-foreground leading-snug">{thread.title}</p>
          {!open && <p className="text-xs text-muted mt-1 line-clamp-1">{thread.body}</p>}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-xs text-muted"><MessageSquare size={11} /> {thread.replies.length}</span>
          {open ? <ChevronUp size={15} className="text-muted" /> : <ChevronDown size={15} className="text-muted" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-black/6">
          <p className="text-sm text-foreground leading-relaxed pt-4 mb-4">{thread.body}</p>
          <button
            onClick={() => toggleLike(thread.id)}
            className={`flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-semibold transition-colors mb-5 ${liked.has(thread.id) ? 'bg-primary/10 text-primary' : 'bg-canvas text-muted hover:text-primary'}`}
          >
            <ThumbsUp size={11} /> {thread.likes + (liked.has(thread.id) ? 1 : 0)} Helpful
          </button>

          {thread.replies.length > 0 && (
            <div className="flex flex-col gap-3 mb-4">
              {thread.replies.map(r => (
                <div key={r.id} className="flex gap-3 ml-4 border-l-2 border-black/8 pl-4">
                  <div className="size-7 rounded-full bg-canvas text-muted text-xs font-bold flex items-center justify-center shrink-0">
                    {r.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{r.author} <span className="font-normal text-muted">· {r.time}</span></p>
                    <p className="text-sm text-foreground mt-1 leading-relaxed">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 ml-4">
            <div className="size-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">O</div>
            <input
              placeholder="Write a reply…"
              className="flex-1 h-8 px-3 border border-black/20 rounded-full text-sm outline-none focus:border-primary"
            />
            <button className="h-8 px-3 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-deep transition-colors">Reply</button>
          </div>
        </div>
      )}
    </div>
  )
}
