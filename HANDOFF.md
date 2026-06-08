# Learnora — Handoff

## Stack & Conventions
React 18 + TypeScript + Vite · Tailwind CSS v4 (`@theme {}` in `src/index.css`) · react-router-dom v7
`useNav()` adapter · `DashboardLayout` (desktop) · `MobileLayout` (parent/student mobile)
Brand: primary `#4b75ff` / deep `#005cf7` / sidebar `#0d2060` — DO NOT change sidebar color

---

## Backend

**Supabase** — `https://njriewvlsufzvxgfpzkg.supabase.co`
- Client: `src/lib/supabase.ts`
- Auth helpers: `src/lib/auth.ts` (signIn, signOut, getProfile, generateSchoolCode)
- Schema: `supabase/schema.sql` (paste into Supabase SQL Editor → Run All)
- Env vars (in `.env`, gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

**Auth wired:**
- `LoginPage.tsx` — calls `supabase.auth.signInWithPassword()`, reads `profiles` for role, navigates to correct dashboard
- `SchoolSignUpPage.tsx` — creates auth user, inserts `schools` record, updates `profiles` with `school_id` + `role=admin`

**Schema deployed?** → User needs to paste `supabase/schema.sql` into Supabase SQL Editor and run it.

---

## Immediate Next Steps

### Step 1: Deploy the schema
1. Go to Supabase dashboard → SQL Editor
2. Paste the entire contents of `supabase/schema.sql`
3. Click Run — should complete with no errors

### Step 2: Disable email confirmation (for testing)
Supabase Dashboard → Authentication → Settings → "Confirm email" → toggle OFF
(Re-enable before production)

### Step 3: Test the signup flow
1. Go to `/signup`, register a school
2. You should land on the "Done" screen with a school code
3. Log in at `/login` with the admin email/password
4. Should land on the admin dashboard

### Step 4: Wire data feature by feature
After you can log in and see empty dashboards, wire features one at a time:
- Admin: create classes, add students/teachers (admin pages → Supabase inserts)
- Teacher: view classes, post assignments
- Student: see enrolled courses, submit assignments
- Parent: see linked children

---

## What's Built (All Screens)

### Super Admin
SchoolDetailPage (6 tabs), PlansAndPricingPage, PlatformBillingPage, BroadcastPage, SchoolsListPage, OnboardSchoolPage, PlatformAnalyticsPage, SupportTicketsPage, PlatformSettingsPage, FeatureFlagsPage, EmailTemplatesPage, AuditLogsPage

### Admin
AdminDashboardPage (onboarding checklist), AdminResultsPage (grade review + publish), AdminFeeSetupPage, FeeCollectionPage, AdminAttendancePage, AdminAnnouncementsPage, AdminSupportPage, RolesPermissionsPage, AuditLogsPage, TimetableManagementPage

### Teacher
TeacherDashboardPage, TeacherSettingsPage (dark mode), GradeBookPage, full suite

### Student
AssignmentsPage (submission confirmation), GlobalSearchPage (6 result types), NotificationsPage, full suite

### Parent
ParentHomePage (multi-child switcher: Olive + Tobi), PaymentSuccessPage, full fee flow

---

## Mock Data Status
All 20+ dashboard pages have been cleared of hardcoded fake data:
- Arrays emptied → show "No data yet" empty states
- Stat cards show "—" until real data flows in
- UI layout and components unchanged

Remaining pages not yet cleared (lower priority — not in main testing flow):
AnalysisPage, StudentAnalysisPage, StudentProfilePage, TeacherAnalyticsPage, AttendanceAnalyticsPage, StudyConsistencyPage, AchievementsPage, GroupChatPage, LiveClassRoomPage, AcademicHistoryPage, LessonNotesPage, AIStudyPlanPage, parent/ParentProgressPage, mobile/QuizPage, ReportPage

---

## Dark Mode
CSS vars under `[data-theme="dark"]` in `index.css`. Toggled from TeacherSettingsPage → `localStorage` key `learnora-theme`.

## Design Source
Screenshots in `design/`. MCP available but rate-limited on free plan.
