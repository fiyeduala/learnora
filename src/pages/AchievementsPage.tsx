import { useState } from 'react'
import { Award, Star, Lock, Trophy } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

interface Badge {
  id:          string
  title:       string
  description: string
  icon:        string
  category:    string
  earned:      boolean
  earnedDate?: string
  xp:          number
}

const badges: Badge[] = [
  { id: '1',  title: 'First Login',        description: 'Logged in for the first time',                    icon: '🚀', category: 'Milestones', earned: true,  earnedDate: 'Sep 14, 2024', xp: 50   },
  { id: '2',  title: 'Course Completer',   description: 'Completed your first full course',                icon: '📗', category: 'Learning',   earned: true,  earnedDate: 'Nov 2, 2024',  xp: 200  },
  { id: '3',  title: '7-Day Streak',       description: 'Studied every day for a week',                   icon: '🔥', category: 'Consistency', earned: true,  earnedDate: 'Nov 20, 2024', xp: 150  },
  { id: '4',  title: 'Top of the Class',   description: 'Ranked #1 in your class leaderboard',            icon: '🥇', category: 'Excellence', earned: true,  earnedDate: 'Jan 10, 2025', xp: 500  },
  { id: '5',  title: 'Perfect Score',      description: 'Got 100% on a quiz',                             icon: '💯', category: 'Excellence', earned: true,  earnedDate: 'Feb 28, 2025', xp: 300  },
  { id: '6',  title: 'Night Owl',          description: 'Studied after 10PM for 5 days',                  icon: '🦉', category: 'Consistency', earned: true,  earnedDate: 'Mar 15, 2025', xp: 100  },
  { id: '7',  title: '30-Day Streak',      description: 'Studied every day for a month',                  icon: '📅', category: 'Consistency', earned: false, xp: 500  },
  { id: '8',  title: 'WAEC Ready',         description: 'Completed all WAEC prep modules',                icon: '📝', category: 'Learning',   earned: false, xp: 400  },
  { id: '9',  title: 'Social Learner',     description: 'Participated in 10 group discussions',           icon: '💬', category: 'Collaboration', earned: false, xp: 200  },
  { id: '10', title: 'Polymath',           description: 'Completed courses in 5 different subjects',      icon: '🧠', category: 'Learning',   earned: false, xp: 600  },
  { id: '11', title: 'AI Explorer',        description: 'Used AI Tutor for 20 sessions',                  icon: '🤖', category: 'Learning',   earned: false, xp: 250  },
  { id: '12', title: 'Goal Crusher',       description: 'Completed all academic goals for a term',        icon: '🎯', category: 'Excellence', earned: false, xp: 350  },
]

const categories = ['All', 'Milestones', 'Learning', 'Consistency', 'Excellence', 'Collaboration']

const totalXP   = badges.filter(b => b.earned).reduce((s, b) => s + b.xp, 0)
const earnedCount = badges.filter(b => b.earned).length

export default function AchievementsPage({ onNavigate }: Props) {
  const [tab, setTab] = useState('All')

  const filtered = tab === 'All' ? badges : badges.filter(b => b.category === tab)

  return (
    <DashboardLayout
      activePage="profile"
      onNavigate={onNavigate}
      title="Achievements"
      subtitle="Badges and milestones you've unlocked"
    >
      {/* XP Banner */}
      <div className="bg-gradient-to-r from-[#4b75ff] to-[#005cf7] rounded-card p-6 flex items-center justify-between mb-5 text-white">
        <div>
          <p className="text-sm font-semibold opacity-80 mb-1">Total XP Earned</p>
          <p className="text-3xl font-bold">{totalXP.toLocaleString()} XP</p>
          <p className="text-sm opacity-70 mt-1">{earnedCount} of {badges.length} badges unlocked</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <Trophy size={32} className="mx-auto mb-1 opacity-80" />
            <p className="text-xs font-semibold opacity-70">Level 6</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-surface rounded-card shadow-sm p-5 mb-5">
        <div className="flex justify-between text-xs font-semibold text-muted mb-2">
          <span>Progress to Level 7</span>
          <span>{totalXP} / 2500 XP</span>
        </div>
        <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min((totalXP / 2500) * 100, 100)}%` }} />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setTab(c)}
            className={`h-8 px-4 rounded-full text-xs font-semibold transition-colors ${tab === c ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-foreground shadow-sm'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(badge => (
          <div
            key={badge.id}
            className={`bg-surface rounded-card shadow-sm p-5 flex flex-col items-center text-center transition-all ${badge.earned ? '' : 'opacity-50'}`}
          >
            <div className={`size-16 rounded-full flex items-center justify-center text-3xl mb-3 ${badge.earned ? 'bg-primary/10' : 'bg-canvas'}`}>
              {badge.earned ? badge.icon : <Lock size={22} className="text-muted" />}
            </div>
            <p className="text-sm font-bold text-foreground mb-1">{badge.title}</p>
            <p className="text-xs text-muted leading-relaxed mb-3">{badge.description}</p>
            <div className="flex items-center gap-1.5">
              <Star size={11} className={badge.earned ? 'text-amber-500' : 'text-muted'} fill={badge.earned ? '#f59e0b' : 'none'} />
              <span className={`text-xs font-bold ${badge.earned ? 'text-amber-600' : 'text-muted'}`}>{badge.xp} XP</span>
            </div>
            {badge.earned && badge.earnedDate && (
              <p className="text-[10px] text-muted mt-1.5">{badge.earnedDate}</p>
            )}
            {!badge.earned && (
              <span className="text-[10px] font-semibold text-muted mt-1.5 bg-canvas px-2 py-0.5 rounded-full">Locked</span>
            )}
          </div>
        ))}
      </div>

      {/* Earned XP per category summary */}
      <div className="bg-surface rounded-card shadow-sm p-5 mt-5">
        <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Award size={14} className="text-primary" /> XP by Category
        </h2>
        <div className="flex flex-col gap-3">
          {['Learning', 'Consistency', 'Excellence', 'Milestones', 'Collaboration'].map(cat => {
            const catBadges = badges.filter(b => b.category === cat)
            const catXP     = catBadges.filter(b => b.earned).reduce((s, b) => s + b.xp, 0)
            const catTotal  = catBadges.reduce((s, b) => s + b.xp, 0)
            const pct       = catTotal > 0 ? Math.round((catXP / catTotal) * 100) : 0
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-foreground">{cat}</span>
                  <span className="text-muted">{catXP} / {catTotal} XP</span>
                </div>
                <div className="h-2 bg-canvas rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
