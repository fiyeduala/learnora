import { useState } from 'react'
import { Upload, FileText, Video, Link, BookOpen, Clock, CheckCircle2, XCircle, Filter, Plus } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }
type Status = 'approved' | 'pending' | 'rejected'

interface Resource {
  id: number; title: string; type: 'pdf' | 'video' | 'link' | 'doc'
  subject: string; class: string; size: string
  status: Status; uploadedAt: string; note?: string
}

const myResources: Resource[] = [
  { id: 1, title: 'Physics Textbook — SS2 (PDF)',         type: 'pdf',   subject: 'Physics',     class: 'SS2A', size: '8.4 MB',  status: 'approved', uploadedAt: 'Jun 1, 2026' },
  { id: 2, title: 'Newton\'s Laws — Lecture Video',        type: 'video', subject: 'Physics',     class: 'SS2A', size: '180 MB', status: 'approved', uploadedAt: 'Jun 2, 2026' },
  { id: 3, title: 'Khan Academy — Quadratics',            type: 'link',  subject: 'Mathematics', class: 'SS1A', size: '—',      status: 'approved', uploadedAt: 'Jun 3, 2026' },
  { id: 4, title: 'Physics Past Questions 2025',          type: 'pdf',   subject: 'Physics',     class: 'SS3A', size: '2.1 MB', status: 'pending',  uploadedAt: 'Jun 7, 2026' },
  { id: 5, title: 'Forces — Animated Explainer',         type: 'video', subject: 'Physics',     class: 'SS2B', size: '240 MB', status: 'pending',  uploadedAt: 'Jun 7, 2026' },
  { id: 6, title: 'Copyrighted Textbook (rejected)',      type: 'pdf',   subject: 'Physics',     class: 'SS2A', size: '14 MB',  status: 'rejected', uploadedAt: 'May 30, 2026', note: 'Copyright issue — please upload an open-access version.' },
]

const typeIcon = { pdf: FileText, video: Video, link: Link, doc: BookOpen }
const typeColor: Record<string, string> = {
  pdf:   'bg-red-50 text-red-600',
  video: 'bg-primary/10 text-primary',
  link:  'bg-green-50 text-green-700',
  doc:   'bg-amber-50 text-amber-700',
}
const statusStyle: Record<Status, string> = {
  approved: 'bg-green-50 text-green-700',
  pending:  'bg-amber-50 text-amber-700',
  rejected: 'bg-red-50 text-red-600',
}
const statusIcon = { approved: CheckCircle2, pending: Clock, rejected: XCircle }

const subjects = ['All', 'Physics', 'Mathematics', 'English', 'Government']
const classes  = ['All', 'SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B']

export default function TeacherResourcesPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [filter,     setFilter]     = useState<Status | 'all'>('all')
  const [subject,    setSubject]    = useState('All')
  const [showUpload, setShowUpload] = useState(false)
  const [uploaded,   setUploaded]   = useState(false)

  const [newTitle,   setNewTitle]   = useState('')
  const [newSubject, setNewSubject] = useState('Physics')
  const [newClass,   setNewClass]   = useState('SS2A')
  const [newType,    setNewType]    = useState<'pdf' | 'video' | 'link' | 'doc'>('pdf')
  const [newLink,    setNewLink]    = useState('')

  const visible = myResources.filter(r =>
    (filter === 'all' || r.status === filter) &&
    (subject === 'All' || r.subject === subject)
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setUploaded(true)
  }

  const counts = {
    approved: myResources.filter(r => r.status === 'approved').length,
    pending:  myResources.filter(r => r.status === 'pending').length,
    rejected: myResources.filter(r => r.status === 'rejected').length,
  }

  return (
    <DashboardLayout
      activePage="resources"
      onNavigate={onNavigate}
      title="Resources"
      subtitle="Upload teaching materials to the school library — approved by admin before students can access"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[1000px] flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Approved',  value: counts.approved, color: 'text-green-600 bg-green-50', status: 'approved' as const },
            { label: 'Pending Approval', value: counts.pending, color: 'text-amber-600 bg-amber-50', status: 'pending' as const },
            { label: 'Rejected',  value: counts.rejected, color: 'text-red-600 bg-red-50', status: 'rejected' as const },
          ].map(s => (
            <button
              key={s.label}
              onClick={() => setFilter(filter === s.status ? 'all' : s.status)}
              className={`bg-surface rounded-card shadow-sm p-5 text-left hover:shadow-md transition-all ${filter === s.status ? 'ring-2 ring-primary' : ''}`}
            >
              <p className={`text-3xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</p>
              <p className="text-sm text-muted mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 bg-canvas rounded-card p-1">
            {(['All', 'Physics', 'Mathematics'] as const).map(s => (
              <button key={s} onClick={() => setSubject(s)}
                className={`px-3 h-8 text-xs font-semibold rounded-md transition-colors ${subject === s ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'}`}>
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setShowUpload(true); setUploaded(false) }}
            className="flex items-center gap-1.5 h-9 px-4 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary ml-auto"
          >
            <Plus size={13} /> Upload Resource
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-primary/6 border border-primary/20 rounded-card p-4 flex items-start gap-3">
          <Clock size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary leading-relaxed">
            All uploaded materials are reviewed by the school admin before being made available to students. Approved resources appear in the student resource library automatically.
          </p>
        </div>

        {/* Resource list */}
        <div className="flex flex-col gap-3">
          {visible.map(r => {
            const Icon = typeIcon[r.type]
            const SIcon = statusIcon[r.status]
            return (
              <div key={r.id} className="bg-surface rounded-card shadow-sm p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className={`size-10 rounded-card flex items-center justify-center shrink-0 ${typeColor[r.type]}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground leading-snug">{r.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
                      <span>{r.subject}</span><span>·</span>
                      <span>{r.class}</span><span>·</span>
                      <span>{r.size}</span><span>·</span>
                      <span>{r.uploadedAt}</span>
                    </div>
                    {r.note && (
                      <p className="text-xs text-red-500 mt-1.5 leading-snug">{r.note}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyle[r.status]}`}>
                    <SIcon size={11} />
                    {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                  </div>
                </div>
              </div>
            )
          })}

          {visible.length === 0 && (
            <div className="text-center py-12 text-muted">
              <Filter size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No resources match the current filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowUpload(false)} />
          <div className="relative z-10 bg-white rounded-card shadow-xl w-full max-w-[480px]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/8">
              <h2 className="text-base font-bold text-foreground">Upload Resource</h2>
              <button onClick={() => setShowUpload(false)} className="text-muted hover:text-foreground">✕</button>
            </div>

            {uploaded ? (
              <div className="p-6 text-center">
                <div className="size-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <Clock size={24} className="text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Submitted for Review</h3>
                <p className="text-sm text-muted leading-relaxed mb-6">
                  Your resource has been submitted. The school admin will review and approve it before it becomes available to students. You'll be notified once approved.
                </p>
                <button onClick={() => setShowUpload(false)} className="h-10 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Resource Title <span className="text-red-500">*</span></label>
                  <input required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Physics Textbook SS2"
                    className="h-10 px-3 border border-black/20 rounded-input text-sm outline-none focus:border-primary" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Subject</label>
                    <select value={newSubject} onChange={e => setNewSubject(e.target.value)}
                      className="h-10 px-3 border border-black/20 rounded-input text-sm bg-white outline-none focus:border-primary">
                      {subjects.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">Class</label>
                    <select value={newClass} onChange={e => setNewClass(e.target.value)}
                      className="h-10 px-3 border border-black/20 rounded-input text-sm bg-white outline-none focus:border-primary">
                      {classes.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-foreground">Type</label>
                  <div className="flex gap-2">
                    {(['pdf', 'video', 'link', 'doc'] as const).map(t => {
                      const Icon = typeIcon[t]
                      return (
                        <button key={t} type="button" onClick={() => setNewType(t)}
                          className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-input border text-xs font-semibold transition-colors ${newType === t ? 'border-primary bg-primary/8 text-primary' : 'border-black/15 text-muted hover:border-primary/40'}`}>
                          <Icon size={14} />
                          {t.toUpperCase()}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {newType === 'link' ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-foreground">URL</label>
                    <input type="url" value={newLink} onChange={e => setNewLink(e.target.value)}
                      placeholder="https://..."
                      className="h-10 px-3 border border-black/20 rounded-input text-sm outline-none focus:border-primary" />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-black/20 rounded-card p-6 flex flex-col items-center gap-2 text-center cursor-pointer hover:border-primary/40 transition-colors">
                    <Upload size={20} className="text-muted" />
                    <p className="text-sm font-semibold text-foreground">Click to upload or drag &amp; drop</p>
                    <p className="text-xs text-muted">PDF, MP4, DOCX — max 500 MB</p>
                  </div>
                )}

                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-card px-3 py-2">
                  This resource will be submitted to the school admin for approval before students can access it.
                </p>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowUpload(false)}
                    className="h-10 px-5 border border-black/15 text-sm font-semibold text-foreground rounded-pill hover:border-primary hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 h-10 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
                    Submit for Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
