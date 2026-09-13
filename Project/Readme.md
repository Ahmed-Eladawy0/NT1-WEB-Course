# 🎓 SkillHub - Course Management System

A robust, full-stack Course Management System built with the **MEAN Stack** (MongoDB, Express.js, Angular 17+, Node.js). Designed with a strong emphasis on security, Role-Based Access Control (RBAC), and modern state management.

---

## ✨ Key Features

**🔒 Security & Authentication**

- **JWT Authentication:** Secure login and registration with stateless JWT tokens.
- **Role-Based Access Control (RBAC):** Distinct privileges for `Admin` and `Student` roles.
- **Advanced Route Protection:** Angular Functional Guards (`CanActivateFn`, `UrlTree`) to prevent unauthorized access to dashboards.
- **HTTP Interceptors:** Automatic token injection and centralized unauthorized error handling.
- **Password Hashing:** Passwords securely hashed using `bcrypt` before database storage.

**👨‍💻 Admin Features**

- **User Management:** View all registered users, toggle roles (Admin/Student), and delete users.
- **Course Management:** Full CRUD operations for courses.
- **File Uploads:** Upload and manage course thumbnails securely using `Multer`.

**🎓 Student Features**

- **Course Browsing:** View available courses with dynamic routing and parameters.
- **Enrollment System:** One-click enrollment in courses.
- **Personal Dashboard:** Track enrolled courses.
- **Profile Management:** Update personal information and profile avatars.

---

## 🛠️ Technology Stack

**Frontend (Client)**

- **Framework:** Angular 17+
- **Architecture:** Standalone Components, `inject()` Dependency Injection.
- **State Management:** Angular **Signals** for reactive, glitch-free UI updates without RxJS boilerplate.
- **Routing:** Lazy loading, Child Routes, and dynamic parameter parsing.
- **Libraries:** `jwt-decode` for client-side token expiration validation.

**Backend (Server)**

- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM.
- **Middleware:** Custom `authenticate` and `authorize` middlewares, `Multer` for `FormData` handling.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [Angular CLI](https://angular.io/cli) installed globally (`npm install -g @angular/cli`).
- [MongoDB](https://www.mongodb.com/) running locally or via MongoDB Atlas.

---

1. Backend Setup

````bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file and add your PORT, MONGO_URI, and JWT_SECRET

# Start the development server
npm run dev

---

2. Frontend Setup

```bash
# Navigate to the frontend directory
cd skillhub-ng

# Install dependencies
npm install

# Start the Angular development server
ng serve
The application will be available at http://localhost:4200/.

---

📁 Project Architecture Highlights
Smart Redirects: The AuthService intelligently parses the JWT payload upon login/signup and uses the Angular Router to redirect users to their specific dashboards based on their role.

Separation of Concerns: Clean backend structure separating Routes, Controllers, Models, and Middlewares.

Frontend Caching: Utilizing Angular Signals to cache courses and user data locally, minimizing redundant API calls.

Developed by Ahmed Eladawy as a comprehensive showcase of full-stack engineering and cybersecurity principles.
````
