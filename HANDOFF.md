# Learnora — Handoff

## Stack & Conventions
React 18 + TypeScript + Vite · Tailwind CSS v4 (`@theme {}` in `src/index.css`) · react-router-dom v7
`useNav()` adapter · `DashboardLayout` (desktop) · `MobileLayout` (parent/student mobile)
Brand: primary `#4b75ff` / deep `#005cf7` / sidebar `#0d2060` — DO NOT change sidebar color

---

## Fix & Feature Checklist — ALL DONE

### 🔴 Broken Links
- [x] SchoolsListPage → `school-detail` ✅
- [x] SuperAdminDashboard → `school-detail` ✅
- [x] TopBar — Search/Bell/Messages/Calendar/Avatar dropdown ✅
- [x] AdminDashboardPage — alert buttons ✅
- [x] TeacherDashboardPage — all nav links ✅
- [x] BroadcastPage — reactive sent list ✅
- [x] ParentHomePage — Bell/Settings ✅

### 🟠 Orphaned Pages
- [x] adminNav — Timetable, Roles, Audit Logs, **Results** ✅
- [x] superAdminNav — Feature Flags, Email Templates, Audit Logs ✅

### 🟡 Features
- [x] Notification centre — `/notifications` ✅
- [x] Avatar profile dropdown — TopBar ✅
- [x] Payment receipt — `/parent/payment-success` ✅
- [x] **Multi-child support** — ParentHomePage: dropdown switcher, 2 children (Olive & Tobi), per-child fee/performance ✅
- [x] **Admin onboarding checklist** — dismissible 5-step guide on AdminDashboard, progress bar, per-step Go → links ✅
- [x] **Assignment submission confirmation** — inline success flash, status updates to Completed in state, row highlights green ✅
- [x] **Search** — GlobalSearchPage: 6 result types (course/assignment/student/teacher/event/announcement), category filter tabs ✅
- [x] **Results management** — `/admin-results`: class-by-class grade review, publish modal, publish-all button, AdminResultsPage ✅
- [x] **Dark mode** — `[data-theme="dark"]` CSS vars in index.css, TeacherSettingsPage wires localStorage + `document.documentElement.setAttribute`, system preference support ✅

### 🟢 Pre-Ship Cleanup
- [ ] Remove dev/QA 5-tab role-switcher from LoginPage before production

---

## Dark Mode Notes
- CSS vars: `--color-foreground`, `--color-muted`, `--color-surface`, `--color-canvas` overridden under `[data-theme="dark"]`
- Controlled from TeacherSettingsPage Appearance tab → stored in `localStorage` key `learnora-theme`
- Other role dashboards (Admin, Student, Parent) would need their own settings page wired to the same localStorage key if they want the toggle too

---

## What's Built (All Screens)

### Super Admin
SchoolDetailPage (6 tabs + all modals), PlansAndPricingPage, PlatformBillingPage, BroadcastPage, SchoolsListPage, OnboardSchoolPage, PlatformAnalyticsPage, SupportTicketsPage, PlatformSettingsPage, FeatureFlagsPage, EmailTemplatesPage, AuditLogsPage

### Admin
AdminDashboardPage (with onboarding checklist), AdminResultsPage (grade review + publish), AdminFeeSetupPage, FeeCollectionPage, AdminAttendancePage, AdminAnnouncementsPage, AdminSupportPage, RolesPermissionsPage, AuditLogsPage, TimetableManagementPage, and all other admin pages

### Teacher
Full suite: TeacherDashboardPage, TeacherSettingsPage (dark mode functional), GradeBookPage, all teacher pages

### Student
AssignmentsPage (submission confirmation), GlobalSearchPage (6 result types + category tabs), NotificationsPage, all student pages

### Parent
ParentHomePage (multi-child switcher: Olive + Tobi), PaymentSuccessPage, full fee flow, report cards

---

## Design Source
No Figma frames for feature screens — built to design system from earlier frames.
Free-plan MCP rate limits apply — use sparingly.

## Login / Dev Navigation
LoginPage has 5-tab role-switcher (Student / Teacher / Admin / Parent / Super Admin) — dev/QA convenience, remove pre-ship.
