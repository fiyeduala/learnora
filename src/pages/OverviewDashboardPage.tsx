import { Play, ArrowRight, CheckCircle2, Clock, ChevronRight } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

// ── Data (matches Figma text nodes) ─────────────────────────────────────────

const courses = [
  { id: 1, subject: 'Physics 101',  teacher: 'Mr. Daniel Johnson',  progress: 74, color: 'bg-accent-cyan' },
  { id: 2, subject: 'English',      teacher: 'Mrs Monica Johnson',  progress: 52, color: 'bg-accent-mint' },
  { id: 3, subject: 'Mathematics',  teacher: 'Mrs Nnduka Kisha',    progress: 38, color: 'bg-primary' },
  { id: 4, subject: 'Government',   teacher: 'Mr Boris Johnson',    progress: 61, color: 'bg-primary-deep' },
]

const assignments = [
  { subject: 'Mathematics', deadline: 'Tomorrow',   status: 'Pending' },
  { subject: 'English',     deadline: '07/07/2026', status: 'Completed' },
  { subject: 'Mathematics', deadline: 'Tomorrow',   status: 'Pending' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

function WelcomeBanner({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="relative bg-surface rounded-card px-8 py-7 overflow-hidden shadow-sm">
      <div className="max-w-[480px]">
        <h2 className="text-2xl font-bold text-foreground mb-1">Welcome Back, Olive!</h2>
        <p className="text-sm text-muted mb-6">You have 3 assignments due this week</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-2 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            <Play size={14} fill="currentColor" />
            Continue Learning
          </button>
          <button
            onClick={() => onNavigate('live-classes')}
            className="flex items-center gap-2 h-11 px-5 border border-muted text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors"
          >
            Join Live Class
          </button>
        </div>
      </div>
      {/* Decorative illustration placeholder */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 size-36 rounded-card bg-gradient-to-br from-accent-cyan/20 to-accent-mint/20 flex items-center justify-center text-4xl select-none hidden sm:flex">
        📚
      </div>
    </div>
  )
}

function SectionHeader({ title, onViewAll }: { title: string; onViewAll?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
        >
          View all <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}

function CourseCard({ subject, teacher, progress, color }: typeof courses[0]) {
  return (
    <div className="bg-surface rounded-card overflow-hidden shadow-sm flex flex-col">
      {/* Thumbnail */}
      <div className={`h-40 ${color} opacity-80`} />
      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <p className="text-base font-semibold text-foreground">{subject}</p>
        <p className="text-sm text-muted">{teacher}</p>
        {/* Progress bar */}
        <div className="h-2 bg-black/8 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted">{progress}% complete</p>
      </div>
      <div className="px-4 pb-4">
        <button className="w-full h-10 border border-primary text-primary text-sm font-semibold rounded-pill hover:bg-primary hover:text-white transition-colors">
          Resume Course
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const done = status === 'Completed'
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xs ${
        done
          ? 'bg-green-50 text-green-700'
          : 'bg-amber-50 text-amber-700'
      }`}
    >
      {done
        ? <CheckCircle2 size={12} />
        : <Clock size={12} />}
      {status}
    </span>
  )
}

function AssignmentsTable({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="bg-surface rounded-card shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <SectionHeader title="Upcoming Assignments" onViewAll={() => onNavigate('assignments')} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/6 text-muted text-xs font-semibold uppercase tracking-wider">
              <th className="text-left px-6 py-3">Subject</th>
              <th className="text-left px-6 py-3">Deadline</th>
              <th className="text-left px-6 py-3">Status</th>
              <th className="text-left px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a, i) => (
              <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{a.subject}</td>
                <td className="px-6 py-4 text-muted">{a.deadline}</td>
                <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onNavigate('assignments')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xs transition-colors ${
                      a.status === 'Completed'
                        ? 'text-primary hover:bg-primary/8'
                        : 'bg-primary text-white hover:bg-primary-deep'
                    }`}
                  >
                    {a.status === 'Completed' ? 'View' : 'Submit'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LiveClassCard({ subject, teacher, time, live }: {
  subject: string; teacher: string; time: string; live?: boolean
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-black/4 last:border-0">
      <div className={`size-10 rounded-card flex items-center justify-center shrink-0 ${live ? 'bg-red-50' : 'bg-primary/8'}`}>
        <Play size={14} className={live ? 'text-red-500 fill-red-500' : 'text-primary fill-primary'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{subject}</p>
        <p className="text-xs text-muted">{teacher} · {time}</p>
      </div>
      {live && (
        <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-xs">LIVE</span>
      )}
      {!live && (
        <button className="text-xs text-primary font-semibold hover:underline shrink-0">Join</button>
      )}
    </div>
  )
}

function PerformanceBar({ subject, score }: { subject: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-foreground w-24 shrink-0">{subject}</p>
      <div className="flex-1 h-2 bg-black/8 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
      </div>
      <p className="text-sm font-semibold text-foreground w-10 text-right">{score}%</p>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewDashboardPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="dashboard"
      onNavigate={onNavigate}
      title="Dashboard"
      subtitle="Track your academic activities"
    >
      <div className="flex flex-col gap-6 max-w-[1300px]">

        {/* Welcome banner */}
        <WelcomeBanner onNavigate={onNavigate} />

        {/* Continue Learning */}
        <section>
          <SectionHeader title="Continue Learning" onViewAll={() => onNavigate('courses')} />
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {courses.map(c => <CourseCard key={c.id} {...c} />)}
          </div>
        </section>

        {/* Assignments table */}
        <AssignmentsTable onNavigate={onNavigate} />

        {/* Live Classes + Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">

          {/* Live Classes */}
          <div className="bg-surface rounded-card shadow-sm p-6">
            <SectionHeader title="Live Classes" onViewAll={() => onNavigate('live-classes')} />
            <LiveClassCard subject="Physics 101"  teacher="Mr. Daniel Johnson" time="10:00 AM" live />
            <LiveClassCard subject="Mathematics"  teacher="Mrs Nnduka Kisha"   time="12:30 PM" />
            <LiveClassCard subject="English"      teacher="Mrs Monica Johnson" time="2:00 PM" />
          </div>

          {/* Performance Overview */}
          <div className="bg-surface rounded-card shadow-sm p-6 lg:w-80">
            <SectionHeader title="Performance Overview" onViewAll={() => onNavigate('analysis')} />
            <div className="flex flex-col gap-4">
              <PerformanceBar subject="Physics"    score={82} />
              <PerformanceBar subject="English"    score={76} />
              <PerformanceBar subject="Maths"      score={68} />
              <PerformanceBar subject="Government" score={91} />
            </div>
            <button
              onClick={() => onNavigate('analysis')}
              className="mt-6 w-full h-10 border border-primary text-primary text-sm font-semibold rounded-pill hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1"
            >
              Full Report <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
