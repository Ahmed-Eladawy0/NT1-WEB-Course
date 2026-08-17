# SkillHub - Core & Authentication Modules (Sessions 16 Tasks)

This project is the backend module for the **SkillHub** graduation project, built using Node.js, Express, and MongoDB (Mongoose ODM). It handles Course Management, User Authentication, and Role-Based Authorization.

## 🚀 Entities Chosen

- **Course:** To manage all online courses available on the SkillHub platform efficiently using a flexible NoSQL database structure.
- **User:** To manage user accounts, roles (Student / Admin), and authentication data securely.

## ✨ Features Implemented

- **RESTful API:** Full CRUD operations for courses and users.
- **Authentication & Authorization:** Secure user registration and login using JSON Web Tokens (`jsonwebtoken`).
- **Data Security:** Password hashing using `bcryptjs` to protect sensitive user credentials.
- **Role Management:** System supports `student` (default) and `admin` roles for access control.
- **File Upload (Multer):** Support for uploading course thumbnails and user avatars using `multer` with automatic directory creation (`uploads/courses`, `uploads/users`).
- **File Validation & Filtering:** Strict file type filtering to accept images only.
- **Automated Cleanup:** Built-in helper utility to delete unused or orphan files upon validation failure, updates, or record deletion to keep storage clean.
- **Static File Serving:** Exposing the `uploads` folder publicly via Express static middleware.

## 📋 API Routes Summary

### Authentication & User Management

| Method     | Endpoint                         | Description                                     |
| :--------- | :------------------------------- | :---------------------------------------------- |
| **POST**   | `/api/v1/auth/signup`            | Register a new user (accepts `imageUrl` upload) |
| **POST**   | `/api/v1/auth/login`             | Authenticate user and return JWT                |
| **GET**    | `/api/v1/auth/users`             | Get all users (Admin purpose)                   |
| **PATCH**  | `/api/v1/auth/users/:id/role`    | Toggle user role between admin and student      |
| **PATCH**  | `/api/v1/auth/users/:id/profile` | Update user profile data and avatar image       |
| **POST**   | `/api/v1/auth/users/:id/enroll`  | Enroll a user in a specific course              |
| **DELETE** | `/api/v1/auth/users/:id`         | Delete user and clear their uploaded image      |

### Course Management

| Method     | Endpoint              | Description                                            |
| :--------- | :-------------------- | :----------------------------------------------------- |
| **GET**    | `/api/v1/courses`     | Get all courses                                        |
| **POST**   | `/api/v1/courses`     | Create a new course (with `imageUrl` upload)           |
| **GET**    | `/api/v1/courses/:id` | Get a specific course by ID                            |
| **PATCH**  | `/api/v1/courses/:id` | Update an existing course (supports image replacement) |
| **DELETE** | `/api/v1/courses/:id` | Delete a course (and its associated image file)        |

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

1. Authentication Examples:
   1. Sign Up (POST /api/v1/auth/signup):
      Use form-data. Add text fields (firstName, lastName, email, password, phone) and a file field (imageUrl).

   2. Log In (POST /api/v1/auth/login):
      Use JSON body with email and password. Returns a JWT token.

2. Course Examples:
   1. Create Course (POST /api/v1/courses):
      Use form-data. Add text fields (title, instructor, category, level, price, duration) and a file field (imageUrl).

   2. Update Course (PATCH /api/v1/courses/:id):
      Send a form-data request updating any field or replacing the imageUrl file.
