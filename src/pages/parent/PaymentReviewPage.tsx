import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

function genRef() {
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `TXN-LRN-${new Date().getFullYear()}-${rand}`
}

export default function PaymentReviewPage({ onNavigate }: Props) {
  const [confirmed, setConfirmed] = useState(false)
  const [amount,    setAmount]    = useState(0)
  const [ref,       setRef]       = useState('')
  const [dateStr,   setDateStr]   = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('learnora_pending_payment_amount')
    const total  = sessionStorage.getItem('learnora_pending_payment_total')
    setAmount(stored ? Number(stored) : total ? Number(total) : 0)
    const r = genRef()
    setRef(r)
    sessionStorage.setItem('learnora_pending_payment_ref', r)
    setDateStr(new Date().toLocaleString('en-NG', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }))
  }, [])

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-8 flex flex-col min-h-full">

        <button onClick={() => onNavigate('parent/payment')} className="mb-6"><ChevronLeft size={22} /></button>

        <h1 className="text-2xl font-bold text-primary mb-2">Review and Confirm</h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          Please verify your school fee payment details before proceeding.
        </p>

        <div className="flex flex-col gap-5 mb-8">
          {[
            { label: 'Amount',       value: fmt(amount) },
            { label: 'Reference ID', value: ref          },
            { label: 'Date & Time',  value: dateStr       },
          ].map(f => (
            <div key={f.label} className="border-b border-black/8 pb-4">
              <p className="text-sm font-bold text-foreground mb-1">{f.label}</p>
              <p className="text-base text-foreground">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 mb-10">
          <button
            onClick={() => setConfirmed(!confirmed)}
            className={`size-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              confirmed ? 'border-primary bg-primary' : 'border-black/20'
            }`}
          >
            {confirmed && <span className="text-white text-xs font-bold">✓</span>}
          </button>
          <p className="text-sm text-muted leading-relaxed">
            I confirm that the payment details above are correct and I authorise this school fee payment.
          </p>
        </div>

        <div className="flex-1" />

        <button
          disabled={!confirmed}
          onClick={() => onNavigate('parent/payment-success')}
          className="w-full h-14 bg-primary text-white text-base font-bold rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-deep transition-colors"
        >
          Confirm Payment
        </button>

      </div>
    </MobileLayout>
  )
}
