# Learnora — Handoff

## Stack & Conventions
React 18 + TypeScript + Vite · Tailwind CSS v4 (`@theme {}` in `src/index.css`) · react-router-dom v7
`useNav()` adapter · `DashboardLayout` (desktop) · `MobileLayout` (parent/student mobile)
Brand: primary `#4b75ff` / deep `#005cf7` / sidebar `#0d2060` — DO NOT change sidebar color

---

## Backend — Supabase

**Project URL:** `https://njriewvlsufzvxgfpzkg.supabase.co`
**Client:** `src/lib/supabase.ts`
**Auth helpers:** `src/lib/auth.ts` — `signIn()`, `signOut()`, `getProfile()`, `generateSchoolCode()`
**Schema:** `supabase/schema.sql` — already deployed to Supabase ✅
**Env vars (`.env`, gitignored):** `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
**Vercel env vars:** also set in Vercel dashboard ✅

### Auth Status
- `LoginPage.tsx` — wired to `supabase.auth.signInWithPassword()`, reads `profiles.role`, routes to correct dashboard ✅
- `SchoolSignUpPage.tsx` — creates auth user → inserts `schools` row → updates `profiles` with `school_id + role=admin` ✅
- `src/contexts/AuthContext.tsx` — `AuthProvider` wraps the whole app, `useAuth()` available everywhere ✅
- `profileToSidebarUser()` helper converts profile → `{ name, role, initials }` for DashboardLayout ✅
- Email confirmation: **disabled in Supabase** (for testing) — re-enable before production
- Super admin creation: manual — create user in Supabase Auth dashboard, then run SQL:
  ```sql
  UPDATE public.profiles SET role = 'super_admin', school_id = NULL, full_name = 'Name Here'
  WHERE email = 'superadmin@email.com';
  ```

### Database
35+ tables, all with `school_id` multi-tenancy + RLS policies. Key tables:
`schools` · `profiles` · `classes` · `subjects` · `terms` · `class_enrollments` · `teacher_assignments`
`courses` · `modules` · `lessons` · `assignments` · `assignment_submissions` · `grades`
`attendance_records` · `live_sessions` · `messages` · `invoices` · `payments` · `notifications` · `announcements`

**Pending migrations (SQL provided inline in chat — run in Supabase SQL Editor):**
- `school_settings` table
- `fee_level_configs` table (AdminFeeSetupPage uses this, NOT `fee_structures`)
- `invoices.paid_amount NUMERIC` column
- `conversation_members.last_read_at TIMESTAMPTZ` column
- Storage bucket `message-attachments`: created in dashboard ✅, public ON ✅

---

## Current State — Full Audit Pass Complete ✅ (2026-06-09)

### Audit Items Resolved (this session)

**HIGH items — all done:**
- D6 ✅ AdminAttendancePage — real school classes + students + today's attendance from Supabase
- D7 ✅ AdminAnnouncementsPage — real announcements load + send wired (INSERT with school_id, author_id, target_roles)
- D8 ✅ AdminResultsPage — real classes + grade_summaries; review modal with dynamic subject columns
- D9 ✅ AdminFeeSetupPage — fee structure upserts to `fee_structures`; bank + Paystack upserts to `school_settings`; load-on-mount pre-fills form
- D10 ✅ FeeCollectionPage — real students from `profiles` + class from `class_enrollments` + invoice data; "Record Payment" updates invoice in DB
- D11 ✅ SchoolDetailPage (super admin) — loads school name/location + user counts from Supabase; students tab uses real data

**MED items — resolved:**
- E3 ✅ ErrorBoundary added (`src/components/shared/ErrorBoundary.tsx`) — wraps entire app in `main.tsx`
- E4 ✅ `src/lib/supabaseError.ts` utility added — wired into GradeBook, Attendance, AdminAnnouncements writes
- A8 ✅ ParentProgressPage — school_id guard added: verifies child belongs to parent's school before querying
- A9 ✅ MobileStudentSettingsPage — Sign Out now calls `signOut()` from `useAuth()` (was just `onNavigate('login')`)
- D24 ✅ TeacherAssignmentsPage — added `.eq('school_id', profile.school_id)` to assignments query
- D25 ✅ MessagesPage + TeacherMessagesPage — `conversation_members` membership query now includes `.eq('school_id', ...)`
- Q8 ✅ SchoolFeesPage — bank details now loaded from `school_settings` table (set up by admin in AdminFeeSetupPage)
- N3 ✅ ParentHomePage "View All" quick actions button → `parent/fees`

**LOW items — resolved:**
- V4 ✅ AssignmentBuilderPage — validates title, deadline, instructions before publish
- V2 ✅ ProfileSettingsPage — first name required before save
- Q3 ✅ MessagesPage + TeacherMessagesPage — rollback optimistic message if INSERT fails
- N6 ✅ SchoolFeesPage download buttons — disabled with `cursor-not-allowed` + tooltip (receipt download not yet implemented)

**Additional fixes this session:**
- A6 ✅ SettingsPage — profile card now shows real name/email/role from `useAuth()`, sign-out calls `signOut()`
- E5 ✅ ParentProgressPage — empty-state message when `learnora_selected_child` is missing from localStorage
- N4 ✅ MessagesPage paperclip — wired to Supabase Storage upload; images displayed inline, other files as download link
- DB ✅ AdminFeeSetupPage — switched from `fee_structures` to `fee_level_configs` (schema mismatch fix)

### Still Open
- Q5 — localStorage coupling fragile (architectural — acceptable for now)
- S3 — audit_logs, quiz_questions etc. tables don't exist in schema yet
- N5 — MoreVertical menu in MessagesPage header is a stub
- R4 — Admin tables at narrow viewport not fully audited

### This session — fully resolved
- E6 ✅ Unread counts: computed from `last_read_at`; marked read on conversation open
- Q4 ✅ Realtime: `postgres_changes` subscription in MessagesPage + TeacherMessagesPage
- Q7 ✅ Supabase types generated → `src/lib/database.types.ts`; client is `createClient<Database>`
- 15.1–15.9 ✅ EmptyStatePage: all 9 states (404, 403, offline, maintenance, subscription-expired, no-courses, no-assignments, no-notifications, no-search) driven by `?type=` URL param; wildcard `*` route already redirects to `/404`

---

## What's Built (All Screens)

### Super Admin
SuperAdminDashboardPage, SchoolsListPage, SchoolDetailPage (6 tabs, real school/user counts),
PlansAndPricingPage, PlatformBillingPage, PlatformAnalyticsPage, BroadcastPage, SupportTicketsPage,
PlatformSettingsPage, FeatureFlagsPage, EmailTemplatesPage, AuditLogsPage, OnboardSchoolPage,
SuperAdminNotificationsPage

### Admin
AdminDashboardPage, AdminResultsPage, AdminFeeSetupPage (wired to DB),
FeeCollectionPage (wired to DB), AdminAttendancePage (wired to DB),
AdminAnnouncementsPage (wired to DB), AdminSupportPage, RolesPermissionsPage,
AuditLogsPage, TimetableManagementPage, SchoolAnalyticsPage, SubscriptionBillingPage

### Teacher
TeacherDashboardPage, GradeBookPage, AttendanceManagementPage, TeacherAnnouncementsPage,
AnalysisPage, MyClassesPage, StudentsManagementPage, TeacherAssignmentsPage,
AssignmentBuilderPage, SubmissionsInboxPage, GradingScreenPage, MyCoursesPage,
full live classes suite, TeacherMessagesPage (school-scoped)

### Student
OverviewDashboardPage, MyCoursesPage, CourseDetailsPage, AssignmentsPage,
AssignmentDetailsPage, NotificationsPage, GlobalSearchPage, full mobile suite,
MobileStudentSettingsPage (logout wired)

### Parent
ParentHomePage (multi-child switcher), SchoolFeesPage (real bank details from school_settings),
ParentProgressPage (school-id guarded), full payment flow D15–D20

---

## Error Handling Infrastructure
- `src/components/shared/ErrorBoundary.tsx` — class component, wraps full app
- `src/lib/supabaseError.ts` — `logSupabaseError(context, error)` + `logAuthError(context, error)`
- Wired into: GradeBookPage save, AttendanceManagementPage save, AdminAnnouncementsPage send
- Pattern to follow for future: import `logSupabaseError` and call after every write operation

---

## Notifications Routing
- Student/Teacher/Admin bell → `/notifications` (role-aware sidebar via `useAuth()`)
- Super Admin bell → `/super-notifications` (uses `superAdminNav`)

## Dark Mode
CSS vars under `[data-theme="dark"]` in `index.css`. Toggled from TeacherSettingsPage and MobileStudentSettingsPage.

## Design Source
Screenshots in `design/sections/`. MCP available but rate-limited on free plan.

## Round 3 — 18 New Pages (2026-06-10) ✅

**New pages built and routed:**
- `ScreenSharePage` `/screen-share` — screen share controls for live class
- `ParticipantsPanelPage` `/participants-panel` — participant list with mic/cam/hand-raised states (Supabase-backed)
- `OfflineSyncPage` `/offline-sync` — sync queue with pending/synced/failed states (mock)
- `WhiteboardPage` `/whiteboard` — full Canvas API drawing (pen/eraser/rect/circle/text, undo, download)
- `AttendanceHistoryPage` `/attendance-history` — teacher view of past attendance records
- `SubjectPerformancePage` `/subject-performance` — student per-subject drill-down from grade_summaries
- `DeadlinesViewPage` `/deadlines` — student assignments by urgency (overdue/today/week/upcoming)
- `SharedFilesPage` `/shared-files` — message attachments grid with file-type detection
- `CourseResourcesPage` `/course-resources` — student lesson list for selected course (tabs by type)
- `CourseSettingsPage` `/course-settings` — teacher edit course title/description
- `PlagiarismCheckPage` `/plagiarism-check` — submission similarity scores (simulated)
- `TwoFASetupPage` `/2fa-setup` — full Supabase TOTP MFA: enroll → QR code → challenge → verify → recovery codes persisted to user_metadata
- `AddEventPage` `/add-event` — calendar event form → inserts to `live_sessions`
- `StorageManagementPage` `/storage-management` — queries `message-attachments` Supabase Storage bucket; sums sizes by MIME type
- `BadgesRewardsPage` `/badges-rewards` — XP from lesson_progress + submissions (real); claims persisted to `badge_claims` table
- `ConnectedDevicesPage` `/connected-devices` — active sessions list (mock)
- `PrivacySettingsPage` `/privacy-settings` — privacy toggles persisted to Supabase auth user_metadata
- `LinkedAccountsPage` `/linked-accounts` — wired to `getUserIdentities/linkIdentity/unlinkIdentity` (OAuth redirect)

**TypeScript fixes (caught by Vercel fresh build):**
- `interface Record` → `AttendRow` (shadowed built-in)
- `Chrome` icon → `Info` (lucide-react)
- `courses.published` column removed from CourseSettingsPage
- `live_sessions.topic` cast pattern in AddEventPage
- `grade_summaries` class_id → via `class_enrollments` join in LeaderboardPage
- `profile.created_at` cast in AchievementsPage
- `PostgrestBuilder` → `any[]` in MobileStudentMessagesPage
- Unused imports/variables removed across 12+ files

## Round 4 — Wiring Stubs to Real Services (2026-06-11) ✅

All 5 "available in stack" items wired up. Run this SQL in Supabase before testing badge claims:

```sql
CREATE TABLE IF NOT EXISTS public.badge_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  school_id  UUID NOT NULL REFERENCES schools(id)  ON DELETE CASCADE,
  reward_id  TEXT NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, reward_id)
);
ALTER TABLE badge_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_claims" ON badge_claims
  USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
```

**Wiring changes made:**
1. `WhiteboardPage` — full HTML5 Canvas: useRef, mousedown/move/up + touch, pen/eraser/rect/circle/text tools, 24-frame undo stack, clear, download as PNG
2. `TwoFASetupPage` — `supabase.auth.mfa.enroll()` → real TOTP QR code; `challenge()` + `verify()` flow; recovery codes generated client-side and stored in `user_metadata`; SMS option disabled (not in Supabase stack)
3. `LinkedAccountsPage` — `getUserIdentities()` on mount; `linkIdentity({ provider })` triggers OAuth redirect; `unlinkIdentity(identity)` to disconnect; provider 'microsoft' maps to Supabase 'azure'
4. `StorageManagementPage` — lists `message-attachments` bucket for school prefix, walks sub-folders (capped at 20), sums bytes by MIME type into video/pdf/image categories
5. `BadgesRewardsPage` — loads `badge_claims` on mount to restore claimed state; `claim()` inserts to `badge_claims` table (cast pattern)

## Roadmap Checklists

### Option A — Third-party services (blocked on external accounts)
- [ ] Video calls / Live Classroom real WebRTC — Daily.co, Jitsi, or Twilio
- [ ] Real screen share — same video provider
- [ ] SMS 2FA — Twilio / Africa's Talking
- [ ] Push notifications — Firebase FCM
- [ ] AI essay auto-feedback — OpenAI API
- [ ] ConnectedDevicesPage — real session list (Supabase Admin API, server-side only)

### Option B — Polish & production hardening (in progress)
- [ ] Re-enable Supabase email confirmation + custom template (Supabase dashboard — not code)
- [ ] Stripe / Paystack payment webhook (server-side; FeeCollectionPage records manually for now)
- [x] Wire `logSupabaseError` into all critical write paths (14 pages — see commit fee675e)
- [ ] RLS audit — verify every table policy before going multi-tenant (SQL review)
- [ ] OfflineSyncPage — real Service Worker offline queue
- [ ] Fix localStorage coupling (Q5 — architectural, low urgency)
- [ ] Admin tables responsive audit at narrow viewport (R4)
- [x] MoreVertical menu in MessagesPage header (N5) — already implemented (markUnread + shared-files)

### Option C — New screens / features ✅ COMPLETE
- [x] SQL: `timetable_entries` table — run in Supabase SQL Editor (see below)
- [x] SQL: `quiz_questions` + `quiz_attempts` tables — run in Supabase SQL Editor (see below)
- [x] SQL: `bulk_student_imports` not needed — batch insert directly from CSV
- [x] StudentTimetablePage `/student-timetable` — weekly grid for students (mobile day-picker + desktop table)
- [x] ChildTimetablePage `/parent/timetable` — already wired (reads `timetable_entries`)
- [x] TimetableManagementPage `/timetable` — admin grid editor, already wired (reads/writes `timetable_entries`)
- [x] QuizBuilderPage `/quiz-builder` — wired to `quiz_questions` (MCQ/true-false/short; delete+re-insert pattern)
- [x] QuizPage `/m/quiz` — loads from `quiz_questions`, saves to `quiz_attempts`, navigates to quiz-result
- [x] QuizResultPage `/m/quiz-result` — reads `learnora_quiz_result` from localStorage (set by QuizPage); shows score/grade/XP
- [x] ReportCardsPage `/parent/report-cards` — already wired to `grade_summaries`
- [x] ParentMessageTeacherPage — already wired
- [x] BulkStudentImportPage `/admin/bulk-import` — CSV drag-drop → parse → preview → batch insert profiles + class_enrollments; template download; per-row result table

### Option D — Mobile app ✅ COMPLETE
- [x] Capacitor installed + configured (appId: com.learnora.app, androidScheme: https)
- [x] vite.config.ts: base='./' for native WebView relative paths
- [x] android/ and ios/ native project scaffolds committed
- [x] To build Android APK: `npm run build && npx cap sync && npx cap open android`
- [x] To build iOS (Mac only): `npm run build && npx cap sync && npx cap open ios`

---

### SQL to run in Supabase (Option C — run these before testing timetable and quiz)

```sql
-- Timetable entries (day is TEXT: 'Monday'..'Friday'; period is 0-indexed INT)
CREATE TABLE IF NOT EXISTS public.timetable_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id   UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id),
  day        TEXT NOT NULL,
  period     INT  NOT NULL,
  start_time TIME NOT NULL,
  end_time   TIME NOT NULL,
  room       TEXT,
  UNIQUE(class_id, day, period)
);
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "school_members_read_tt" ON timetable_entries
  FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "admin_teacher_write_tt" ON timetable_entries
  FOR ALL USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher','super_admin')))
  WITH CHECK (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('admin','teacher','super_admin')));

-- Quiz questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID REFERENCES lessons(id) ON DELETE CASCADE,
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  question    TEXT NOT NULL,
  type        TEXT DEFAULT 'mcq' CHECK (type IN ('mcq','truefalse','short')),
  options     JSONB,
  explanation TEXT,
  points      INT DEFAULT 1,
  order_index INT DEFAULT 0,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "school_read_qq" ON quiz_questions
  FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid()));
CREATE POLICY "teacher_write_qq" ON quiz_questions
  FOR ALL USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','super_admin')))
  WITH CHECK (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin','super_admin')));

-- Quiz attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES lessons(id),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  answers      JSONB,
  score        INT,
  max_score    INT,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_quiz_attempts" ON quiz_attempts
  FOR ALL USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
CREATE POLICY "teacher_read_qa" ON quiz_attempts
  FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE id = auth.uid() AND role IN ('teacher','admin')));
```

---

## Git / Deploy
- Repo: `github.com/fiyeduala/learnora`
- Deploy: Vercel auto-deploys on push to `main`
- Latest commit: `2ac43f5` — wired 5 stub pages to real services
- Round 5 (2026-06-11): StudentTimetablePage routed; BulkStudentImportPage built; QuizPage/QuizBuilderPage/QuizResultPage fully wired — Option C complete
