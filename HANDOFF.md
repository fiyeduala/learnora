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

**New tables expected (may need migration):**
- `fee_structures (school_id, level, term, items jsonb)` — for AdminFeeSetupPage
- `school_settings (school_id, bank_name, account_number, account_name, paystack_public_key, paystack_secret_key, paystack_subaccount_code)` — for AdminFeeSetupPage + SchoolFeesPage

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
- Q3 ✅ MessagesPage + TeacherMessagesPage — rollback optimistic message if INSERT fails
- N6 ✅ SchoolFeesPage download buttons — disabled with `cursor-not-allowed` + tooltip (receipt download not yet implemented)

### Still Open (not fixed — needs schema work or complex implementation)
- E6 — Unread message count always 0 (needs `last_read_at` in `conversation_members`)
- Q4 — No Supabase Realtime subscription on messages (future improvement)
- Q5 — localStorage coupling fragile (architectural — acceptable for now)
- Q7 — No Supabase type generation (run `supabase gen types` when ready)
- S3 — RLS not explicitly enabled on 9+ tables (`audit_logs`, `quiz_questions`, etc.) — needs SQL migration
- V3 — SecuritySettingsPage already calls `signInWithPassword` for re-auth before password change ✅ (actually fine)
- N4/N5 — Paperclip and MoreVertical in MessagesPage are UI stubs (file attach not implemented)
- A6 — Default sidebar user "Olive Johnson" (47 pages — most now pass `profileToSidebarUser(profile)`)
- R4 — Admin tables at narrow viewport not fully audited

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
- Latest commit: `bd60a89` — Fix V4/Q3/N3/N6: assignment validation, message rollback, dead buttons
