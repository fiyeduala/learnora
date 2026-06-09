import { useState, useEffect } from 'react'
import { ChevronLeft, TrendingUp } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

interface SubjectStat {
  name:        string
  avgScore:    number
  gradeLetter: string
}

function BarChart({ scores }: { scores: number[] }) {
  if (!scores.length) return null
  const max = Math.max(...scores, 50)
  const w = 280; const h = 80
  const barW = Math.max(20, (w - (scores.length - 1) * 6) / scores.length)
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {scores.map((s, i) => {
        const bh = Math.round((s / max) * h)
        const x  = i * (barW + 6)
        return <rect key={i} x={x} y={h - bh} width={barW} height={bh} rx="3" fill="#4b75ff" opacity={0.8} />
      })}
    </svg>
  )
}

export default function ParentProgressPage({ onNavigate }: Props) {
  const { profile }  = useAuth()
  const [childName,  setChildName]  = useState('Child')
  const [className,  setClassName]  = useState('')
  const [subjects,   setSubjects]   = useState<SubjectStat[]>([])
  const [avgGPA,     setAvgGPA]     = useState<number | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [noChild,    setNoChild]    = useState(false)

  useEffect(() => { if (profile?.school_id) loadProgress() }, [profile?.school_id])

  async function loadProgress() {
    setLoading(true)
    const childId = localStorage.getItem('learnora_selected_child')
    if (!childId) { setNoChild(true); setLoading(false); return }

    // Guard: verify child belongs to this school
    const { data: childCheck } = await supabase
      .from('profiles').select('id').eq('id', childId).eq('school_id', profile!.school_id).maybeSingle()
    if (!childCheck) { setLoading(false); return }

    const [profileRes, enrollRes, gradeRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', childId).maybeSingle(),
      supabase.from('class_enrollments')
        .select('class_id, classes(name)')
        .eq('student_id', childId)
        .limit(1)
        .maybeSingle(),
      supabase.from('grade_summaries')
        .select('average_score, grade_letter, subjects(name)')
        .eq('student_id', childId),
    ])

    if (profileRes.data) {
      const p = profileRes.data as unknown as { full_name: string | null }
      setChildName(p.full_name ?? 'Child')
    }

    if (enrollRes.data) {
      const e = enrollRes.data as unknown as { classes: { name: string } | null }
      setClassName(e.classes?.name ?? '')
    }

    const rawGrades = (gradeRes.data ?? []) as unknown as {
      average_score: number | null; grade_letter: string | null
      subjects: { name: string } | null
    }[]

    const stats: SubjectStat[] = rawGrades
      .filter(g => g.subjects?.name)
      .map(g => ({
        name:        g.subjects!.name,
        avgScore:    g.average_score ?? 0,
        gradeLetter: g.grade_letter ?? '—',
      }))

    if (stats.length > 0) {
      const mean = stats.reduce((s, g) => s + g.avgScore, 0) / stats.length
      setAvgGPA(parseFloat((mean / 20).toFixed(1)))
    }
    setSubjects(stats)
    setLoading(false)
  }

  const scores = subjects.map(s => s.avgScore)

  return (
    <MobileLayout activePage="parent/progress" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => onNavigate('parent/home')}><ChevronLeft size={22} /></button>
          <div className="flex items-center gap-2 border border-black/12 rounded-full px-3 py-1.5">
            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {childName.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground leading-none">{childName}</p>
              {className && <p className="text-[9px] text-muted">{className}</p>}
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary mt-3 mb-1">Progress Tracking</h1>
        <p className="text-xs text-muted mb-5">Track your child's academic growth and performance trends.</p>

        {loading ? (
          <p className="text-sm text-muted text-center py-10">Loading…</p>
        ) : noChild ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-foreground">No child selected</p>
            <p className="text-xs text-muted mt-1">Go back to the home screen and select a child first.</p>
            <button onClick={() => onNavigate('parent/home')}
              className="mt-4 h-9 px-5 bg-primary text-white text-sm font-semibold rounded-pill">
              Go to Home
            </button>
          </div>
        ) : (
          <>
            {/* Academic Growth card */}
            <div className="bg-white border border-black/8 rounded-2xl p-4 shadow-sm mb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-foreground">Subject Performance</p>
                <div className="flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                  <TrendingUp size={10} /> Overview
                </div>
              </div>

              {avgGPA !== null && (
                <div className="flex items-end gap-2 mb-2">
                  <p className="text-3xl font-bold text-foreground">{avgGPA}</p>
                  <p className="text-base text-muted mb-1">/5.0 GPA</p>
                </div>
              )}

              {scores.length > 0 ? (
                <div className="mt-3">
                  <BarChart scores={scores} />
                  <div className="flex justify-between mt-1 overflow-hidden">
                    {subjects.map(s => (
                      <span key={s.name} className="text-[8px] text-muted truncate text-center flex-1">{s.name.substring(0, 4)}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted py-4 text-center">No grade data yet.</p>
              )}
            </div>

            {/* Subject breakdown */}
            {subjects.length > 0 && (
              <>
                <p className="text-base font-bold text-foreground mb-3">Subject Grades</p>
                <div className="flex flex-col gap-2 mb-5">
                  {subjects.map(s => (
                    <div key={s.name} className="bg-white border border-black/6 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{s.name}</p>
                        <div className="h-1.5 bg-black/8 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${s.avgScore}%` }} />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-foreground">{s.gradeLetter}</p>
                        <p className="text-[10px] text-muted">{s.avgScore}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Quick Stats */}
            <p className="text-base font-bold text-foreground mb-3">Quick Stats</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'GPA',     value: avgGPA !== null ? avgGPA.toString() : '—',     sub: 'Based on grade summaries',   color: 'bg-green-100 text-green-700'  },
                { label: 'Subjects',value: subjects.length.toString(),                     sub: 'Tracked this term',          color: 'bg-blue-100 text-blue-700'    },
              ].map(s => (
                <div key={s.label} className="bg-white border border-black/6 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-xs text-muted">{s.label}</p>
                    <div className={`size-8 rounded-xl ${s.color} flex items-center justify-center`}>
                      <span className="text-xs font-bold">{s.label.charAt(0)}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground mb-0.5">{s.value}</p>
                  <p className="text-[10px] text-muted">{s.sub}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  )
}
