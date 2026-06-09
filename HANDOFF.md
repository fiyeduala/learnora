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

## Git / Deploy
- Repo: `github.com/fiyeduala/learnora`
- Deploy: Vercel auto-deploys on push to `main`
- Latest commit: `4850a9b` — E6/Q4 unread counts + Realtime; fix EmptyStatePage type
