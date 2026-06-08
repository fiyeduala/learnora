import { Share2 } from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

export default function QuizResultPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-primary flex flex-col max-w-[430px] mx-auto items-center px-5 pt-10 pb-8">

      {/* Confetti strips (visual) */}
      <div className="flex gap-2 mb-6 opacity-70">
        {['bg-yellow-300', 'bg-red-400', 'bg-green-300', 'bg-pink-400', 'bg-blue-300'].map((c, i) => (
          <div key={i} className={`w-1 h-12 ${c} rounded-full transform rotate-${i * 15}`} />
        ))}
      </div>

      {/* Robot mascot */}
      <div className="size-28 rounded-full bg-white/20 flex items-center justify-center text-6xl mb-4 select-none">
        🤖
      </div>

      {/* Result card */}
      <div className="w-full bg-white rounded-3xl p-6">
        <p className="text-base font-bold text-foreground text-center mb-1">Great work, Olive!</p>
        <p className="text-xs text-muted text-center mb-5">You have successfully completed the Science Basics Quiz.</p>

        {/* Time taken */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-muted">Time Taken</p>
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-[10px] text-primary font-bold">⏱</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-foreground mb-5">4m 22s</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-canvas rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted">Accuracy</p>
              <div className="size-7 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-xs">🎯</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">80%</p>
          </div>
          <div className="bg-canvas rounded-2xl p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted">Grade</p>
              <div className="size-7 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xs">⭐</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">B+</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('m/learn')}
          className="w-full h-12 bg-primary text-white font-bold rounded-full mt-5 flex items-center justify-center gap-2"
        >
          <Share2 size={15} /> Share Score Card
        </button>
        <button
          onClick={() => onNavigate('m/learn')}
          className="w-full h-12 bg-white border-2 border-black/12 text-foreground font-bold rounded-full mt-3"
        >
          View Summary
        </button>
      </div>
    </div>
  )
}
