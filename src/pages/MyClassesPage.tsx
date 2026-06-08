import { Plus, Users, BookOpen, ChevronRight, TrendingUp } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const classes = [
  { id: 1, name: 'Physics 101',  code: 'SS1A', students: 32, progress: 68, color: 'bg-primary',      avgScore: 74 },
  { id: 2, name: 'Mathematics',  code: 'SS2B', students: 28, progress: 45, color: 'bg-accent-cyan',  avgScore: 68 },
  { id: 3, name: 'Physics 101',  code: 'SS3A', students: 30, progress: 82, color: 'bg-accent-mint',  avgScore: 81 },
  { id: 4, name: 'Mathematics',  code: 'SS1A', students: 27, progress: 31, color: 'bg-primary-deep', avgScore: 62 },
  { id: 5, name: 'Physics 102',  code: 'SS2A', students: 29, progress: 55, color: 'bg-primary',      avgScore: 70 },
  { id: 6, name: 'Mathematics',  code: 'SS3B', students: 31, progress: 73, color: 'bg-accent-cyan',  avgScore: 77 },
]

export default function MyClassesPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="classes"
      onNavigate={onNavigate}
      title="My Classes"
      subtitle="Manage all your active classes"
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="max-w-[1200px] flex flex-col gap-6">

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Classes',   value: '6',    color: 'text-primary'    },
            { label: 'Total Students',  value: '177',  color: 'text-foreground' },
            { label: 'Avg Completion',  value: '59%',  color: 'text-amber-600'  },
            { label: 'Avg Score',       value: '72%',  color: 'text-green-600'  },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Header + create */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">All Classes</h2>
          <button
            onClick={() => onNavigate('create-class')}
            className="flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            <Plus size={14} /> New Class
          </button>
        </div>

        {/* Classes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {classes.map(c => (
            <div key={c.id} className="bg-surface rounded-card shadow-sm overflow-hidden flex flex-col">
              {/* Color bar */}
              <div className={`h-2 ${c.color}`} />
              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Title */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted">{c.code}</p>
                  </div>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {c.code}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Users size={14} />{c.students} students
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <TrendingUp size={14} />Avg: {c.avgScore}%
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted">Course progress</span>
                    <span className="font-semibold text-foreground">{c.progress}%</span>
                  </div>
                  <div className="h-2 bg-black/8 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onNavigate('class-details')}
                    className="flex-1 h-9 border border-primary text-primary text-sm font-semibold rounded-pill hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <BookOpen size={13} /> View Class
                  </button>
                  <button
                    onClick={() => onNavigate('students')}
                    className="flex-1 h-9 border border-black/15 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                  >
                    <Users size={13} /> Students
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/6">
            <h3 className="text-base font-bold text-foreground">Class Activity</h3>
            <button className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-black/4">
            {[
              { class: 'Physics 101 · SS1A', action: '28/32 students submitted Algebra Quiz',   time: '10 min ago' },
              { class: 'Mathematics · SS2B', action: 'New assignment posted: Calculus Basics',  time: '1 hr ago'   },
              { class: 'Physics 101 · SS3A', action: 'Live class starts in 30 minutes',         time: '2 hr ago'   },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen size={13} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary mb-0.5">{a.class}</p>
                  <p className="text-sm text-foreground">{a.action}</p>
                </div>
                <span className="text-xs text-muted shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
