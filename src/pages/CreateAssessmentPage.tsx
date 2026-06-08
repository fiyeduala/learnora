import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { teacherNav } from '../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

const steps = [
  { label: 'Academic Detail',         key: 'academic'  },
  { label: 'Score Settings',          key: 'score'     },
  { label: 'Schedule and Submission', key: 'schedule'  },
] as const


function SelectField({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <div className="relative">
        <select
          defaultValue={value}
          className="w-full h-14 px-4 pr-10 bg-surface border border-black/12 rounded-card text-sm text-foreground appearance-none outline-none focus:border-primary transition-colors"
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>
    </div>
  )
}

function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="h-14 px-4 bg-surface border border-black/12 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
      />
    </div>
  )
}

function NumberField({ label, placeholder, hint }: { label: string; placeholder: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {hint && <p className="text-xs text-muted -mt-1">{hint}</p>}
      <input
        type="number"
        placeholder={placeholder}
        className="h-14 px-4 bg-surface border border-black/12 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
      />
    </div>
  )
}

function Step1() {
  return (
    <div className="flex flex-col gap-6">
      <InputField label="Assessment Title" placeholder="Midterm Mathematics Examination" />
      <div className="grid grid-cols-2 gap-5">
        <SelectField label="Assessment Type" value="Quiz" options={['Quiz', 'Exam', 'Assignment', 'Project']} />
        <InputField label="Subject" placeholder="Mathematics" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <SelectField label="Class" value="SS2A" options={['SS1A', 'SS1B', 'SS2A', 'SS2B', 'SS3A', 'SS3B']} />
        <SelectField label="Academic Session" value="2025/2026" options={['2024/2025', '2025/2026', '2026/2027']} />
      </div>
    </div>
  )
}

function Step2() {
  return (
    <div className="flex flex-col gap-6">
      <NumberField label="Total Score" placeholder="100" hint="Maximum marks a student can earn" />
      <div className="grid grid-cols-2 gap-5">
        <NumberField label="Passing Score" placeholder="50" />
        <SelectField label="Grade Scale" value="Percentage" options={['Percentage', 'Letter Grade', 'Points', 'Pass/Fail']} />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <SelectField label="Assessment Weight" value="20%" options={['5%', '10%', '15%', '20%', '25%', '30%']} />
        <SelectField label="Attempt Limit" value="1 Attempt" options={['1 Attempt', '2 Attempts', '3 Attempts', 'Unlimited']} />
      </div>
    </div>
  )
}

function Step3() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-5">
        <InputField label="Available From" placeholder="2026-06-10 08:00 AM" />
        <InputField label="Deadline" placeholder="2026-06-17 11:59 PM" />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <SelectField label="Submission Type" value="Online" options={['Online', 'In-Person', 'Both']} />
        <SelectField label="Late Submission" value="Not Allowed" options={['Not Allowed', 'With Penalty', 'Allowed']} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground">Instructions</label>
        <textarea
          placeholder="Provide instructions for students…"
          rows={4}
          className="px-4 py-3 bg-surface border border-black/12 rounded-card text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors resize-none"
        />
      </div>
    </div>
  )
}

export default function CreateAssessmentPage({ onNavigate }: Props) {
  const [currentStep, setCurrentStep] = useState(0)

  const stepIndex = currentStep
  const isLast = stepIndex === steps.length - 1

  function handleNext() {
    if (isLast) {
      onNavigate('examinations')
    } else {
      setCurrentStep(s => s + 1)
    }
  }

  return (
    <DashboardLayout
      activePage="examinations"
      onNavigate={onNavigate}
      title="Create Assessment"
      subtitle="Set up a new assessment for grading and performance tracking."
      nav={teacherNav}
      user={{ name: 'Daniel Johnson', role: 'Teacher', initials: 'D' }}
    >
      <div className="flex justify-center">
        <div className="w-full max-w-[1088px] bg-surface rounded-card shadow-sm p-10">

          {/* Stepper */}
          <div className="flex items-center mb-10">
            {steps.map((step, i) => {
              const done    = i < stepIndex
              const active  = i === stepIndex
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`
                      size-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                      ${done   ? 'bg-primary text-white'
                      : active ? 'bg-primary text-white ring-4 ring-primary/20'
                               : 'bg-black/10 text-muted'}
                    `}>
                      {done ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${active ? 'text-primary' : 'text-muted'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px mx-3 mb-5 transition-colors ${i < stepIndex ? 'bg-primary' : 'bg-black/10'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {stepIndex === 1 ? 'Score Settings' : 'Create Assessment'}
            </h2>
            <p className="text-sm text-muted mt-1">Set up a new assessment for grading and performance tracking.</p>
          </div>

          {/* Step content */}
          {stepIndex === 0 && <Step1 />}
          {stepIndex === 1 && <Step2 />}
          {stepIndex === 2 && <Step3 />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/6">
            <button
              onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
              disabled={stepIndex === 0}
              className="h-12 px-6 border border-black/10 text-foreground text-sm font-semibold rounded-card hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="h-12 px-8 bg-primary text-white text-sm font-bold rounded-card hover:bg-primary-deep transition-colors shadow-primary"
            >
              {isLast ? 'Create Assessment' : 'Continue'}
            </button>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}
