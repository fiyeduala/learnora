import { useState, useEffect } from 'react'
import {
  ChevronLeft, Download, Copy, CheckCircle2,
  AlertCircle, CreditCard, Banknote,
} from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface FeeItem {
  invoiceId: string
  label:     string
  amount:    number
  paid:      number
}

interface Payment {
  ref:    string
  amount: number
  date:   string
  method: string
  items:  string
}

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

export default function SchoolFeesPage({ onNavigate }: Props) {
  const { profile } = useAuth()

  const [tab,         setTab]         = useState<'summary' | 'history'>('summary')
  const [copied,      setCopied]      = useState(false)
  const [showOffline, setShowOffline] = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [childName,   setChildName]   = useState('Child')
  const [className,   setClassName]   = useState('')
  const [feeItems,    setFeeItems]    = useState<FeeItem[]>([])
  const [payments,    setPayments]    = useState<Payment[]>([])
  const [nearestDue,  setNearestDue]  = useState<string | null>(null)
  const [schoolBank,  setSchoolBank]  = useState({ name: '', acct: '', acctName: '' })

  useEffect(() => { if (profile?.id) loadFees() }, [profile?.id])

  async function loadFees() {
    setLoading(true)
    const schoolId = profile!.school_id!
    let childId = localStorage.getItem('learnora_selected_child')

    if (!childId) {
      const { data: linkData } = await supabase
        .from('parent_student_links')
        .select('student_id')
        .eq('parent_id', profile!.id)
        .eq('school_id', schoolId)
        .limit(1)
        .maybeSingle()
      if (linkData) childId = (linkData as { student_id: string }).student_id
    }

    if (!childId) { setLoading(false); return }

    const [profileRes, enrollRes, invoiceRes, paymentRes, settingsRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', childId).maybeSingle(),
      supabase.from('class_enrollments')
        .select('classes(name)')
        .eq('student_id', childId)
        .limit(1)
        .maybeSingle(),
      supabase.from('invoices')
        .select('id, amount, status, due_date, fee_structure_id, fee_structures(name)')
        .eq('student_id', childId)
        .eq('school_id', schoolId),
      supabase.from('payments')
        .select('invoice_id, amount, paystack_reference, paystack_status, paid_at')
        .eq('student_id', childId),
      supabase.from('school_settings')
        .select('bank_name, account_number, account_name')
        .eq('school_id', schoolId)
        .maybeSingle(),
    ])

    if (profileRes.data) {
      const p = profileRes.data as unknown as { full_name: string | null }
      setChildName(p.full_name ?? 'Child')
    }
    if (enrollRes.data) {
      const e = enrollRes.data as unknown as { classes: { name: string } | null }
      setClassName(e.classes?.name ?? '')
    }

    const invData = (invoiceRes.data ?? []) as unknown as {
      id: string; amount: string | number; status: string; due_date: string | null
      fee_structure_id: string
      fee_structures: { name: string } | null
    }[]

    const payData = (paymentRes.data ?? []) as unknown as {
      invoice_id: string; amount: string | number
      paystack_reference: string | null; paystack_status: string | null; paid_at: string
    }[]

    // Build paid totals per invoice
    const paidByInvoice: Record<string, number> = {}
    for (const p of payData) {
      paidByInvoice[p.invoice_id] = (paidByInvoice[p.invoice_id] ?? 0) + parseFloat(String(p.amount))
    }

    const items: FeeItem[] = invData.map(inv => ({
      invoiceId: inv.id,
      label:     inv.fee_structures?.name ?? 'Fee',
      amount:    parseFloat(String(inv.amount)),
      paid:      paidByInvoice[inv.id] ?? 0,
    }))
    setFeeItems(items)

    const paidList: Payment[] = payData.map(p => ({
      ref:    p.paystack_reference ?? 'N/A',
      amount: parseFloat(String(p.amount)),
      date:   new Date(p.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      method: p.paystack_status === 'success' ? 'Paystack' : 'Bank Transfer',
      items:  invData.find(i => i.id === p.invoice_id)?.fee_structures?.name ?? 'Payment',
    }))
    setPayments(paidList)

    const unpaidDues = invData
      .filter(inv => inv.status !== 'paid' && inv.status !== 'waived' && inv.due_date)
      .map(inv => inv.due_date!)
      .sort()
    setNearestDue(unpaidDues[0] ?? null)

    const s = settingsRes.data as { bank_name: string | null; account_number: string | null; account_name: string | null } | null
    if (s) setSchoolBank({ name: s.bank_name ?? '', acct: s.account_number ?? '', acctName: s.account_name ?? '' })

    setLoading(false)
  }

  function copyAcct() {
    navigator.clipboard.writeText(schoolBank.acct).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalFee     = feeItems.reduce((s, f) => s + f.amount, 0)
  const totalPaid    = feeItems.reduce((s, f) => s + f.paid, 0)
  const totalBalance = totalFee - totalPaid
  const pct          = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 100

  const dueDateStr = nearestDue
    ? new Date(nearestDue + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <MobileLayout activePage="parent/fees" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-24">

        <button onClick={() => onNavigate('parent/home')} className="mb-4">
          <ChevronLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold text-primary mb-0.5">School Fees</h1>
        <p className="text-xs text-muted mb-5">{childName}{className ? ` · ${className}` : ''}</p>

        {loading ? (
          <p className="text-sm text-muted text-center py-10">Loading…</p>
        ) : feeItems.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-5 text-center">
            <CheckCircle2 size={28} className="text-green-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-green-700">No fee records found.</p>
            <p className="text-xs text-muted mt-1">Contact the school if this is unexpected.</p>
          </div>
        ) : (
          <>
            {/* Overdue alert */}
            {totalBalance > 0 && (
              <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-amber-800">Payment Incomplete</p>
                  <p className="text-xs text-amber-700">
                    {fmt(totalBalance)} outstanding{dueDateStr ? ` · due ${dueDateStr}` : ''}
                  </p>
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

            {/* Fee Breakdown */}
            {tab === 'summary' && (
              <div className="flex flex-col gap-3">
                <div className="bg-white border border-black/8 rounded-2xl shadow-sm divide-y divide-black/4 mb-2">
                  {feeItems.map(f => {
                    const balance = f.amount - f.paid
                    const pctPaid = f.amount > 0 ? Math.round((f.paid / f.amount) * 100) : 100
                    return (
                      <div key={f.invoiceId} className="px-4 py-3.5 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{f.label}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="h-1.5 w-20 bg-black/8 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${pctPaid}%` }} />
                            </div>
                            <span className="text-[10px] text-muted">{pctPaid}% paid</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-foreground">{fmt(f.amount)}</p>
                          {balance > 0
                            ? <p className="text-[10px] text-red-500 font-semibold">{fmt(balance)} left</p>
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

            {/* Payment History */}
            {tab === 'history' && (
              <div className="flex flex-col gap-3">
                {payments.length === 0 && (
                  <p className="text-center text-sm text-muted py-8">No payments recorded yet.</p>
                )}
                {payments.map((h, i) => (
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

            {/* Payment Options */}
            {totalBalance > 0 && (
              <div className="mt-6 flex flex-col gap-3">
                <p className="text-sm font-bold text-foreground">Pay {fmt(totalBalance)}</p>
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
          </>
        )}
      </div>
    </MobileLayout>
  )
}
