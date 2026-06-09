import { TrendingUp, Download, ArrowUp, Users, Building2, CreditCard, AlertCircle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

/* Per-student-per-term billing model */

const stats = [
  { label: 'Current Term Revenue',   value: '—', change: '+12%', Icon: TrendingUp,  color: 'bg-primary/10 text-primary'         },
  { label: 'Annual Run Rate',        value: '—', change: '+12%', Icon: TrendingUp,  color: 'bg-green-50 text-green-600'         },
  { label: 'Billable Schools',       value: '—', change: '+8',   Icon: Building2,   color: 'bg-accent-mint/10 text-accent-mint' },
  { label: 'Failed Payments',        value: '—', change: '-2',   Icon: AlertCircle, color: 'bg-red-50 text-red-500'             },
]

type InvStatus = 'paid' | 'failed' | 'pending'

const invoices: { school: string; plan: string; students: number; rate: number; term: string; date: string; status: InvStatus }[] = []

const revenueByTerm = [
  { label: 'T1 2025', value: 38  },
  { label: 'T2 2025', value: 40  },
  { label: 'T3 2025', value: 41  },
  { label: 'T1 2026', value: 43  },
  { label: 'T2 2026', value: 48.2},
]
const maxRev = 52

const statusStyle: Record<InvStatus, string> = {
  paid:    'bg-green-50 text-green-700',
  failed:  'bg-red-50 text-red-600',
  pending: 'bg-amber-50 text-amber-600',
}

const fmt = (n: number) => '₦' + n.toLocaleString('en-NG')

export default function PlatformBillingPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)
  return (
    <DashboardLayout
      activePage="platform-billing"
      onNavigate={onNavigate}
      title="Platform Billing"
      subtitle="Per-student, per-term revenue and payment history"
      nav={superAdminNav}
      user={sidebarUser}
    >
      <div className="flex flex-col gap-6 max-w-[1200px]">

        {/* Billing model note */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-card px-5 py-3.5 text-sm text-blue-800">
          <Users size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <span>Billing is <strong>per student per term</strong>. Each invoice = enrolled students × plan rate. Volume discounts apply within each plan.</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ label, value, change, Icon, color }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-5">
              <div className={`size-10 rounded-card ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
              <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-green-600">
                <ArrowUp size={11} /> {change} this term
              </div>
            </div>
          ))}
        </div>

        {/* Revenue per term chart */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-foreground">Revenue per Term (₦M)</h2>
            <button className="flex items-center gap-2 h-9 px-4 border border-black/20 text-sm font-semibold text-foreground rounded-pill hover:bg-canvas transition-colors">
              <Download size={13} /> Export CSV
            </button>
          </div>
          <div className="flex items-end gap-4 h-40">
            {revenueByTerm.map((r, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-[10px] font-bold text-foreground">₦{r.value}M</span>
                <div className="w-full bg-primary rounded-t-lg" style={{ height: `${Math.round((r.value / maxRev) * 100)}%` }} />
                <span className="text-xs text-muted">{r.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice history */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Term Invoices</h2>
            <button className="flex items-center gap-2 h-9 px-4 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors">
              <CreditCard size={12} /> View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-canvas">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted">School</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Plan</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Students</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Rate/Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Term</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-black/4">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-muted">No data yet.</td>
                  </tr>
                ) : invoices.map((t, i) => (
                  <tr key={i} className="hover:bg-canvas/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-foreground">{t.school}</td>
                    <td className="px-4 py-3.5 text-muted">{t.plan}</td>
                    <td className="px-4 py-3.5 text-foreground">{t.students.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-foreground">{fmt(t.rate)}</td>
                    <td className="px-4 py-3.5 font-semibold text-foreground">{fmt(t.students * t.rate)}</td>
                    <td className="px-4 py-3.5 text-muted">{t.term}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusStyle[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {t.status === 'failed' && (
                        <button className="text-xs text-primary font-semibold hover:underline">Retry</button>
                      )}
                      {t.status !== 'failed' && (
                        <button className="text-xs text-muted hover:text-primary font-semibold">View</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
