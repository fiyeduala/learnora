import { ArrowLeft, Pin, Paperclip, Calendar, User, Download } from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

type Props = { onNavigate: (page: string) => void }

const announcement = {
  title: 'Second Term Examination Schedule — 2025/2026',
  category: 'Examinations',
  categoryColor: 'bg-red-50 text-red-600',
  author: 'Admin Okafor',
  authorRole: 'School Admin',
  date: 'June 5, 2026',
  pinned: true,
  audience: 'All Students & Parents',
  body: `Dear Students and Parents,

The Second Term Examinations for the 2025/2026 academic session are scheduled to commence on Monday, June 15, 2026, and will run through Friday, June 26, 2026.

All students are required to report to school by 7:45 AM on each examination day. Late arrivals will not be granted additional time.

Please note the following important guidelines:

1. Students must bring their examination ID cards to every paper.
2. Calculators are permitted only in Mathematics, Physics, and Further Mathematics papers.
3. Mobile phones and electronic devices are strictly prohibited in the examination hall.
4. Students should come prepared with two blue or black ballpoint pens, pencils, and a ruler.
5. The examination timetable has been attached to this announcement — please review it carefully.

Parents are advised to ensure their wards are well-rested and arrive on time. For any concerns, please contact the school admin office via the messaging feature.

We wish all students the very best as they prepare. Study hard and remain focused!

Warm regards,
School Administration
Greenfield Academy`,
  attachments: [
    { name: 'Exam_Timetable_Term2_2026.pdf', size: '312 KB' },
    { name: 'Exam_Guidelines.pdf', size: '95 KB' },
  ],
}

const categoryMap: Record<string, string> = {
  Examinations: 'bg-red-50 text-red-600',
  Assignments: 'bg-amber-50 text-amber-600',
  General: 'bg-primary/10 text-primary',
  Events: 'bg-accent-mint/10 text-accent-mint',
}

export default function AnnouncementDetailsPage({ onNavigate }: Props) {
  const catColor = categoryMap[announcement.category] ?? 'bg-canvas text-muted'

  return (
    <DashboardLayout activePage="announcements" onNavigate={onNavigate} title="Announcement">
      <div className="max-w-[780px] flex flex-col gap-5">
        <button
          onClick={() => onNavigate('announcements')}
          className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Announcements
        </button>

        {/* Header */}
        <div className="bg-surface rounded-card shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catColor}`}>
                {announcement.category}
              </span>
              {announcement.pinned && (
                <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <Pin size={10} /> Pinned
                </span>
              )}
            </div>
          </div>

          <h1 className="text-xl font-bold text-foreground leading-snug mb-4">{announcement.title}</h1>

          <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-black/6">
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={13} className="text-primary" />
              </div>
              <span className="font-medium text-foreground">{announcement.author}</span>
              <span>·</span>
              <span>{announcement.authorRole}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Calendar size={13} />
              <span>{announcement.date}</span>
            </div>
            <div className="text-sm text-muted">
              <span>To: <span className="font-medium text-foreground">{announcement.audience}</span></span>
            </div>
          </div>

          {/* Body */}
          <div className="mt-5">
            {announcement.body.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Attachments */}
        {announcement.attachments.length > 0 && (
          <div className="bg-surface rounded-card shadow-sm p-6">
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Paperclip size={14} className="text-muted" /> Attachments
            </h2>
            <div className="flex flex-col gap-2">
              {announcement.attachments.map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-canvas rounded-card px-4 py-3">
                  <div className="size-9 rounded-card bg-primary/10 flex items-center justify-center shrink-0">
                    <Paperclip size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-muted">{a.size}</p>
                  </div>
                  <button className="flex items-center gap-1.5 h-8 px-3 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary/20 transition-colors">
                    <Download size={12} /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
