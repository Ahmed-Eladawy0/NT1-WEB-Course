# SkillHub - Course Management Module (Session 12 Task)

This project is the backend module for the **SkillHub** graduation project, built using Node.js, Express, and MongoDB (Mongoose ODM).

## 🚀 Entity Chosen

- **Entity:** Course
- **Why:** To manage all online courses available on the SkillHub platform efficiently using a flexible NoSQL database structure with built-in validation and file uploads.

## ✨ Features Implemented

- **RESTful API:** Full CRUD operations for courses.
- **File Upload (Multer):** Support for uploading course thumbnails and avatars using `multer` with automatic directory creation (`uploads/courses`, `uploads/users`).
- **File Validation & Filtering:** Strict file type filtering to accept images only.
- **Automated Cleanup:** Built-in helper utility to delete unused or orphan files upon validation failure, updates, or course deletion to keep storage clean.
- **Static File Serving:** Exposing the `uploads` folder publicly via Express static middleware.

## 📋 API Routes Summary

| Method     | Endpoint              | Description                                            |
| :--------- | :-------------------- | :----------------------------------------------------- |
| **GET**    | `/api/v1/courses`     | Get all courses                                        |
| **POST**   | `/api/v1/courses`     | Create a new course (with image upload)                |
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

   ```

5. Start the development server:
   npm start

🛠️ Examples of API Usage
`Create Course (POST /api/v1/courses):`
`Use Postman with body -> form-data.`
`Add text fields: title, instructor, category, level, price, duration.`
`Add file field: imageUrl (select an image file).`
`Update Course (PATCH /api/v1/courses/:id):`

    Send a form-data request updating any field or replacing the imageUrl file.
