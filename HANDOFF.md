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

### What's built but NOT yet wired to Supabase
Every dashboard page shows correct empty state (no fake data). Pages need Supabase queries added feature by feature. **Wire in this order:**

**Phase 1 — Admin panel (do this first, everything else depends on it)**
1. Admin: Create terms, subjects, classes
2. Admin: Add teachers → assign to classes/subjects
3. Admin: Add students → enroll in classes
4. Admin: Add parents → link to students

**Phase 2 — Teacher features**
5. Teacher: View assigned classes + students
6. Teacher: Post assignments
7. Teacher: Mark attendance
8. Teacher: Grade submissions

**Phase 3 — Student features**
9. Student: View enrolled courses + assignments
10. Student: Submit assignments
11. Student: View grades/report cards

**Phase 4 — Parent features**
12. Parent: View linked children's progress + fees

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
