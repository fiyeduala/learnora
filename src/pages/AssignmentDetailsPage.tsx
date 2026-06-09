import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, BookOpen, Upload, CheckCircle2, X, FileText, AlertCircle } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type Props = { onNavigate: (page: string) => void }
type View = 'details' | 'submit' | 'success'

interface AssignmentData {
  id:           string
  title:        string
  subjectName:  string
  className:    string
  dueDate:      string | null
  points:       number
  teacherName:  string
  instructions: string | null
  status:       'Pending' | 'Completed' | 'Overdue'
}

function fmtDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusCls: Record<string, string> = {
  Pending:   'bg-amber-50 text-amber-700',
  Completed: 'bg-green-50 text-green-700',
  Overdue:   'bg-red-50 text-red-700',
}

export default function AssignmentDetailsPage({ onNavigate }: Props) {
  const { profile }  = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)

  const [view,       setView]       = useState<View>('details')
  const [assignment, setAssignment] = useState<AssignmentData | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [note,       setNote]       = useState('')
  const [files,      setFiles]      = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  useEffect(() => { if (profile?.id) loadAssignment() }, [profile?.id])

  async function loadAssignment() {
    setLoading(true)
    const studentId    = profile!.id
    let assignmentId   = localStorage.getItem('learnora_selected_assignment')

    if (!assignmentId) {
      const { data: ceData } = await supabase
        .from('class_enrollments').select('class_id').eq('student_id', studentId)
      const classIds = (ceData ?? []).map((e: { class_id: string }) => e.class_id)
      if (classIds.length > 0) {
        const { data: aData } = await supabase
          .from('assignments').select('id').in('class_id', classIds)
          .eq('is_published', true).order('due_date', { ascending: true }).limit(1).maybeSingle()
        if (aData) {
          assignmentId = (aData as { id: string }).id
          localStorage.setItem('learnora_selected_assignment', assignmentId)
        }
      }
    }

    if (!assignmentId) { setLoading(false); return }
    await loadById(assignmentId, studentId)
  }

  async function loadById(assignmentId: string, studentId: string) {
    const { data } = await supabase
      .from('assignments')
      .select('id, title, due_date, max_score, instructions, subjects(name), classes(name), profiles!teacher_id(full_name)')
      .eq('id', assignmentId)
      .maybeSingle()

    if (!data) { setLoading(false); return }

    const raw = data as unknown as {
      id: string; title: string; due_date: string | null
      max_score: number | null; instructions: string | null
      subjects: { name: string } | null
      classes:  { name: string } | null
      profiles: { full_name: string | null } | null
    }

    const { data: subData } = await supabase
      .from('assignment_submissions')
      .select('status')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .maybeSingle()

    let status: 'Pending' | 'Completed' | 'Overdue'
    if (subData) {
      status = 'Completed'
    } else if (raw.due_date && new Date(raw.due_date) < new Date()) {
      status = 'Overdue'
    } else {
      status = 'Pending'
    }

    setAssignment({
      id:           raw.id,
      title:        raw.title,
      subjectName:  raw.subjects?.name ?? '—',
      className:    raw.classes?.name ?? '—',
      dueDate:      raw.due_date,
      points:       raw.max_score ?? 100,
      teacherName:  raw.profiles?.full_name ?? '—',
      instructions: raw.instructions,
      status,
    })
    setLoading(false)
  }

  async function submitAssignment() {
    if (!assignment) return
    setSubmitting(true)
    setError('')

    const { error: err } = await supabase
      .from('assignment_submissions')
      .upsert({
        school_id:       profile!.school_id!,
        assignment_id:   assignment.id,
        student_id:      profile!.id,
        submission_text: note.trim() || null,
        status:          'submitted',
        submitted_at:    new Date().toISOString(),
      }, { onConflict: 'assignment_id,student_id' })

    setSubmitting(false)
    if (err) { setError(err.message); return }
    setView('success')
  }

  if (loading) {
    return (
      <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Assignment Details" user={sidebarUser}>
        <p className="text-sm text-muted py-8">Loading…</p>
      </DashboardLayout>
    )
  }

  if (!assignment) {
    return (
      <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Assignment Details" user={sidebarUser}>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <AlertCircle size={32} className="text-muted opacity-40" />
          <p className="text-sm text-muted">Assignment not found.</p>
          <button
            onClick={() => onNavigate('assignments')}
            className="h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill"
          >
            Back to Assignments
          </button>
        </div>
      </DashboardLayout>
    )
  }

  if (view === 'success') {
    return (
      <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Assignment Submitted" user={sidebarUser}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="size-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Submitted Successfully!</h1>
          <p className="text-sm text-muted max-w-[380px] leading-relaxed mb-2">
            Your assignment <span className="font-semibold text-foreground">{assignment.title}</span> has been submitted.
          </p>
          <p className="text-xs text-muted mb-8">
            Submitted · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('assignments')}
              className="h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
            >
              Back to Assignments
            </button>
            <button
              onClick={() => { setView('details'); setAssignment(a => a ? { ...a, status: 'Completed' } : a) }}
              className="h-11 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:bg-canvas transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (view === 'submit') {
    return (
      <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Submit Assignment" user={sidebarUser}>
        <div className="max-w-[700px] flex flex-col gap-6">
          <button
            onClick={() => setView('details')}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back to Details
          </button>

          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground mb-1">{assignment.title}</h2>
            <p className="text-sm text-muted mb-5">{assignment.subjectName} · Due {fmtDate(assignment.dueDate)}</p>

            {/* File attachment zone (UI only — storage not yet wired) */}
            <div
              className="border-2 border-dashed border-black/20 rounded-card p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/4 transition-colors mb-4"
              onClick={() => setFiles(f => [...f, `Attachment_${f.length + 1}.pdf`])}
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={22} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Click to attach a file (optional)</p>
                <p className="text-xs text-muted mt-1">PDF, DOC, DOCX — max 50 MB</p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="flex flex-col gap-2 mb-5">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-canvas rounded-card px-4 py-3">
                    <FileText size={16} className="text-primary shrink-0" />
                    <span className="text-sm text-foreground flex-1">{f}</span>
                    <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                      <X size={14} className="text-muted hover:text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="block text-sm font-semibold text-foreground mb-2">Your answer / note to teacher</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={4}
              placeholder="Type your answer or add a note for your teacher…"
              className="w-full border border-black/20 rounded-card px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none transition-colors"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            disabled={submitting || (!note.trim() && files.length === 0)}
            onClick={submitAssignment}
            className="h-12 bg-primary text-white text-sm font-bold rounded-pill shadow-primary hover:bg-primary-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit Assignment'}
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const instructionText = assignment.instructions ?? ''
  const instructionParts = instructionText.split('\n').filter(Boolean)

  return (
    <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Assignment Details" user={sidebarUser}>
      <div className="max-w-[780px] flex flex-col gap-5">
        <button
          onClick={() => onNavigate('assignments')}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Assignments
        </button>

        {/* Header card */}
        <div className="bg-primary rounded-card p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">{assignment.subjectName}</span>
              <h1 className="text-xl font-bold mt-3 mb-1">{assignment.title}</h1>
              <p className="text-white/70 text-sm">{assignment.className} · {assignment.teacherName}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-bold">{assignment.points}</p>
              <p className="text-white/70 text-xs">points</p>
            </div>
          </div>
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={14} />
              <span>{fmtDate(assignment.dueDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock size={14} />
              <span>11:59 PM</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {instructionText ? (
              <div className="bg-surface rounded-card shadow-sm p-6">
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" /> Instructions
                </h2>
                {instructionParts.length > 1 ? (
                  <ul className="flex flex-col gap-2.5">
                    {instructionParts.map((inst, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted">
                        <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {inst}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{instructionText}</p>
                )}
              </div>
            ) : (
              <div className="bg-surface rounded-card shadow-sm p-6">
                <p className="text-sm text-muted">No instructions provided for this assignment.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Status */}
            <div className="bg-surface rounded-card shadow-sm p-5">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Status</p>
              <span className={`inline-flex items-center gap-2 h-8 px-3 text-xs font-semibold rounded-full ${statusCls[assignment.status]}`}>
                <span className="size-1.5 rounded-full bg-current" />{assignment.status}
              </span>
            </div>

            {/* Submit CTA */}
            {assignment.status !== 'Completed' && (
              <button
                onClick={() => setView('submit')}
                className="w-full h-12 bg-primary text-white text-sm font-bold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
              >
                Submit Assignment
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
