const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Course title must be at least 3 characters long"],
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
    },

    level: {
      type: String,
      required: [true, "Course level is required"],
      trim: true,
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
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;