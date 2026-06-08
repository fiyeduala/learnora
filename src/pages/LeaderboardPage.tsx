import { Trophy, Medal, Flame, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }
type Tab   = 'class' | 'school' | 'national'

type BoardEntry = { rank: number; name: string; gpa: number; streak: number; points: number; change: number; me?: boolean }

const myRank = { class: 0, school: 0, national: 0 }

const classBoard: BoardEntry[] = []

const medalColor = ['text-amber-500', 'text-gray-400', 'text-orange-600']
const medalBg    = ['bg-amber-50', 'bg-gray-50', 'bg-orange-50']

export default function LeaderboardPage({ onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>('class')

  const label = { class: 'My Class (SS1A)', school: 'Greenfield Academy', national: 'Nigeria' }

  return (
    <DashboardLayout activePage="analysis" onNavigate={onNavigate} title="Leaderboard" subtitle="See how you rank against your peers">
      <div className="max-w-[720px] flex flex-col gap-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-canvas rounded-pill p-1 w-fit">
          {(['class','school','national'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-9 px-5 rounded-full text-sm font-semibold capitalize transition-colors ${tab === t ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* My rank banner */}
        <div className="bg-primary rounded-card p-5 flex items-center gap-4">
          <div className="size-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
            O
          </div>
          <div className="flex-1">
            <p className="text-white text-xs mb-0.5">Your rank in {label[tab]}</p>
            <p className="text-3xl font-bold text-white">{myRank[tab] ? `#${myRank[tab]}` : '—'}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-white/80 text-sm mb-1">
              <Flame size={13} className="text-red-300" /> — streak
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <TrendingUp size={13} /> — points
            </div>
          </div>
        </div>

        {/* Podium (top 3) */}
        {classBoard.length >= 3 && (
          <div className="flex items-end justify-center gap-4 py-4">
            {[classBoard[1], classBoard[0], classBoard[2]].map((p, i) => {
              const displayRank = i === 0 ? 2 : i === 1 ? 1 : 3
              const heights = ['h-24', 'h-32', 'h-20']
              return (
                <div key={p.rank} className="flex flex-col items-center gap-2">
                  <div className={`size-12 rounded-full ${p.me ? 'bg-primary' : 'bg-canvas border border-black/10'} flex items-center justify-center text-sm font-bold ${p.me ? 'text-white' : 'text-foreground'}`}>
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-xs font-semibold text-foreground text-center max-w-[80px] leading-tight">{p.name.split(' ')[0]}</p>
                  <div className={`w-20 ${heights[i]} ${medalBg[displayRank - 1]} rounded-t-lg flex items-end justify-center pb-2`}>
                    <Medal size={20} className={medalColor[displayRank - 1]} />
                  </div>
                  <span className="text-xs font-bold text-foreground">#{displayRank}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Full board */}
        <div className="bg-surface rounded-card shadow-sm overflow-hidden">
          <div className="divide-y divide-black/4">
            {classBoard.length === 0
              ? <div className="py-8 text-center text-sm text-muted">No data yet.</div>
              : classBoard.map(p => (
                <div key={p.rank} className={`flex items-center gap-4 px-5 py-3.5 ${p.me ? 'bg-primary/6 border-l-2 border-primary' : ''}`}>
                  <div className={`w-7 text-center shrink-0 ${p.rank <= 3 ? 'text-base' : 'text-sm'}`}>
                    {p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank - 1] : <span className="text-muted font-semibold">{p.rank}</span>}
                  </div>
                  <div className={`size-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${p.me ? 'bg-primary text-white' : 'bg-canvas text-foreground'}`}>
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${p.me ? 'text-primary' : 'text-foreground'}`}>
                      {p.name}{p.me ? ' (You)' : ''}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span>GPA {p.gpa}</span>
                      <span className="flex items-center gap-0.5"><Flame size={10} className="text-red-400" /> {p.streak}d</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{p.points}</p>
                    <p className={`text-[10px] font-semibold ${p.change > 0 ? 'text-green-500' : p.change < 0 ? 'text-red-500' : 'text-muted'}`}>
                      {p.change > 0 ? `+${p.change}` : p.change < 0 ? `${p.change}` : '—'}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* How points work */}
        <div className="bg-surface rounded-card shadow-sm p-5">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Trophy size={13} className="text-amber-500" /> How Points Work
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted">
            {[
              ['Complete a lesson', '+20 pts'],
              ['Submit assignment on time', '+30 pts'],
              ['Score 80%+ on a quiz', '+50 pts'],
              ['Daily study session', '+10 pts'],
              ['Maintain a 7-day streak', '+100 pts'],
              ['Help a classmate (forum)', '+15 pts'],
            ].map(([action, pts]) => (
              <div key={action} className="flex items-center justify-between">
                <span>{action}</span>
                <span className="text-primary font-semibold">{pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
