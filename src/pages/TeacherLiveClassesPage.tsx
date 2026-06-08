import { useState } from 'react'
import { Video, Plus, Play, Clock, Users, Calendar, Mic, MicOff } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const myClasses = [
  { id: 1, subject: 'Physics',     class: 'SS2A', topic: "Newton's Laws — Live Revision",  date: 'Today',  time: '2:00 PM', duration: '60 min', enrolled: 29, status: 'live'    },
  { id: 2, subject: 'Physics',     class: 'SS2B', topic: 'Forces and Motion — Q&A',         date: 'Today',  time: '4:00 PM', duration: '45 min', enrolled: 28, status: 'upcoming'},
  { id: 3, subject: 'Mathematics', class: 'SS1A', topic: 'Quadratic Equations',             date: 'Jun 10', time: '10:00 AM',duration: '60 min', enrolled: 32, status: 'upcoming'},
  { id: 4, subject: 'Physics',     class: 'SS3A', topic: 'Organic Chemistry — Exam Prep',   date: 'Jun 12', time: '1:00 PM', duration: '90 min', enrolled: 31, status: 'upcoming'},
]

const recordings = [
  { subject: 'Physics',     topic: 'Forces and Motion',         class: 'SS2A', date: 'Jun 4, 2026', duration: '58 min', views: 24 },
  { subject: 'Mathematics', topic: 'Trigonometry Review',       class: 'SS1A', date: 'Jun 3, 2026', duration: '47 min', views: 19 },
  { subject: 'Physics',     topic: 'Kinetic Energy Workshop',   class: 'SS2B', date: 'Jun 1, 2026', duration: '62 min', views: 31 },
]

const subjectColor: Record<string, string> = {
  Physics:     'bg-primary/10 text-primary',
  Mathematics: 'bg-accent-mint/10 text-accent-mint',
  English:     'bg-amber-50 text-amber-600',
  Chemistry:   'bg-red-50 text-red-500',
}

export default function TeacherLiveClassesPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<'upcoming' | 'recordings'>('upcoming')

  const liveClass = myClasses.find(c => c.status === 'live')
  const upcoming  = myClasses.filter(c => c.status === 'upcoming')

  return (
    <DashboardLayout
      activePage="live-classes"
      onNavigate={onNavigate}
      title="Live Classes"
      subtitle="Manage and host your live teaching sessions"
      nav={teacherNav}
      user={{ name: 'Mr Johnson', role: 'Teacher', initials: 'MJ' }}
    >
      <div className="max-w-[1000px] flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Live Now',     value: myClasses.filter(c => c.status === 'live').length,    color: 'text-red-600 bg-red-50'     },
            { label: 'Upcoming',     value: upcoming.length,                                       color: 'text-primary bg-primary/10' },
            { label: 'Recordings',   value: recordings.length,                                     color: 'text-green-600 bg-green-50' },
            { label: 'Total Students',value: myClasses.reduce((s, c) => s + c.enrolled, 0),       color: 'text-foreground bg-canvas'  },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Live now banner */}
        {liveClass && (
          <div className="bg-red-50 border border-red-200 rounded-card p-5">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold text-red-600 uppercase tracking-wide">LIVE NOW</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-foreground">{liveClass.topic}</p>
                <p className="text-xs text-muted mt-0.5">{liveClass.subject} · {liveClass.class} · {liveClass.time} · {liveClass.duration}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('live-classroom')}
                  className="flex items-center gap-1.5 h-10 px-5 bg-red-600 text-white text-sm font-semibold rounded-pill hover:bg-red-700 transition-colors"
                >
                  <Mic size={14} /> Enter Class
                </button>
                <button className="flex items-center gap-1.5 h-10 px-4 border border-red-300 text-red-600 text-sm font-semibold rounded-pill hover:bg-red-50 transition-colors">
                  <MicOff size={14} /> End Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab + Schedule button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 bg-canvas rounded-card p-1">
            {(['upcoming', 'recordings'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 h-9 text-sm font-semibold rounded-md transition-colors capitalize ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>
                {t === 'upcoming' ? 'Upcoming Sessions' : 'Recordings'}
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('schedule-class')}
            className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary ml-auto"
          >
            <Plus size={13} /> Schedule New Session
          </button>
        </div>

        {/* ── Upcoming ── */}
        {tab === 'upcoming' && (
          <div className="flex flex-col gap-4">
            {upcoming.map(cls => (
              <div key={cls.id} className="bg-surface rounded-card shadow-sm p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className={`size-11 rounded-card flex items-center justify-center shrink-0 ${subjectColor[cls.subject] ?? 'bg-canvas text-muted'}`}>
                    <Video size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${subjectColor[cls.subject] ?? 'bg-canvas text-muted'}`}>{cls.subject}</span>
                      <span className="text-xs text-muted font-semibold">{cls.class}</span>
                    </div>
                    <h3 className="text-base font-bold text-foreground leading-snug">{cls.topic}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {cls.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {cls.time} · {cls.duration}</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {cls.enrolled} students</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <>
                        <button
                          onClick={() => onNavigate('schedule-class')}
                          className="h-9 px-4 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onNavigate('pre-class-lobby')}
                          className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors"
                        >
                          <Play size={13} /> Start
                        </button>
                      </>
                  </div>
                </div>
              </div>
            ))}

            {upcoming.length === 0 && (
              <div className="text-center py-16 text-muted">
                <Video size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No upcoming sessions.</p>
                <button
                  onClick={() => onNavigate('schedule-class')}
                  className="mt-3 text-sm text-primary font-semibold hover:underline"
                >
                  Schedule a session
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Recordings ── */}
        {tab === 'recordings' && (
          <div className="flex flex-col gap-3">
            {recordings.map((r, i) => (
              <div key={i} className="bg-surface rounded-card shadow-sm p-5 flex flex-wrap items-center gap-4">
                <div className={`size-11 rounded-card flex items-center justify-center shrink-0 ${subjectColor[r.subject] ?? 'bg-canvas text-muted'}`}>
                  <Video size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{r.topic}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted">
                    <span>{r.subject} · {r.class}</span>
                    <span>{r.date}</span>
                    <span><Clock size={10} className="inline mr-0.5" />{r.duration}</span>
                    <span><Users size={10} className="inline mr-0.5" />{r.views} views</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('class-recordings')}
                  className="flex items-center gap-1.5 h-9 px-4 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors"
                >
                  <Play size={13} /> Play
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
