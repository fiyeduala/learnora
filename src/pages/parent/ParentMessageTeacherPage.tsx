import { useState, useEffect, useRef } from 'react'
import { Send, ChevronLeft } from 'lucide-react'
import MobileLayout, { parentMobileNav } from '../../components/layout/MobileLayout'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface Teacher {
  id:      string
  name:    string
  subject: string
  cls:     string
  initials:string
}

interface Message {
  id:        string
  body:      string | null
  sent_at:   string | null
  sender_id: string
  self:      boolean
}

function fmtTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

const db = supabase as unknown as { from: (t: string) => any }

export default function ParentMessageTeacherPage({ onNavigate }: Props) {
  const { profile } = useAuth()

  const [teachers,  setTeachers]  = useState<Teacher[]>([])
  const [selected,  setSelected]  = useState<Teacher | null>(null)
  const [messages,  setMessages]  = useState<Message[]>([])
  const [convId,    setConvId]    = useState<string | null>(null)
  const [draft,     setDraft]     = useState('')
  const [loading,   setLoading]   = useState(true)
  const [sending,   setSending]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const childId   = localStorage.getItem('learnora_selected_child') ?? profile?.id ?? ''
  const childName = ''

  useEffect(() => { if (profile?.id) loadTeachers() }, [profile?.id])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadTeachers() {
    setLoading(true)
    const schoolId = profile!.school_id!

    const { data: ceData } = await supabase
      .from('class_enrollments')
      .select('class_id, classes(id, name)')
      .eq('student_id', childId)
      .limit(1)
      .maybeSingle()

    const ce = ceData as unknown as { class_id: string; classes: { id: string; name: string } | null } | null
    if (!ce?.class_id) { setLoading(false); return }

    const { data: taData } = await db.from('teacher_assignments')
      .select('teacher_id, subject_id, profiles!teacher_id(id, full_name), subjects!subject_id(name), classes!class_id(name)')
      .eq('class_id', ce.class_id)
      .eq('school_id', schoolId)

    const rows = (taData ?? []) as {
      teacher_id: string
      profiles:   { id: string; full_name: string | null } | null
      subjects:   { name: string } | null
      classes:    { name: string } | null
    }[]

    const seen = new Set<string>()
    const list: Teacher[] = []
    for (const r of rows) {
      if (!r.profiles?.id || seen.has(r.profiles.id)) continue
      seen.add(r.profiles.id)
      const name = r.profiles.full_name ?? 'Teacher'
      list.push({
        id:      r.profiles.id,
        name,
        subject: r.subjects?.name ?? 'General',
        cls:     r.classes?.name ?? '',
        initials:name.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase(),
      })
    }
    setTeachers(list)
    setLoading(false)
  }

  async function openConversation(teacher: Teacher) {
    setSelected(teacher)
    setMessages([])
    setConvId(null)
    const schoolId = profile!.school_id!
    const parentId = profile!.id
    const dmName   = `dm:${[parentId, teacher.id].sort().join(':')}`

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('school_id', schoolId)
      .eq('name', dmName)
      .maybeSingle()

    let cid = (existing as { id: string } | null)?.id
    if (!cid) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({ school_id: schoolId, type: 'direct', name: dmName })
        .select('id').single()
      cid = (newConv as { id: string } | null)?.id
    }

    if (!cid) return
    setConvId(cid)
    await loadMessages(cid)
  }

  async function loadMessages(cid: string) {
    const { data } = await supabase
      .from('messages')
      .select('id, body, sent_at, sender_id')
      .eq('conversation_id', cid)
      .order('sent_at', { ascending: true })
      .limit(100)

    const rows = (data ?? []) as { id: string; body: string | null; sent_at: string | null; sender_id: string }[]
    setMessages(rows.map(r => ({ ...r, self: r.sender_id === profile!.id })))
  }

  async function send() {
    if (!draft.trim() || !convId || sending) return
    setSending(true)
    await supabase.from('messages').insert({
      conversation_id: convId,
      sender_id:       profile!.id,
      school_id:       profile!.school_id!,
      body:            draft.trim(),
    })
    setDraft('')
    await loadMessages(convId)
    setSending(false)
  }

  if (selected) {
    return (
      <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
        <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="flex items-center gap-3 px-4 py-4 border-b border-black/8 bg-white">
            <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground">
              <ChevronLeft size={20} />
            </button>
            <div className="size-9 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
              {selected.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{selected.name}</p>
              <p className="text-xs text-muted">{selected.subject} · {selected.cls}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-canvas/30">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p className="text-sm">Start a conversation with {selected.name}</p>
              </div>
            ) : messages.map(m => (
              <div key={m.id} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.self ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-foreground rounded-bl-sm shadow-sm'}`}>
                  {m.body}
                  <p className={`text-[10px] mt-1 ${m.self ? 'text-white/60' : 'text-muted'}`}>{fmtTime(m.sent_at)}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-black/8 bg-white flex items-end gap-2 pb-[80px]">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none px-4 py-2.5 bg-canvas border border-black/12 rounded-2xl text-sm outline-none focus:border-primary"
            />
            <button
              onClick={send}
              disabled={!draft.trim() || sending}
              className="size-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout activePage="parent/home" onNavigate={onNavigate} nav={parentMobileNav}>
      <div className="px-4 pt-5 pb-24">
        <button onClick={() => onNavigate('parent/chat')} className="mb-4 text-muted">
          <ChevronLeft size={20} />
        </button>

        <h1 className="text-lg font-bold text-foreground mb-1">Message a Teacher</h1>
        <p className="text-sm text-muted mb-5">Contact your child's subject teachers directly.</p>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted">Loading teachers…</div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted">No teachers found for your child's class.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {teachers.map(t => (
              <button
                key={t.id}
                onClick={() => openConversation(t)}
                className="w-full bg-white border border-black/8 rounded-2xl p-4 text-left shadow-sm flex items-center gap-3"
              >
                <div className="size-11 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0">
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted mt-0.5">{t.subject} · {t.cls}</p>
                </div>
                <Send size={14} className="text-primary shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
