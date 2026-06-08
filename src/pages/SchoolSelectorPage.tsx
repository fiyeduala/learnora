import { useState } from 'react'
import { Search, ChevronRight, MapPin } from 'lucide-react'
import AuthHeroPanel from '../components/auth/AuthHeroPanel'

type Props = { onNavigate: (page: string) => void }

const schools = [
  { id: 1, name: 'Greenfield Academy',       location: 'Lagos, Nigeria',   code: 'GFA-001' },
  { id: 2, name: 'Royal Crown Secondary',    location: 'Abuja, Nigeria',   code: 'RCS-002' },
  { id: 3, name: 'Heritage International',   location: 'Port Harcourt, NG',code: 'HIS-003' },
  { id: 4, name: 'Bright Future School',     location: 'Kano, Nigeria',    code: 'BFS-004' },
]

export default function SchoolSelectorPage({ onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [code, setCode] = useState('')
  const [tab, setTab] = useState<'search' | 'code'>('search')

  const filtered = schools.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.location.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      <div className="lg:w-[52%] lg:flex-shrink-0 p-3 lg:p-6">
        <AuthHeroPanel />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-0 lg:px-12">
        <div className="w-full max-w-[500px]">
          <h1 className="text-4xl font-semibold text-foreground mb-2 leading-tight">Find Your School</h1>
          <p className="text-base text-muted mb-8">Search for your school by name or enter your school code.</p>

          {/* Tabs */}
          <div className="flex gap-1 bg-canvas rounded-card p-1 mb-6">
            {(['search', 'code'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 h-10 text-sm font-semibold rounded-md transition-colors capitalize ${
                  tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'
                }`}
              >
                {t === 'search' ? 'Search School' : 'Enter Code'}
              </button>
            ))}
          </div>

          {tab === 'search' ? (
            <>
              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by school name or city..."
                  className="w-full h-14 pl-11 pr-5 border border-black/20 rounded-input text-base text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                {filtered.map(s => (
                  <button
                    key={s.id}
                    onClick={() => onNavigate('login')}
                    className="flex items-center gap-4 p-4 border border-black/10 rounded-card hover:border-primary hover:shadow-sm transition-all text-left"
                  >
                    <div className="size-11 rounded-card bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-base font-bold">{s.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />{s.location}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-muted shrink-0" />
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-muted py-8">No schools found. Try a different name or use a school code.</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-base font-bold text-foreground">School Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GFA-001"
                  className="h-14 px-5 border border-black/20 rounded-input text-base text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors tracking-widest"
                />
                <p className="text-xs text-muted">Your school code is provided by your school administrator.</p>
              </div>
              <button
                disabled={code.length < 4}
                onClick={() => onNavigate('login')}
                className="h-14 bg-primary text-white text-base font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
