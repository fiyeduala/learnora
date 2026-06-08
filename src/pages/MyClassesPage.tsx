import { Plus, Users, BookOpen, ChevronRight, TrendingUp } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type ClassType = { id: number; name: string; code: string; students: number; progress: number; color: string; avgScore: number }
const classes: ClassType[] = []

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
            { label: 'Total Classes',   value: classes.length,         color: 'text-primary'    },
            { label: 'Total Students',  value: classes.reduce((s, c) => s + c.students, 0), color: 'text-foreground' },
            { label: 'Avg Completion',  value: classes.length ? Math.round(classes.reduce((s, c) => s + c.progress, 0) / classes.length) + '%' : '—', color: 'text-amber-600' },
            { label: 'Avg Score',       value: classes.length ? Math.round(classes.reduce((s, c) => s + c.avgScore, 0) / classes.length) + '%' : '—', color: 'text-green-600' },
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
        {classes.length === 0 && (
          <div className="bg-surface rounded-card shadow-sm p-12 text-center text-muted">
            <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No classes yet. Create your first class to get started.</p>
          </div>
        )}
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
            <div className="px-6 py-8 text-center text-sm text-muted">No recent activity.</div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
