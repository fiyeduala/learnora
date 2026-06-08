import { useState } from 'react'
import { Plus } from 'lucide-react'

type Props = { onNavigate: (page: string) => void }

export default function CompleteProfilePage({ onNavigate }: Props) {
  const [phone, setPhone]   = useState('')
  const [school, setSchool] = useState('')
  const [cls, setCls]       = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onNavigate('dashboard')
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[900px]">

        {/* Title above card */}
        <h1 className="text-4xl font-semibold text-foreground mb-1">Complete Your Profile</h1>
        <p className="text-base text-muted mb-8">Help us personalize your experience.</p>

        <div className="bg-surface rounded-card shadow-md p-10">

          {/* Avatar upload */}
          <div className="flex items-center gap-5 mb-8">
            <div className="size-[120px] rounded-full border-2 border-dashed border-black/20 bg-canvas flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/4 transition-colors">
              <div className="flex flex-col items-center gap-1 text-muted hover:text-primary transition-colors">
                <Plus size={32} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Add Photo</p>
              <p className="text-xs text-muted mt-0.5">JPG, PNG or GIF — max 2 MB</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-bold text-foreground">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="Type in your phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="
                  h-[70px] w-full border border-muted/40 rounded-card px-5
                  text-sm text-foreground placeholder:text-muted/70
                  outline-none focus:border-primary transition-colors bg-surface
                "
              />
            </div>

            {/* School Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="school" className="text-sm font-bold text-foreground">School Name</label>
              <input
                id="school"
                type="text"
                placeholder="Type in your school name"
                value={school}
                onChange={e => setSchool(e.target.value)}
                className="
                  h-[70px] w-full border border-muted/40 rounded-card px-5
                  text-sm text-foreground placeholder:text-muted/70
                  outline-none focus:border-primary transition-colors bg-surface
                "
              />
            </div>

            {/* Class */}
            <div className="flex flex-col gap-2">
              <label htmlFor="class" className="text-sm font-bold text-foreground">Class</label>
              <input
                id="class"
                type="text"
                placeholder="e.g. SS2A"
                value={cls}
                onChange={e => setCls(e.target.value)}
                className="
                  h-[70px] w-full border border-muted/40 rounded-card px-5
                  text-sm text-foreground placeholder:text-muted/70
                  outline-none focus:border-primary transition-colors bg-surface
                "
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="
                w-full h-[78px] bg-primary text-white text-base font-bold
                rounded-card hover:bg-primary-deep transition-colors shadow-primary mt-2
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
              "
            >
              Finish Setup
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
