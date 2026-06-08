import { useState } from 'react'
import {
  ChevronLeft, Download, Copy, CheckCircle2,
  AlertCircle, CreditCard, Landmark, Banknote,
} from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const feeBreakdown = [
  { label: 'Tuition Fee',  amount: 60000, paid: 60000  },
  { label: 'PTA Levy',     amount: 5000,  paid: 5000   },
  { label: 'Textbook Fee', amount: 10000, paid: 2500   },
  { label: 'Uniform Levy', amount: 8000,  paid: 0      },
  { label: 'Lab Fee',      amount: 7000,  paid: 0      },
]

const totalFee      = feeBreakdown.reduce((s, f) => s + f.amount, 0)
const totalPaid     = feeBreakdown.reduce((s, f) => s + f.paid,   0)
const totalBalance  = totalFee - totalPaid
const pct           = Math.round((totalPaid / totalFee) * 100)

const history = [
  { ref: 'TXN-20260605-001', amount: 65000, date: 'Jun 5, 2026',  method: 'Paystack',       items: 'Tuition + PTA' },
  { ref: 'TXN-20260601-002', amount: 2500,  date: 'Jun 1, 2026',  method: 'Bank Transfer',  items: 'Textbook (partial)' },
]

// School bank details (what admin set)
const schoolBank = { name: 'GTBank', acct: '0123456789', acctName: 'Springfield Academy' }

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

export default function SchoolFeesPage({ onNavigate }: Props) {
  const [tab,     setTab]     = useState<'summary' | 'history'>('summary')
  const [copied,  setCopied]  = useState(false)
  const [showOffline, setShowOffline] = useState(false)

  function copyAcct() {
    navigator.clipboard.writeText(schoolBank.acct).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <MobileLayout activePage="parent/fees" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-24">

        <button onClick={() => onNavigate('parent/home')} className="mb-4">
          <ChevronLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold text-primary mb-0.5">School Fees</h1>
        <p className="text-xs text-muted mb-5">SS2A · First Term 2025/2026</p>

        {/* Overdue alert */}
        {totalBalance > 0 && (
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
            <AlertCircle size={15} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800">Payment Incomplete</p>
              <p className="text-xs text-amber-700">{fmt(totalBalance)} outstanding · due Jun 30, 2026</p>
            </div>
          </div>
        )}

        {/* Balance card */}
        <div className="bg-primary rounded-3xl p-5 mb-5 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 size-28 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-4 size-24 rounded-full bg-white/5" />
          <p className="text-xs text-white/70 mb-0.5">Outstanding Balance</p>
          <p className="text-3xl font-bold text-white mb-1">{fmt(totalBalance)}</p>
          <p className="text-xs text-white/60 mb-3">of {fmt(totalFee)} total</p>

          <div className="mb-3">
            <div className="flex justify-between text-[10px] text-white/60 mb-1">
              <span>{fmt(totalPaid)} paid</span><span>{pct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-xl p-1 mb-4">
          {(['summary', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 h-9 text-sm font-semibold rounded-lg transition-colors capitalize ${tab === t ? 'bg-white shadow text-foreground' : 'text-muted'}`}>
              {t === 'summary' ? 'Fee Breakdown' : 'Payment History'}
            </button>
          ))}
        </div>

        {/* ── Fee Breakdown ── */}
        {tab === 'summary' && (
          <div className="flex flex-col gap-3">
            <div className="bg-white border border-black/8 rounded-2xl shadow-sm divide-y divide-black/4 mb-2">
              {feeBreakdown.map((f, i) => {
                const itemBalance = f.amount - f.paid
                return (
                  <div key={i} className="px-4 py-3.5 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{f.label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="h-1.5 w-20 bg-black/8 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.round((f.paid/f.amount)*100)}%` }} />
                        </div>
                        <span className="text-[10px] text-muted">{Math.round((f.paid/f.amount)*100)}% paid</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground">{fmt(f.amount)}</p>
                      {itemBalance > 0
                        ? <p className="text-[10px] text-red-500 font-semibold">{fmt(itemBalance)} left</p>
                        : <p className="text-[10px] text-green-600 font-semibold flex items-center gap-0.5 justify-end"><CheckCircle2 size={9} /> Cleared</p>
                      }
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-primary/8 border border-primary/20 rounded-2xl px-4 py-3.5 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground">Total</span>
              <div className="text-right">
                <p className="text-base font-bold text-primary">{fmt(totalFee)}</p>
                {totalBalance > 0 && <p className="text-[10px] text-red-500">{fmt(totalBalance)} outstanding</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Payment History ── */}
        {tab === 'history' && (
          <div className="flex flex-col gap-3">
            {history.length === 0 && (
              <p className="text-center text-sm text-muted py-8">No payments yet.</p>
            )}
            {history.map((h, i) => (
              <div key={i} className="bg-white border border-black/8 rounded-2xl shadow-sm px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground">{fmt(h.amount)}</p>
                  <button className="size-8 border border-black/12 rounded-lg flex items-center justify-center">
                    <Download size={14} className="text-muted" />
                  </button>
                </div>
                <p className="text-xs text-muted">{h.items}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{h.method}</span>
                  <span className="text-[10px] text-muted">{h.date}</span>
                </div>
                <p className="text-[10px] font-mono text-muted mt-1">{h.ref}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Payment Options ── */}
        {totalBalance > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-sm font-bold text-foreground">Pay {fmt(totalBalance)}</p>

            {/* Online (Paystack) */}
            <button
              onClick={() => onNavigate('parent/payment-method')}
              className="w-full flex items-center gap-4 bg-primary text-white rounded-2xl px-5 py-4 text-left"
            >
              <CreditCard size={20} className="shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold">Pay Online</p>
                <p className="text-xs text-white/70">Card, USSD, or bank transfer via Paystack</p>
              </div>
            </button>

            {/* Offline / Bank Transfer */}
            <button
              onClick={() => setShowOffline(v => !v)}
              className="w-full flex items-center gap-4 bg-white border border-black/12 rounded-2xl px-5 py-4 text-left shadow-sm"
            >
              <Banknote size={20} className="text-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">Pay Offline / Bank Transfer</p>
                <p className="text-xs text-muted">Transfer directly to school account</p>
              </div>
            </button>

            {/* Offline bank details drawer */}
            {showOffline && (
              <div className="bg-canvas border border-black/10 rounded-2xl px-4 py-4 flex flex-col gap-3">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">School Bank Details</p>
                {[
                  { label: 'Bank',           value: schoolBank.name    },
                  { label: 'Account Name',   value: schoolBank.acctName },
                  { label: 'Account Number', value: schoolBank.acct     },
                  { label: 'Amount',         value: fmt(totalBalance)   },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-xs text-muted">{row.label}</span>
                    <span className={`text-sm font-bold text-foreground ${row.label === 'Account Number' ? 'font-mono' : ''}`}>{row.value}</span>
                  </div>
                ))}

                <button onClick={copyAcct}
                  className="flex items-center gap-2 h-10 bg-white border border-black/12 rounded-xl text-sm font-semibold text-foreground justify-center hover:border-primary hover:text-primary transition-colors">
                  {copied ? <><CheckCircle2 size={14} className="text-green-600" /> Copied!</> : <><Copy size={14} /> Copy Account Number</>}
                </button>

                <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
                  <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 leading-snug">
                    After transferring, keep your bank receipt and inform the school office. Payments are confirmed within 1–2 business days.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {totalBalance === 0 && (
          <div className="mt-6 flex flex-col items-center gap-2 py-4">
            <CheckCircle2 size={32} className="text-green-500" />
            <p className="text-sm font-bold text-green-700">All fees cleared for this term!</p>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
