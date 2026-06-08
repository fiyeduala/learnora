import { useState } from 'react'
import { Search, Plus, ChevronRight } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type StatusFilter = 'All' | 'Active' | 'Trial' | 'Suspended'

const schools = [
  { name: 'Greenfield Academy',     location: 'Lagos',     plan: 'Professional', students: 1248, mrr: '₦1.06M', status: 'Active',    joined: 'Jan 2024' },
  { name: 'Royal Crown Secondary',  location: 'Abuja',     plan: 'Starter',      students: 420,  mrr: '₦357K',  status: 'Active',    joined: 'Mar 2024' },
  { name: 'Heritage International', location: 'PH',        plan: 'Professional', students: 890,  mrr: '₦756.5K',status: 'Active',    joined: 'Jun 2024' },
  { name: 'Bright Future School',   location: 'Kano',      plan: 'Starter',      students: 310,  mrr: '₦263.5K',status: 'Trial',     joined: 'May 2026' },
  { name: 'Unity Academy',          location: 'Enugu',     plan: 'Professional', students: 680,  mrr: '₦578K',  status: 'Suspended', joined: 'Sep 2023' },
  { name: 'Apex College',           location: 'Ibadan',    plan: 'Starter',      students: 280,  mrr: '₦238K',  status: 'Active',    joined: 'Nov 2024' },
  { name: 'Pinnacle Academy',       location: 'Kaduna',    plan: 'Professional', students: 760,  mrr: '₦646K',  status: 'Active',    joined: 'Feb 2025' },
]

export default function SchoolsListPage({ onNavigate }: Props) {
  const [search, setSearch]   = useState('')
  const [status, setStatus]   = useState<StatusFilter>('All')

  const filtered = schools.filter(s =>
    (status === 'All' || s.status === status) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout
      activePage="schools-list"
      onNavigate={onNavigate}
      title="Schools"
      subtitle="All schools on the Learnora platform"
      nav={superAdminNav}
      user={{ name: 'Learnora Admin', role: 'Super Admin', initials: 'LA' }}
    >
      <div className="max-w-[1200px] flex flex-col gap-6">

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search schools..."
              className="w-full h-10 pl-9 pr-4 border border-black/15 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
          </div>
          <div className="flex gap-1 bg-canvas rounded-card p-1">
            {(['All', 'Active', 'Trial', 'Suspended'] as StatusFilter[]).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 h-8 text-xs font-semibold rounded-md transition-colors ${status === s ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>{s}</button>
            ))}
          </div>
          <button onClick={() => onNavigate('onboard-school')} className="flex items-center gap-1.5 h-10 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary ml-auto">
            <Plus size={13} /> Onboard School
          </button>
        </div>

        {/* School cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((s, i) => (
            <div key={i} className="bg-surface rounded-card shadow-sm p-5 flex flex-wrap items-center gap-4 hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigate('school-detail')}>
              <div className="size-11 rounded-card bg-primary/10 text-primary text-lg font-bold flex items-center justify-center shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-[180px]">
                <p className="text-base font-bold text-foreground">{s.name}</p>
                <p className="text-xs text-muted mt-0.5">{s.location} · Since {s.joined}</p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted">Plan</p>
                  <p className="font-semibold text-foreground">{s.plan}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">Students</p>
                  <p className="font-semibold text-foreground">{s.students.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted">MRR</p>
                  <p className="font-semibold text-foreground">{s.mrr}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  s.status === 'Active'    ? 'bg-green-50 text-green-700' :
                  s.status === 'Trial'     ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-600'
                }`}>{s.status}</span>
                <ChevronRight size={16} className="text-muted" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
