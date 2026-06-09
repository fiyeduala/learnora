import { useState } from 'react'
import { Video, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

const subjects  = ['Physics', 'Mathematics', 'Chemistry', 'English', 'Biology']
const classes   = ['SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B']
const durations = ['30 minutes', '45 minutes', '60 minutes', '90 minutes']
const platforms = ['Built-in (Learnora Live)', 'Zoom', 'Google Meet']

export default function ScheduleLiveClassPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    title: '', subject: subjects[0], cls: classes[0],
    date: '', time: '', duration: durations[2], platform: platforms[0],
    description: '', sendNotif: true,
  })

  function set(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }))
  }

  if (done) {
    return (
      <DashboardLayout
        activePage="live-classes"
        onNavigate={onNavigate}
        title="Class Scheduled"
        nav={teacherNav}
        user={profileToSidebarUser(profile)}
      >
        <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4">
          <div className="size-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Class Scheduled!</h1>
          <p className="text-sm text-muted max-w-[360px] mb-2">
            <span className="font-semibold text-foreground">{form.title || 'Live Class'}</span> has been scheduled.
            Students will receive a notification.
          </p>
          <p className="text-xs text-muted mb-8">{form.date} · {form.time} · {form.duration}</p>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('teacher-live-classes')}
              className="h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
            >
              Back to Live Classes
            </button>
            <button
              onClick={() => { setDone(false); setForm(f => ({ ...f, title: '', date: '', time: '' })) }}
              className="h-11 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:bg-canvas transition-colors"
            >
              Schedule Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      activePage="live-classes"
      onNavigate={onNavigate}
      title="Schedule Live Class"
      subtitle="Set up an upcoming live session for your students"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[680px] flex flex-col gap-6">

        {/* Basic info */}
        <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Video size={15} className="text-primary" /> Class Details
          </h2>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">Session Title</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Newton's Laws — Live Revision"
              className="w-full h-11 px-4 border border-black/20 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Subject</label>
              <select
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
                className="w-full h-11 px-3 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary bg-white appearance-none"
              >
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Class</label>
              <select
                value={form.cls}
                onChange={e => set('cls', e.target.value)}
                className="w-full h-11 px-3 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary bg-white appearance-none"
              >
                {classes.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full h-11 px-3 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => set('time', e.target.value)}
                className="w-full h-11 px-3 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Duration</label>
              <select
                value={form.duration}
                onChange={e => set('duration', e.target.value)}
                className="w-full h-11 px-3 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary bg-white appearance-none"
              >
                {durations.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1.5">Platform</label>
              <select
                value={form.platform}
                onChange={e => set('platform', e.target.value)}
                className="w-full h-11 px-3 border border-black/20 rounded-card text-sm text-foreground outline-none focus:border-primary bg-white appearance-none"
              >
                {platforms.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="What will you cover in this session?"
              className="w-full border border-black/20 rounded-card px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <button
              onClick={() => set('sendNotif', !form.sendNotif)}
              className={`w-10 h-5.5 rounded-full relative transition-colors ${form.sendNotif ? 'bg-primary' : 'bg-black/15'}`}
            >
              <span className={`absolute inset-y-[2px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${form.sendNotif ? 'left-[20px]' : 'left-[2px]'}`} />
            </button>
            <div>
              <p className="text-sm font-semibold text-foreground">Notify students</p>
              <p className="text-xs text-muted">Students will receive a notification when the class is scheduled</p>
            </div>
          </label>
        </div>

        <button
          onClick={() => form.title && form.date && form.time ? setDone(true) : undefined}
          className="h-12 bg-primary text-white text-sm font-bold rounded-pill shadow-primary hover:bg-primary-deep transition-colors disabled:opacity-40"
        >
          Schedule Class
        </button>
      </div>
    </DashboardLayout>
  )
}
