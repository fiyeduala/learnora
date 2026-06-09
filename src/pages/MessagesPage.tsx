import { useState, useEffect, useRef } from 'react'
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, MessageSquare } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useAuth, profileToSidebarUser } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

type Props = { onNavigate: (page: string) => void }

interface Conversation {
  id:       string
  name:     string
  role:     string
  lastMsg:  string
  lastTime: string
  unread:   number
}

interface Message {
  id:   string
  from: 'me' | 'them'
  text: string
  time: string
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0] ?? '').join('')
}

function fmtMsgTime(iso: string) {
  const d   = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

export default function MessagesPage({ onNavigate }: Props) {
  const { profile }  = useAuth()
  const sidebarUser  = profileToSidebarUser(profile)

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId,      setActiveId]      = useState<string | null>(null)
  const [messages,      setMessages]      = useState<Message[]>([])
  const [loadingConvs,  setLoadingConvs]  = useState(true)
  const [loadingMsgs,   setLoadingMsgs]   = useState(false)
  const [tab,           setTab]           = useState<'all' | 'unread'>('all')
  const [input,         setInput]         = useState('')
  const [mobileView,    setMobileView]    = useState<'list' | 'chat'>('list')
  const [sending,       setSending]       = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (profile?.id) loadConversations() }, [profile?.id])
  useEffect(() => { if (activeId) loadMessages(activeId) }, [activeId])
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function loadConversations() {
    setLoadingConvs(true)
    const userId = profile!.id

    const { data: memberData } = await supabase
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', userId)

    const convIds = (memberData ?? []).map((m: { conversation_id: string }) => m.conversation_id)
    if (!convIds.length) { setLoadingConvs(false); return }

    const [convRes, partnerRes, lastMsgRes] = await Promise.all([
      supabase.from('conversations').select('id, name, type').in('id', convIds),
      supabase.from('conversation_members')
        .select('conversation_id, user_id, profiles!user_id(full_name, role)')
        .in('conversation_id', convIds)
        .neq('user_id', userId),
      supabase.from('messages')
        .select('conversation_id, body, sent_at')
        .in('conversation_id', convIds)
        .order('sent_at', { ascending: false }),
    ])

    const convData = (convRes.data ?? []) as { id: string; name: string | null; type: string }[]
    const partners = (partnerRes.data ?? []) as unknown as {
      conversation_id: string; user_id: string
      profiles: { full_name: string | null; role: string | null } | null
    }[]
    const lastMsgs = (lastMsgRes.data ?? []) as { conversation_id: string; body: string | null; sent_at: string }[]

    const partnerMap: Record<string, { full_name: string; role: string }> = {}
    for (const p of partners) {
      if (!partnerMap[p.conversation_id] && p.profiles?.full_name) {
        partnerMap[p.conversation_id] = {
          full_name: p.profiles.full_name,
          role:      p.profiles.role ?? '',
        }
      }
    }
    const lastMsgMap: Record<string, { body: string; sent_at: string }> = {}
    for (const msg of lastMsgs) {
      if (!lastMsgMap[msg.conversation_id]) {
        lastMsgMap[msg.conversation_id] = { body: msg.body ?? '', sent_at: msg.sent_at }
      }
    }

    const convList: Conversation[] = convData.map(c => ({
      id:       c.id,
      name:     c.name ?? partnerMap[c.id]?.full_name ?? 'Unknown',
      role:     partnerMap[c.id]?.role ?? '',
      lastMsg:  lastMsgMap[c.id]?.body ?? '',
      lastTime: lastMsgMap[c.id] ? fmtMsgTime(lastMsgMap[c.id].sent_at) : '',
      unread:   0,
    }))

    setConversations(convList)
    if (convList.length > 0 && !activeId) setActiveId(convList[0].id)
    setLoadingConvs(false)
  }

  async function loadMessages(convId: string) {
    setLoadingMsgs(true)
    const { data } = await supabase
      .from('messages')
      .select('id, body, sent_at, sender_id')
      .eq('conversation_id', convId)
      .order('sent_at', { ascending: true })
      .limit(100)

    const userId = profile!.id
    setMessages((data ?? []).map((m: { id: string; body: string | null; sent_at: string; sender_id: string }) => ({
      id:   m.id,
      from: m.sender_id === userId ? 'me' : 'them',
      text: m.body ?? '',
      time: fmtMsgTime(m.sent_at),
    })))
    setLoadingMsgs(false)
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || !activeId || sending) return
    setSending(true)
    const now = new Date().toISOString()
    const tempMsg: Message = { id: `t-${Date.now()}`, from: 'me', text, time: fmtMsgTime(now) }
    setMessages(prev => [...prev, tempMsg])
    setInput('')
    await supabase.from('messages').insert({
      conversation_id: activeId,
      sender_id:       profile!.id,
      school_id:       profile!.school_id,
      body:            text,
      sent_at:         now,
    })
    setSending(false)
  }

  function openChat(id: string) {
    setActiveId(id)
    setMobileView('chat')
  }

  const visibleConvs = conversations.filter(c => tab === 'all' || c.unread > 0)
  const active       = conversations.find(c => c.id === activeId)

  return (
    <DashboardLayout
      activePage="messages"
      onNavigate={onNavigate}
      title="Messages"
      user={sidebarUser}
      mainClassName="flex-1 flex overflow-hidden"
    >
      {/* Left: chat list */}
      <div className={`w-full md:w-[320px] lg:w-[360px] shrink-0 bg-surface border-r border-black/6 flex flex-col overflow-hidden
        ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 md:p-5 border-b border-black/6 shrink-0">
          <h2 className="text-lg font-bold text-foreground mb-3">Messages</h2>
          <div className="flex items-center gap-2.5 h-10 px-4 bg-canvas border border-black/8 rounded-input">
            <Search size={15} className="text-muted shrink-0" />
            <input type="search" placeholder="Search chats..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none" />
          </div>
          <div className="flex gap-1 mt-3">
            {(['all', 'unread'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 h-9 text-sm font-semibold rounded-md capitalize transition-colors
                  ${tab === t ? 'bg-primary text-white' : 'text-muted hover:bg-canvas'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <p className="text-center text-sm text-muted py-8">Loading…</p>
          ) : visibleConvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted">
              <MessageSquare size={28} className="opacity-30 mb-2" />
              <p className="text-sm">No conversations yet.</p>
            </div>
          ) : visibleConvs.map(chat => (
            <button key={chat.id} onClick={() => openChat(chat.id)}
              className={`w-full flex items-start gap-3 px-4 md:px-5 py-4 border-b border-black/4 last:border-0 text-left transition-colors
                ${activeId === chat.id ? 'bg-primary/6' : 'hover:bg-canvas/60'}`}>
              <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials(chat.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate">{chat.name}</p>
                  <span className="text-xs text-muted shrink-0 ml-2">{chat.lastTime}</span>
                </div>
                <p className="text-xs text-muted truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <span className="size-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {chat.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right: active chat */}
      <div className={`flex-1 flex flex-col overflow-hidden bg-canvas
        ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {active ? (
          <>
            <div className="flex items-center gap-3 px-4 md:px-6 py-4 bg-surface border-b border-black/6 shrink-0">
              <button onClick={() => setMobileView('list')}
                className="md:hidden p-1 -ml-1 text-muted hover:text-foreground">
                <ArrowLeft size={18} />
              </button>
              <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials(active.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{active.name}</p>
                <p className="text-xs text-muted capitalize">{active.role}</p>
              </div>
              <button className="p-2 text-muted hover:text-foreground"><MoreVertical size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 flex flex-col gap-3 md:gap-4">
              {loadingMsgs ? (
                <p className="text-center text-sm text-muted">Loading messages…</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-sm text-muted mt-10">No messages yet. Say hello!</p>
              ) : messages.map(msg => (
                <div key={msg.id} className={`flex flex-col gap-1 max-w-[80%] md:max-w-[65%]
                  ${msg.from === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`px-4 py-2.5 md:py-3 text-sm leading-relaxed
                    ${msg.from === 'me'
                      ? 'bg-primary text-white rounded-card rounded-br-xs'
                      : 'bg-surface text-foreground rounded-card rounded-bl-xs shadow-sm'}`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-muted">{msg.time}</span>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 md:px-6 py-3 md:py-4 bg-surface border-t border-black/6 shrink-0">
              <div className="flex items-center gap-3 h-11 md:h-12 px-4 bg-canvas border border-black/8 rounded-pill">
                <button className="p-1 text-muted hover:text-foreground shrink-0">
                  <Paperclip size={15} />
                </button>
                <input type="text" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) sendMessage() }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none min-w-0"
                />
                <button onClick={sendMessage} disabled={!input.trim() || sending}
                  className="size-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-deep disabled:opacity-40 transition-colors shrink-0">
                  <Send size={13} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted flex-col gap-3">
            <MessageSquare size={40} className="opacity-20" />
            <p className="text-sm">Select a conversation</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
