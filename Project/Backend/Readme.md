# ⚙️ SkillHub API (Backend)

The robust and secure RESTful API powering the **SkillHub** Course Management System. Built with Node.js, Express, and MongoDB, this backend focuses on secure data handling, Role-Based Access Control (RBAC), and efficient file management.

---

## 🛠️ Tech Stack & Libraries

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Security & Hashing:** `bcrypt` for password encryption
- **File Uploads:** `multer` for handling `multipart/form-data` (course images and user avatars)

---

## ✨ Key Features

- **JWT-Based Authentication:** Secure, stateless user sessions with expiration handling.
- **Role-Based Access Control (RBAC):** Custom middleware to protect endpoints based on user roles (`Admin` vs `Student`).
- **Secure Password Storage:** Passwords are never stored in plaintext; they are hashed using bcrypt before hitting the database.
- **Media Management:** Configured Multer storage engine to securely accept, rename, and store uploaded images in the `/uploads` directory.
- **RESTful Architecture:** Clean and predictable API endpoints for Users and Courses.

---

## 📂 Project Structure

```text
Backend/
├── config/             # Database connection setup (db-connect.js)
├── controllers/        # Business logic for Auth, Users, and Courses
├── middlewares/        # Custom middlewares (auth, roles, multer)
├── models/             # Mongoose schemas (User, Course)
├── routes/             # Express routers
├── uploads/            # Static folder for uploaded images (courses/ users/)
├── index.js            # Application entry point
└── package.json        # Project metadata and scripts

🚀 Getting Started
Prerequisites
Node.js installed

MongoDB running locally or a MongoDB Atlas URI

1. Installation
Clone the repository and install the dependencies:

Bash
cd Backend
npm install
2. Environment Variables
Create a .env file in the root directory and add the following keys:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
3. Run the Server
To start the server in development mode (using nodemon):

Bash
npm run dev
```
