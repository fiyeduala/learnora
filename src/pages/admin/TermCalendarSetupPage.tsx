import { useState } from 'react'
import { Calendar, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminNav } from '../../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

interface Term { id: number; name: string; start: string; end: string; active: boolean }
interface Holiday { id: number; name: string; date: string; type: string }

const initialTerms: Term[] = [
  { id: 1, name: '1st Term 2025/2026', start: '2025-09-08', end: '2025-12-13', active: false },
  { id: 2, name: '2nd Term 2025/2026', start: '2026-01-12', end: '2026-04-04', active: false },
  { id: 3, name: '3rd Term 2025/2026', start: '2026-04-27', end: '2026-07-18', active: true  },
]

const initialHolidays: Holiday[] = [
  { id: 1, name: 'New Year',           date: '2026-01-01', type: 'Public'  },
  { id: 2, name: 'Eid al-Fitr',        date: '2026-03-30', type: 'Public'  },
  { id: 3, name: 'Labour Day',         date: '2026-05-01', type: 'Public'  },
  { id: 4, name: 'Mid-term Break',     date: '2026-05-25', type: 'School'  },
  { id: 5, name: 'Founders Day',       date: '2026-06-15', type: 'School'  },
]

export default function TermCalendarSetupPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [terms,    setTerms]    = useState<Term[]>(initialTerms)
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays)
  const [saved,    setSaved]    = useState(false)

  function setActive(id: number) {
    setTerms(prev => prev.map(t => ({ ...t, active: t.id === id })))
  }
  function removeHoliday(id: number) {
    setHolidays(prev => prev.filter(h => h.id !== id))
  }
  function addHoliday() {
    setHolidays(prev => [...prev, { id: Date.now(), name: 'New Holiday', date: '2026-07-01', type: 'School' }])
  }

  return (
    <DashboardLayout
      activePage="timetable"
      onNavigate={onNavigate}
      title="Term & Calendar Setup"
      subtitle="Configure academic terms and school holidays"
      nav={adminNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[820px] flex flex-col gap-6">

        {/* Terms */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Calendar size={15} className="text-primary" /> Academic Terms
            </h2>
            <button className="flex items-center gap-1.5 h-8 px-3 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors">
              <Plus size={12} /> Add Term
            </button>
          </div>
          <div className="divide-y divide-black/4">
            {terms.map(t => (
              <div key={t.id} className="flex items-center gap-5 px-6 py-4">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-muted mb-1 uppercase tracking-wider">Term Name</label>
                    <input
                      defaultValue={t.name}
                      className="w-full h-9 px-3 border border-black/15 rounded-card text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted mb-1 uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      defaultValue={t.start}
                      className="w-full h-9 px-3 border border-black/15 rounded-card text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-muted mb-1 uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      defaultValue={t.end}
                      className="w-full h-9 px-3 border border-black/15 rounded-card text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setActive(t.id)}
                    className={`h-8 px-3 rounded-full text-xs font-semibold transition-colors ${t.active ? 'bg-green-500 text-white' : 'bg-canvas text-muted hover:bg-primary/10 hover:text-primary'}`}
                  >
                    {t.active ? 'Active' : 'Set Active'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Holidays */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Holidays & Breaks</h2>
            <button onClick={addHoliday} className="flex items-center gap-1.5 h-8 px-3 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors">
              <Plus size={12} /> Add Holiday
            </button>
          </div>
          <div className="divide-y divide-black/4">
            {holidays.map(h => (
              <div key={h.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input defaultValue={h.name} className="h-9 px-3 border border-black/15 rounded-card text-sm outline-none focus:border-primary" />
                  <input type="date" defaultValue={h.date} className="h-9 px-3 border border-black/15 rounded-card text-sm outline-none focus:border-primary" />
                  <select defaultValue={h.type} className="h-9 px-3 border border-black/15 rounded-card text-sm outline-none focus:border-primary bg-white appearance-none">
                    <option>Public</option><option>School</option><option>Religious</option>
                  </select>
                </div>
                <button onClick={() => removeHoliday(h.id)} className="size-8 rounded-full flex items-center justify-center text-muted hover:text-red-500 hover:bg-red-50 transition-colors shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500) }}
            className="flex items-center gap-2 h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
          >
            <Save size={15} /> Save Calendar
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <CheckCircle2 size={16} /> Saved!
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
