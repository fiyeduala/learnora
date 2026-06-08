import { useState } from 'react'
import { Mail, Edit2, Save, CheckCircle2, ChevronRight, Eye } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

interface Template {
  id:       string
  name:     string
  subject:  string
  category: string
  lastEdited: string
  body:     string
}

const templates: Template[] = [
  {
    id: 'welcome_student',
    name: 'Welcome — Student',
    subject: 'Welcome to Learnora, {{first_name}}!',
    category: 'Onboarding',
    lastEdited: 'Jun 6, 2026',
    body: `Hi {{first_name}},\n\nWelcome to Learnora! Your account has been set up at {{school_name}}.\n\nYou can log in at: {{login_url}}\n\nYour temporary password is: {{temp_password}}\n\nWe're excited to have you on board.\n\nThe Learnora Team`,
  },
  {
    id: 'welcome_teacher',
    name: 'Welcome — Teacher',
    subject: 'Your Learnora teacher account is ready',
    category: 'Onboarding',
    lastEdited: 'Jun 6, 2026',
    body: `Dear {{first_name}},\n\nYour Learnora teacher account at {{school_name}} has been created.\n\nLogin: {{login_url}}\nPassword: {{temp_password}}\n\nYou can begin creating courses and managing classes immediately.\n\nKind regards,\nThe Learnora Team`,
  },
  {
    id: 'password_reset',
    name: 'Password Reset',
    subject: 'Reset your Learnora password',
    category: 'Auth',
    lastEdited: 'May 18, 2026',
    body: `Hi {{first_name}},\n\nWe received a request to reset your Learnora password.\n\nClick the link below (expires in 1 hour):\n{{reset_url}}\n\nIf you did not request this, please ignore this email.\n\nLearnora Security Team`,
  },
  {
    id: 'invoice_issued',
    name: 'Invoice Issued',
    subject: 'Your invoice #{{invoice_number}} from {{school_name}}',
    category: 'Finance',
    lastEdited: 'Apr 30, 2026',
    body: `Dear {{parent_name}},\n\nA new invoice of {{amount}} has been issued for {{student_name}}.\n\nDue date: {{due_date}}\nPay now: {{payment_url}}\n\nFor any queries, contact your school admin.\n\nLearnora`,
  },
  {
    id: 'assignment_reminder',
    name: 'Assignment Due Reminder',
    subject: '{{assignment_name}} is due in 24 hours',
    category: 'Notifications',
    lastEdited: 'May 2, 2026',
    body: `Hi {{first_name}},\n\nThis is a reminder that your assignment "{{assignment_name}}" for {{subject}} is due on {{due_date}}.\n\nSubmit here: {{submission_url}}\n\nGood luck!\nLearnora`,
  },
  {
    id: 'subscription_renewal',
    name: 'Subscription Renewal',
    subject: 'Your Learnora subscription renews in 7 days',
    category: 'Finance',
    lastEdited: 'Mar 10, 2026',
    body: `Hi {{admin_name}},\n\nYour {{plan_name}} subscription for {{school_name}} renews on {{renewal_date}}.\n\nAmount: {{amount}}\n\nUpdate payment details: {{billing_url}}\n\nThank you,\nLearnora Billing`,
  },
]

const categoryColors: Record<string, string> = {
  Onboarding:    'bg-primary/10 text-primary',
  Auth:          'bg-amber-50 text-amber-600',
  Finance:       'bg-green-50 text-green-700',
  Notifications: 'bg-accent-mint/10 text-accent-mint',
}

export default function EmailTemplatesPage({ onNavigate }: Props) {
  const [selected, setSelected] = useState<Template>(templates[0])
  const [editing,  setEditing]  = useState(false)
  const [body,     setBody]     = useState(selected.body)
  const [subject,  setSubject]  = useState(selected.subject)
  const [saved,    setSaved]    = useState(false)
  const [preview,  setPreview]  = useState(false)

  function select(t: Template) {
    setSelected(t)
    setBody(t.body)
    setSubject(t.subject)
    setEditing(false)
    setPreview(false)
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const categories = [...new Set(templates.map(t => t.category))]

  return (
    <DashboardLayout
      activePage="platform-settings"
      onNavigate={onNavigate}
      title="Email Templates"
      subtitle="Manage transactional and notification emails"
      nav={superAdminNav}
      user={{ name: 'Learnora Admin', role: 'Super Admin', initials: 'LA' }}
    >
      <div className="flex gap-5 h-[calc(100vh-160px)] min-h-0">

        {/* Left: template list */}
        <div className="w-72 shrink-0 bg-surface rounded-card shadow-sm overflow-y-auto">
          <div className="p-4 border-b border-black/6">
            <p className="text-xs font-bold text-muted uppercase tracking-wider">Templates</p>
          </div>
          {categories.map(cat => (
            <div key={cat}>
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider px-4 pt-4 pb-1.5">{cat}</p>
              {templates.filter(t => t.category === cat).map(t => (
                <button
                  key={t.id}
                  onClick={() => select(t)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selected.id === t.id ? 'bg-primary/6' : 'hover:bg-canvas'}`}
                >
                  <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${selected.id === t.id ? 'bg-primary text-white' : 'bg-canvas text-muted'}`}>
                    <Mail size={13} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${selected.id === t.id ? 'text-primary' : 'text-foreground'}`}>{t.name}</p>
                    <p className="text-[10px] text-muted mt-0.5">{t.lastEdited}</p>
                  </div>
                  <ChevronRight size={12} className={`shrink-0 ${selected.id === t.id ? 'text-primary' : 'text-muted'}`} />
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Right: editor */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Header */}
          <div className="bg-surface rounded-card shadow-sm p-5 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-bold text-foreground">{selected.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoryColors[selected.category]}`}>{selected.category}</span>
              </div>
              <p className="text-xs text-muted">Last edited: {selected.lastEdited}</p>
            </div>
            <div className="flex items-center gap-2">
              {saved && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                  <CheckCircle2 size={13} /> Saved
                </span>
              )}
              <button
                onClick={() => setPreview(!preview)}
                className={`flex items-center gap-1.5 h-9 px-3 border rounded-pill text-xs font-semibold transition-colors ${preview ? 'border-primary text-primary bg-primary/6' : 'border-black/20 text-muted hover:text-foreground'}`}
              >
                <Eye size={12} /> Preview
              </button>
              {editing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-xs font-semibold rounded-pill hover:bg-primary-deep transition-colors"
                >
                  <Save size={12} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 h-9 px-4 border border-black/20 rounded-pill text-xs font-semibold text-foreground hover:bg-canvas transition-colors"
                >
                  <Edit2 size={12} /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="bg-surface rounded-card shadow-sm p-5">
            <label className="block text-xs font-semibold text-muted mb-2">Subject Line</label>
            {editing ? (
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full h-10 px-3 border border-black/20 rounded-card text-sm outline-none focus:border-primary"
              />
            ) : (
              <p className="text-sm text-foreground font-medium bg-canvas rounded-card px-3 py-2.5">{subject}</p>
            )}
          </div>

          {/* Body */}
          <div className="bg-surface rounded-card shadow-sm p-5 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted">Email Body</label>
              <p className="text-[10px] text-muted">Use {'{{'}<span>variable</span>{'}}'}  for dynamic values</p>
            </div>
            {preview ? (
              <div className="flex-1 overflow-y-auto bg-canvas rounded-card p-5 text-sm text-foreground whitespace-pre-wrap leading-relaxed border border-black/8">
                {body}
              </div>
            ) : editing ? (
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                className="flex-1 resize-none border border-black/20 rounded-card p-4 text-sm font-mono leading-relaxed outline-none focus:border-primary"
              />
            ) : (
              <div className="flex-1 overflow-y-auto bg-canvas rounded-card p-5 text-sm text-foreground whitespace-pre-wrap leading-relaxed font-mono border border-black/8">
                {body}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
