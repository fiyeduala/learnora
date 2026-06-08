import { useState } from 'react'
import { Flag, Search, Save, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

interface FeatureFlag {
  key:         string
  label:       string
  description: string
  category:    string
  global:      boolean
  schools:     string[]
  enabled:     boolean
}

const initialFlags: FeatureFlag[] = [
  { key: 'ai_tutor',        label: 'AI Tutor',          description: 'Enable the AI-powered tutoring chatbot for students',     category: 'AI',       global: false, schools: ['greenfield', 'unity-high'], enabled: true  },
  { key: 'live_classes',    label: 'Live Classes',       description: 'Video conferencing and live classroom feature',           category: 'LMS',      global: true,  schools: [],                           enabled: true  },
  { key: 'offline_mode',    label: 'Offline Mode',       description: 'Allow content to be downloaded for offline access',      category: 'LMS',      global: true,  schools: [],                           enabled: true  },
  { key: 'waec_prep',       label: 'WAEC/NECO Prep',     description: 'Access to past exam question banks',                     category: 'AI',       global: false, schools: ['greenfield'],               enabled: true  },
  { key: 'leaderboard',     label: 'Leaderboard',        description: 'Student ranking and gamification features',              category: 'Engagement', global: true, schools: [],                          enabled: true  },
  { key: 'behavior_flags',  label: 'Behavior Analytics', description: 'At-risk student detection and alerts for teachers',      category: 'Analytics', global: false, schools: ['unity-high'],              enabled: false },
  { key: 'parent_payments', label: 'Parent Payments',    description: 'Allow parents to pay school fees through the app',       category: 'Finance',  global: false, schools: ['greenfield', 'bright-minds'], enabled: true },
  { key: 'sso_google',      label: 'Google SSO',         description: 'Allow login via Google account',                        category: 'Auth',     global: false, schools: [],                           enabled: false },
  { key: 'custom_branding', label: 'Custom Branding',    description: 'School-specific logo, colors, and domain',              category: 'Settings', global: false, schools: ['greenfield', 'royal-crown'], enabled: true  },
]

const categories = ['All', 'AI', 'LMS', 'Analytics', 'Engagement', 'Finance', 'Auth', 'Settings']

export default function FeatureFlagsPage({ onNavigate }: Props) {
  const [flags,    setFlags]    = useState<FeatureFlag[]>(initialFlags)
  const [query,    setQuery]    = useState('')
  const [category, setCategory] = useState('All')
  const [saved,    setSaved]    = useState(false)

  const filtered = flags.filter(f => {
    const matchCat   = category === 'All' || f.category === category
    const matchQuery = !query || f.label.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQuery
  })

  function toggle(key: string) {
    setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f))
  }

  return (
    <DashboardLayout
      activePage="platform-settings"
      onNavigate={onNavigate}
      title="Feature Flags"
      subtitle="Toggle platform features globally or per school"
      nav={superAdminNav}
      user={{ name: 'Learnora Admin', role: 'Super Admin', initials: 'LA' }}
    >
      <div className="flex flex-col gap-5">

        {/* Controls */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search flags..."
              className="h-10 pl-9 pr-4 border border-black/20 rounded-pill text-sm outline-none focus:border-primary w-52"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${category === c ? 'bg-primary text-white' : 'bg-canvas text-muted hover:text-foreground'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
            className="ml-auto flex items-center gap-2 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            <Save size={14} /> Save Changes
          </button>
          {saved && <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium"><CheckCircle2 size={14} /> Saved!</span>}
        </div>

        {/* Flags list */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="divide-y divide-black/4">
            {filtered.map(f => (
              <div key={f.key} className="flex items-start gap-4 px-6 py-4">
                <div className={`size-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${f.enabled ? 'bg-green-50 text-green-600' : 'bg-canvas text-muted'}`}>
                  <Flag size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{f.label}</p>
                    <span className="text-[10px] font-semibold bg-canvas text-muted px-2 py-0.5 rounded-full">{f.category}</span>
                    {f.global && <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Global</span>}
                  </div>
                  <p className="text-xs text-muted">{f.description}</p>
                  {!f.global && f.schools.length > 0 && (
                    <p className="text-[10px] text-muted mt-1">Enabled for: {f.schools.join(', ')}</p>
                  )}
                  <p className="text-[10px] font-mono text-muted/50 mt-1">{f.key}</p>
                </div>
                <button
                  onClick={() => toggle(f.key)}
                  className={`w-11 h-6 rounded-full relative shrink-0 transition-colors mt-0.5 ${f.enabled ? 'bg-primary' : 'bg-black/15'}`}
                >
                  <span className={`absolute inset-y-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${f.enabled ? 'left-[22px]' : 'left-[2px]'}`} />
                </button>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted">
              <Flag size={24} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No flags found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
