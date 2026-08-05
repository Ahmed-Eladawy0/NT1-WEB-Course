const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      unique: true,
      trim: true,
      minlength: [3, "Course title must be at least 3 characters long"],
      maxlength: [100, "Course title cannot exceed 100 characters"],
    },

    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
      enum: {
        values: [
          "frontend",
          "backend",
          "database",
          "programming",
          "devops",
          "mobile",
        ],
        message: "Please provide a valid category",
      },
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
    },

    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },

    level: {
      type: String,
      required: [true, "Course level is required"],
      enum: {
        values: ["beginner", "intermediate", "advanced"],
        message: "Level must be Beginner, Intermediate, or Advanced",
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be greater than 5"],
    },

    students: {
      type: Number,
      default: 0,
      min: [0, "Students count cannot be negative"],
    },

    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {timestamps: true,}
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;