import { useState, useEffect } from 'react'
import { Download, ChevronLeft, TrendingUp } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface GradeSummary {
  average_score: number | null
  grade_letter:  string | null
  subjects:      { name: string } | null
}

function gradeColor(g: string | null) {
  if (!g) return 'text-foreground'
  if (g.startsWith('A')) return 'text-green-600'
  if (g.startsWith('B')) return 'text-primary'
  return 'text-foreground'
}

function remarkFor(score: number) {
  if (score >= 90) return 'Outstanding'
  if (score >= 80) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Average'
  return 'Needs Improvement'
}

export default function ReportCardsPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [grades,    setGrades]    = useState<GradeSummary[]>([])
  const [childName, setChildName] = useState('')
  const [className, setClassName] = useState('')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => { if (profile?.id) loadData() }, [profile?.id])

  async function loadData() {
    setLoading(true)
    const childId = sessionStorage.getItem('learnora_selected_child') ?? profile!.id

    const [childRes, ceRes, gradeRes] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', childId).maybeSingle(),
      supabase.from('class_enrollments').select('classes(name)').eq('student_id', childId).limit(1).maybeSingle(),
      supabase.from('grade_summaries').select('average_score, grade_letter, subjects(name)').eq('student_id', childId),
    ])

    setChildName((childRes.data as { full_name: string | null } | null)?.full_name ?? '')
    const ce = ceRes.data as unknown as { classes: { name: string } | null } | null
    setClassName(ce?.classes?.name ?? '')
    setGrades((gradeRes.data ?? []) as unknown as GradeSummary[])
    setLoading(false)
  }

  const scores      = grades.map(g => g.average_score ?? 0).filter(s => s > 0)
  const avg         = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
  const overallGrade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B' : avg >= 60 ? 'C' : 'D'

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-5 pb-4">

        <button onClick={() => onNavigate('parent/home')} className="mb-4">
          <ChevronLeft size={22} />
        </button>

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-primary">Report Card</h1>
          <button className="flex items-center gap-1.5 h-9 px-3 border border-primary text-primary text-xs font-semibold rounded-full">
            <Download size={13} /> PDF
          </button>
        </div>
        <p className="text-xs text-muted mb-5">{childName}{className ? ` · ${className}` : ''}</p>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted">Loading…</div>
        ) : (
          <>
            <div className="bg-primary rounded-3xl p-5 mb-6">
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div>
                  <p className="text-2xl font-bold text-white">{avg > 0 ? `${avg}%` : '—'}</p>
                  <p className="text-[10px] text-white/70">Average</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{grades.length}</p>
                  <p className="text-[10px] text-white/70">Subjects</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{avg > 0 ? overallGrade : '—'}</p>
                  <p className="text-[10px] text-white/70">Overall Grade</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/15 rounded-2xl px-3 py-2">
                <TrendingUp size={13} className="text-white" />
                <p className="text-xs text-white">Academic performance this term</p>
              </div>
            </div>

            {grades.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">No report card data available yet.</p>
            ) : (
              <>
                <p className="text-base font-bold text-foreground mb-3">Subject Results</p>
                <div className="flex flex-col gap-2">
                  {grades.map((g, i) => {
                    const score   = g.average_score ?? 0
                    const grade   = g.grade_letter ?? '—'
                    const subject = g.subjects?.name ?? `Subject ${i + 1}`
                    return (
                      <div key={i} className="bg-white border border-black/6 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-foreground">{subject}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-base font-bold ${gradeColor(grade)}`}>{grade}</span>
                            <span className="text-sm font-semibold text-muted">{score > 0 ? `${score}%` : '—'}</span>
                          </div>
                        </div>
                        {score > 0 && (
                          <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                          </div>
                        )}
                        <p className="text-xs text-muted mt-1">{score > 0 ? remarkFor(score) : '—'}</p>
                      </div>
                    )
                  })}
                </div>

                <button className="w-full h-14 bg-primary text-white text-base font-bold rounded-2xl mt-6 flex items-center justify-center gap-2">
                  <Download size={16} /> Download Full Report
                </button>
              </>
            )}
          </>
        )}

      </div>
    </MobileLayout>
  )
}
