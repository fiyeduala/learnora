import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

const questions = [
  {
    subject: 'Mathematics',
    question: 'If 3x+5=203x + 5 = 203x+5=20, what is the value of xxx?',
    options: ['3', '5', '7', '14'],
    correct: 2,
  },
]

export default function QuizPage({ onNavigate }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const q = questions[0]

  function handleNext() {
    if (submitted) onNavigate('m/quiz-result')
    else setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto px-5 pt-5 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onNavigate('m/learn')}><ChevronLeft size={22} /></button>
        <p className="text-xl font-bold text-red-500">05:10</p>
        <div className="w-8" />
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-black/8 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-primary rounded-full w-[40%]" />
      </div>
      <p className="text-right text-[10px] text-muted mb-6">1/10</p>

      {/* Question */}
      <div className="bg-canvas rounded-2xl p-5 mb-6">
        <p className="text-xs text-muted mb-2">{q.subject}</p>
        <p className="text-base font-bold text-foreground leading-snug">{q.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-auto">
        {q.options.map((opt, i) => {
          let style = 'bg-canvas border-transparent text-foreground'
          if (submitted && selected === i && i !== q.correct) style = 'bg-red-50 border-red-400 text-foreground'
          else if (submitted && i === q.correct) style = 'bg-primary border-primary text-white'
          else if (selected === i) style = 'bg-primary/10 border-primary text-foreground'
          return (
            <button
              key={i}
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`h-12 px-4 border-2 rounded-xl text-left text-sm font-medium transition-colors ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={selected === null}
        className="mt-8 h-14 bg-primary text-white text-base font-bold rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-deep transition-colors"
      >
        {submitted ? 'Finish' : 'Next'}
      </button>
    </div>
  )
}
