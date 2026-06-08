import { Search, ChevronDown, Play, BookOpen } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const courses = [
  { id: 1,  subject: 'Introduction to Physics 101', teacher: 'Mr. Daniel Johnson',  progress: 74, color: 'from-accent-cyan to-primary',      lessons: 24, enrolled: true  },
  { id: 2,  subject: 'Mathematics',                  teacher: 'Mrs. Nnduka Kisha',   progress: 38, color: 'from-primary to-accent-cyan',       lessons: 18, enrolled: true  },
  { id: 3,  subject: 'Understanding English',        teacher: 'Mrs. Monica Johnson', progress: 52, color: 'from-accent-mint to-primary-deep',   lessons: 20, enrolled: true  },
  { id: 4,  subject: 'History',                      teacher: 'Mr. Boris Johnson',   progress: 61, color: 'from-primary-deep to-accent-mint',   lessons: 15, enrolled: true  },
  { id: 5,  subject: 'Biology',                      teacher: 'Ms. Sarah Okonkwo',   progress: 45, color: 'from-green-400 to-accent-mint',      lessons: 22, enrolled: true  },
  { id: 6,  subject: 'Chemistry',                    teacher: 'Mr. James Eze',        progress: 29, color: 'from-orange-400 to-red-400',         lessons: 28, enrolled: true  },
  { id: 7,  subject: 'Economics',                    teacher: 'Mrs. Aisha Bello',     progress: 0,  color: 'from-violet-400 to-primary',         lessons: 16, enrolled: false },
  { id: 8,  subject: 'Government',                   teacher: 'Mr. Boris Johnson',   progress: 0,  color: 'from-rose-400 to-orange-400',        lessons: 19, enrolled: false },
]

type CourseCardProps = typeof courses[0] & { onNavigate: (p: string) => void }

function CourseCard({ subject, teacher, progress, color, lessons, enrolled, onNavigate }: CourseCardProps) {
  return (
    <div className="bg-surface rounded-card shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className={`h-40 bg-gradient-to-br ${color} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/30 text-white text-xs font-medium px-2 py-1 rounded-full">
          <BookOpen size={11} />
          {lessons} lessons
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <p className="text-base font-semibold text-foreground leading-snug">{subject}</p>
        <p className="text-sm text-muted">{teacher}</p>

        {enrolled ? (
          <>
            <div className="h-1.5 bg-black/8 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-muted">{progress}% complete</p>
          </>
        ) : (
          <p className="text-xs text-muted mt-1">Not enrolled</p>
        )}
      </div>

      <div className="px-4 pb-4">
        {enrolled ? (
          <button
            onClick={() => onNavigate('course-detail')}
            className="w-full h-10 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            <Play size={12} fill="currentColor" />
            Continue Learning
          </button>
        ) : (
          <button
            onClick={() => onNavigate('course-detail')}
            className="w-full h-10 border border-primary text-primary text-sm font-semibold rounded-pill hover:bg-primary hover:text-white transition-colors"
          >
            Enroll Now
          </button>
        )}
      </div>
    </div>
  )
}

export default function MyCoursesPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="courses"
      onNavigate={onNavigate}
      title="My Courses"
      subtitle="Access and continue all enrolled courses"
    >
      <div className="flex flex-col gap-6 max-w-[1300px]">

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 h-11 px-4 bg-surface border border-black/8 rounded-input flex-1 min-w-[200px] max-w-md shadow-sm">
            <Search size={16} className="text-muted shrink-0" />
            <input
              type="search"
              placeholder="Search Courses"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>

          <button className="flex items-center gap-2 h-11 px-4 bg-surface border border-black/8 rounded-input text-sm text-foreground shadow-sm hover:border-primary hover:text-primary transition-colors shrink-0">
            All Courses
            <ChevronDown size={14} className="text-muted" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Enrolled',     value: 6,   color: 'text-primary'    },
            { label: 'In Progress',  value: 6,   color: 'text-amber-600'  },
            { label: 'Completed',    value: 0,   color: 'text-green-600'  },
            { label: 'Available',    value: 2,   color: 'text-foreground' },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Course grid */}
        <section>
          <h3 className="text-lg font-bold text-foreground mb-4">All Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map(c => (
              <CourseCard key={c.id} {...c} onNavigate={onNavigate} />
            ))}
          </div>
        </section>

      </div>
    </DashboardLayout>
  )
}
