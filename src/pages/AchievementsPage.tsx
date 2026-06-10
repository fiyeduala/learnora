import { useState, useEffect } from 'react'
import { Award, Star, Lock, Trophy } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

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

// Static badge catalog — earned status derived from DB activity
const BADGE_CATALOG: Omit<Badge, 'earned' | 'earnedDate'>[] = [
  { id: 'first_login',    title: 'First Login',        description: 'Logged in for the first time',               icon: '🚀', category: 'Milestones',    xp: 50   },
  { id: 'course_done',    title: 'Course Completer',   description: 'Completed your first full lesson',            icon: '📗', category: 'Learning',      xp: 200  },
  { id: 'streak_7',       title: '7-Day Streak',       description: 'Studied every day for a week',               icon: '🔥', category: 'Consistency',   xp: 150  },
  { id: 'top_class',      title: 'Top of the Class',   description: 'Ranked #1 in your class leaderboard',        icon: '🥇', category: 'Excellence',    xp: 500  },
  { id: 'forum_post',     title: 'Forum Starter',      description: 'Posted your first discussion thread',        icon: '💬', category: 'Collaboration', xp: 100  },
  { id: 'streak_30',      title: '30-Day Streak',      description: 'Studied every day for a month',              icon: '📅', category: 'Consistency',   xp: 500  },
  { id: 'five_subjects',  title: 'Polymath',           description: 'Completed lessons in 5 different subjects',  icon: '🧠', category: 'Learning',      xp: 600  },
  { id: 'goal_crusher',   title: 'Goal Crusher',       description: 'Completed all academic goals for a term',    icon: '🎯', category: 'Excellence',    xp: 350  },
]

const categories = ['All', 'Milestones', 'Learning', 'Consistency', 'Excellence', 'Collaboration']

const db = supabase as unknown as { from: (t: string) => any }

export default function AchievementsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const sidebarUser = profileToSidebarUser(profile)

  const [badges, setBadges]   = useState<Badge[]>([])
  const [tab,    setTab]      = useState('All')
  const [loading,setLoading]  = useState(true)

  useEffect(() => { if (profile?.id) deriveAchievements() }, [profile?.id])

  async function deriveAchievements() {
    setLoading(true)
    const sid      = profile!.id
    const schoolId = profile!.school_id!

    const [lpRes, gsRes, forumRes, goalsRes] = await Promise.all([
      supabase.from('lesson_progress').select('completed_at, lesson_id').eq('student_id', sid).eq('completed', true).not('completed_at', 'is', null).order('completed_at', { ascending: true }),
      supabase.from('grade_summaries').select('subject_id').eq('student_id', sid).eq('school_id', schoolId),
      db.from('forum_threads').select('id').eq('author_id', sid).limit(1),
      db.from('student_goals').select('id').eq('student_id', sid).eq('done', true).limit(1),
    ])

    const lpRows = (lpRes.data ?? []) as { completed_at: string; lesson_id: string }[]
    const gsRows = (gsRes.data ?? []) as { subject_id: string }[]
    const forumRows = (forumRes.data ?? []) as { id: string }[]
    const goalRows  = (goalsRes.data ?? []) as { id: string }[]

    // Streak from completed_at dates
    const days = new Set(lpRows.map(r => r.completed_at.slice(0, 10)))
    const today = new Date()
    let streak = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      if (days.has(d.toISOString().slice(0, 10))) streak++
      else if (i > 0) break
    }

    const joined = (profile as any).created_at ? new Date((profile as any).created_at as string).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
    const firstLesson = lpRows[0]?.completed_at ? new Date(lpRows[0].completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

    const result: Badge[] = BADGE_CATALOG.map(b => {
      let earned = false
      let earnedDate: string | undefined

      if (b.id === 'first_login')   { earned = true; earnedDate = joined }
      if (b.id === 'course_done')   { earned = lpRows.length > 0; earnedDate = firstLesson }
      if (b.id === 'streak_7')      { earned = streak >= 7 }
      if (b.id === 'streak_30')     { earned = streak >= 30 }
      if (b.id === 'top_class')     { earned = false }
      if (b.id === 'forum_post')    { earned = forumRows.length > 0 }
      if (b.id === 'five_subjects') { earned = new Set(gsRows.map(g => g.subject_id)).size >= 5 }
      if (b.id === 'goal_crusher')  { earned = goalRows.length > 0 }

      return { ...b, earned, earnedDate }
    })

    setBadges(result)
    setLoading(false)
  }

  const filtered   = tab === 'All' ? badges : badges.filter(b => b.category === tab)
  const totalXP    = badges.filter(b => b.earned).reduce((s, b) => s + b.xp, 0)
  const earnedCount = badges.filter(b => b.earned).length
  const level = Math.floor(totalXP / 500) + 1

  return (
    <DashboardLayout
      activePage="profile"
      onNavigate={onNavigate}
      title="Achievements"
      subtitle="Badges and milestones you've unlocked"
      user={sidebarUser}
    >
      {loading ? (
        <div className="text-center py-16 text-sm text-muted">Loading achievements…</div>
      ) : <>
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
            <p className="text-xs font-semibold opacity-70">Level {level}</p>
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
      </>}
    </DashboardLayout>
  )
}
