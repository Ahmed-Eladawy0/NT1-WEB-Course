# 🎓 SkillHub - Course Management System

A robust, full-stack Course Management System built with the **MEAN Stack** (**MongoDB, Express.js, Angular 17+, Node.js**).

Designed with a strong emphasis on security, Role-Based Access Control (RBAC), and modern state management.

---

## ✨ Key Features

### 🔒 Security & Authentication

- **JWT Authentication:** Secure login and registration with stateless JWT tokens.
- **Role-Based Access Control (RBAC):** Distinct privileges for `Admin` and `Student` roles.
- **Advanced Route Protection:** Angular Functional Guards (`CanActivateFn`, `UrlTree`) to prevent unauthorized access to dashboards.
- **HTTP Interceptors:** Automatic token injection and centralized unauthorized error handling.
- **Password Hashing:** Passwords securely hashed using `bcrypt` before database storage.

### 👨‍💻 Admin Features

- **User Management:** View all registered users, toggle roles (`Admin` / `Student`), and delete users.
- **Course Management:** Full CRUD operations for courses.
- **File Uploads:** Upload and manage course thumbnails securely using `Multer`.

### 🎓 Student Features

- **Course Browsing:** View available courses with dynamic routing and parameters.
- **Enrollment System:** One-click enrollment in courses.
- **Personal Dashboard:** Track enrolled courses.
- **Profile Management:** Update personal information and profile avatars.

---

## 🛠️ Technology Stack

### Frontend (Client)

- **Framework:** Angular 17+
- **Architecture:** Standalone Components, `inject()` Dependency Injection.
- **State Management:** Angular **Signals** for reactive, glitch-free UI updates without RxJS boilerplate.
- **Routing:** Lazy loading, Child Routes, and dynamic parameter parsing.
- **Libraries:** `jwt-decode` for client-side token expiration validation.

### Backend (Server)

- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM.
- **Middleware:** Custom `authenticate` and `authorize` middlewares, `Multer` for `FormData` handling.

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/)
- [Angular CLI](https://angular.dev/tools/cli)

```bash
npm install -g @angular/cli
```

- [MongoDB](https://www.mongodb.com/), running locally or through MongoDB Atlas.

---

## 1. Backend Setup

### Step 1 — Navigate to the Backend directory

```bash
cd Backend
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Set up environment variables

Create a `.env` file inside the `Backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> **Important:** Do not commit your real `.env` file or secrets to GitHub.

### Step 4 — Start the development server

```bash
npm run dev
```

---

## 2. Frontend Setup

### Step 1 — Navigate to the Frontend directory

```bash
cd skillhub-ng
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Start the Angular development server

```bash
ng serve
```

The application will be available at:

**http://localhost:4200/**

---

## 📁 Project Architecture Highlights

### Smart Redirects

The `AuthService` intelligently parses the JWT payload after login/signup and uses the Angular Router to redirect users to the appropriate dashboard based on their role.

### Separation of Concerns

The backend follows a clean structure separating:

- Routes
- Controllers
- Models
- Middlewares

### Frontend State Management

Angular Signals are used for reactive UI updates and local application state.

---

## 🔗 Useful Resources

- [Angular Documentation](https://angular.dev/)
- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Git Documentation](https://git-scm.com/doc)

---

## 👨‍💻 Developed By

**Ahmed Eladawy**

A full-stack Course Management System showcasing web development, authentication, role-based access control, and cybersecurity principles.
