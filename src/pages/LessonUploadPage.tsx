import { useState } from 'react'
import { Upload, File, Video, FileText, Headphones, X, CheckCircle2, ChevronDown } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }
type ContentType = 'video' | 'pdf' | 'audio' | 'document'

const typeConfig: Record<ContentType, { label: string; icon: typeof Video; accept: string; color: string }> = {
  video:    { label: 'Video Lesson',  icon: Video,    accept: '.mp4,.mov,.avi',   color: 'text-primary'    },
  pdf:      { label: 'PDF / Notes',   icon: FileText, accept: '.pdf',             color: 'text-amber-600'  },
  audio:    { label: 'Audio Lesson',  icon: Headphones,accept: '.mp3,.wav,.m4a', color: 'text-accent-mint' },
  document: { label: 'Document',      icon: File,     accept: '.doc,.docx,.pptx', color: 'text-foreground' },
}

type UploadFile = { name: string; size: string; type: ContentType; progress: number }

export default function LessonUploadPage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const [contentType, setContentType] = useState<ContentType>('video')
  const [title, setTitle]             = useState('')
  const [module, setModule]           = useState('Module 1: Introduction')
  const [files, setFiles]             = useState<UploadFile[]>([])
  const [dragging, setDragging]       = useState(false)

  function fakeUpload(name: string) {
    const newFile: UploadFile = { name, size: '12.4 MB', type: contentType, progress: 100 }
    setFiles(prev => [...prev, newFile])
  }

  function removeFile(idx: number) {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <DashboardLayout
      activePage="classes"
      onNavigate={onNavigate}
      title="Upload Lesson Content"
      subtitle="Add materials to your course"
      nav={teacherNav}
      user={profileToSidebarUser(profile)}
    >
      <div className="max-w-[800px] flex flex-col gap-6">

        {/* Content type selector */}
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

        {/* Details */}
        <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-5">
          <h2 className="text-base font-bold text-foreground">Lesson Details</h2>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">Lesson Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Newton's Laws"
              className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">Add to Module</label>
            <div className="relative">
              <select value={module} onChange={e => setModule(e.target.value)}
                className="w-full h-12 pl-4 pr-10 border border-black/20 rounded-input text-sm text-foreground bg-white outline-none focus:border-primary appearance-none">
                {['Module 1: Introduction', 'Module 2: Mechanics', 'Module 3: Energy & Work'].map(m => <option key={m}>{m}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false)
            Array.from(e.dataTransfer.files).forEach(f => fakeUpload(f.name))
          }}
          className={`border-2 border-dashed rounded-card p-10 flex flex-col items-center gap-4 transition-colors cursor-pointer ${
            dragging ? 'border-primary bg-primary/5' : 'border-black/20 hover:border-primary/50'
          }`}
          onClick={() => fakeUpload('lesson-video.mp4')}
        >
          <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload size={24} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">Drag & drop files here</p>
            <p className="text-xs text-muted mt-1">or click to browse · Max 500 MB</p>
          </div>
          <span className="text-xs text-muted">Supported: {typeConfig[contentType].accept}</span>
        </div>

        {/* Uploaded files */}
        {files.length > 0 && (
          <div className="flex flex-col gap-2">
            {files.map((f, i) => {
              const Icon = typeConfig[f.type].icon
              return (
                <div key={i} className="flex items-center gap-4 bg-surface rounded-card shadow-sm p-4">
                  <Icon size={18} className={typeConfig[f.type].color} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                    <p className="text-xs text-muted">{f.size}</p>
                  </div>
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <button onClick={() => removeFile(i)} className="text-muted hover:text-red-500 transition-colors shrink-0">
                    <X size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('course-builder')}
            className="h-12 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            Save Lesson
          </button>
          <button onClick={() => onNavigate('course-builder')} className="h-12 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </DashboardLayout>
  )
}
