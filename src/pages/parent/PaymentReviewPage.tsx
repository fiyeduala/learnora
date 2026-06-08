import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

export default function PaymentReviewPage({ onNavigate }: Props) {
  const [confirmed, setConfirmed] = useState(false)

  const fields = [
    { label: 'Amount',         value: '₦50,000.00' },
    { label: 'Reference ID',   value: 'TXN-2026-45983' },
    { label: 'Date',           value: 'Today • 2:35 PM' },
    { label: 'Account number', value: '0236777858' },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto px-5 pt-5 pb-8">

      <button onClick={() => onNavigate('parent/payment')} className="mb-6"><ChevronLeft size={22} /></button>

      <h1 className="text-2xl font-bold text-primary mb-2">Review and Confirm</h1>
      <p className="text-sm text-muted mb-8 leading-relaxed">
        You are about to submit a sell request for your TPCM. Please verify the details carefully before proceeding.
      </p>

      {/* Fields */}
      <div className="flex flex-col gap-5 mb-8">
        {fields.map(f => (
          <div key={f.label} className="border-b border-black/8 pb-4">
            <p className="text-sm font-bold text-foreground mb-1">{f.label}</p>
            <p className="text-base text-foreground">{f.value}</p>
          </div>
        ))}
      </div>

      {/* Confirmation checkbox */}
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
          I confirm that the tripacash account is correct and I understand that I will manually receive cash after submission
        </p>
      </div>

      <div className="flex-1" />

      <button
        disabled={!confirmed}
        onClick={() => onNavigate('parent/fees')}
        className="w-full h-14 bg-primary text-white text-base font-bold rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-deep transition-colors"
      >
        Confirm Sell Request
      </button>

    </div>
  )
}
