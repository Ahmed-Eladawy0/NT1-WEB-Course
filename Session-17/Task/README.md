# SkillHub - Core & Authentication/Authorization Modules (Session 17)

This project is the backend module for the **SkillHub** graduation project, built using Node.js, Express, and MongoDB (Mongoose ODM). It handles Course Management, User Authentication, and Role-Based Access Control (RBAC).

## 🚀 Entities Chosen

- **Course:** To manage all online courses available on the SkillHub platform efficiently using a flexible NoSQL database structure.
- **User:** To manage user accounts, roles (Student / Admin), and authentication data securely.

## ✨ Features Implemented

- **RESTful API:** Full CRUD operations for courses and users.
- **Authentication:** Secure user registration and login using JSON Web Tokens (`jsonwebtoken`).
- **Authorization (RBAC):** Middleware to protect routes and restrict access based on roles (`student` vs `admin`).
- **Data Security:** Password hashing using `bcryptjs` to protect sensitive user credentials.
- **Stateless Sessions:** Utilizing JWT payloads to identify users securely without passing IDs in URLs for profile management.
- **File Upload (Multer):** Support for uploading course thumbnails and user avatars using `multer` with automatic directory creation (`uploads/courses`, `uploads/users`).
- **File Validation & Filtering:** Strict file type filtering to accept images only.
- **Automated Cleanup:** Built-in helper utility to delete unused or orphan files upon validation failure, updates, or record deletion to keep storage clean.
- **Static File Serving:** Exposing the `uploads` folder publicly via Express static middleware.

## 📋 API Routes Summary

### 🟢 Public Routes (No Token Required)

| Method   | Endpoint              | Description                                     |
| :------- | :-------------------- | :---------------------------------------------- |
| **POST** | `/api/v1/auth/signup` | Register a new user (accepts `imageUrl` upload) |
| **POST** | `/api/v1/auth/login`  | Authenticate user and return JWT                |
| **GET**  | `/api/v1/courses`     | Get all courses                                 |
| **GET**  | `/api/v1/courses/:id` | Get a specific course by ID                     |

### 🟡 Protected Routes (Token Required - Any Role)

| Method    | Endpoint               | Description                                     |
| :-------- | :--------------------- | :---------------------------------------------- |
| **GET**   | `/api/v1/auth/profile` | Get logged-in user's profile & enrolled courses |
| **PATCH** | `/api/v1/auth/profile` | Update logged-in user's profile and avatar      |
| **POST**  | `/api/v1/auth/enroll`  | Enroll the logged-in user in a specific course  |

### 🔴 Restricted Routes (Token Required - Admin Only)

| Method     | Endpoint                      | Description                                  |
| :--------- | :---------------------------- | :------------------------------------------- |
| **GET**    | `/api/v1/auth/users`          | Get all users                                |
| **PATCH**  | `/api/v1/auth/users/:id/role` | Toggle user role between admin and student   |
| **DELETE** | `/api/v1/auth/users/:id`      | Delete user and clear their uploaded image   |
| **POST**   | `/api/v1/courses`             | Create a new course (with `imageUrl` upload) |
| **PATCH**  | `/api/v1/courses/:id`         | Update an existing course & its image        |
| **DELETE** | `/api/v1/courses/:id`         | Delete a course and its associated image     |

## ⚙️ How to Run Locally

1. Clone the repository:
   `git clone <your-repo-url>`

2. Navigate to the backend directory:
   `cd Backend`

3. Install dependencies:
   `npm install`

4. Create a `.env` file in the Backend directory and add your credentials:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=SkillHub
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   ```

5. Start the development server:
   npm start

🛠️ Examples of API Usage (Postman)

1. Authentication & Authorization:
   Sign Up (POST /api/v1/auth/signup):
   Use form-data. Add text fields (firstName, lastName, email, password) and a file field (imageUrl).

   Log In (POST /api/v1/auth/login):
   Use JSON body with email and password. Returns a JWT token.

   Access Profile (GET /api/v1/auth/profile):
   Select Bearer Token in the Authorization tab and paste the JWT token.

2. Course Management:
   Create Course (POST /api/v1/courses):
   Must provide an Admin JWT Token. Use form-data with text fields (title, instructor, category, level, price, duration) and a file field (imageUrl).
