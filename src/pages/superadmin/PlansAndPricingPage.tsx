import { useState } from 'react'
import { Check, Pencil, Save, Info, Users, Building2, X } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

/* ── Pricing model ──────────────────────────────────────────────────────────
   Billing is PER STUDENT PER TERM.
   Tiers give volume discounts as student counts grow.
   Each school's invoice = enrolled students × applicable rate.
─────────────────────────────────────────────────────────────────────────── */

type Tier = {
  id:        string
  name:      string
  tagline:   string
  color:     string
  badge:     string
  schools:   number
  volumeTiers: { label: string; max: number | null; rate: number }[]
  features:    string[]
  unavailable: string[]
}

const defaultTiers: Tier[] = [
  {
    id:      'starter',
    name:    'Starter',
    tagline: 'For small schools just getting started',
    color:   'border-black/12',
    badge:   '',
    schools: 28,
    volumeTiers: [
      { label: '1 – 100 students',   max: 100,  rate: 950 },
      { label: '101 – 200 students', max: 200,  rate: 900 },
      { label: '201 – 300 students', max: 300,  rate: 850 },
    ],
    features:    ['Core LMS (courses & assignments)', 'Attendance management', 'Parent portal', 'Email support', 'Gradebook', 'Basic reports'],
    unavailable: ['Live classes', 'Advanced analytics', 'AI Tutor', 'Custom branding', 'Finance module', 'API access'],
  },
  {
    id:      'growth',
    name:    'Growth',
    tagline: 'For growing schools with more complex needs',
    color:   'border-primary',
    badge:   'Most Popular',
    schools: 89,
    volumeTiers: [
      { label: '1 – 300 students',    max: 300,  rate: 800 },
      { label: '301 – 600 students',  max: 600,  rate: 750 },
      { label: '601 – 1,000 students',max: 1000, rate: 700 },
    ],
    features:    ['Everything in Starter', 'Live classes', 'Advanced analytics', 'Finance management', 'Resource library', 'Custom branding', 'Priority email support'],
    unavailable: ['AI Tutor', 'Dedicated account manager', 'API access'],
  },
  {
    id:      'enterprise',
    name:    'Enterprise',
    tagline: 'For large institutions with full platform access',
    color:   'border-black/12',
    badge:   '',
    schools: 25,
    volumeTiers: [
      { label: '1 – 500 students',   max: 500,  rate: 650 },
      { label: '501 – 1,000 students',max: 1000, rate: 600 },
      { label: '1,001+ students',    max: null, rate: 550 },
    ],
    features:    ['Everything in Growth', 'AI Tutor for all students', 'Report builder', 'API access + webhooks', 'Custom domain + branding', 'Dedicated account manager', 'SLA & phone support', 'Payroll module'],
    unavailable: [],
  },
]

const fmt = (n: number) => '₦' + n.toLocaleString('en-NG')

function calcExample(tiers: Tier['volumeTiers'], count: number): number {
  let total = 0
  let remaining = count
  for (const t of tiers) {
    const prev = tiers.indexOf(t) === 0 ? 0 : (tiers[tiers.indexOf(t) - 1].max ?? 0)
    const band = t.max !== null ? t.max - prev : remaining
    const inBand = Math.min(remaining, band)
    total += inBand * t.rate
    remaining -= inBand
    if (remaining <= 0) break
  }
  return total
}

export default function PlansAndPricingPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)
  const [plans,   setPlans]   = useState<Tier[]>(defaultTiers)
  const [editing, setEditing] = useState<string | null>(null)
  const [exCount, setExCount] = useState(250)
  const [editRates, setEditRates] = useState<Record<string, number[]>>({})

  function startEdit(plan: Tier) {
    setEditing(plan.id)
    setEditRates({ [plan.id]: plan.volumeTiers.map(t => t.rate) })
  }

  function saveEdit(planId: string) {
    const rates = editRates[planId]
    setPlans(prev => prev.map(p =>
      p.id === planId
        ? { ...p, volumeTiers: p.volumeTiers.map((t, i) => ({ ...t, rate: rates[i] ?? t.rate })) }
        : p
    ))
    setEditing(null)
  }

  return (
    <DashboardLayout
      activePage="plans-pricing"
      onNavigate={onNavigate}
      title="Plans & Pricing"
      subtitle="Per-student, per-term subscription tiers"
      nav={superAdminNav}
      user={sidebarUser}
    >
      <div className="max-w-[1200px] flex flex-col gap-6">

        {/* Billing model banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-card px-5 py-4">
          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">How billing works</p>
            <p className="mt-0.5 text-blue-700">
              Schools are billed <strong>per student per term</strong>. An invoice is generated at the start of each term based on the enrolled student count. Volume discounts apply automatically as student counts increase within a tier's bands. Custom rates can be set per school from the school detail page.
            </p>
          </div>
        </div>

        {/* Platform-wide example calculator */}
        <div className="bg-surface rounded-card shadow-sm p-5">
          <h3 className="text-sm font-bold text-foreground mb-3">Bill Calculator</h3>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted">Number of students</label>
              <input
                type="number" min={1} value={exCount}
                onChange={e => setExCount(Math.max(1, Number(e.target.value)))}
                className="h-10 w-36 px-3 border border-black/15 rounded-input text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {plans.map(p => (
                <div key={p.id} className="bg-canvas rounded-card px-4 py-2.5 text-center">
                  <p className="text-xs text-muted">{p.name}</p>
                  <p className="text-base font-bold text-primary">{fmt(calcExample(p.volumeTiers, exCount))}</p>
                  <p className="text-[10px] text-muted">per term</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-4">
          {plans.map(p => (
            <div key={p.id} className="bg-surface rounded-card shadow-sm p-4 flex items-center gap-3">
              <div className="size-9 rounded-card bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{p.schools}</p>
                <p className="text-xs text-muted">{p.name} schools</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {plans.map(plan => (
            <div key={plan.id} className={`bg-surface rounded-card border-2 ${plan.color} shadow-sm flex flex-col`}>
              <div className="p-6 border-b border-black/6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                      {plan.badge && (
                        <span className="text-[10px] font-bold bg-primary text-white px-2.5 py-0.5 rounded-full">{plan.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted">{plan.tagline}</p>
                  </div>
                  <button
                    onClick={() => editing === plan.id ? saveEdit(plan.id) : startEdit(plan)}
                    className="size-8 rounded-full bg-canvas flex items-center justify-center hover:bg-primary/10 transition-colors"
                    title={editing === plan.id ? 'Save' : 'Edit rates'}
                  >
                    {editing === plan.id ? <Save size={13} className="text-primary" /> : <Pencil size={13} className="text-muted" />}
                  </button>
                </div>

                {/* Volume pricing tiers */}
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center gap-1 text-[10px] text-muted mb-1">
                    <Users size={10} /> Per-student rate (per term)
                  </div>
                  {plan.volumeTiers.map((vt, vi) => (
                    <div key={vi} className="flex items-center justify-between text-sm">
                      <span className="text-xs text-muted">{vt.label}</span>
                      {editing === plan.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted">₦</span>
                          <input
                            type="number" min={0}
                            value={editRates[plan.id]?.[vi] ?? vt.rate}
                            onChange={e => setEditRates(prev => ({
                              ...prev,
                              [plan.id]: (prev[plan.id] ?? plan.volumeTiers.map(t => t.rate)).map((r, i) => i === vi ? Number(e.target.value) : r)
                            }))}
                            className="w-20 h-7 px-2 border border-primary rounded-md text-xs font-bold outline-none text-right"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-foreground text-xs">{fmt(vt.rate)}</span>
                      )}
                    </div>
                  ))}
                  {editing === plan.id && (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setEditing(null)}
                        className="flex-1 h-8 border border-black/15 text-xs font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => saveEdit(plan.id)}
                        className="flex-1 h-8 bg-primary text-white text-xs font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                        Save Rates
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="p-5 flex flex-col gap-1.5 flex-1">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={13} className="text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </div>
                ))}
                {plan.unavailable.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted/50">
                    <X size={13} className="mt-0.5 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted text-center">
          Custom rates can be applied per school from the school detail page. Rates shown are platform defaults.
        </p>
      </div>
    </DashboardLayout>
  )
}
