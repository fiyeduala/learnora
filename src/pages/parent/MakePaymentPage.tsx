import { useState, useEffect } from 'react'
import { ChevronLeft, MoreHorizontal } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

export default function MakePaymentPage({ onNavigate }: Props) {
  const [total,  setTotal]  = useState(0)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('learnora_pending_payment_total')
    setTotal(stored ? Number(stored) : 0)
  }, [])

  function setPercent(pct: number) {
    setAmount(String(Math.round(total * pct / 100)))
  }

  function proceed() {
    const n = Number(amount) || total
    localStorage.setItem('learnora_pending_payment_amount', String(n))
    onNavigate('parent/payment-review')
  }

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4 flex flex-col min-h-full">

        <button onClick={() => onNavigate('parent/payment-method')} className="mb-6"><ChevronLeft size={22} /></button>

        <h1 className="text-2xl font-bold text-primary mb-1">Make Payment</h1>
        <p className="text-sm text-muted mb-5">Manage and track your child's school payments.</p>

        <div className="bg-primary rounded-3xl p-5 mb-6 relative">
          <button className="absolute top-4 right-4"><MoreHorizontal size={18} className="text-white/70" /></button>
          <p className="text-xs text-white/70 mb-1">Outstanding Summary</p>
          <p className="text-3xl font-bold text-white mb-2">{total > 0 ? fmt(total) : '₦0'}</p>
          <span className="bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">Due Soon</span>
        </div>

        <p className="text-base font-bold text-foreground mb-3">Amount Field</p>
        <div className="flex items-center gap-2 border border-black/15 rounded-2xl px-4 py-3 mb-4">
          <span className="text-base font-bold text-foreground">₦</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="00.00"
            className="flex-1 text-base text-foreground placeholder:text-muted outline-none"
          />
          <button
            onClick={() => setAmount(String(total))}
            className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0"
          >
            Full Payment
          </button>
        </div>

        <div className="flex gap-3 mb-8">
          {[25, 50, 75].map(p => (
            <button
              key={p}
              onClick={() => setPercent(p)}
              className="flex-1 h-11 border-2 border-black/12 rounded-xl text-sm font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {p}%
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button
          onClick={proceed}
          disabled={total === 0 && !amount}
          className="w-full h-14 bg-primary text-white text-base font-bold rounded-2xl hover:bg-primary-deep transition-colors disabled:opacity-50"
        >
          Make Payment
        </button>

      </div>
    </MobileLayout>
  )
}
