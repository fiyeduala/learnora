import { useState } from 'react'
import { Search, BookOpen, PenLine, User, Calendar, X, Megaphone, GraduationCap } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

type RType = 'course' | 'assignment' | 'student' | 'event' | 'teacher' | 'announcement'

type Result = { type: RType; title: string; sub: string; page: string }

const allResults: Result[] = [
  { type: 'course',       title: 'Physics 101',               sub: 'Course · SS1A · 68% complete',             page: 'course-details'        },
  { type: 'course',       title: 'Mathematics',               sub: 'Course · SS2B · 45% complete',             page: 'course-details'        },
  { type: 'course',       title: 'Basic Science',             sub: 'Course · JSS1 · 82% complete',             page: 'course-details'        },
  { type: 'assignment',   title: "Newton's Laws Quiz",        sub: 'Assignment · Physics · Due Jun 8',         page: 'assignments'           },
  { type: 'assignment',   title: 'Algebra Worksheet',         sub: 'Assignment · Maths · Submitted',           page: 'assignments'           },
  { type: 'assignment',   title: 'Essay on Shakespeare',      sub: 'Assignment · English · Overdue',           page: 'assignments'           },
  { type: 'student',      title: 'Olive Princely Johnson',    sub: 'Student · SS1A · GPA 4.3',                 page: 'student-profile'       },
  { type: 'student',      title: 'Fatima Al-Rashid',          sub: 'Student · SS1A · GPA 4.8',                 page: 'student-profile'       },
  { type: 'student',      title: 'Tobi Ashuma',               sub: 'Student · JSS2B · GPA 3.8',               page: 'student-profile'       },
  { type: 'teacher',      title: 'Mr. Daniel Johnson',        sub: 'Teacher · Mathematics & Physics',          page: 'students'              },
  { type: 'teacher',      title: 'Mrs. Elena Bright',         sub: 'Teacher · English · New (Pending)',        page: 'students'              },
  { type: 'event',        title: 'Maths Exam',                sub: 'Event · June 15, 2026 · 9:00 AM',          page: 'event-details'         },
  { type: 'event',        title: 'Sports Day',                sub: 'Event · June 20, 2026 · All day',          page: 'event-details'         },
  { type: 'announcement', title: 'End-of-Term Timetable',     sub: 'Announcement · Posted Jun 1',              page: 'announcements'         },
  { type: 'announcement', title: 'Platform Maintenance',      sub: 'Announcement · Jun 14, 2026',              page: 'announcements'         },
]

const recentSearches = ['Physics assignment', 'Newton', 'SS1A attendance', 'Mrs Bright']

const iconMap: Record<RType, { Icon: typeof BookOpen; color: string; bg: string }> = {
  course:       { Icon: BookOpen,       color: 'text-primary',      bg: 'bg-primary/10'     },
  assignment:   { Icon: PenLine,        color: 'text-amber-600',    bg: 'bg-amber-50'       },
  student:      { Icon: User,           color: 'text-accent-mint',  bg: 'bg-accent-mint/10' },
  teacher:      { Icon: GraduationCap,  color: 'text-purple-600',   bg: 'bg-purple-50'      },
  event:        { Icon: Calendar,       color: 'text-foreground',   bg: 'bg-canvas'         },
  announcement: { Icon: Megaphone,      color: 'text-primary-deep', bg: 'bg-primary/8'      },
}

type Category = 'All' | 'Courses' | 'Assignments' | 'Students' | 'Teachers' | 'Announcements'

const categoryMap: Record<Category, RType[] | null> = {
  'All':           null,
  'Courses':       ['course'],
  'Assignments':   ['assignment'],
  'Students':      ['student'],
  'Teachers':      ['teacher'],
  'Announcements': ['announcement', 'event'],
}

export default function GlobalSearchPage({ onNavigate }: Props) {
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState<Category>('All')

  const filtered = allResults.filter(r => {
    const matchesQuery = query.trim().length > 1
      ? r.title.toLowerCase().includes(query.toLowerCase()) || r.sub.toLowerCase().includes(query.toLowerCase())
      : true
    const types = categoryMap[category]
    const matchesCat = types === null || types.includes(r.type)
    return matchesQuery && matchesCat
  })

  const showResults = query.trim().length > 1 || category !== 'All'

  return (
    <DashboardLayout
      activePage="search"
      onNavigate={onNavigate}
      title="Search"
      subtitle="Find anything across Learnora"
    >
      <div className="max-w-[760px] flex flex-col gap-5">

        {/* Search input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            autoFocus
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search courses, assignments, students, teachers..."
            className="w-full h-14 pl-12 pr-12 border border-black/20 rounded-card text-base text-foreground placeholder:text-muted outline-none focus:border-primary shadow-sm transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(['All', 'Courses', 'Assignments', 'Students', 'Teachers', 'Announcements'] as Category[]).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${category === c ? 'bg-primary text-white shadow-primary' : 'bg-surface text-muted hover:text-primary border border-black/10'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Recent (when no query and All category) */}
        {!query && category === 'All' && (
          <div className="bg-surface rounded-card shadow-sm p-5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Recent Searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="flex items-center gap-2 h-8 px-3 bg-canvas rounded-full text-sm text-muted hover:text-primary hover:bg-primary/8 transition-colors">
                  <Search size={12} />{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && filtered.length > 0 && (
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-black/6 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                {query.trim() ? ` for "${query}"` : ''}
              </p>
              {category !== 'All' && (
                <span className="text-xs text-primary font-semibold">{category}</span>
              )}
            </div>
            <div className="divide-y divide-black/4">
              {filtered.map((r, i) => {
                const { Icon, color, bg } = iconMap[r.type]
                return (
                  <button key={i} onClick={() => onNavigate(r.page)}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-canvas/60 transition-colors text-left">
                    <div className={`size-9 rounded-card ${bg} flex items-center justify-center shrink-0`}>
                      <Icon size={15} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.title}</p>
                      <p className="text-xs text-muted mt-0.5">{r.sub}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-muted uppercase tracking-wider shrink-0 capitalize">{r.type}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {showResults && filtered.length === 0 && (
          <div className="text-center py-12 text-muted">
            <Search size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No results{query.trim() ? ` for "${query}"` : ''}</p>
            <p className="text-xs mt-1">Try different keywords or select a different category.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
