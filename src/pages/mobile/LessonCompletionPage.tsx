import { ChevronLeft } from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

export default function LessonCompletionPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto px-5">

      {/* Confetti header */}
      <div className="relative bg-gradient-to-b from-yellow-50 to-white pt-10 pb-6 -mx-5 px-5 mb-6">
        <button onClick={() => onNavigate('m/learn')} className="absolute top-5 left-5">
          <ChevronLeft size={22} />
        </button>
        <div className="flex gap-1 justify-center mb-4">
          {['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400', 'bg-pink-400', 'bg-purple-400'].map((c, i) => (
            <div key={i} className={`w-2 h-8 ${c} rounded-full transform -rotate-12`} style={{ transform: `rotate(${(i - 2) * 15}deg)` }} />
          ))}
        </div>

        {/* Robot mascot */}
        <div className="flex justify-center">
          <div className="size-28 rounded-full bg-primary/10 flex items-center justify-center text-6xl select-none">
            🤖
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-0">
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">Congratulations!</h1>
        <p className="text-sm text-muted text-center mb-8">
          You completed<br />
          <span className="font-semibold text-foreground">Solving Linear Equations</span>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-canvas rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted">Accuracy</p>
              <div className="size-8 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-sm">🎯</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">80%</p>
          </div>
          <div className="bg-canvas rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted">Grade</p>
              <div className="size-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-sm">⭐</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">B+</p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => onNavigate('m/lesson')}
          className="w-full h-14 bg-primary text-white text-base font-bold rounded-full mb-3 hover:bg-primary-deep transition-colors"
        >
          Continue to Next Lesson
        </button>
        <button
          onClick={() => onNavigate('m/learn')}
          className="w-full h-14 bg-white border-2 border-black/12 text-foreground text-base font-bold rounded-full"
        >
          Back to Course
        </button>
      </div>
    </div>
  )
}
