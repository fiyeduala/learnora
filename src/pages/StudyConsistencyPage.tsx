import { Flame, Calendar, Trophy, TrendingUp, Target } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

// 10-week heatmap: 1=studied, 0=missed, 2=double session
const heatmapData = [
  [1,1,1,1,1,0,0],
  [1,1,0,1,1,1,0],
  [1,1,1,1,1,0,0],
  [0,1,1,1,0,1,0],
  [1,1,1,1,1,0,0],
  [1,0,1,1,1,1,0],
  [2,1,1,1,2,0,0],
  [1,1,1,0,1,1,0],
  [2,2,1,1,1,0,0],
  [1,1,1,1,1,1,0],
]

const weekLabels = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10']
const dayLabels  = ['M','T','W','T','F','S','S']

const subjectStreaks = [
  { subject: 'Physics',     streak: 12, best: 18, color: 'bg-primary'     },
  { subject: 'Mathematics', streak: 7,  best: 14, color: 'bg-accent-mint' },
  { subject: 'English',     streak: 15, best: 15, color: 'bg-amber-400'   },
  { subject: 'Chemistry',   streak: 5,  best: 10, color: 'bg-red-400'     },
]

const tileColor = ['bg-black/8', 'bg-primary/50', 'bg-primary']

export default function StudyConsistencyPage({ onNavigate }: Props) {
  const totalDays   = heatmapData.flat().filter(v => v > 0).length
  const totalSess   = heatmapData.flat().length - heatmapData.flat().filter(v => v === 0 && dayLabels[heatmapData.flat().indexOf(v) % 7] === 'S').length
  const consistency = Math.round((totalDays / (totalSess * 5 / 7)) * 100)

  return (
    <DashboardLayout activePage="analysis" onNavigate={onNavigate} title="Study Consistency" subtitle="Streaks, habits, and study activity over time">
      <div className="flex flex-col gap-6 max-w-[860px]">

        {/* Top stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Current Streak',     value: '12 days',   Icon: Flame,       color: 'bg-red-50 text-red-500'       },
            { label: 'Longest Streak',     value: '18 days',   Icon: Trophy,      color: 'bg-amber-50 text-amber-600'  },
            { label: 'Days Studied',        value: `${totalDays}/70`, Icon: Calendar, color: 'bg-primary/10 text-primary' },
            { label: 'Consistency',         value: `${Math.min(consistency, 100)}%`, Icon: TrendingUp, color: 'bg-green-50 text-green-600' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} className="bg-surface rounded-card shadow-sm p-5">
              <div className={`size-10 rounded-card ${color} flex items-center justify-center mb-3`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-4">10-Week Study Heatmap</h2>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1.5 pt-6">
              {dayLabels.map(d => (
                <div key={d} className="h-6 w-5 flex items-center justify-center text-[10px] text-muted">{d}</div>
              ))}
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {heatmapData.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5">
                  <div className="h-5 flex items-center justify-center text-[10px] text-muted">{weekLabels[wi]}</div>
                  {week.map((val, di) => (
                    <div
                      key={di}
                      className={`size-6 rounded ${tileColor[val]} transition-colors`}
                      title={val === 0 ? 'No study' : val === 2 ? 'Double session' : 'Studied'}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {[['bg-black/8','No study'],['bg-primary/50','Studied'],['bg-primary','Double session']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-muted">
                <span className={`size-3 rounded ${c}`} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Per-subject streaks */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Target size={15} className="text-primary" /> Subject Streaks
          </h2>
          <div className="flex flex-col gap-5">
            {subjectStreaks.map(s => (
              <div key={s.subject}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{s.subject}</p>
                    <div className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                      <Flame size={12} /> {s.streak} days
                    </div>
                  </div>
                  <p className="text-xs text-muted">Best: {s.best} days</p>
                </div>
                <div className="h-2 bg-black/8 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.round((s.streak / s.best) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly goal */}
        <div className="bg-primary rounded-card p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs mb-1">This Week's Goal</p>
            <p className="text-xl font-bold text-white">Study 5 days out of 7</p>
            <p className="text-white/70 text-sm mt-1">You've studied 4 days — 1 more to hit your goal!</p>
          </div>
          <div className="size-16 rounded-full bg-white/15 flex items-center justify-center">
            <p className="text-white text-xl font-bold">4/5</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
