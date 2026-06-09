import { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, ArrowLeft, Users, Clock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

type Props = { onNavigate: (page: string) => void }

export default function PreClassLobbyPage({ onNavigate }: Props) {
  const { profile }          = useAuth()
  const liveClassesPage      = profile?.role === 'teacher' ? 'teacher-live-classes' : 'live-classes'
  const [micOn,    setMicOn]    = useState(true)
  const [cameraOn, setCameraOn] = useState(true)

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-6 gap-8">
      {/* Back */}
      <button
        onClick={() => onNavigate(liveClassesPage)}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-white">Ready to join?</h1>
        <p className="text-white/60 text-sm mt-1">Newton's Laws — Live Revision · Physics</p>
      </div>

      {/* Camera preview */}
      <div className="relative w-full max-w-[480px] aspect-video bg-[#1a2035] rounded-2xl overflow-hidden flex items-center justify-center">
        {cameraOn ? (
          <div className="size-24 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
            O
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="size-16 rounded-full bg-white/10 flex items-center justify-center">
              <VideoOff size={28} className="text-white/40" />
            </div>
            <p className="text-white/40 text-sm">Camera is off</p>
          </div>
        )}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
          {micOn ? <Mic size={12} className="text-green-400" /> : <MicOff size={12} className="text-red-400" />}
          <span className="text-white text-xs font-medium">Olive Princely</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`size-14 rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-white/15 hover:bg-white/25' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {micOn ? <Mic size={22} className="text-white" /> : <MicOff size={22} className="text-white" />}
        </button>
        <button
          onClick={() => setCameraOn(!cameraOn)}
          className={`size-14 rounded-full flex items-center justify-center transition-colors ${cameraOn ? 'bg-white/15 hover:bg-white/25' : 'bg-red-500 hover:bg-red-600'}`}
        >
          {cameraOn ? <Video size={22} className="text-white" /> : <VideoOff size={22} className="text-white" />}
        </button>
      </div>

      {/* Class info */}
      <div className="flex items-center gap-6 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <Users size={14} /> <span>38 participants</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} /> <span>Starts at 2:00 PM</span>
        </div>
      </div>

      {/* Join button */}
      <button
        onClick={() => onNavigate('live-classroom')}
        className="h-13 px-10 bg-primary text-white text-base font-bold rounded-pill shadow-primary hover:bg-primary-deep transition-colors"
      >
        Join Class
      </button>
    </div>
  )
}
