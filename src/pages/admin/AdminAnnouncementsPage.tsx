import { useState } from 'react'
import { Megaphone, Plus, Search, ChevronRight, Pin, Send, X, CheckCircle2, Users, BookOpen, User } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }
type Audience = 'school-wide' | 'students' | 'teachers' | 'parents' | 'class'

const announcements = [
  { id: 1, pinned: true,  title: 'Second Term Examination Timetable',      body: 'The examination timetable for the second term has been published. Students should collect timetables from the office or download from the portal.', audience: 'school-wide', date: 'Jun 6, 2026',  category: 'Academic', sentTo: 1282 },
  { id: 2, pinned: false, title: 'School Fees Payment Deadline',            body: 'This is a reminder that second-term school fees are due by June 20, 2026. Late payments attract a 5% surcharge.',                               audience: 'parents',     date: 'Jun 4, 2026',  category: 'Finance',  sentTo: 934  },
  { id: 3, pinned: false, title: 'Staff Meeting — Thursday 3 PM',           body: 'All teaching and non-teaching staff are required to attend the monthly staff meeting on Thursday June 12 at 3 PM in the main hall.',              audience: 'teachers',    date: 'Jun 2, 2026',  category: 'General',  sentTo: 86   },
  { id: 4, pinned: false, title: 'Inter-House Sports Day — June 28',        body: 'The annual Inter-House Sports Day will hold on Saturday June 28. All students must participate in at least one event.',                            audience: 'school-wide', date: 'May 28, 2026', category: 'Event',    sentTo: 1282 },
]

const categoryColor: Record<string, string> = {
  Academic: 'bg-primary/10 text-primary',
  Finance:  'bg-amber-50 text-amber-700',
  General:  'bg-canvas text-muted border border-black/10',
  Event:    'bg-green-50 text-green-700',
}

const audienceLabel: Record<string, string> = {
  'school-wide': 'Whole School',
  'students':    'Students',
  'teachers':    'Teachers',
  'parents':     'Parents',
  'class':       'Specific Class',
}

const classes = ['SS1A','SS1B','SS2A','SS2B','SS3A','SS3B','JSS1','JSS2','JSS3']

export default function AdminAnnouncementsPage({ onNavigate }: Props) {
  const [search,    setSearch]    = useState('')
  const [showCompose, setShowCompose] = useState(false)
  const [sent,      setSent]      = useState(false)

  const [title,     setTitle]     = useState('')
  const [body,      setBody]      = useState('')
  const [audience,  setAudience]  = useState<Audience>('school-wide')
  const [targetClass, setTargetClass] = useState('SS1A')
  const [category,  setCategory]  = useState('General')
  const [pin,       setPin]       = useState(false)

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.body.toLowerCase().includes(search.toLowerCase())
  )

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  function closeCompose() {
    setShowCompose(false)
    setSent(false)
    setTitle('')
    setBody('')
    setAudience('school-wide')
    setCategory('General')
    setPin(false)
  }

  const audienceOptions: { id: Audience; label: string; icon: typeof Users; desc: string }[] = [
    { id: 'school-wide', label: 'Whole School',    icon: Megaphone, desc: 'All students, teachers & parents'  },
    { id: 'students',    label: 'Students Only',   icon: BookOpen,  desc: '1,248 students'                    },
    { id: 'teachers',    label: 'Teachers Only',   icon: User,      desc: '86 teachers'                       },
    { id: 'parents',     label: 'Parents Only',    icon: Users,     desc: '934 parents'                       },
    { id: 'class',       label: 'Specific Class',  icon: BookOpen,  desc: 'Target one class'                  },
  ]

  return (
    <DashboardLayout
      activePage="announcements"
      onNavigate={onNavigate}
      title="Announcements"
      subtitle="Send school-wide notices to students, teachers, and parents"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[900px] flex flex-col gap-6">

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full h-11 pl-9 pr-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary" />
          </div>
          <button
            onClick={() => { setShowCompose(true); setSent(false) }}
            className="flex items-center gap-2 h-11 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            <Plus size={14} /> New Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Sent',     value: announcements.length },
            { label: 'School-Wide',    value: announcements.filter(a => a.audience === 'school-wide').length },
            { label: 'To Parents',     value: announcements.filter(a => a.audience === 'parents').length },
            { label: 'To Teachers',    value: announcements.filter(a => a.audience === 'teachers').length },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-4">
              <p className="text-2xl font-bold text-primary">{s.value}</p>
              <p className="text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {filtered.map(a => (
            <div key={a.id} className="bg-surface rounded-card shadow-sm p-6">
              <div className="flex items-start gap-3 mb-3">
                {a.pinned && <Pin size={14} className="text-primary mt-1 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-foreground">{a.title}</h3>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor[a.category]}`}>{a.category}</span>
                    {a.pinned && <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Pinned</span>}
                  </div>
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">{a.body}</p>
                </div>
                <ChevronRight size={16} className="text-muted shrink-0 mt-1" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Users size={11} /> {audienceLabel[a.audience]}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Send size={11} /> {a.sentTo} recipients
                </span>
                <span>·</span>
                <span>{a.date}</span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted">
              <Megaphone size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No announcements found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeCompose} />
          <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8 sticky top-0 bg-white z-10">
              <h2 className="text-base font-bold text-foreground">{sent ? 'Announcement Sent' : 'New Announcement'}</h2>
              <button onClick={closeCompose} className="text-muted hover:text-foreground"><X size={18} /></button>
            </div>

            {sent ? (
              <div className="p-8 text-center">
                <div className="size-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 size={28} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Sent Successfully!</h3>
                <p className="text-sm text-muted mb-2">
                  <strong>"{title}"</strong> has been sent to{' '}
                  <strong>{audienceLabel[audience]}{audience === 'class' ? ` (${targetClass})` : ''}</strong>.
                </p>
                <p className="text-xs text-muted mb-6">Students, teachers, and parents will see it in their Announcements feed immediately.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => { setSent(false); setTitle(''); setBody('') }}
                    className="h-10 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors"
                  >
                    Write Another
                  </button>
                  <button onClick={closeCompose} className="h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSend} className="p-6 flex flex-col gap-5">

                {/* Audience */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Send To <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {audienceOptions.map(opt => {
                      const Icon = opt.icon
                      const active = audience === opt.id
                      return (
                        <button key={opt.id} type="button" onClick={() => setAudience(opt.id)}
                          className={`flex items-center gap-3 p-3 rounded-card border-2 text-left transition-colors ${active ? 'border-primary bg-primary/5' : 'border-black/10 hover:border-primary/30'}`}>
                          <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-primary text-white' : 'bg-canvas text-muted'}`}>
                            <Icon size={13} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground">{opt.label}</p>
                            <p className="text-[10px] text-muted">{opt.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {audience === 'class' && (
                    <select value={targetClass} onChange={e => setTargetClass(e.target.value)}
                      className="h-10 px-3 border border-black/20 rounded-input text-sm bg-white outline-none focus:border-primary mt-1">
                      {classes.map(c => <option key={c}>{c}</option>)}
                    </select>
                  )}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {['General','Academic','Finance','Event'].map(cat => (
                      <button key={cat} type="button" onClick={() => setCategory(cat)}
                        className={`h-8 px-3 rounded-full text-xs font-semibold border transition-colors ${category === cat ? 'border-primary bg-primary/8 text-primary' : 'border-black/15 text-muted hover:border-primary/40'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Announcement Title <span className="text-red-500">*</span></label>
                  <input required value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. End-of-Term Examination Schedule"
                    className="h-11 px-4 border border-black/20 rounded-input text-sm outline-none focus:border-primary" />
                </div>

                {/* Body */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Message <span className="text-red-500">*</span></label>
                  <textarea required rows={5} value={body} onChange={e => setBody(e.target.value)}
                    placeholder="Write the full announcement content here…"
                    className="px-4 py-3 border border-black/20 rounded-input text-sm outline-none focus:border-primary resize-none leading-relaxed" />
                </div>

                {/* Pin toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <button type="button" role="switch" aria-checked={pin} onClick={() => setPin(!pin)}
                    className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${pin ? 'bg-primary' : 'bg-black/15'}`}>
                    <span className={`absolute inset-y-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${pin ? 'left-[22px]' : 'left-[2px]'}`} />
                  </button>
                  <span className="text-sm text-foreground">Pin this announcement</span>
                </label>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={closeCompose}
                    className="h-11 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 h-11 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary flex items-center justify-center gap-2">
                    <Send size={14} /> Send Announcement
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
