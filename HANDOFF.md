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

---

## Current State

### What works end-to-end
- School registration (signup → Supabase → school code generated)
- Login → role read from DB → routes to correct dashboard
- Super admin login → super-dashboard
- **Admin panel — Phase 1 complete ✅**

### Admin Panel — Wired (Phase 1)
- `AdminDashboardPage` — real student/teacher/class counts + recent users; onboarding checklist auto-marks steps as done
- `ClassesManagementPage` — reads classes from Supabase; creates classes with subjects + form teacher; auto-seeds default subjects on first load
- `UserManagementPage` — reads real profiles; Add User creates invite record + shows shareable signup link
- `InviteAcceptancePage` — reads invite token from URL, calls `signUp()`, updates profile with `school_id + role`, enrolls student in class
- **Migration required**: run `supabase/migrations/001_admin_panel.sql` in Supabase SQL Editor (adds `form_teacher_id` to classes, creates `invitations` table)

### Settings pages — role-aware nav ✅ (committed 2026-06-09)
All 4 settings pages (`SettingsPage`, `ProfileSettingsPage`, `NotificationSettingsPage`, `SecuritySettingsPage`) now use `useAuth()` to read role and render the correct sidebar nav, active page highlight, and back button. Admins see admin sidebar, teachers see teacher sidebar, super admin sees super admin sidebar — no longer falls through to student nav.

### Nav / Cross-role Fixes — Full Audit Pass ✅
- `TopBar` fully role-aware (messages, calendar, settings, notifications)
- Live class pages (`PreClassLobbyPage`, `LiveClassRoomPage`, `ClassRecordingsPage`) are now role-aware: teacher → `teacher-live-classes`, student → `live-classes`
- `LiveClassesOverviewPage` — student-only; removed Schedule button (teachers use `TeacherLiveClassesPage`)
- `ScheduleLiveClassPage` back → `teacher-live-classes` ✅
- `ComposeAnnouncementPage` back + publish → `teacher-announcements` ✅
- `TeacherAnnouncementsPage` card click → `announcement-details` ✅
- `AnnouncementsFeedPage` (student) — removed Compose button; card → `announcement-details` ✅
- `StudentDetailViewPage` + `BehaviorAnalyticsPage` Message → `teacher-messages` ✅
- `MyCoursesPage` course card → `course-details` (was `course-detail`, was 404) ✅
- `MyClassesPage` (teacher) — removed "New Class" button (admin creates classes) ✅
- `TeacherDashboardPage` "View calendar" label fixed → "View all" (→`classes`); "Post Announcement" → `teacher-announcements` ✅
- `ParentMessageTeacherPage` back → `parent/chat` ✅
- `MobileStudentHomePage` AI banner → `ai-tutor` (was `m/ai`, was 404) ✅
- `MobileStudentProfilePage` settings icon → `m/settings` ✅
- `CompleteProfilePage` routes by role after submit ✅
- `AdminAttendancePage` "View Details" drills into class students in-page ✅
- `AdminClassDetailsPage` — NEW page at `/admin-class-details`; shows class info, students, performance, attendance ✅
- `MobileStudentSettingsPage` — NEW page at `/m/settings` with dark mode toggle + account links ✅

### Supabase Wiring — Batch 2 (Teacher core) ✅ (2026-06-09)
- `TeacherDashboardPage` — live stats (classes, students, pending submissions), recent submissions activity, assignment overview table
- `MyClassesPage` — teacher_assignments → classes with enrollment counts
- `StudentsManagementPage` — class_enrollments → profiles for teacher's classes; search + class filter
- `InClassAttendancePage` — class selector dropdown; loads enrolled students; upserts attendance_records (present/absent/late)
- `AssignmentBuilderPage` — real class+subject dropdowns from teacher_assignments; INSERT assignments (published or draft); success screen
- `SubmissionsInboxPage` — loads real assignment_submissions for teacher's assignments; status filter + search
- `GradingScreenPage` — loads first ungraded submission (status='submitted'); grade score input + feedback; INSERT grades + UPDATE submission status='graded'

**Note on GradingScreenPage:** Loads the oldest ungraded submission. No routing params yet — teacher navigates to this page from SubmissionsInboxPage and grades one at a time. Full per-submission routing is a future improvement.

### Next Batches
**Batch 3 — Student core:**
- OverviewDashboardPage, MyCoursesPage + CourseDetailsPage, AssignmentsPage + AssignmentDetailsPage

**Batch 4 — Parent core:**
- ParentHomePage (parent_student_links), ParentProgressPage, SchoolFeesPage

**Batch 5 — Shared:**
- Announcements, Notifications, Messages, Calendar

---

## Mock Data Status
All pages cleared — empty state UI shows everywhere until real data is added:
- ✅ All student dashboard pages
- ✅ All teacher dashboard pages
- ✅ All super admin pages (dashboard, schools list, analytics, billing, support)
- ✅ Admin pages (cleared in earlier session)
- ⚠️ Some lower-priority pages NOT yet cleared (not in main testing flow):
  AnalysisPage, StudentAnalysisPage, StudentProfilePage, TeacherAnalyticsPage,
  AttendanceAnalyticsPage, StudyConsistencyPage, AchievementsPage, GroupChatPage,
  LiveClassRoomPage, AcademicHistoryPage, LessonNotesPage, AIStudyPlanPage,
  ParentProgressPage, QuizPage, ReportPage

---

## What's Built (All Screens)

### Super Admin
SuperAdminDashboardPage, SchoolsListPage, SchoolDetailPage (6 tabs), PlansAndPricingPage,
PlatformBillingPage, PlatformAnalyticsPage, BroadcastPage, SupportTicketsPage,
PlatformSettingsPage, FeatureFlagsPage, EmailTemplatesPage, AuditLogsPage, OnboardSchoolPage,
**SuperAdminNotificationsPage** (bell → correct page with superAdminNav)

### Admin
AdminDashboardPage (onboarding checklist), AdminResultsPage, AdminFeeSetupPage,
FeeCollectionPage, AdminAttendancePage, AdminAnnouncementsPage, AdminSupportPage,
RolesPermissionsPage, AuditLogsPage, TimetableManagementPage, SchoolAnalyticsPage,
SubscriptionBillingPage

### Teacher
TeacherDashboardPage, TeacherSettingsPage (dark mode functional), GradeBookPage,
MyClassesPage, StudentsManagementPage, TeacherAssignmentsPage, MyCoursesPage,
full live classes suite

### Student
OverviewDashboardPage, MyCoursesPage, AssignmentsPage, NotificationsPage,
GlobalSearchPage (6 result types), full suite

### Parent
ParentHomePage (multi-child switcher), PaymentSuccessPage, full fee flow

---

## Notifications Routing
- Student/Teacher/Admin bell → `/notifications` (uses `studentNav`) — needs role-aware nav eventually
- **Super Admin bell → `/super-notifications`** (uses `superAdminNav`) ✅ fixed
- Routing logic in `TopBar.tsx`: checks `user.role === 'Super Admin'`

## Dark Mode
CSS vars under `[data-theme="dark"]` in `index.css`. Toggled from TeacherSettingsPage → `localStorage` key `learnora-theme`.

## Design Source
Screenshots in `design/sections/`. MCP available but rate-limited on free plan.

## Git / Deploy
- Repo: `github.com/fiyeduala/learnora` (going private)
- Deploy: Vercel auto-deploys on push to `main`
- Vercel env vars already set — no action needed after making repo private
