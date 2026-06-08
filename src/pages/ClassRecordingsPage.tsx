import { Play, Search, Download, Clock, Calendar, BookOpen } from 'lucide-react'
import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const recordings = [
  { subject: 'Physics',     topic: 'Forces and Motion',              teacher: 'Mr Adeyemi Johnson',  date: 'Jun 4, 2026',  duration: '58 min', views: 24, thumb: 'bg-primary'     },
  { subject: 'Mathematics', topic: 'Trigonometry Review',            teacher: 'Mrs Oluwaseun Bello', date: 'Jun 3, 2026',  duration: '47 min', views: 31, thumb: 'bg-accent-mint' },
  { subject: 'Physics',     topic: 'Work, Energy and Power',         teacher: 'Mr Adeyemi Johnson',  date: 'May 28, 2026', duration: '62 min', views: 38, thumb: 'bg-primary'     },
  { subject: 'Chemistry',   topic: 'Acids, Bases and Salts',         teacher: 'Mrs Fatima Aliyu',    date: 'May 26, 2026', duration: '55 min', views: 19, thumb: 'bg-red-400'     },
  { subject: 'English',     topic: 'Comprehension Techniques',       teacher: 'Mr Daniel Okafor',    date: 'May 22, 2026', duration: '44 min', views: 28, thumb: 'bg-amber-400'   },
  { subject: 'Mathematics', topic: 'Algebraic Fractions Simplified', teacher: 'Mrs Oluwaseun Bello', date: 'May 20, 2026', duration: '51 min', views: 35, thumb: 'bg-accent-mint' },
]

const subjects = ['All', 'Physics', 'Mathematics', 'Chemistry', 'English']

export default function ClassRecordingsPage({ onNavigate }: Props) {
  const [query,   setQuery]   = useState('')
  const [subject, setSubject] = useState('All')

  const filtered = recordings.filter(r => {
    const matchSub   = subject === 'All' || r.subject === subject
    const matchQuery = !query || r.topic.toLowerCase().includes(query.toLowerCase())
    return matchSub && matchQuery
  })

  return (
    <DashboardLayout
      activePage="live-classes"
      onNavigate={onNavigate}
      title="Class Recordings"
      subtitle="Catch up on missed sessions"
    >
      <div className="flex flex-col gap-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search recordings..."
              className="w-full h-10 pl-10 pr-4 border border-black/20 rounded-pill text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`h-9 px-4 rounded-pill text-sm font-semibold transition-colors ${subject === s ? 'bg-primary text-white shadow-primary' : 'bg-canvas text-muted hover:text-foreground'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((r, i) => (
            <div key={i} className="bg-surface rounded-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className={`h-40 ${r.thumb} relative flex items-center justify-center cursor-pointer`}
                onClick={() => onNavigate('live-classroom')}>
                <button className="size-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur hover:bg-white/30 transition-colors">
                  <Play size={22} className="text-white ml-1" />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={10} /> {r.duration}
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">{r.subject}</span>
                </div>
                <p className="text-sm font-bold text-foreground leading-snug mb-1">{r.topic}</p>
                <p className="text-xs text-muted flex items-center gap-1">
                  <BookOpen size={11} /> {r.teacher}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/6">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Calendar size={11} /> {r.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">{r.views} views</span>
                    <button className="size-7 rounded-full bg-canvas flex items-center justify-center hover:bg-primary/10 transition-colors">
                      <Download size={12} className="text-muted hover:text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted">
            <Play size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No recordings found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
