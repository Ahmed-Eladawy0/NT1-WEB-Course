const addStudent = require("./modules/addStudent");
const listStudents = require("./modules/listStudents");
const filterPassed = require("./modules/filterPassed");

// 1. Add students with grades
addStudent("Adawy", [85, 90, 95]);
addStudent("Ali", [50, 55, 60]);
addStudent("Soli", [75, 80, 82]);
addStudent("Samy", [69, 11, 6]);
addStudent("Salah", [5, 15, 20]);
addStudent("Dana", [100, 100, 100]);
addStudent("Sagda", [85, 85, 95]);
addStudent("Jana", [90, 90, 95]);

// 2. List all students with their averages
listStudents();

// 3. Show who passed (Average >= 60)
filterPassed();