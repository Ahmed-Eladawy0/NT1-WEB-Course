# SkillHub - Course Management Module (Session 11 Task)

This project is the backend module for the **SkillHub** graduation project, built using Node.js, Express, and MongoDB (Mongoose ODM).

## 🚀 Entity Chosen

- **Entity:** Course
- **Why:** To manage all online courses available on the SkillHub platform efficiently using a flexible NoSQL database structure with built-in validation.

## 📋 API Routes Summary

| Method     | Endpoint              | Description                 |
| :--------- | :-------------------- | :-------------------------- |
| **GET**    | `/api/v1/courses`     | Get all courses             |
| **POST**   | `/api/v1/courses`     | Create a new course         |
| **GET**    | `/api/v1/courses/:id` | Get a specific course by ID |
| **PATCH**  | `/api/v1/courses/:id` | Update an existing course   |
| **DELETE** | `/api/v1/courses/:id` | Delete a course             |

## ⚙️ How to Run Locally

1. Clone the repository:
   git clone <your-repo-url>

## 1. Navigate to the backend directory:

    cd Backend

## 2. Install dependencies:

    npm install

## 3. Create a .env file in the Backend directory and add your credentials:

    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    DB_NAME=SkillHub

## 4. Start the development server:

    npm start

## Postman Testing Screenshots:

1. Get All Courses (Empty Database)
2. Create New Course (POST Request)
3. Get All Courses (With Data)
4. Update Course (PATCH Request)
5. Delete Course (DELETE Request)
