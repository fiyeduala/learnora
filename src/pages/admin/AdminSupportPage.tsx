import { useState } from 'react'
import { HelpCircle, MessageSquare, FileText, ChevronRight, Send, CheckCircle2, Search } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }
type Tab = 'faq' | 'messages' | 'contact'
type Thread = 'superadmin' | 'teachers' | null

const faqs = [
  { q: 'How do I add a new student or teacher?',              a: 'Go to Users in the sidebar. Click "Add User", fill in the details and choose the credential delivery method. The user will receive their login info by email or SMS.' },
  { q: 'How do I create a new class?',                        a: 'Go to Classes in the sidebar, then click "New Class". Select the level, arm, form teacher, and subjects, then submit.' },
  { q: 'How do I send an announcement to the whole school?',  a: 'Open Announcements in the sidebar. Click "New Announcement", set the audience to "Whole School", compose your message, and post.' },
  { q: 'How do I view attendance across classes?',            a: 'Open Attendance in the sidebar. The By Class tab shows all classes with present/absent/late counts and attendance rates.' },
  { q: 'How do I manage the school subscription?',            a: 'Go to Subscription in the sidebar to view your current plan, billing history, and upgrade options.' },
  { q: 'How do I approve teacher-uploaded resources?',        a: 'When a teacher submits a resource, it appears in a pending state. Go to Resources or check the notification — you can approve or reject from there.' },
]

type Message = { from: 'me' | 'them'; text: string; time: string }

const superAdminThread: Message[] = [
  { from: 'them', text: 'Your school trial period ends in 14 days. Please review your subscription options.', time: '2d ago' },
  { from: 'me',   text: "Thanks, I'll check the subscription page and get back to you.",                      time: '2d ago' },
  { from: 'them', text: 'Sure. Let me know if you have any questions about the Pro plan.',                    time: '1d ago' },
]

const teacherThreads = [
  { id: 't1', name: 'Mrs Nnduka Kisha',  initials: 'NK', subject: 'Mathematics', preview: 'Can we adjust the exam schedule for SS2A?', time: '1h ago',  unread: true  },
  { id: 't2', name: 'Mr Daniel Johnson', initials: 'DJ', subject: 'Physics',     preview: 'Submitted two resources for approval.',     time: '3h ago',  unread: true  },
  { id: 't3', name: 'Mrs Gloria Ewa',    initials: 'GE', subject: 'English',     preview: 'Attendance report for last week is ready.',  time: 'Yesterday', unread: false },
]

const teacherMessages: Record<string, Message[]> = {
  t1: [
    { from: 'them', text: 'Good morning Admin. Can we adjust the exam schedule for SS2A? Two students have a clash.', time: '1h ago' },
  ],
  t2: [
    { from: 'them', text: 'I just submitted two resources for library approval — Introduction to Calculus and Physics Lab Guide.', time: '3h ago' },
    { from: 'me',   text: "Got them. I'll review by end of day.",                                                                  time: '3h ago' },
  ],
  t3: [
    { from: 'them', text: "The weekly attendance report for SS1B is ready. Average attendance was 91%.",    time: 'Yesterday' },
    { from: 'me',   text: 'Great, thanks for the update.',                                                  time: 'Yesterday' },
  ],
}

export default function AdminSupportPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [tab,      setTab]      = useState<Tab>('faq')
  const [openFaq,  setOpenFaq]  = useState<number | null>(null)
  const [thread,   setThread]   = useState<Thread>(null)
  const [activeT,  setActiveT]  = useState<string | null>(null)
  const [msgText,  setMsgText]  = useState('')
  const [subject,  setSubject]  = useState('')
  const [body,     setBody]     = useState('')
  const [sent,     setSent]     = useState(false)
  const [search,   setSearch]   = useState('')

  function sendSuperAdmin() {
    if (!msgText.trim()) return
    setMsgText('')
  }

  function sendTeacher() {
    if (!msgText.trim()) return
    setMsgText('')
  }

  const tabs: { id: Tab; label: string; icon: typeof MessageSquare; badge?: boolean }[] = [
    { id: 'faq',      label: 'FAQs',            icon: HelpCircle   },
    { id: 'messages', label: 'Messages',         icon: MessageSquare, badge: true },
    { id: 'contact',  label: 'Contact Support',  icon: FileText     },
  ]

  return (
    <DashboardLayout
      activePage="admin-support"
      onNavigate={onNavigate}
      title="Support Centre"
      subtitle="Help, FAQs, and messaging with Learnora and your teachers"
      nav={adminNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[860px] flex flex-col gap-6">

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-input p-1 w-fit">
          {tabs.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setThread(null); setActiveT(null) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-[6px] text-sm font-semibold transition-colors ${tab === t.id ? 'bg-surface shadow text-foreground' : 'text-muted hover:text-foreground'}`}
              >
                <Icon size={14} />
                {t.label}
                {t.id === 'messages' && t.badge && (
                  <span className="size-2 rounded-full bg-red-500" />
                )}
              </button>
            )
          })}
        </div>

        {/* ── FAQ ── */}
        {tab === 'faq' && (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary"
              />
            </div>
            {faqs.filter(f => !search || f.q.toLowerCase().includes(search.toLowerCase())).map((faq, i) => (
              <div key={i} className="bg-surface rounded-card shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-canvas/50 transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                  <ChevronRight size={15} className={`text-muted shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Messages ── */}
        {tab === 'messages' && (
          <div className="flex flex-col gap-4">
            {/* Thread selector if none chosen */}
            {!thread && (
              <>
                <p className="text-sm text-muted">Choose a conversation to open.</p>

                {/* Super Admin card */}
                <button
                  onClick={() => setThread('superadmin')}
                  className="bg-surface rounded-card shadow-sm p-5 text-left flex items-center gap-4 hover:shadow-md transition-all"
                >
                  <div className="size-11 rounded-full bg-primary flex items-center justify-center text-white font-bold text-base shrink-0">L</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Learnora Support</p>
                    <p className="text-xs text-muted mt-0.5 truncate">Platform admin · Billing, subscriptions, account</p>
                    <p className="text-xs text-muted mt-1 truncate italic">"{superAdminThread[superAdminThread.length - 1].text}"</p>
                  </div>
                  <ChevronRight size={16} className="text-muted shrink-0" />
                </button>

                {/* Teacher threads */}
                <div className="bg-surface rounded-card shadow-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-black/6">
                    <p className="text-sm font-bold text-foreground">Teachers</p>
                    <p className="text-xs text-muted">Direct messages with your school's teachers</p>
                  </div>
                  <div className="divide-y divide-black/4">
                    {teacherThreads.map(t => (
                      <button
                        key={t.id}
                        onClick={() => { setThread('teachers'); setActiveT(t.id) }}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-canvas/40 transition-colors"
                      >
                        <div className="size-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">{t.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-foreground">{t.name}</p>
                            {t.unread && <span className="size-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted truncate">{t.subject} · {t.preview}</p>
                        </div>
                        <span className="text-xs text-muted shrink-0">{t.time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Super Admin thread */}
            {thread === 'superadmin' && (
              <div className="bg-surface rounded-card shadow-sm flex flex-col" style={{ minHeight: '420px' }}>
                <div className="flex items-center gap-3 px-5 py-4 border-b border-black/6">
                  <button onClick={() => setThread(null)} className="text-muted hover:text-foreground text-xs font-semibold mr-1">← Back</button>
                  <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">L</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Learnora Support</p>
                    <p className="text-xs text-muted">Super Admin · Platform support</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-3 p-5 overflow-y-auto">
                  {superAdminThread.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'me' ? 'bg-primary text-white rounded-br-sm' : 'bg-canvas text-foreground rounded-bl-sm'}`}>
                        {m.text}
                        <div className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-white/60' : 'text-muted'}`}>{m.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 border-t border-black/6 flex gap-2">
                  <input
                    value={msgText} onChange={e => setMsgText(e.target.value)}
                    placeholder="Message Learnora Support..."
                    className="flex-1 h-10 px-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary"
                    onKeyDown={e => { if (e.key === 'Enter') sendSuperAdmin() }}
                  />
                  <button onClick={sendSuperAdmin} disabled={!msgText.trim()}
                    className="size-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-deep transition-colors disabled:opacity-40">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Teacher thread */}
            {thread === 'teachers' && activeT && (() => {
              const teacher = teacherThreads.find(t => t.id === activeT)!
              const msgs = teacherMessages[activeT] ?? []
              return (
                <div className="bg-surface rounded-card shadow-sm flex flex-col" style={{ minHeight: '420px' }}>
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-black/6">
                    <button onClick={() => setThread(null)} className="text-muted hover:text-foreground text-xs font-semibold mr-1">← Back</button>
                    <div className="size-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{teacher.initials}</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{teacher.name}</p>
                      <p className="text-xs text-muted">{teacher.subject} teacher</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-3 p-5 overflow-y-auto">
                    {msgs.map((m, i) => (
                      <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'me' ? 'bg-primary text-white rounded-br-sm' : 'bg-canvas text-foreground rounded-bl-sm'}`}>
                          {m.text}
                          <div className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-white/60' : 'text-muted'}`}>{m.time}</div>
                        </div>
                      </div>
                    ))}
                    {msgs.length === 0 && (
                      <p className="text-center text-sm text-muted py-8">No messages yet. Start a conversation below.</p>
                    )}
                  </div>
                  <div className="px-5 py-4 border-t border-black/6 flex gap-2">
                    <input
                      value={msgText} onChange={e => setMsgText(e.target.value)}
                      placeholder={`Message ${teacher.name}...`}
                      className="flex-1 h-10 px-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary"
                      onKeyDown={e => { if (e.key === 'Enter') sendTeacher() }}
                    />
                    <button onClick={sendTeacher} disabled={!msgText.trim()}
                      className="size-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-deep transition-colors disabled:opacity-40">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── Contact Support ── */}
        {tab === 'contact' && (
          <div className="bg-surface rounded-card shadow-sm p-6">
            {sent ? (
              <div className="text-center py-8">
                <div className="size-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">Request Submitted</h3>
                <p className="text-sm text-muted mb-6">Our support team will respond within 1 business day.</p>
                <button onClick={() => setSent(false)}
                  className="h-10 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-5">
                <div>
                  <h3 className="text-base font-bold text-foreground">Contact Learnora Support</h3>
                  <p className="text-sm text-muted mt-1">For technical issues, billing, or platform-level questions.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Subject <span className="text-red-500">*</span></label>
                  <input required value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder="Briefly describe your issue"
                    className="h-11 px-4 border border-black/20 rounded-input text-sm outline-none focus:border-primary" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Message <span className="text-red-500">*</span></label>
                  <textarea required rows={5} value={body} onChange={e => setBody(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="px-4 py-3 border border-black/20 rounded-input text-sm outline-none focus:border-primary resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setSubject(''); setBody('') }}
                    className="h-11 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Clear
                  </button>
                  <button type="submit"
                    className="flex-1 h-11 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary flex items-center justify-center gap-2">
                    <Send size={14} /> Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
