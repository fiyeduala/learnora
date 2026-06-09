import { useState } from 'react'
import { Megaphone, Send, Users, Building2, CheckCircle2, Clock, Filter } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type Audience = 'all' | 'starter' | 'growth' | 'enterprise' | 'trial' | 'suspended'
type Channel  = 'in_app' | 'email'

type SentMsg = {
  id:       number
  title:    string
  body:     string
  audience: string
  channels: string[]
  sentAt:   string
  reached:  number
}

const initialSentMessages: SentMsg[] = [
  { id: 1, title: 'New Term: Billing Update',          body: 'Term 2 2026 invoices have been generated and are due within 7 days.',          audience: 'All schools',   channels: ['In-App', 'Email'], sentAt: 'Apr 1, 2026',  reached: 142 },
  { id: 2, title: 'Platform Maintenance – Jun 14',     body: 'Scheduled maintenance window: Jun 14 02:00–04:00 WAT. Expect brief downtime.', audience: 'All schools',   channels: ['In-App', 'Email'], sentAt: 'Jun 8, 2026',  reached: 142 },
  { id: 3, title: 'New Feature: AI Tutor Live',        body: 'The AI Tutor module is now available to all Growth and Enterprise schools.',    audience: 'Growth+',       channels: ['In-App'],         sentAt: 'May 20, 2026', reached: 114 },
  { id: 4, title: 'Trial Expiry Reminder',             body: 'Your free trial ends in 7 days. Upgrade to keep your school data.',            audience: 'Trial schools', channels: ['In-App', 'Email'], sentAt: 'May 15, 2026', reached: 18  },
]

const AUDIENCE_OPTIONS: { value: Audience; label: string; desc: string }[] = [
  { value: 'all',        label: 'All Schools',        desc: '142 schools' },
  { value: 'starter',   label: 'Starter Plan',        desc: '28 schools'  },
  { value: 'growth',    label: 'Growth Plan',         desc: '89 schools'  },
  { value: 'enterprise',label: 'Enterprise Plan',     desc: '25 schools'  },
  { value: 'trial',     label: 'Trial Schools',       desc: '18 schools'  },
  { value: 'suspended', label: 'Suspended Schools',   desc: '5 schools'   },
]

export default function BroadcastPage({ onNavigate: _onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)
  const [tab, setTab]           = useState<'compose' | 'sent'>('compose')
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [audience, setAud]      = useState<Audience>('all')
  const [channels, setChans]    = useState<Channel[]>(['in_app', 'email'])
  const [sent, setSent]         = useState(false)
  const [sentMessages, setSentMessages] = useState<SentMsg[]>(initialSentMessages)

  function toggleChannel(c: Channel) {
    setChans(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  function handleSend() {
    if (!title.trim() || !body.trim()) return
    setSent(true)
    setTimeout(() => {
      const newMsg: SentMsg = {
        id:       Date.now(),
        title:    title.trim(),
        body:     body.trim(),
        audience: selectedAud.label,
        channels: channels.map(c => c === 'in_app' ? 'In-App' : 'Email'),
        sentAt:   'Just now',
        reached:  Number(selectedAud.desc.replace(/\D/g, '')),
      }
      setSentMessages(prev => [newMsg, ...prev])
      setSent(false)
      setTitle('')
      setBody('')
      setAud('all')
      setChans(['in_app', 'email'])
      setTab('sent')
    }, 1800)
  }

  const selectedAud = AUDIENCE_OPTIONS.find(o => o.value === audience)!

  return (
    <DashboardLayout
      activePage="broadcast"
      onNavigate={_onNavigate}
      title="Broadcast"
      subtitle="Send platform-wide announcements to schools"
      nav={superAdminNav}
      user={sidebarUser}
    >
      <div className="max-w-[900px] flex flex-col gap-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-card p-1 w-fit">
          {(['compose', 'sent'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 h-9 text-sm font-semibold rounded-md transition-colors capitalize ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>
              {t === 'compose' ? 'Compose' : 'Sent Messages'}
            </button>
          ))}
        </div>

        {tab === 'compose' && (
          <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-5">

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted">Announcement Title *</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Platform Maintenance – Jun 14"
                className="h-10 px-3 border border-black/15 rounded-input text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Body */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted">Message *</label>
              <textarea
                value={body} onChange={e => setBody(e.target.value)}
                rows={5} placeholder="Write the announcement content here..."
                className="px-3 py-2.5 border border-black/15 rounded-input text-sm outline-none focus:border-primary resize-none"
              />
              <p className="text-[11px] text-muted text-right">{body.length} characters</p>
            </div>

            {/* Audience */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted flex items-center gap-1"><Filter size={11} /> Audience</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AUDIENCE_OPTIONS.map(o => (
                  <button key={o.value} onClick={() => setAud(o.value)}
                    className={`flex flex-col items-start px-3 py-2.5 rounded-card border text-left transition-colors ${audience === o.value ? 'border-primary bg-primary/4' : 'border-black/12 hover:border-primary/40'}`}>
                    <span className={`text-xs font-semibold ${audience === o.value ? 'text-primary' : 'text-foreground'}`}>{o.label}</span>
                    <span className="text-[10px] text-muted">{o.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted">Delivery Channels</label>
              <div className="flex gap-3">
                {([
                  { id: 'in_app' as Channel, label: 'In-App Notification' },
                  { id: 'email'  as Channel, label: 'Email' },
                ]).map(ch => (
                  <button key={ch.id} onClick={() => toggleChannel(ch.id)}
                    className={`flex items-center gap-2 px-4 h-9 text-xs font-semibold rounded-pill border transition-colors ${channels.includes(ch.id) ? 'bg-primary text-white border-primary' : 'border-black/15 text-muted hover:border-primary hover:text-primary'}`}>
                    {channels.includes(ch.id) && <CheckCircle2 size={12} />}
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {(title || body) && (
              <div className="bg-canvas rounded-card p-4 border border-black/8">
                <p className="text-xs font-semibold text-muted mb-2">Preview</p>
                <div className="flex items-start gap-3">
                  <div className="size-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Megaphone size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{title || 'Announcement Title'}</p>
                    <p className="text-xs text-muted mt-0.5">To {selectedAud.label} · {channels.map(c => c === 'in_app' ? 'In-App' : 'Email').join(' + ')}</p>
                    <p className="text-sm text-foreground mt-2 leading-relaxed">{body || 'Message body will appear here.'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Send button */}
            <div className="flex justify-end gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Users size={12} />
                Reaches {selectedAud.desc}
              </div>
              <button
                onClick={handleSend}
                disabled={!title.trim() || !body.trim() || channels.length === 0 || sent}
                className="flex items-center gap-2 h-10 px-6 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-primary"
              >
                {sent ? <><CheckCircle2 size={14} /> Sent!</> : <><Send size={14} /> Send Broadcast</>}
              </button>
            </div>
          </div>
        )}

        {tab === 'sent' && (
          <div className="flex flex-col gap-3">
            {sentMessages.map(m => (
              <div key={m.id} className="bg-surface rounded-card shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Megaphone size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.title}</p>
                      <p className="text-xs text-muted mt-0.5">{m.audience} · {m.channels.join(' + ')}</p>
                      <p className="text-sm text-foreground mt-1.5 leading-relaxed">{m.body}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted justify-end">
                      <Clock size={11} /> {m.sentAt}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-green-700 justify-end">
                      <Building2 size={11} /> {m.reached} schools
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
