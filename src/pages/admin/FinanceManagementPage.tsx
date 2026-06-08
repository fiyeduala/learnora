import { useState } from 'react'
import { Download, ChevronRight, AlertCircle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type Tab = 'overview' | 'invoices' | 'payments'

const recentPayments = [
  { student: 'Olive Princely',   amount: '₦85,000', date: 'Jun 5, 2026',  method: 'Online',  status: 'Paid'    },
  { student: 'Yetunde Adesanya', amount: '₦85,000', date: 'Jun 4, 2026',  method: 'Bank',    status: 'Paid'    },
  { student: 'Fatima Al-Rashid', amount: '₦42,500', date: 'Jun 3, 2026',  method: 'Online',  status: 'Partial' },
  { student: 'Kofi Asante',      amount: '₦85,000', date: '—',            method: '—',       status: 'Overdue' },
  { student: 'James Owusu',      amount: '₦85,000', date: 'May 28, 2026', method: 'Cash',    status: 'Paid'    },
]

const statusStyle: Record<string, string> = {
  Paid:    'bg-green-50 text-green-700',
  Partial: 'bg-amber-50 text-amber-700',
  Overdue: 'bg-red-50 text-red-600',
}

export default function FinanceManagementPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <DashboardLayout
      activePage="finance"
      onNavigate={onNavigate}
      title="Finance Management"
      subtitle="School fees, collections and financial reports"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[1200px] flex flex-col gap-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Expected',   value: '₦106.1M', sub: 'This term',        color: 'text-foreground' },
            { label: 'Total Collected',  value: '₦89.4M',  sub: '84% collection',   color: 'text-green-600'  },
            { label: 'Outstanding',      value: '₦16.7M',  sub: '156 students',     color: 'text-red-500'    },
            { label: 'Overdue 30+ days', value: '₦3.2M',   sub: '28 students',      color: 'text-amber-600'  },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Alert */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-card px-5 py-3.5 text-sm">
          <AlertCircle size={16} className="text-amber-600 shrink-0" />
          <p className="text-foreground">28 students have payments overdue by 30+ days. <button onClick={() => onNavigate('fee-collection')} className="text-primary font-semibold hover:underline">View overdue list</button></p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-card p-1 w-fit">
          {(['overview', 'invoices', 'payments'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 h-9 text-sm font-semibold rounded-md transition-colors capitalize ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Collection breakdown */}
            <div className="bg-surface rounded-card shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-foreground">Collection by Class</h3>
                <button className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
                  <Download size={13} /> Export
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { class: 'SS1A', total: 32, paid: 28, amount: '₦2.38M' },
                  { class: 'SS2A', total: 29, paid: 24, amount: '₦2.04M' },
                  { class: 'SS3A', total: 31, paid: 31, amount: '₦2.64M' },
                  { class: 'JSS1', total: 35, paid: 30, amount: '₦2.55M' },
                ].map(c => (
                  <div key={c.class}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-semibold text-foreground">{c.class}</span>
                      <span className="text-muted">{c.paid}/{c.total} students · {c.amount}</span>
                    </div>
                    <div className="h-2 bg-black/8 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(c.paid/c.total)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-col gap-4">
              {[
                { label: 'Fee Collection',      sub: 'Track payments & record offline',   page: 'fee-collection'   },
                { label: 'Set Fee Structure',   sub: 'Configure fees per class/term',   page: 'admin-fee-setup'  },
                { label: 'Bank & Paystack',     sub: 'School account & remittance',     page: 'admin-fee-setup'  },
                { label: 'Download Report',     sub: 'Full collection report PDF',      page: 'admin-reports'    },
              ].map(a => (
                <button key={a.label} onClick={() => onNavigate(a.page)}
                  className="flex items-center justify-between bg-surface rounded-card shadow-sm p-4 hover:shadow-md transition-all text-left">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.label}</p>
                    <p className="text-xs text-muted mt-0.5">{a.sub}</p>
                  </div>
                  <ChevronRight size={15} className="text-muted shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {(tab === 'invoices' || tab === 'payments') && (
          <div className="bg-surface rounded-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/6">
              <h3 className="text-base font-bold text-foreground">{tab === 'payments' ? 'Recent Payments' : 'Outstanding Invoices'}</h3>
              <button className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline"><Download size={13} /> Export</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/6 bg-canvas/40">
                    {['Student', 'Amount', 'Date', 'Method', 'Status', ''].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((p, i) => (
                    <tr key={i} className="border-b border-black/4 last:border-0 hover:bg-canvas/40 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{p.student.charAt(0)}</div>
                          <span className="font-medium text-foreground">{p.student}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-foreground">{p.amount}</td>
                      <td className="px-6 py-3.5 text-muted text-xs">{p.date}</td>
                      <td className="px-6 py-3.5 text-muted">{p.method}</td>
                      <td className="px-6 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-xs ${statusStyle[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <button className="text-xs text-primary font-semibold hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
