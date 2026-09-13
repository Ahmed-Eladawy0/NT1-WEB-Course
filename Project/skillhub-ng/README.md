# 💻 SkillHub Frontend (Angular Client)

The modern, responsive client-side application for the **SkillHub** Course Management System. Built with Angular, this application leverages modern reactive features like Standalone Components, Signals, and the three core Angular form techniques (Template-driven, Reactive, and Signal Forms) to deliver a seamless user experience.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Angular
- **Architecture:** Standalone Components with functional `inject()` Dependency Injection
- **State Management:** Angular Signals for reactive UI updates
- **Forms:** Template-driven Forms (Login), Signal Forms (Signup/Profile), Reactive Forms (Course management)
- **Routing:** Angular Router
- **HTTP Client:** `@angular/common/http`

---

## ✨ Key Features

- **Role-Based Dashboards** — Separate experiences and interfaces for students and administrators.
- **Session-Aware Navigation** — Logged-in users are redirected to the right dashboard automatically, and protected pages redirect back to login when there's no active session.
- **Reactive State** — Efficient local state management via Signals (`coursesCache`, `usersCache`, etc.) to minimize redundant network round trips.
- **Real File Uploads** — Profile avatars and course cover images are uploaded directly to the backend via `multipart/form-data`.
- **Intelligent Navigation** — Automatic role-based routing upon successful authentication.

---

## 📂 Project Structure

```text
skillhub-ng/
├── src/
│   ├── app/
│   │   ├── signin-form/       # Login page (Template-driven form)
│   │   ├── signup-form/       # Signup page (Signal Forms)
│   │   ├── profile-form/      # Profile page (Signal Forms)
│   │   ├── add-course-form/   # Course create/edit (Reactive Forms)
│   │   ├── user-dashboard/    # Student course catalog & enrollment
│   │   ├── admin-dashboard/   # Course & user management
│   │   ├── header/            # Shared top navigation
│   │   ├── services/          # Centralized API logic (AuthService, CourseService)
│   │   ├── constants/         # Shared constants (course categories/levels)
│   │   ├── models.ts          # TypeScript interfaces and types
│   │   ├── utils.ts           # Shared formatting/display helpers
│   │   ├── app.config.ts      # Application configuration & providers
│   │   └── app.routes.ts      # Route definitions
│   └── styles.css             # Global design system & utility classes
├── angular.json                # Workspace configuration
└── package.json                 # Dependencies and build scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- Angular CLI installed globally:

```bash
npm install -g @angular/cli
```

### 1. Installation

Navigate to the frontend directory and install dependencies:

```bash
cd skillhub-ng
npm install
```

### 2. Development Server

Run the local dev server:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser.

### 3. Production Build

To create a production-ready optimized build:

```bash
ng build
```

---

Frontend Architecture & UI Implementation by **Ahmed Eladawy**.
