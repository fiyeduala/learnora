import { Video, Calendar, Clock, Users, Play, Plus } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const upcoming = [
  { id: 1, subject: 'Physics',     topic: 'Newton\'s Laws — Live Revision',    teacher: 'Mr Adeyemi Johnson',  date: 'Today', time: '2:00 PM',  duration: '60 min', students: 38, status: 'live'     },
  { id: 2, subject: 'Mathematics', topic: 'Quadratic Equations Deep Dive',      teacher: 'Mrs Oluwaseun Bello', date: 'Today', time: '4:00 PM',  duration: '45 min', students: 42, status: 'upcoming' },
  { id: 3, subject: 'English',     topic: 'Essay Writing — Live Workshop',      teacher: 'Mr Daniel Okafor',    date: 'Jun 8', time: '10:00 AM', duration: '60 min', students: 40, status: 'upcoming' },
  { id: 4, subject: 'Chemistry',   topic: 'Organic Chemistry — Q&A Session',   teacher: 'Mrs Fatima Aliyu',    date: 'Jun 9', time: '1:00 PM',  duration: '90 min', students: 36, status: 'upcoming' },
]

const past = [
  { subject: 'Physics',     topic: 'Forces and Motion',           date: 'Jun 4, 2026', duration: '58 min', hasRecording: true  },
  { subject: 'Mathematics', topic: 'Trigonometry Review',         date: 'Jun 3, 2026', duration: '47 min', hasRecording: true  },
  { subject: 'Biology',     topic: 'Cell Division — Meiosis',     date: 'Jun 2, 2026', duration: '62 min', hasRecording: false },
]

const subjectColor: Record<string, string> = {
  Physics:     'bg-primary/10 text-primary',
  Mathematics: 'bg-accent-mint/10 text-accent-mint',
  English:     'bg-amber-50 text-amber-600',
  Chemistry:   'bg-red-50 text-red-500',
  Biology:     'bg-green-50 text-green-600',
}

export default function LiveClassesOverviewPage({ onNavigate }: Props) {
  return (
    <DashboardLayout
      activePage="live-classes"
      onNavigate={onNavigate}
      title="Live Classes"
      subtitle="Join live sessions and review recordings"
    >
      <div className="flex flex-col gap-6">

        {/* Live now banner */}
        {upcoming.filter(c => c.status === 'live').map(cls => (
          <div key={cls.id} className="bg-primary rounded-card p-5 flex items-center gap-5">
            <div className="size-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Video size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" /> LIVE
                </span>
                <span className="text-xs text-white/70">{cls.subject}</span>
              </div>
              <p className="text-base font-bold text-white truncate">{cls.topic}</p>
              <p className="text-xs text-white/70 mt-0.5">{cls.teacher} · {cls.students} students</p>
            </div>
            <button
              onClick={() => onNavigate('live-classroom')}
              className="h-10 px-5 bg-white text-primary text-sm font-bold rounded-pill shrink-0 hover:bg-white/90 transition-colors"
            >
              Join Now
            </button>
          </div>
        ))}

        {/* Upcoming classes */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Upcoming Classes</h2>
            <button
              onClick={() => onNavigate('schedule-class')}
              className="flex items-center gap-1.5 h-8 px-3 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors"
            >
              <Plus size={12} /> Schedule
            </button>
          </div>
          <div className="divide-y divide-black/4">
            {upcoming.filter(c => c.status === 'upcoming').map(cls => (
              <div key={cls.id} className="flex items-center gap-4 px-6 py-4 hover:bg-canvas/50 transition-colors">
                <div className={`size-10 rounded-card flex items-center justify-center shrink-0 ${subjectColor[cls.subject] ?? 'bg-canvas text-muted'}`}>
                  <Video size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{cls.topic}</p>
                  <p className="text-xs text-muted mt-0.5">{cls.subject} · {cls.teacher}</p>
                </div>
                <div className="text-right shrink-0 hidden sm:block">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground justify-end">
                    <Calendar size={11} className="text-muted" /> {cls.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted justify-end mt-0.5">
                    <Clock size={11} /> {cls.time} · {cls.duration}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted shrink-0 hidden lg:flex">
                  <Users size={11} /> {cls.students}
                </div>
                <button
                  onClick={() => onNavigate('pre-class-lobby')}
                  className="h-8 px-4 border border-primary text-primary text-xs font-semibold rounded-full hover:bg-primary/8 transition-colors shrink-0"
                >
                  Prepare
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Past / recordings */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Past Classes</h2>
            <button
              onClick={() => onNavigate('class-recordings')}
              className="text-xs text-primary font-semibold hover:underline"
            >
              View all recordings
            </button>
          </div>
          <div className="divide-y divide-black/4">
            {past.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className={`size-10 rounded-card flex items-center justify-center shrink-0 ${subjectColor[cls.subject] ?? 'bg-canvas text-muted'}`}>
                  <Video size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{cls.topic}</p>
                  <p className="text-xs text-muted">{cls.subject} · {cls.date} · {cls.duration}</p>
                </div>
                {cls.hasRecording ? (
                  <button
                    onClick={() => onNavigate('class-recordings')}
                    className="flex items-center gap-1.5 h-8 px-3 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors shrink-0"
                  >
                    <Play size={11} /> Watch
                  </button>
                ) : (
                  <span className="text-xs text-muted shrink-0">No recording</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
