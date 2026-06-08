import { ChevronLeft, Mic } from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

export default function LessonViewerPage({ onNavigate }: Props) {
  const progress = 37
  const total = 45

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto px-5 pt-5 pb-8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => onNavigate('m/learn')}><ChevronLeft size={22} className="text-foreground" /></button>
        <h1 className="text-base font-bold text-foreground flex-1 text-center">Algebra (Basics)</h1>
      </div>

      {/* Progress */}
      <div className="relative mb-6">
        <div className="h-1.5 bg-black/8 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: `${(progress / total) * 100}%` }} />
        </div>
        <span className="absolute right-0 -top-5 text-[10px] font-bold bg-foreground text-white px-2 py-0.5 rounded-full">
          {progress}/{total}
        </span>
      </div>

      {/* Content card */}
      <div className="bg-primary rounded-3xl p-5 mb-5 relative flex-1">
        <p className="text-sm text-white/80 mb-2">Algebra Basics</p>
        <h2 className="text-xl font-bold text-white mb-4">What is a Linear Equation?</h2>
        <p className="text-sm text-white/90 leading-relaxed mb-3">
          A linear equation is an equation whose highest power is 1.
        </p>
        <p className="text-sm text-white/80 mb-1">Example:</p>
        <p className="text-xl font-bold text-white mb-4">2x + 4 = 10</p>
        <button className="absolute bottom-5 right-5 size-10 rounded-full border-2 border-white/30 flex items-center justify-center">
          <Mic size={16} className="text-white" />
        </button>
      </div>

      {/* Reminder */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
        <p className="text-sm font-bold text-amber-700 mb-1">Reminder</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          Whatever you do on one side of the equation, do the same on the other side.
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={() => onNavigate('m/lesson-complete')}
          className="h-14 bg-primary text-white text-base font-bold rounded-full hover:bg-primary-deep transition-colors"
        >
          Next
        </button>
        <button className="h-14 bg-white border-2 border-black/12 text-foreground text-base font-bold rounded-full">
          Previous
        </button>
      </div>
    </div>
  )
}
