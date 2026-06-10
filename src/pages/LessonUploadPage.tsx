import { useState, useEffect } from 'react'
import { Video, FileText, Headphones, File, ChevronDown, CheckCircle2, Link2, ArrowLeft } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type Props = { onNavigate: (page: string) => void }
type ContentType = 'video' | 'pdf' | 'audio' | 'document'

const typeConfig: Record<ContentType, { label: string; icon: typeof Video; color: string; placeholder: string }> = {
  video:    { label: 'Video',    icon: Video,      color: 'text-primary',     placeholder: 'YouTube, Vimeo, or direct video URL' },
  pdf:      { label: 'PDF',      icon: FileText,   color: 'text-amber-600',   placeholder: 'Google Drive, Dropbox, or PDF URL' },
  audio:    { label: 'Audio',    icon: Headphones, color: 'text-teal-600',    placeholder: 'SoundCloud, direct MP3 URL' },
  document: { label: 'Document', icon: File,       color: 'text-foreground',  placeholder: 'Google Docs, OneDrive, or doc URL' },
}

interface CourseOpt  { id: string; title: string }
interface ModuleOpt  { id: string; title: string }

export default function LessonUploadPage({ onNavigate }: Props) {
  const { profile }  = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)

  const [courses,     setCourses]     = useState<CourseOpt[]>([])
  const [modules,     setModules]     = useState<ModuleOpt[]>([])
  const [courseId,    setCourseId]    = useState(localStorage.getItem('learnora_selected_course') ?? '')
  const [moduleId,    setModuleId]    = useState('')
  const [title,       setTitle]       = useState('')
  const [contentUrl,  setContentUrl]  = useState('')
  const [contentType, setContentType] = useState<ContentType>('video')
  const [duration,    setDuration]    = useState('')
  const [position,    setPosition]    = useState('')
  const [loading,     setLoading]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [done,        setDone]        = useState(false)
  const [error,       setError]       = useState('')

  useEffect(() => { if (profile?.id) loadCourses() }, [profile?.id])
  useEffect(() => { if (courseId) loadModules(courseId) }, [courseId])

  async function loadCourses() {
    const { data } = await supabase
      .from('courses')
      .select('id, title')
      .eq('teacher_id', profile!.id)
      .eq('school_id', profile!.school_id!)
      .order('created_at', { ascending: false })

    const rows = (data ?? []) as CourseOpt[]
    setCourses(rows)
    if (rows.length > 0 && !courseId) setCourseId(rows[0].id)
    setLoading(false)
  }

  async function loadModules(cid: string) {
    setModuleId('')
    const { data } = await supabase
      .from('modules')
      .select('id, title')
      .eq('course_id', cid)
      .order('position', { ascending: true })

    const rows = (data ?? []) as ModuleOpt[]
    setModules(rows)
    if (rows.length > 0) setModuleId(rows[0].id)
  }

  async function saveLesson() {
    if (!title.trim() || !courseId || !moduleId) {
      setError('Please fill in the lesson title and select a course and module.')
      return
    }
    setError('')
    setSaving(true)

    const { error: err } = await supabase.from('lessons').insert({
      course_id:        courseId,
      module_id:        moduleId,
      school_id:        profile!.school_id!,
      title:            title.trim(),
      content_url:      contentUrl.trim() || null,
      type:             contentType,
      duration_minutes: duration ? parseInt(duration) || null : null,
      position:         position ? parseInt(position) || null : null,
      is_published:     true,
    })

    setSaving(false)
    if (err) { setError('Failed to save lesson. Please try again.'); return }
    setDone(true)
  }

  function reset() {
    setTitle('')
    setContentUrl('')
    setDuration('')
    setPosition('')
    setDone(false)
    setError('')
  }

  if (done) {
    return (
      <DashboardLayout activePage="classes" onNavigate={onNavigate} title="Upload Lesson Content" nav={teacherNav} user={sidebarUser}>
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="size-16 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Lesson Added!</h2>
            <p className="text-sm text-muted mt-2">"{title}" has been saved to your course.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={reset} className="h-11 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
              Add Another Lesson
            </button>
            <button onClick={() => onNavigate('course-builder')} className="h-11 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
              Back to Course Builder
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      activePage="classes"
      onNavigate={onNavigate}
      title="Upload Lesson Content"
      subtitle="Add a lesson to an existing course"
      nav={teacherNav}
      user={sidebarUser}
    >
      <div className="max-w-[800px] flex flex-col gap-6">

        <button onClick={() => onNavigate('course-builder')} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground w-fit">
          <ArrowLeft size={14} /> Back to Course Builder
        </button>

        {loading ? (
          <div className="bg-surface rounded-card shadow-sm p-12 text-center text-sm text-muted">Loading courses…</div>
        ) : courses.length === 0 ? (
          <div className="bg-surface rounded-card shadow-sm p-12 flex flex-col items-center gap-4">
            <p className="text-sm text-muted text-center">No courses found. Create a course first before adding lesson content.</p>
            <button onClick={() => onNavigate('course-builder')} className="h-10 px-5 bg-primary text-white text-sm font-semibold rounded-pill">
              Go to Course Builder
            </button>
          </div>
        ) : (
          <>
            {/* Content type */}
            <div className="bg-surface rounded-card shadow-sm p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Content Type</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.entries(typeConfig) as [ContentType, typeof typeConfig.video][]).map(([key, cfg]) => {
                  const Icon = cfg.icon
                  return (
                    <button
                      key={key}
                      onClick={() => setContentType(key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-card border-2 transition-colors ${
                        contentType === key ? 'border-primary bg-primary/5' : 'border-black/10 hover:border-primary/40'
                      }`}
                    >
                      <Icon size={22} className={contentType === key ? 'text-primary' : cfg.color} />
                      <span className="text-xs font-semibold text-foreground">{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Lesson details */}
            <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-5">
              <h2 className="text-base font-bold text-foreground">Lesson Details</h2>

              {/* Course + Module pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Course *</label>
                  <div className="relative">
                    <select
                      value={courseId}
                      onChange={e => setCourseId(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none"
                    >
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Module *</label>
                  <div className="relative">
                    <select
                      value={moduleId}
                      onChange={e => setModuleId(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none"
                    >
                      {modules.length === 0
                        ? <option value="">No modules in this course</option>
                        : modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)
                      }
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">Lesson Title *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Newton's Laws"
                  className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Link2 size={13} className="text-muted" /> Content URL
                </label>
                <input
                  value={contentUrl}
                  onChange={e => setContentUrl(e.target.value)}
                  placeholder={typeConfig[contentType].placeholder}
                  className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                />
                <p className="text-xs text-muted">Paste a URL to YouTube, Google Drive, Vimeo, or any accessible link.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Duration (minutes)</label>
                  <input
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    type="number"
                    min="1"
                    placeholder="e.g. 15"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">Position in Module</label>
                  <input
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    type="number"
                    min="1"
                    placeholder="e.g. 1"
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={saveLesson}
                disabled={saving || !title.trim() || !courseId || !moduleId}
                className="h-12 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save Lesson'}
              </button>
              <button onClick={() => onNavigate('course-builder')} className="h-12 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
