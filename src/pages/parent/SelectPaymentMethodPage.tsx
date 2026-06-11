import { useState, useEffect } from 'react'
import { ChevronLeft, CreditCard, Landmark, Banknote, Copy, CheckCircle2, AlertCircle } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }
type Method = 'card' | 'bank' | 'offline'

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

export default function SelectPaymentMethodPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [selected,   setSelected]   = useState<Method | null>(null)
  const [copied,     setCopied]     = useState(false)
  const [balance,    setBalance]    = useState(0)
  const [schoolName, setSchoolName] = useState('—')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => { if (profile?.id) loadBalance() }, [profile?.id])

  async function loadBalance() {
    setLoading(true)
    const childId = sessionStorage.getItem('learnora_selected_child') ?? profile!.id

    const { data: invData } = await supabase
      .from('invoices')
      .select('amount')
      .eq('student_id', childId)
      .neq('status', 'paid')
    const total = (invData ?? []).reduce((s: number, r: { amount: number }) => s + (r.amount ?? 0), 0)
    setBalance(total)
    sessionStorage.setItem('learnora_pending_payment_total', String(total))

    if (profile?.school_id) {
      const { data: school } = await supabase
        .from('schools').select('name').eq('id', profile.school_id).maybeSingle()
      setSchoolName((school as { name: string } | null)?.name ?? '—')
    }
    setLoading(false)
  }

  function copyAcct() {
    navigator.clipboard.writeText('—').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const methods: { id: Method; icon: typeof CreditCard; label: string; sub: string }[] = [
    { id: 'card',    icon: CreditCard, label: 'Card / USSD',   sub: 'Pay securely via Paystack — card, USSD, bank app.'         },
    { id: 'bank',    icon: Landmark,   label: 'Bank Transfer', sub: 'Generate a virtual account and transfer from your bank.'   },
    { id: 'offline', icon: Banknote,   label: 'Offline / Cash',sub: 'Pay cash at school or transfer directly to school account.' },
  ]

  function handleProceed() {
    if (selected === 'offline') return
    onNavigate('parent/payment')
  }

  return (
    <MobileLayout activePage="parent/fees" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-8 flex flex-col min-h-full">

        <button onClick={() => onNavigate('parent/fees')} className="mb-6">
          <ChevronLeft size={22} />
        </button>

        <h1 className="text-2xl font-bold text-primary mb-1">Select Payment Method</h1>
        <p className="text-sm text-muted mb-2">
          {loading
            ? 'Loading outstanding balance…'
            : <>Choose a payment method to pay <strong>{fmt(balance)}</strong></>
          }
        </p>

        <div className="flex flex-col gap-3 flex-1">
          {methods.map(m => {
            const Icon = m.icon
            const isSelected = selected === m.id
            return (
              <div key={m.id}>
                <button
                  onClick={() => setSelected(isSelected ? null : m.id)}
                  className={`w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all border-2 ${
                    isSelected
                      ? 'border-primary bg-primary/4 shadow-md'
                      : 'border-black/10 bg-white shadow-sm hover:border-primary/40'
                  }`}
                >
                  <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-canvas text-foreground'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{m.label}</p>
                    <p className="text-xs text-muted mt-0.5">{m.sub}</p>
                  </div>
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-black/20'}`}>
                    {isSelected && <div className="size-2 bg-white rounded-full" />}
                  </div>
                </button>

                {m.id === 'offline' && isSelected && (
                  <div className="mt-2 bg-canvas border border-black/10 rounded-2xl px-4 py-4 flex flex-col gap-3">
                    <p className="text-xs font-bold text-foreground uppercase tracking-wide">School Account Details</p>
                    {[
                      { label: 'Account Name',   value: schoolName },
                      { label: 'Amount',         value: fmt(balance) },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-center">
                        <span className="text-xs text-muted">{row.label}</span>
                        <span className="text-sm font-bold text-foreground">{row.value}</span>
                      </div>
                    ))}
                    <button onClick={copyAcct}
                      className="flex items-center gap-2 h-10 bg-white border border-black/12 rounded-xl text-sm font-semibold text-foreground justify-center hover:border-primary hover:text-primary transition-colors">
                      {copied
                        ? <><CheckCircle2 size={14} className="text-green-600" /> Copied!</>
                        : <><Copy size={14} /> Copy Account Number</>
                      }
                    </button>
                    <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
                      <AlertCircle size={13} className="text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-800 leading-snug">
                        After transferring, keep your receipt and notify the school office. Payments are confirmed within 1–2 business days.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {selected && selected !== 'offline' && (
          <button
            onClick={handleProceed}
            className="w-full h-14 bg-primary text-white text-base font-bold rounded-2xl mt-6 hover:bg-primary-deep transition-colors"
          >
            Proceed to Pay {fmt(balance)}
          </button>
        )}

        {selected === 'offline' && (
          <button
            onClick={() => onNavigate('parent/fees')}
            className="w-full h-14 border-2 border-primary text-primary text-base font-bold rounded-2xl mt-6 hover:bg-primary/5 transition-colors"
          >
            Done
          </button>
        )}

      </div>
    </MobileLayout>
  )
}
