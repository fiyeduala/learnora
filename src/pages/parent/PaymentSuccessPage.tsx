import { useState, useEffect } from 'react'
import { CheckCircle2, Download, ArrowLeft, Share2 } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

export default function PaymentSuccessPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [childName,  setChildName]  = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [amount,     setAmount]     = useState(0)
  const [ref,        setRef]        = useState('')

  useEffect(() => {
    setAmount(Number(sessionStorage.getItem('learnora_pending_payment_amount') ?? '0'))
    setRef(sessionStorage.getItem('learnora_pending_payment_ref') ?? '')
    if (profile?.id) loadNames()
  }, [profile?.id])

  async function loadNames() {
    const childId = sessionStorage.getItem('learnora_selected_child')
    if (childId) {
      const { data } = await supabase
        .from('profiles').select('full_name').eq('id', childId).maybeSingle()
      setChildName((data as { full_name: string | null } | null)?.full_name ?? '')
    }
    if (profile?.school_id) {
      const { data } = await supabase
        .from('schools').select('name').eq('id', profile.school_id).maybeSingle()
      setSchoolName((data as { name: string | null } | null)?.name ?? '')
    }
  }

  const dateStr = new Date().toLocaleString('en-NG', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-6 pb-10 flex flex-col gap-5 min-h-screen">

        <button onClick={() => onNavigate('parent/fees')}
          className="flex items-center gap-1.5 text-sm text-muted w-fit">
          <ArrowLeft size={15} /> Back to fees
        </button>

        <div className="flex flex-col items-center text-center pt-4 pb-2">
          <div className="size-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Payment Successful</h1>
          <p className="text-sm text-muted mt-1">Your payment has been received and recorded.</p>
          <p className="text-2xl font-bold text-green-600 mt-3">{fmt(amount)}</p>
        </div>

        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/6 flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">Receipt</p>
            <span className="text-[10px] font-mono text-muted">{ref}</span>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            {[
              { label: 'Date & Time', value: dateStr             },
              { label: 'Method',      value: 'School Fee Payment' },
              { label: 'Student',     value: childName || '—'     },
              { label: 'School',      value: schoolName || '—'    },
              { label: 'Amount Paid', value: fmt(amount)           },
            ].map(row => (
              <div key={row.label} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted shrink-0">{row.label}</span>
                <span className="font-semibold text-foreground text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button className="h-12 w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-bold rounded-pill hover:bg-primary-deep transition-colors">
            <Download size={15} /> Download Receipt
          </button>
          <button className="h-12 w-full flex items-center justify-center gap-2 border border-black/15 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
            <Share2 size={15} /> Share Receipt
          </button>
          <button onClick={() => onNavigate('parent/home')}
            className="h-12 w-full text-sm font-semibold text-muted hover:text-foreground transition-colors">
            Back to Home
          </button>
        </div>

      </div>
    </MobileLayout>
  )
}
