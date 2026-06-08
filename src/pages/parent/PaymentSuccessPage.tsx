import { CheckCircle2, Download, ArrowLeft, Share2 } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'

type Props = { onNavigate: (page: string) => void }

const receipt = {
  ref:       'TXN-LRN-2026-00841',
  amount:    '₦17,500',
  method:    'Card (Mastercard ••• 4521)',
  date:      'Jun 8, 2026',
  time:      '2:47 PM WAT',
  student:   'Olive Princely',
  class:     'SS1A',
  term:      'Second Term 2025/2026',
  school:    'Greenfield Academy',
  items: [
    { label: 'Tuition Fee',  amount: '₦60,000' },
    { label: 'PTA Levy',     amount: '₦5,000'  },
    { label: 'Textbooks',    amount: '₦10,000' },
    { label: 'Amount Paid',  amount: '₦17,500' },
  ],
  balance: '₦57,500',
}

export default function PaymentSuccessPage({ onNavigate }: Props) {
  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-6 pb-10 flex flex-col gap-5 min-h-screen">

        {/* Back */}
        <button onClick={() => onNavigate('parent/fees')}
          className="flex items-center gap-1.5 text-sm text-muted w-fit">
          <ArrowLeft size={15} /> Back to fees
        </button>

        {/* Success mark */}
        <div className="flex flex-col items-center text-center pt-4 pb-2">
          <div className="size-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Payment Successful</h1>
          <p className="text-sm text-muted mt-1">Your payment has been received and recorded.</p>
          <p className="text-2xl font-bold text-green-600 mt-3">{receipt.amount}</p>
        </div>

        {/* Receipt card */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-black/6 flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">Receipt</p>
            <span className="text-[10px] font-mono text-muted">{receipt.ref}</span>
          </div>

          <div className="px-5 py-4 flex flex-col gap-3">
            {[
              { label: 'Date & Time',  value: `${receipt.date} · ${receipt.time}` },
              { label: 'Method',       value: receipt.method                       },
              { label: 'Student',      value: receipt.student                      },
              { label: 'Class',        value: receipt.class                        },
              { label: 'Term',         value: receipt.term                         },
              { label: 'School',       value: receipt.school                       },
            ].map(row => (
              <div key={row.label} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted shrink-0">{row.label}</span>
                <span className="font-semibold text-foreground text-right">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-dashed border-black/10 flex flex-col gap-2">
            {receipt.items.map((item, i) => (
              <div key={i} className={`flex justify-between text-sm ${i === receipt.items.length - 1 ? 'font-bold text-foreground border-t border-black/8 pt-2 mt-1' : 'text-muted'}`}>
                <span>{item.label}</span>
                <span>{item.amount}</span>
              </div>
            ))}
          </div>

          {Number(receipt.balance.replace(/[^\d]/g, '')) > 0 && (
            <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-700 font-semibold">Remaining balance: {receipt.balance}</p>
            </div>
          )}
        </div>

        {/* Actions */}
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
