# 💻 SkillHub Frontend (Angular Client)

The modern, responsive client-side application for the **SkillHub** Course Management System. Built with Angular 17+, this application leverages modern reactive features like Standalone Components, Signals, and functional route guards to deliver a seamless user experience.

---

## 🛠️ Tech Stack & Dependencies

- **Framework:** Angular 17+
- **Architecture:** Standalone Components & functional `inject()` Dependency Injection
- **State Management:** Angular Signals for reactive UI updates
- **Routing:** Angular Router with functional `CanActivateFn` Guards returning `UrlTree`
- **HTTP Client:** `@angular/common/http` with HTTP Interceptors
- **Security:** `jwt-decode` for client-side token expiration validation

---

## ✨ Key Features

- **Role-Based Dashboards:** Separate experiences and interfaces for students and administrators.
- **Client-Side Route Protection:**
  - `authGuard`: Restricts protected pages (Dashboard, Profile) to authenticated users.
  - `adminGuard`: Restricts management tools to users with the `admin` role.
  - `guestGuard`: Redirects already authenticated users away from Login and Signup pages.
- **Reactive State:** Efficient local state management via Signals (`coursesCache`, `usersCache`) to minimize redundant network round trips.
- **Intelligent Navigation:** Automatic role-based routing upon successful authentication.
- **HTTP Interceptor:** Seamless JWT attachment to outgoing API requests and global error intercepting.

---

## 📂 Project Structure

```text
skillhub-ng/
├── src/
│   ├── app/
│   │   ├── components/      # UI Views (Login, Dashboards, Profile)
│   │   ├── core/
│   │   │   ├── guards/      # auth.guard, admin.guard, guest.guard
│   │   │   ├── interceptors/# Authentication and error interceptors
│   │   │   ├── models/      # TypeScript interfaces and types
│   │   │   └── services/    # Centralized API logic (AuthService, etc.)
│   │   ├── app.config.ts    # Application configuration & providers
│   │   └── app.routes.ts    # Route definitions and guard mappings
│   └── styles.css           # Global design system & utility classes
├── angular.json             # Workspace configuration
└── package.json             # Dependencies and build scripts

🚀 Getting Started
Prerequisites
Node.js installed

Angular CLI installed globally:

Bash
npm install -g @angular/cli
1. Installation
Navigate to the frontend directory and install dependencies:

Bash
cd skillhub-ng
npm install
2. Development Server
Run the local dev server:

Bash
ng serve
Navigate to http://localhost:4200/ in your browser.

3. Production Build
To create a production-ready optimized build:

Bash
ng build


Frontend Architecture & UI Implementation by Ahmed Eladawy.
```
