import { CheckCircle2, ChevronRight, CreditCard, RefreshCw } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

const planFeatures = [
  'Unlimited students',
  'AI Tutor for all students',
  'Advanced analytics & reports',
  'Parent portal with fee payment',
  'Custom school branding',
  'Priority support',
  'SMS & email notifications',
  'Offline-first PWA access',
]

export default function SubscriptionBillingPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  return (
    <DashboardLayout
      activePage="subscription"
      onNavigate={onNavigate}
      title="Subscription & Billing"
      subtitle="Manage your school's Learnora subscription"
      nav={adminNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[900px] flex flex-col gap-6">

        {/* Current plan */}
        <div className="bg-primary rounded-card p-6 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-white/70 mb-1">Current Plan</p>
              <h2 className="text-2xl font-bold mb-1">Professional Plan</h2>
              <p className="text-sm text-white/80">Greenfield Academy · 1,248 active students</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₦850</p>
              <p className="text-sm text-white/70">per student / term</p>
            </div>
          </div>
          <hr className="border-white/20 my-4" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/80">
              Next billing: <span className="font-semibold text-white">September 1, 2026</span>
            </div>
            <div className="flex gap-2">
              <button className="h-9 px-4 bg-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/30 transition-colors">
                Manage Plan
              </button>
              <button className="h-9 px-4 border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Plan features */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h3 className="text-base font-bold text-foreground mb-4">Included in your plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {planFeatures.map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                <CheckCircle2 size={15} className="text-green-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Billing info + invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-surface rounded-card shadow-sm p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Payment Method</h3>
            <div className="flex items-center gap-3 p-4 border border-black/10 rounded-card mb-4">
              <CreditCard size={18} className="text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Paystack · Auto-debit</p>
                <p className="text-xs text-muted">Active · Next charge Sep 1, 2026</p>
              </div>
            </div>
            <button className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              <RefreshCw size={13} /> Update payment method
            </button>
          </div>

          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/6">
              <h3 className="text-base font-bold text-foreground">Recent Invoices</h3>
              <button className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">All <ChevronRight size={12} /></button>
            </div>
            <div className="divide-y divide-black/4">
              {[
                { period: 'Term 1, 2026', amount: '₦1.06B', date: 'Jan 1, 2026',  status: 'Paid' },
                { period: 'Term 3, 2025', amount: '₦998.4M',date: 'Sep 1, 2025',  status: 'Paid' },
                { period: 'Term 2, 2025', amount: '₦948.0M',date: 'May 1, 2025',  status: 'Paid' },
              ].map((inv, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3.5">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{inv.period}</p>
                    <p className="text-xs text-muted">{inv.date} · {inv.amount}</p>
                  </div>
                  <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-xs">{inv.status}</span>
                  <button className="text-xs text-primary font-semibold hover:underline">PDF</button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}
