import { useState } from 'react'
import {
  Search, Filter, Download, Plus, CheckCircle2,
  AlertCircle, Clock, XCircle, ChevronDown, X, Send,
} from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type PayStatus = 'Paid' | 'Partial' | 'Unpaid' | 'Overdue'

interface Student {
  id: number
  name: string
  class: string
  expected: number
  paid: number
  lastPayment: string
  status: PayStatus
}

const ALL_STUDENTS: Student[] = [
  { id: 1,  name: 'Olive Princely',    class: 'SS1A',  expected: 85000, paid: 85000, lastPayment: 'Jun 5, 2026',  status: 'Paid'    },
  { id: 2,  name: 'Yetunde Adesanya',  class: 'SS2A',  expected: 85000, paid: 85000, lastPayment: 'Jun 4, 2026',  status: 'Paid'    },
  { id: 3,  name: 'Fatima Al-Rashid',  class: 'SS3A',  expected: 85000, paid: 42500, lastPayment: 'Jun 3, 2026',  status: 'Partial' },
  { id: 4,  name: 'Kofi Asante',       class: 'SS1A',  expected: 85000, paid: 0,     lastPayment: '—',            status: 'Overdue' },
  { id: 5,  name: 'James Owusu',       class: 'SS2A',  expected: 85000, paid: 85000, lastPayment: 'May 28, 2026', status: 'Paid'    },
  { id: 6,  name: 'Amara Osei',        class: 'JSS1',  expected: 65000, paid: 65000, lastPayment: 'Jun 1, 2026',  status: 'Paid'    },
  { id: 7,  name: 'Chisom Eze',        class: 'SS3A',  expected: 85000, paid: 30000, lastPayment: 'May 15, 2026', status: 'Partial' },
  { id: 8,  name: 'Emmanuel Boateng',  class: 'JSS1',  expected: 65000, paid: 0,     lastPayment: '—',            status: 'Unpaid'  },
  { id: 9,  name: 'Akosua Mensah',     class: 'SS1A',  expected: 85000, paid: 0,     lastPayment: '—',            status: 'Overdue' },
  { id: 10, name: 'Daniel Eze',        class: 'JSS2',  expected: 65000, paid: 65000, lastPayment: 'Jun 2, 2026',  status: 'Paid'    },
  { id: 11, name: 'Grace Okafor',      class: 'SS2A',  expected: 85000, paid: 50000, lastPayment: 'May 20, 2026', status: 'Partial' },
  { id: 12, name: 'Ibrahim Musa',      class: 'JSS3',  expected: 65000, paid: 0,     lastPayment: '—',            status: 'Unpaid'  },
]

const statusConfig: Record<PayStatus, { color: string; icon: typeof CheckCircle2 }> = {
  Paid:    { color: 'bg-green-50 text-green-700',   icon: CheckCircle2 },
  Partial: { color: 'bg-amber-50 text-amber-700',   icon: Clock        },
  Unpaid:  { color: 'bg-red-50 text-red-600',       icon: XCircle      },
  Overdue: { color: 'bg-red-100 text-red-700',      icon: AlertCircle  },
}

const CLASSES = ['All Classes', 'JSS1', 'JSS2', 'JSS3', 'SS1A', 'SS2A', 'SS3A']
const FILTERS: (PayStatus | 'All')[] = ['All', 'Paid', 'Partial', 'Unpaid', 'Overdue']
const OFFLINE_METHODS = ['Cash', 'Bank Transfer', 'Cheque', 'POS']

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

export default function FeeCollectionPage({ onNavigate }: Props) {
  const [search,      setSearch]      = useState('')
  const [filter,      setFilter]      = useState<PayStatus | 'All'>('All')
  const [selClass,    setSelClass]    = useState('All Classes')
  const [showOffline, setShowOffline] = useState(false)
  const [offStudent,  setOffStudent]  = useState<Student | null>(null)
  const [offAmount,   setOffAmount]   = useState('')
  const [offMethod,   setOffMethod]   = useState('Cash')
  const [offNote,     setOffNote]     = useState('')
  const [offDone,     setOffDone]     = useState(false)
  const [showReminder,setShowReminder]= useState(false)
  const [reminderSent,setReminderSent]= useState(false)

  const visible = ALL_STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.class.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || s.status === filter
    const matchClass  = selClass === 'All Classes' || s.class === selClass
    return matchSearch && matchFilter && matchClass
  })

  const totalExpected = ALL_STUDENTS.reduce((s, st) => s + st.expected, 0)
  const totalPaid     = ALL_STUDENTS.reduce((s, st) => s + st.paid, 0)
  const totalBalance  = totalExpected - totalPaid
  const notPaid       = ALL_STUDENTS.filter(s => s.status !== 'Paid')

  function openOffline(student: Student) {
    setOffStudent(student)
    setOffAmount(String(student.expected - student.paid))
    setOffMethod('Cash')
    setOffNote('')
    setOffDone(false)
    setShowOffline(true)
  }

  function submitOffline(e: React.FormEvent) {
    e.preventDefault()
    setOffDone(true)
  }

  function sendReminders() {
    setReminderSent(true)
    setTimeout(() => { setReminderSent(false); setShowReminder(false) }, 2000)
  }

  return (
    <DashboardLayout
      activePage="fee-collection"
      onNavigate={onNavigate}
      title="Fee Collection"
      subtitle="Track payments, record offline collections, and manage balances"
      nav={adminNav}
      user={{ name: 'Admin Okafor', role: 'School Admin', initials: 'A' }}
    >
      <div className="max-w-[1100px] flex flex-col gap-6">

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Expected',  value: fmt(totalExpected), color: 'text-foreground' },
            { label: 'Total Collected', value: fmt(totalPaid),     color: 'text-green-600'  },
            { label: 'Outstanding',     value: fmt(totalBalance),  color: 'text-red-500'    },
            { label: 'Not Fully Paid',  value: `${notPaid.length} students`, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-surface rounded-card shadow-sm p-5">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search student or class..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm outline-none focus:border-primary" />
          </div>

          <div className="relative">
            <select value={selClass} onChange={e => setSelClass(e.target.value)}
              className="h-10 pl-4 pr-8 border border-black/15 rounded-input text-sm bg-white outline-none focus:border-primary appearance-none">
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          <div className="flex gap-1 bg-canvas rounded-input p-1">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 h-8 text-xs font-semibold rounded-[6px] transition-colors ${filter === f ? 'bg-white text-foreground shadow' : 'text-muted hover:text-foreground'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setShowReminder(true)}
              className="flex items-center gap-1.5 h-10 px-4 border border-black/15 rounded-pill text-sm text-muted hover:text-primary hover:border-primary transition-colors">
              <Send size={13} /> Send Reminders
            </button>
            <button className="flex items-center gap-1.5 h-10 px-4 border border-black/15 rounded-pill text-sm text-muted hover:text-primary hover:border-primary transition-colors">
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: '780px' }}>
              <thead>
                <tr className="bg-canvas/60 border-b border-black/6">
                  {['Student', 'Class', 'Expected', 'Paid', 'Balance', 'Last Payment', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/4">
                {visible.map(s => {
                  const balance = s.expected - s.paid
                  const pct = Math.round((s.paid / s.expected) * 100)
                  const { color, icon: Icon } = statusConfig[s.status]
                  return (
                    <tr key={s.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{s.class}</td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{fmt(s.expected)}</td>
                      <td className="px-5 py-3.5">
                        <div>
                          <span className="font-semibold text-green-600">{fmt(s.paid)}</span>
                          <div className="mt-1 h-1.5 w-20 bg-black/8 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-red-500">{balance > 0 ? fmt(balance) : '—'}</td>
                      <td className="px-5 py-3.5 text-muted text-xs">{s.lastPayment}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
                          <Icon size={11} />{s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {s.status !== 'Paid' && (
                          <button onClick={() => openOffline(s)}
                            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline whitespace-nowrap">
                            <Plus size={11} /> Record Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-muted">
                      <Filter size={28} className="mx-auto mb-2 opacity-30" />
                      No students match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Record Offline Payment Modal ── */}
      {showOffline && offStudent && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowOffline(false)} />
          <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[480px]">

            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
              <h2 className="text-base font-bold text-foreground">
                {offDone ? 'Payment Recorded' : 'Record Offline Payment'}
              </h2>
              <button onClick={() => setShowOffline(false)} className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            {offDone ? (
              <div className="p-8 text-center">
                <div className="size-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={24} className="text-green-600" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Payment Recorded</h3>
                <p className="text-sm text-muted mb-1">
                  {fmt(Number(offAmount))} via {offMethod} for <strong>{offStudent.name}</strong>.
                </p>
                <p className="text-xs text-muted mb-6">The student's payment record has been updated.</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setOffDone(false)}
                    className="h-10 px-5 border border-black/15 text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Record Another
                  </button>
                  <button onClick={() => setShowOffline(false)}
                    className="h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitOffline} className="p-6 flex flex-col gap-4">

                {/* Student info */}
                <div className="bg-canvas rounded-card p-3.5 flex items-center gap-3">
                  <div className="size-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                    {offStudent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{offStudent.name}</p>
                    <p className="text-xs text-muted">
                      {offStudent.class} · Balance: <span className="text-red-500 font-semibold">{fmt(offStudent.expected - offStudent.paid)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Amount Paid <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold">₦</span>
                    <input required type="number" min={1} value={offAmount}
                      onChange={e => setOffAmount(e.target.value)}
                      className="h-11 w-full pl-8 pr-4 border border-black/20 rounded-input text-sm font-semibold outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Payment Method</label>
                  <div className="flex flex-wrap gap-2">
                    {OFFLINE_METHODS.map(m => (
                      <button key={m} type="button" onClick={() => setOffMethod(m)}
                        className={`h-9 px-4 rounded-full text-xs font-bold border transition-colors ${offMethod === m ? 'border-primary bg-primary/8 text-primary' : 'border-black/15 text-muted hover:border-primary/40'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Note (optional)</label>
                  <input value={offNote} onChange={e => setOffNote(e.target.value)}
                    placeholder="e.g. receipt no., collector name"
                    className="h-11 px-4 border border-black/20 rounded-input text-sm outline-none focus:border-primary" />
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowOffline(false)}
                    className="h-11 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 h-11 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary">
                    Confirm Payment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Send Reminders Modal ── */}
      {showReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReminder(false)} />
          <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[420px] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-foreground">Send Payment Reminders</h2>
              <button onClick={() => setShowReminder(false)} className="text-muted hover:text-foreground"><X size={18} /></button>
            </div>
            <p className="text-sm text-muted mb-5">
              This will send a payment reminder to parents of all <strong>{notPaid.length} students</strong> who have not fully paid their fees.
            </p>
            <div className="bg-canvas rounded-card p-3.5 mb-5">
              <p className="text-xs text-muted">Reminder will be sent via:</p>
              <div className="flex gap-2 mt-2">
                {['App Notification', 'SMS', 'Email'].map(m => (
                  <span key={m} className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full">{m}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReminder(false)}
                className="flex-1 h-11 border border-black/15 text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
              <button onClick={sendReminders}
                className="flex-1 h-11 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary flex items-center justify-center gap-2">
                {reminderSent ? <><CheckCircle2 size={14} /> Sent!</> : <><Send size={14} /> Send Reminders</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
