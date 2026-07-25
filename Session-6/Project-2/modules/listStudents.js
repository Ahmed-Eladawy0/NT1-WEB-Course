const students = require("../data/students");
const calculateAverage = require("./calculateAverage");

function listStudents() {
    console.log("\n📋 --- All Students Record ---");
    if (students.length === 0) {
        console.log("No student records found.");
    } else {
        students.forEach(student => {
            const avg = calculateAverage(student.grades);
            console.log(`- ${student.name} | Grades: [${student.grades.join(", ")}] | Average: ${avg.toFixed(2)}`);
        });
    }
    console.log("-------------------------------\n");
}

module.exports = listStudents;