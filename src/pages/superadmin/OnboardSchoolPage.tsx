import { useState } from 'react'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { superAdminNav } from '../../components/layout/Sidebar'

type Props = { onNavigate: (page: string) => void }

type Step = 'school' | 'admin' | 'plan' | 'confirm'

const steps: { key: Step; label: string }[] = [
  { key: 'school',  label: 'School Info'  },
  { key: 'admin',   label: 'Admin Setup'  },
  { key: 'plan',    label: 'Select Plan'  },
  { key: 'confirm', label: 'Confirm'      },
]

const plans = [
  { id: 'starter',      label: 'Starter',      price: '₦850/student/term',  students: 'Up to 500',       features: ['Basic LMS', 'Parent Portal', 'Fee Payment'] },
  { id: 'professional', label: 'Professional', price: '₦850/student/term',  students: 'Unlimited',       features: ['Everything in Starter', 'AI Tutor', 'Advanced Analytics', 'Custom Branding', 'Priority Support'] },
]

export default function OnboardSchoolPage({ onNavigate }: Props) {
  const [step, setStep] = useState<Step>('school')
  const [plan, setPlan] = useState('professional')
  const [done, setDone] = useState(false)

  const stepIndex = steps.findIndex(s => s.key === step)

  function next() {
    const nextStep = steps[stepIndex + 1]
    if (nextStep) setStep(nextStep.key)
    else setDone(true)
  }

  if (done) {
    return (
      <DashboardLayout
        activePage="schools-list"
        onNavigate={onNavigate}
        title="School Onboarded"
        nav={superAdminNav}
        user={{ name: 'Learnora Admin', role: 'Super Admin', initials: 'LA' }}
      >
        <div className="max-w-[500px] text-center mt-10">
          <div className="size-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={28} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">School Onboarded!</h1>
          <p className="text-sm text-muted mb-8">The school admin will receive a setup email. The school will appear as active once they complete setup.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('schools-list')} className="h-11 px-5 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors">
              View All Schools
            </button>
            <button onClick={() => { setDone(false); setStep('school') }} className="h-11 px-5 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
              Onboard Another
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      activePage="schools-list"
      onNavigate={onNavigate}
      title="Onboard New School"
      subtitle="Add a new school to the Learnora platform"
      nav={superAdminNav}
      user={{ name: 'Learnora Admin', role: 'Super Admin', initials: 'LA' }}
    >
      <div className="max-w-[700px] flex flex-col gap-8">

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className={`flex items-center gap-2 ${i <= stepIndex ? 'text-primary' : 'text-muted'}`}>
                <div className={`size-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < stepIndex ? 'bg-primary text-white' :
                  i === stepIndex ? 'bg-primary text-white' :
                  'bg-canvas text-muted border border-black/15'
                }`}>
                  {i < stepIndex ? '✓' : i + 1}
                </div>
                <span className="text-xs font-semibold hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${i < stepIndex ? 'bg-primary' : 'bg-black/10'}`} />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-surface rounded-card shadow-sm p-6 flex flex-col gap-5">

          {step === 'school' && (
            <>
              <h2 className="text-base font-bold text-foreground">School Information</h2>
              {[
                { label: 'School Name',     ph: 'e.g. Greenfield Academy'       },
                { label: 'School Address',  ph: 'Street, City, State'           },
                { label: 'School Email',    ph: 'info@greenfield.edu'           },
                { label: 'School Phone',    ph: '+234 800 000 0000'             },
                { label: 'School Code',     ph: 'Auto-generated (leave blank)'  },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">{f.label}</label>
                  <input placeholder={f.ph}
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
                </div>
              ))}
            </>
          )}

          {step === 'admin' && (
            <>
              <h2 className="text-base font-bold text-foreground">Admin Account</h2>
              <p className="text-sm text-muted">This person will manage the school on Learnora. They'll receive a setup email.</p>
              {[
                { label: 'Admin Full Name', ph: 'e.g. Mr Emmanuel Okafor' },
                { label: 'Admin Email',     ph: 'admin@greenfield.edu'    },
                { label: 'Admin Phone',     ph: '+234 800 000 0000'       },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground">{f.label}</label>
                  <input placeholder={f.ph}
                    className="h-12 px-4 border border-black/20 rounded-input text-sm text-foreground placeholder:text-muted outline-none focus:border-primary" />
                </div>
              ))}
            </>
          )}

          {step === 'plan' && (
            <>
              <h2 className="text-base font-bold text-foreground">Select Plan</h2>
              <div className="flex flex-col gap-3">
                {plans.map(p => (
                  <button key={p.id} onClick={() => setPlan(p.id)}
                    className={`text-left p-5 rounded-card border-2 transition-colors ${plan === p.id ? 'border-primary bg-primary/5' : 'border-black/10 hover:border-primary/40'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base font-bold text-foreground">{p.label}</span>
                      <span className="text-sm font-semibold text-primary">{p.price}</span>
                    </div>
                    <p className="text-xs text-muted mb-3">{p.students} students</p>
                    <div className="flex flex-col gap-1.5">
                      {p.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-xs text-foreground">
                          <CheckCircle2 size={12} className="text-green-500 shrink-0" />{f}
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'confirm' && (
            <>
              <h2 className="text-base font-bold text-foreground">Review & Confirm</h2>
              <div className="flex flex-col gap-3 text-sm">
                {[
                  { label: 'School',   value: 'New School Name' },
                  { label: 'Admin',    value: 'Admin User' },
                  { label: 'Plan',     value: plan === 'professional' ? 'Professional' : 'Starter' },
                  { label: 'Billing',  value: '₦850/student/term · starts on activation' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between p-3 bg-canvas rounded-card">
                    <span className="text-muted">{r.label}</span>
                    <span className="font-semibold text-foreground">{r.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted">The admin will receive an email to complete setup. The school will be billed once students are enrolled.</p>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={next}
            className="flex items-center gap-2 h-12 px-6 bg-primary text-white text-sm font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
          >
            {step === 'confirm' ? 'Create School' : 'Continue'} <ChevronRight size={14} />
          </button>
          {stepIndex > 0 && (
            <button onClick={() => setStep(steps[stepIndex - 1].key)}
              className="h-12 px-6 border border-black/20 text-foreground text-sm font-semibold rounded-pill hover:border-primary hover:text-primary transition-colors">
              Back
            </button>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}
