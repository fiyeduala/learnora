import { useState, useEffect } from 'react'
import { Bell, Settings, ChevronRight, AlertCircle, ChevronDown } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface ChildData {
  id:        string
  name:      string
  className: string
  gpa:       string
  feeOwed:   boolean
  feeAmt:    string
  feeDue:    string
  subjects:  { name: string; avgScore: number; grade: string }[]
}

const quickActions = [
  { label: 'Academic\nProgress', color: 'bg-red-100 text-red-600',    page: 'parent/progress',     emoji: '📊' },
  { label: 'Report\nCard',       color: 'bg-blue-100 text-blue-600',  page: 'parent/report-cards', emoji: '📄' },
  { label: 'Attendance',         color: 'bg-pink-100 text-pink-600',  page: 'parent/attendance',   emoji: '✅' },
  { label: 'Messages',           color: 'bg-green-100 text-green-600',page: 'parent/chat',         emoji: '💬' },
]

function fmt(n: number) { return '₦' + n.toLocaleString('en-NG') }

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ParentHomePage({ onNavigate }: Props) {
  const { profile } = useAuth()

  const [children,       setChildren]       = useState<ChildData[]>([])
  const [selectedIdx,    setSelectedIdx]    = useState(0)
  const [pickerOpen,     setPickerOpen]     = useState(false)
  const [loading,        setLoading]        = useState(true)

  const parentFirstName = profile?.full_name?.split(' ')[0] ?? 'Parent'

  useEffect(() => { if (profile?.id) loadChildren() }, [profile?.id])

  async function loadChildren() {
    setLoading(true)
    const parentId = profile!.id
    const schoolId = profile!.school_id!

    const { data: linkData } = await supabase
      .from('parent_student_links')
      .select('student_id')
      .eq('parent_id', parentId)
      .eq('school_id', schoolId)

    const studentIds = (linkData ?? []).map((l: { student_id: string }) => l.student_id)
    if (!studentIds.length) { setLoading(false); return }

    const [profilesRes, enrollRes, gradeRes, invoiceRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name').in('id', studentIds),
      supabase.from('class_enrollments')
        .select('student_id, class_id, classes(name)')
        .in('student_id', studentIds),
      supabase.from('grade_summaries')
        .select('student_id, average_score, grade_letter, subjects(name)')
        .in('student_id', studentIds),
      supabase.from('invoices')
        .select('student_id, amount, status, due_date')
        .in('student_id', studentIds)
        .eq('school_id', schoolId),
    ])

    const profileMap: Record<string, string> = {}
    for (const p of (profilesRes.data ?? []) as { id: string; full_name: string | null }[]) {
      profileMap[p.id] = p.full_name ?? 'Student'
    }

    const classMap: Record<string, string> = {}
    for (const e of (enrollRes.data ?? []) as unknown as { student_id: string; classes: { name: string } | null }[]) {
      if (!classMap[e.student_id]) classMap[e.student_id] = e.classes?.name ?? '—'
    }

    const gradesByStudent: Record<string, { name: string; avgScore: number; grade: string }[]> = {}
    for (const g of (gradeRes.data ?? []) as unknown as {
      student_id: string; average_score: number | null; grade_letter: string | null
      subjects: { name: string } | null
    }[]) {
      if (!gradesByStudent[g.student_id]) gradesByStudent[g.student_id] = []
      if (g.subjects?.name) {
        gradesByStudent[g.student_id].push({
          name:     g.subjects.name,
          avgScore: g.average_score ?? 0,
          grade:    g.grade_letter ?? '—',
        })
      }
    }

    const invoicesByStudent: Record<string, { amount: number; status: string; due_date: string | null }[]> = {}
    for (const inv of (invoiceRes.data ?? []) as {
      student_id: string; amount: string | number; status: string; due_date: string | null
    }[]) {
      if (!invoicesByStudent[inv.student_id]) invoicesByStudent[inv.student_id] = []
      invoicesByStudent[inv.student_id].push({
        amount:   parseFloat(String(inv.amount)),
        status:   inv.status,
        due_date: inv.due_date,
      })
    }

    const kids: ChildData[] = studentIds.map(id => {
      const grades    = gradesByStudent[id] ?? []
      const invoices  = invoicesByStudent[id] ?? []
      const gpaScore  = grades.length
        ? parseFloat((grades.reduce((s, g) => s + g.avgScore, 0) / grades.length / 20).toFixed(1))
        : null

      const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'waived')
      const totalOwed      = unpaidInvoices.reduce((s, inv) => s + inv.amount, 0)
      const nearestDue     = unpaidInvoices.reduce((nearest: string | null, inv) => {
        if (!inv.due_date) return nearest
        if (!nearest || inv.due_date < nearest) return inv.due_date
        return nearest
      }, null)

      return {
        id,
        name:      profileMap[id] ?? 'Student',
        className: classMap[id] ?? '—',
        gpa:       gpaScore !== null ? gpaScore.toString() : '—',
        feeOwed:   totalOwed > 0,
        feeAmt:    totalOwed > 0 ? fmt(totalOwed) : '',
        feeDue:    nearestDue ? fmtDate(nearestDue) : '',
        subjects:  grades.slice(0, 4),
      }
    })

    setChildren(kids)
    if (kids.length > 0) {
      localStorage.setItem('learnora_selected_child', kids[0].id)
    }
    setLoading(false)
  }

  const child = children[selectedIdx]

  function selectChild(i: number) {
    setSelectedIdx(i)
    setPickerOpen(false)
    if (children[i]) localStorage.setItem('learnora_selected_child', children[i].id)
  }

  function goToProgress() {
    if (child) localStorage.setItem('learnora_selected_child', child.id)
    onNavigate('parent/progress')
  }
  function goToFees() {
    if (child) localStorage.setItem('learnora_selected_child', child.id)
    onNavigate('parent/fees')
  }

  if (loading) {
    return (
      <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
        <div className="px-5 pt-6">
          <p className="text-sm text-muted">Loading…</p>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-5 pt-6 pb-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted">Good Morning, <span className="font-bold text-foreground">{parentFirstName}</span></p>
            <p className="text-xs text-muted/70">Track your children's progress.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('parent/notifications')}
              className="size-9 rounded-full border border-black/10 flex items-center justify-center">
              <Bell size={16} />
            </button>
            <button onClick={() => onNavigate('parent/profile')}
              className="size-9 rounded-full border border-black/10 flex items-center justify-center">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {children.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted">No linked children found.</p>
            <p className="text-xs text-muted mt-1">Contact the school to link your child's account.</p>
          </div>
        ) : (
          <>
            {/* Child switcher */}
            {children.length > 1 && (
              <div className="relative mb-4">
                <button
                  onClick={() => setPickerOpen(p => !p)}
                  className="w-full flex items-center justify-between gap-2 h-10 px-4 bg-canvas border border-black/10 rounded-pill text-sm font-semibold text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {child.name.charAt(0)}
                    </span>
                    <span>{child.name.split(' ')[0]}</span>
                    <span className="text-xs text-muted font-normal">· {child.className}</span>
                  </span>
                  <ChevronDown size={14} className={`text-muted transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
                </button>
                {pickerOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setPickerOpen(false)} />
                    <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-card shadow-xl border border-black/8 py-1.5 z-20">
                      {children.map((c, i) => (
                        <button key={c.id} onClick={() => selectChild(i)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${selectedIdx === i ? 'bg-primary/5 text-primary' : 'hover:bg-canvas text-foreground'}`}>
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-xs text-muted">{c.className}</p>
                          </div>
                          {selectedIdx === i && <span className="ml-auto text-xs font-bold text-primary">Active</span>}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Child card */}
            <div className="bg-primary rounded-3xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-full bg-white/30 flex items-center justify-center text-xl font-bold text-white">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{child.name}</p>
                  <p className="text-xs text-white/70">{child.className}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'GPA',     value: child.gpa    },
                  { label: 'Subjects',value: child.subjects.length > 0 ? child.subjects.length.toString() : '—' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-xs font-bold text-white truncate">{s.value}</p>
                    <p className="text-[9px] text-white/70">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-base font-bold text-foreground">Quick Actions</p>
              <button onClick={() => onNavigate('parent/fees')} className="text-xs text-primary font-medium">View All</button>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {quickActions.map(a => (
                <button key={a.label} onClick={() => {
                  if (child) localStorage.setItem('learnora_selected_child', child.id)
                  onNavigate(a.page)
                }} className="flex flex-col items-center gap-2">
                  <div className={`size-14 rounded-2xl ${a.color} flex items-center justify-center`}>
                    <span className="text-xl">{a.emoji}</span>
                  </div>
                  <p className="text-[10px] font-medium text-foreground text-center leading-tight whitespace-pre-line">{a.label}</p>
                </button>
              ))}
            </div>

            {/* Performance Overview */}
            {child.subjects.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-bold text-foreground">Performance Overview</p>
                  <button className="text-xs text-primary font-medium" onClick={goToProgress}>View All</button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {child.subjects.map((s, i) => {
                    const colors = ['bg-blue-50', 'bg-green-50', 'bg-amber-50', 'bg-purple-50']
                    return (
                      <button key={i} onClick={goToProgress} className={`${colors[i % colors.length]} rounded-2xl p-4 text-left`}>
                        <p className="text-xs text-muted mb-1">{s.name}</p>
                        <p className="text-2xl font-bold text-foreground">{s.grade}</p>
                        <div className="mt-2">
                          <div className="h-1.5 bg-black/8 rounded-full">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${s.avgScore}%` }} />
                          </div>
                        </div>
                        <p className="text-xs text-muted mt-1">{s.avgScore}%</p>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* Fee alert */}
            {child.feeOwed ? (
              <button onClick={goToFees}
                className="w-full mt-2 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3.5 text-left">
                <div className="size-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle size={17} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-amber-800">Fee Payment Incomplete</p>
                  <p className="text-xs text-amber-700">
                    {child.feeAmt} outstanding{child.feeDue ? ` · Due ${child.feeDue}` : ''}
                  </p>
                </div>
                <ChevronRight size={15} className="text-amber-600 shrink-0" />
              </button>
            ) : (
              <div className="w-full mt-2 flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5">
                <div className="size-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <span className="text-sm">✅</span>
                </div>
                <p className="text-sm font-semibold text-green-700">School fees fully paid for this term</p>
              </div>
            )}
          </>
        )}

      </div>
    </MobileLayout>
  )
}
