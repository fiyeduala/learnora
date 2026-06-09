import { useState, useEffect } from 'react'
import { Bell, Sparkles, ChevronRight } from 'lucide-react'
import MobileLayout, { studentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface ClassItem { id: string; name: string; subject: string; time: string; color: string }
interface CourseItem { id: string; title: string; subject: string; teacher: string; progress: number; color: string }

const CLASS_COLORS = ['bg-blue-400', 'bg-green-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500']
const COURSE_COLORS = ['bg-primary', 'bg-green-600', 'bg-amber-500', 'bg-purple-600']

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function MobileStudentHomePage({ onNavigate }: Props) {
  const { profile } = useAuth()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Student'
  const initials  = (profile?.full_name ?? 'S').charAt(0).toUpperCase()

  const [className,  setClassName]  = useState('')
  const [gpa,        setGpa]        = useState<string>('—')
  const [classes,    setClasses]    = useState<ClassItem[]>([])
  const [courses,    setCourses]    = useState<CourseItem[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => { if (profile?.id) loadData() }, [profile?.id])

  async function loadData() {
    setLoading(true)
    const studentId = profile!.id
    const schoolId  = profile!.school_id!

    // Enrolled classes
    const { data: ceData } = await supabase
      .from('class_enrollments')
      .select('class_id, classes(name)')
      .eq('student_id', studentId)
    const enrollments = (ceData ?? []) as unknown as { class_id: string; classes: { name: string } | null }[]
    const classIds = enrollments.map(e => e.class_id)
    if (enrollments.length > 0) setClassName(enrollments[0].classes?.name ?? '')

    // GPA
    if (classIds.length > 0) {
      const { data: gradeData } = await supabase
        .from('grade_summaries')
        .select('average_score')
        .eq('student_id', studentId)
      const scores = (gradeData ?? []) as { average_score: number | null }[]
      if (scores.length > 0) {
        const avg = scores.reduce((s, g) => s + (g.average_score ?? 0), 0) / scores.length
        setGpa((avg / 20).toFixed(1))
      }
    }

    // Today's live sessions
    if (classIds.length > 0) {
      const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
      const todayEnd   = new Date(); todayEnd.setHours(23, 59, 59, 999)
      const { data: sessData } = await supabase
        .from('live_sessions')
        .select('id, title, scheduled_at, subjects(name), classes(name)')
        .in('class_id', classIds)
        .eq('school_id', schoolId)
        .gte('scheduled_at', todayStart.toISOString())
        .lte('scheduled_at', todayEnd.toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(6)
      const rawSessions = (sessData ?? []) as unknown as {
        id: string; title: string; scheduled_at: string
        subjects: { name: string } | null; classes: { name: string } | null
      }[]
      setClasses(rawSessions.map((s, i) => ({
        id:      s.id,
        name:    s.classes?.name ?? s.title,
        subject: s.subjects?.name ?? s.title,
        time:    fmtTime(s.scheduled_at),
        color:   CLASS_COLORS[i % CLASS_COLORS.length],
      })))
    }

    // Continue learning: courses from enrolled classes
    if (classIds.length > 0) {
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title, profiles!teacher_id(full_name), subjects(name)')
        .in('class_id', classIds)
        .eq('is_published', true)
        .limit(4)
      const rawCourses = (courseData ?? []) as unknown as {
        id: string; title: string
        profiles: { full_name: string | null } | null
        subjects: { name: string } | null
      }[]

      // Lesson progress
      const courseIds = rawCourses.map(c => c.id)
      const lessonsByCourse: Record<string, string[]> = {}
      if (courseIds.length > 0) {
        const { data: lData } = await supabase
          .from('lessons').select('id, course_id').in('course_id', courseIds).eq('is_published', true)
        for (const l of (lData ?? []) as { id: string; course_id: string }[]) {
          if (!lessonsByCourse[l.course_id]) lessonsByCourse[l.course_id] = []
          lessonsByCourse[l.course_id].push(l.id)
        }
        const allIds = Object.values(lessonsByCourse).flat()
        const completedSet = new Set<string>()
        if (allIds.length > 0) {
          const { data: pData } = await supabase
            .from('lesson_progress').select('lesson_id').eq('student_id', studentId).eq('completed', true).in('lesson_id', allIds)
          for (const p of (pData ?? []) as { lesson_id: string }[]) completedSet.add(p.lesson_id)
        }
        setCourses(rawCourses.map((c, i) => {
          const total    = lessonsByCourse[c.id]?.length ?? 0
          const done     = lessonsByCourse[c.id]?.filter(id => completedSet.has(id)).length ?? 0
          return {
            id:       c.id,
            title:    c.title,
            subject:  c.subjects?.name ?? '',
            teacher:  c.profiles?.full_name ?? 'Teacher',
            progress: total > 0 ? Math.round((done / total) * 100) : 0,
            color:    COURSE_COLORS[i % COURSE_COLORS.length],
          }
        }))
      }
    }

    setLoading(false)
  }

  return (
    <MobileLayout activePage="m/home" onNavigate={onNavigate} nav={studentMobileNav}>
      <div className="px-5 pt-6 pb-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
              {initials}
            </div>
            <div>
              <p className="text-sm text-muted">Good Morning, <span className="font-bold text-foreground">{firstName}</span></p>
              {className && <p className="text-xs text-muted/70">{className}</p>}
            </div>
          </div>
          <button onClick={() => onNavigate('notifications')} className="size-9 rounded-full border border-black/10 flex items-center justify-center">
            <Bell size={16} className="text-foreground" />
          </button>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-5">
          {[
            { label: 'GPA',     value: loading ? '…' : gpa },
            { label: 'Courses', value: loading ? '…' : courses.length > 0 ? courses.length.toString() : '—' },
            { label: 'Class',   value: loading ? '…' : className || '—' },
          ].map(stat => (
            <div key={stat.label} className="flex-1 bg-canvas rounded-2xl px-3 py-2.5">
              <p className="text-[10px] text-muted mb-0.5">{stat.label}</p>
              <p className="text-base font-bold text-foreground truncate">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Learnora AI Banner */}
        <button
          onClick={() => onNavigate('ai-tutor')}
          className="w-full bg-primary rounded-2xl p-4 flex items-center justify-between mb-6"
        >
          <div className="text-left">
            <p className="text-sm font-bold text-white">Learnora AI</p>
            <p className="text-xs text-white/70">Your smart academic assistant</p>
          </div>
          <div className="size-9 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
        </button>

        {/* Today's Classes */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-foreground">Today's classes</p>
          <button onClick={() => onNavigate('live-classes')} className="text-xs text-primary font-medium">View all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {loading
            ? <div className="py-4 text-sm text-muted">Loading…</div>
            : classes.length === 0
            ? <div className="py-4 text-sm text-muted">No live classes today.</div>
            : classes.map((cls) => (
              <div key={cls.id} className="shrink-0 w-36 rounded-2xl overflow-hidden border border-black/6">
                <div className={`h-20 ${cls.color} flex items-center justify-center`}>
                  <div className="size-10 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold text-foreground">
                    {cls.name.charAt(0)}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-foreground truncate">{cls.name}</p>
                  <p className="text-[10px] text-muted">{cls.subject}</p>
                  <p className="text-[10px] text-muted">{cls.time}</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* Continue Learning */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-foreground">Continue Learning</p>
          <button onClick={() => onNavigate('m/learn')} className="text-xs text-primary font-medium">View all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {loading
            ? <div className="py-4 text-sm text-muted">Loading…</div>
            : courses.length === 0
            ? <div className="py-4 text-sm text-muted">No courses yet.</div>
            : courses.map((course) => (
              <button
                key={course.id}
                onClick={() => {
                  localStorage.setItem('learnora_selected_course', course.id)
                  onNavigate('m/lesson')
                }}
                className="shrink-0 w-40 rounded-2xl overflow-hidden border border-black/6 text-left"
              >
                <div className={`h-24 ${course.color} flex items-center justify-center`}>
                  <p className="text-white font-bold text-lg px-2 text-center leading-tight">{course.title.substring(0, 10)}</p>
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-foreground truncate">{course.subject || course.title}</p>
                  <p className="text-[10px] text-muted mt-0.5 truncate">{course.teacher}</p>
                  <div className="h-1 bg-black/8 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                  <p className="text-[9px] text-muted mt-0.5">{course.progress}%</p>
                </div>
                <div className="px-2.5 pb-2.5">
                  <div className="flex items-center gap-1 bg-primary rounded-full px-3 py-1 w-fit">
                    <span className="text-[10px] text-white font-medium">Resume</span>
                    <ChevronRight size={10} className="text-white" />
                  </div>
                </div>
              </button>
            ))
          }
        </div>

      </div>
    </MobileLayout>
  )
}
