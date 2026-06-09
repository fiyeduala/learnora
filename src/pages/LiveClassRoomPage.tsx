import { useState } from 'react'
import {
  Mic, MicOff, Video, VideoOff, Monitor, Hand, MessageSquare,
  Users, Phone, Maximize2, MoreHorizontal, PenLine, Send
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

type Panel = 'chat' | 'participants' | null
type Mode  = 'gallery' | 'whiteboard' | 'screenshare'

const participants = [
  { name: 'Mr Adeyemi Johnson', initials: 'AJ', role: 'host',   micOn: true,  camOn: true  },
  { name: 'Olive Princely',     initials: 'OP', role: 'student', micOn: true,  camOn: true  },
  { name: 'Fatima Al-Rashid',   initials: 'FA', role: 'student', micOn: false, camOn: true  },
  { name: 'Emeka Nwosu',        initials: 'EN', role: 'student', micOn: true,  camOn: false },
  { name: 'Chisom Okeke',       initials: 'CO', role: 'student', micOn: false, camOn: false },
  { name: 'Yusuf Abubakar',     initials: 'YA', role: 'student', micOn: true,  camOn: true  },
]

const tileColors = ['bg-primary', 'bg-accent-mint', 'bg-amber-500', 'bg-red-500', 'bg-green-600', 'bg-purple-500']

const chatMessages = [
  { sender: 'Mr Adeyemi', time: '14:02', text: "Welcome everyone! Let's begin with Newton's First Law." },
  { sender: 'Fatima',     time: '14:03', text: 'Can you write the formula on the board please?' },
  { sender: 'Mr Adeyemi', time: '14:04', text: 'Sure — switching to whiteboard now.' },
  { sender: 'Emeka',      time: '14:05', text: '👍' },
  { sender: 'Olive',      time: '14:06', text: 'Is inertia covered in the WAEC syllabus?' },
  { sender: 'Mr Adeyemi', time: '14:07', text: 'Yes! It\'s a major topic. We\'ll do exam-style questions at the end.' },
]

export default function LiveClassRoomPage({ onNavigate }: Props) {
  const { profile }       = useAuth()
  const liveClassesPage   = profile?.role === 'teacher' ? 'teacher-live-classes' : 'live-classes'
  const [micOn,    setMicOn]    = useState(true)
  const [camOn,    setCamOn]    = useState(true)
  const [raised,   setRaised]   = useState(false)
  const [panel,    setPanel]    = useState<Panel>('chat')
  const [mode,     setMode]     = useState<Mode>('gallery')
  const [msg,      setMsg]      = useState('')

  function togglePanel(p: Panel) {
    setPanel(prev => prev === p ? null : p)
  }

  return (
    <div className="h-screen bg-[#0a0f1e] flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full">
            <span className="size-1.5 rounded-full bg-white animate-pulse" /> LIVE
          </span>
          <span className="text-white font-semibold text-sm hidden sm:block">Newton's Laws — Live Revision</span>
          <span className="text-white/40 text-xs hidden sm:block">Physics · SS1A</span>
        </div>
        <div className="flex items-center gap-2">
          {(['gallery', 'whiteboard', 'screenshare'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`h-7 px-3 rounded-full text-xs font-semibold capitalize transition-colors ${mode === m ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
            >
              {m === 'screenshare' ? 'Screen' : m}
            </button>
          ))}
        </div>
        <button className="text-white/60 hover:text-white">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video / whiteboard area */}
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">
          {mode === 'gallery' && (
            <div className="flex-1 grid grid-cols-3 gap-3 overflow-hidden">
              {participants.map((p, i) => (
                <div key={i} className="relative bg-[#1a2035] rounded-xl overflow-hidden flex items-center justify-center">
                  {p.camOn ? (
                    <div className={`size-14 rounded-full ${tileColors[i % tileColors.length]} flex items-center justify-center text-white text-xl font-bold`}>
                      {p.initials}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className={`size-12 rounded-full ${tileColors[i % tileColors.length]} flex items-center justify-center text-white text-lg font-bold`}>
                        {p.initials}
                      </div>
                      <VideoOff size={12} className="text-white/30" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-white text-[11px] font-semibold bg-black/50 px-2 py-0.5 rounded-full truncate">
                      {p.name}{p.role === 'host' ? ' (Host)' : ''}
                    </span>
                    {!p.micOn && <MicOff size={11} className="text-red-400 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {mode === 'whiteboard' && (
            <div className="flex-1 bg-white rounded-xl flex flex-col items-center justify-center relative">
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {['bg-black', 'bg-primary', 'bg-red-500', 'bg-green-500'].map(c => (
                  <button key={c} className={`size-6 rounded-full ${c} border-2 border-white shadow`} />
                ))}
                <div className="h-6 w-px bg-black/15 mx-1" />
                <button className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50">
                  <PenLine size={11} /> Draw
                </button>
              </div>
              <p className="text-gray-300 text-sm select-none">Whiteboard — drawing area</p>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                F = ma &nbsp;·&nbsp; Newton's Second Law
              </div>
            </div>
          )}

          {mode === 'screenshare' && (
            <div className="flex-1 bg-[#1a2035] rounded-xl flex flex-col items-center justify-center gap-3">
              <Monitor size={48} className="text-white/20" />
              <p className="text-white/40 text-sm">Mr Adeyemi is sharing their screen</p>
              <div className="w-3/4 h-1.5 bg-white/10 rounded-full">
                <div className="h-full w-2/3 bg-primary rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        {panel && (
          <div className="w-72 border-l border-white/8 flex flex-col shrink-0">
            <div className="h-10 flex border-b border-white/8 shrink-0">
              {(['chat', 'participants'] as Panel[]).map(p => (
                <button
                  key={p!}
                  onClick={() => setPanel(p)}
                  className={`flex-1 text-xs font-semibold capitalize transition-colors ${panel === p ? 'text-white border-b-2 border-primary' : 'text-white/40 hover:text-white'}`}
                >
                  {p === 'participants' ? `People (${participants.length})` : 'Chat'}
                </button>
              ))}
            </div>

            {panel === 'chat' && (
              <>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                  {chatMessages.map((m, i) => (
                    <div key={i}>
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-white/70">{m.sender}</span>
                        <span className="text-[10px] text-white/30">{m.time}</span>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/8 flex gap-2">
                  <input
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 h-9 px-3 bg-white/10 rounded-full text-xs text-white placeholder:text-white/30 outline-none"
                  />
                  <button
                    onClick={() => setMsg('')}
                    className="size-9 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Send size={13} className="text-white" />
                  </button>
                </div>
              </>
            )}

            {panel === 'participants' && (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className={`size-8 rounded-full ${tileColors[i % tileColors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {p.name}{p.role === 'host' ? ' 👑' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {p.micOn ? <Mic size={11} className="text-white/40" /> : <MicOff size={11} className="text-red-400" />}
                      {p.camOn ? <Video size={11} className="text-white/40" /> : <VideoOff size={11} className="text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="h-18 flex items-center justify-center gap-3 px-6 border-t border-white/8 shrink-0 py-3">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${!micOn ? 'bg-red-500/20' : 'hover:bg-white/8'}`}
        >
          {micOn ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-red-400" />}
          <span className="text-[9px] text-white/50">Mic</span>
        </button>
        <button
          onClick={() => setCamOn(!camOn)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${!camOn ? 'bg-red-500/20' : 'hover:bg-white/8'}`}
        >
          {camOn ? <Video size={20} className="text-white" /> : <VideoOff size={20} className="text-red-400" />}
          <span className="text-[9px] text-white/50">Camera</span>
        </button>
        <button
          onClick={() => setMode(mode === 'screenshare' ? 'gallery' : 'screenshare')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${mode === 'screenshare' ? 'bg-primary/30' : 'hover:bg-white/8'}`}
        >
          <Monitor size={20} className={mode === 'screenshare' ? 'text-primary' : 'text-white'} />
          <span className="text-[9px] text-white/50">Share</span>
        </button>
        <button
          onClick={() => setMode(mode === 'whiteboard' ? 'gallery' : 'whiteboard')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${mode === 'whiteboard' ? 'bg-primary/30' : 'hover:bg-white/8'}`}
        >
          <PenLine size={20} className={mode === 'whiteboard' ? 'text-primary' : 'text-white'} />
          <span className="text-[9px] text-white/50">Board</span>
        </button>
        <button
          onClick={() => setRaised(!raised)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${raised ? 'bg-amber-500/30' : 'hover:bg-white/8'}`}
        >
          <Hand size={20} className={raised ? 'text-amber-400' : 'text-white'} />
          <span className="text-[9px] text-white/50">Raise</span>
        </button>
        <button
          onClick={() => togglePanel('chat')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${panel === 'chat' ? 'bg-primary/30' : 'hover:bg-white/8'}`}
        >
          <MessageSquare size={20} className={panel === 'chat' ? 'text-primary' : 'text-white'} />
          <span className="text-[9px] text-white/50">Chat</span>
        </button>
        <button
          onClick={() => togglePanel('participants')}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${panel === 'participants' ? 'bg-primary/30' : 'hover:bg-white/8'}`}
        >
          <Users size={20} className={panel === 'participants' ? 'text-primary' : 'text-white'} />
          <span className="text-[9px] text-white/50">People</span>
        </button>
        <button className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl hover:bg-white/8 transition-colors">
          <Maximize2 size={20} className="text-white" />
          <span className="text-[9px] text-white/50">Fullscreen</span>
        </button>
        <div className="h-8 w-px bg-white/10 mx-1" />
        <button
          onClick={() => onNavigate(liveClassesPage)}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 transition-colors"
        >
          <Phone size={20} className="text-red-400 rotate-[135deg]" />
          <span className="text-[9px] text-red-400">Leave</span>
        </button>
      </div>
    </div>
  )
}
