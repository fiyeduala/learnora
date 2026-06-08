import { useState } from 'react'
import { ArrowLeft, Calendar, Clock, BookOpen, Paperclip, Upload, CheckCircle2, X, FileText } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

type View = 'details' | 'submit' | 'success'

const assignment = {
  title: "Newton's Laws of Motion — Essay",
  subject: 'Physics',
  class: 'SS1A',
  dueDate: 'Jun 12, 2026',
  dueTime: '11:59 PM',
  points: 100,
  status: 'pending' as const,
  teacher: 'Mr Adeyemi Johnson',
  description:
    'Write a comprehensive essay (800–1,000 words) explaining Newton\'s Three Laws of Motion. Include at least two real-world examples for each law, and explain how these laws apply to everyday phenomena.',
  instructions: [
    'Minimum 800 words, maximum 1,000 words',
    'Include diagrams or illustrations where relevant',
    'Cite at least 3 credible sources (APA format)',
    'Submit as a PDF or Word document',
    'Late submissions will lose 10 points per day',
  ],
  attachments: [
    { name: 'Essay_Guidelines.pdf', size: '245 KB' },
    { name: 'APA_Citation_Guide.pdf', size: '180 KB' },
  ],
}

export default function AssignmentDetailsPage({ onNavigate }: Props) {
  const [view, setView] = useState<View>('details')
  const [files, setFiles] = useState<string[]>([])
  const [note, setNote] = useState('')

  if (view === 'success') {
    return (
      <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Assignment Submitted">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="size-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
            <CheckCircle2 size={44} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Submitted Successfully!</h1>
          <p className="text-sm text-muted max-w-[380px] leading-relaxed mb-2">
            Your assignment <span className="font-semibold text-foreground">{assignment.title}</span> has been submitted.
          </p>
          <p className="text-xs text-muted mb-8">Submitted · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('assignments')}
              className="h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
            >
              Back to Assignments
            </button>
            <button
              onClick={() => setView('details')}
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
      <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Submit Assignment">
        <div className="max-w-[700px] flex flex-col gap-6">
          <button
            onClick={() => setView('details')}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft size={16} /> Back to Details
          </button>

          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-lg font-bold text-foreground mb-1">{assignment.title}</h2>
            <p className="text-sm text-muted mb-5">{assignment.subject} · Due {assignment.dueDate} at {assignment.dueTime}</p>

            {/* Upload zone */}
            <div
              className="border-2 border-dashed border-black/20 rounded-card p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/4 transition-colors mb-4"
              onClick={() => setFiles(f => [...f, `Essay_Draft_v${f.length + 1}.pdf`])}
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload size={22} className="text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Click to upload your file</p>
                <p className="text-xs text-muted mt-1">PDF, DOC, DOCX — max 50 MB</p>
              </div>
            </div>

            {/* File list */}
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

            {/* Optional note */}
            <label className="block text-sm font-semibold text-foreground mb-2">Note to teacher (optional)</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Add any comments or notes for your teacher..."
              className="w-full border border-black/20 rounded-card px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary resize-none transition-colors"
            />
          </div>

          <button
            disabled={files.length === 0}
            onClick={() => setView('success')}
            className="h-12 bg-primary text-white text-sm font-bold rounded-pill shadow-primary hover:bg-primary-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Assignment
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activePage="assignments" onNavigate={onNavigate} title="Assignment Details">
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
              <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">{assignment.subject}</span>
              <h1 className="text-xl font-bold mt-3 mb-1">{assignment.title}</h1>
              <p className="text-white/70 text-sm">{assignment.class} · {assignment.teacher}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-bold">{assignment.points}</p>
              <p className="text-white/70 text-xs">points</p>
            </div>
          </div>
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Calendar size={14} />
              <span>{assignment.dueDate}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock size={14} />
              <span>{assignment.dueTime}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Description */}
            <div className="bg-surface rounded-card shadow-sm p-6">
              <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-primary" /> Description
              </h2>
              <p className="text-sm text-muted leading-relaxed">{assignment.description}</p>
            </div>

            {/* Instructions */}
            <div className="bg-surface rounded-card shadow-sm p-6">
              <h2 className="text-base font-bold text-foreground mb-3">Instructions</h2>
              <ul className="flex flex-col gap-2.5">
                {assignment.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {inst}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Status */}
            <div className="bg-surface rounded-card shadow-sm p-5">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Status</p>
              <span className="inline-flex items-center gap-2 h-8 px-3 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">
                <span className="size-1.5 rounded-full bg-amber-500" /> Pending
              </span>
            </div>

            {/* Attachments */}
            {assignment.attachments.length > 0 && (
              <div className="bg-surface rounded-card shadow-sm p-5">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Paperclip size={12} /> Attachments
                </p>
                <div className="flex flex-col gap-2">
                  {assignment.attachments.map((a, i) => (
                    <button key={i} className="flex items-center gap-3 p-3 bg-canvas rounded-card hover:bg-primary/8 transition-colors text-left w-full">
                      <FileText size={14} className="text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{a.name}</p>
                        <p className="text-xs text-muted">{a.size}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <button
              onClick={() => setView('submit')}
              className="w-full h-12 bg-primary text-white text-sm font-bold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
            >
              Submit Assignment
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
