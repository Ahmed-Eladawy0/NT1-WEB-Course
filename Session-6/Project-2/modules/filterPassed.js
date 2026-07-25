const students = require("../data/students");
const calculateAverage = require("./calculateAverage");

function filterPassed() {
    console.log("\n🎓 --- Passed Students (Average >= 60) ---");
    const passedStudents = students.filter(student => {
        const avg = calculateAverage(student.grades);
        return avg >= 60;
    });

    if (passedStudents.length === 0) {
        console.log("No students passed.");
    } else {
        passedStudents.forEach(student => {
            const avg = calculateAverage(student.grades);
            console.log(`- ${student.name} | Average: ${avg.toFixed(2)} (Passed ✅)`);
        });
    }
    console.log("------------------------------------------\n");
}

module.exports = filterPassed;