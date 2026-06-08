import { useState } from 'react'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import AuthHeroPanel from '../components/auth/AuthHeroPanel'

type Props = { onNavigate: (page: string) => void }

export default function InviteAcceptancePage({ onNavigate }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [done, setDone]           = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
      <div className="lg:w-[52%] lg:flex-shrink-0 p-3 lg:p-6">
        <AuthHeroPanel />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-0 lg:px-12">
        <div className="w-full max-w-[500px]">

          {done ? (
            <div className="text-center">
              <div className="size-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={28} className="text-green-600" />
              </div>
              <h1 className="text-3xl font-semibold text-foreground mb-3">You're all set!</h1>
              <p className="text-base text-muted mb-8">Your account has been activated. Welcome to Learnora!</p>
              <button
                onClick={() => onNavigate('login')}
                className="w-full h-14 bg-primary text-white text-base font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
              >
                Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Invitation context */}
              <div className="flex items-center gap-3 bg-primary/8 rounded-card px-4 py-3 mb-6">
                <div className="size-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">G</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Greenfield Academy</p>
                  <p className="text-xs text-muted">You've been invited as a Student</p>
                </div>
              </div>

              <h1 className="text-4xl font-semibold text-foreground mb-2 leading-tight">Accept Invitation</h1>
              <p className="text-base text-muted mb-8">Set up your account to get started.</p>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-foreground">First Name</label>
                    <input
                      required value={firstName} onChange={e => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="h-14 px-5 border border-black/20 rounded-input text-base text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-foreground">Last Name</label>
                    <input
                      required value={lastName} onChange={e => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="h-14 px-5 border border-black/20 rounded-input text-base text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-base font-bold text-foreground">Email Address</label>
                  <input
                    type="email" disabled value="olive.johnson@greenfield.edu"
                    className="h-14 px-5 border border-black/10 rounded-input text-base text-muted bg-canvas cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-base font-bold text-foreground">Create Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      required value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full h-14 px-5 pr-12 border border-black/20 rounded-input text-base text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-14 bg-primary text-white text-base font-semibold rounded-pill hover:bg-primary-deep transition-colors shadow-primary"
                >
                  Activate Account
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
