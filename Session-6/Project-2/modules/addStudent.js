const students = require("../data/students");

function addStudent(name, grades) {
    const newStudent = {
        id: students.length + 1,
        name,
        grades
    };
    students.push(newStudent);
    console.log(`👨‍🎓 Added student: ${name} with grades [${grades.join(", ")}]`);
}

module.exports = addStudent;