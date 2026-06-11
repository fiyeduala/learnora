import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Loader2 } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { logSupabaseError } from '../../lib/supabaseError'

type Props = { onNavigate: (page: string) => void }

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

declare global {
  interface Window {
    PaystackPop: {
      setup(opts: {
        key: string; email: string; amount: number; ref: string; currency: string
        onSuccess: (txn: { reference: string }) => void
        onCancel: () => void
      }): { openIframe(): void }
    }
  }
}

export default function PaymentReviewPage({ onNavigate }: Props) {
  const { profile } = useAuth()

  const [confirmed,  setConfirmed]  = useState(false)
  const [amount,     setAmount]     = useState(0)
  const [ref,        setRef]        = useState('')
  const [dateStr,    setDateStr]    = useState('')
  const [pubKey,     setPubKey]     = useState('')
  const [paying,     setPaying]     = useState(false)
  const [error,      setError]      = useState('')
  const scriptRef = useRef(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('learnora_pending_payment_amount')
    const total  = sessionStorage.getItem('learnora_pending_payment_total')
    setAmount(stored ? Number(stored) : total ? Number(total) : 0)
    const r = `LRN-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`
    setRef(r)
    sessionStorage.setItem('learnora_pending_payment_ref', r)
    setDateStr(new Date().toLocaleString('en-NG', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }))

    // Load Paystack public key from school_settings
    if (profile?.school_id) {
      supabase.from('school_settings')
        .select('paystack_public_key')
        .eq('school_id', profile.school_id)
        .maybeSingle()
        .then(({ data }) => {
          const key = (data as any)?.paystack_public_key ?? ''
          setPubKey(key)
          if (key && !scriptRef.current) {
            scriptRef.current = true
            const s = document.createElement('script')
            s.src = 'https://js.paystack.co/v1/inline.js'
            document.head.appendChild(s)
          }
        })
    }
  }, [profile?.school_id])

  async function handlePay() {
    if (!confirmed || !pubKey || !profile) return
    setError('')

    if (!window.PaystackPop) {
      // Paystack JS not loaded — fall back to manual confirmation
      await recordManualPayment(ref)
      return
    }

    setPaying(true)
    const handler = window.PaystackPop.setup({
      key:      pubKey,
      email:    profile.email ?? '',
      amount:   amount * 100, // kobo
      ref,
      currency: 'NGN',
      onSuccess: async (txn) => {
        await recordManualPayment(txn.reference)
        setPaying(false)
        onNavigate('parent/payment-success')
      },
      onCancel: () => {
        setPaying(false)
        setError('Payment cancelled.')
      },
    })
    handler.openIframe()
  }

  async function recordManualPayment(paystackRef: string) {
    const childId = sessionStorage.getItem('learnora_selected_child')
    if (!childId || !profile?.school_id) return

    sessionStorage.setItem('learnora_pending_payment_ref', paystackRef)

    // Check if invoice exists; upsert it with the paystack_reference
    const db = supabase as unknown as { from: (t: string) => any }
    const { data: existing } = await db.from('invoices')
      .select('id, paid_amount')
      .eq('student_id', childId)
      .eq('school_id', profile.school_id)
      .in('status', ['unpaid', 'partial'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      const { error } = await db.from('invoices').update({
        paid_amount:        ((existing as any).paid_amount ?? 0) + amount,
        status:             'paid',
        paystack_reference: paystackRef,
      }).eq('id', (existing as any).id)
      logSupabaseError('PaymentReview.updateInvoice', error)
    } else {
      const { error } = await db.from('invoices').insert({
        student_id:         childId,
        school_id:          profile.school_id,
        amount,
        paid_amount:        amount,
        status:             'paid',
        paystack_reference: paystackRef,
      })
      logSupabaseError('PaymentReview.insertInvoice', error)
    }
  }

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
            { label: 'Reference ID', value: ref         },
            { label: 'Date & Time',  value: dateStr     },
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

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        <div className="flex-1" />

        <button
          disabled={!confirmed || paying}
          onClick={handlePay}
          className="w-full h-14 bg-primary text-white text-base font-bold rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-deep transition-colors flex items-center justify-center gap-2"
        >
          {paying && <Loader2 size={18} className="animate-spin" />}
          {paying ? 'Processing…' : pubKey ? 'Pay with Paystack' : 'Confirm Payment'}
        </button>

      </div>
    </MobileLayout>
  )
}
