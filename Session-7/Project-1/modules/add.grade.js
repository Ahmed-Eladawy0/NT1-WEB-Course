const readGrades = require("./read.grades");
const saveGrades = require("./save.grades");

async function addGrade(name, subject, grade) {
  if (!name || !subject || grade === undefined) {
    console.log("❌ Invalid Grade Data. Name, subject, and grade are required.");
    return;
  }

  try {
    const grades = await readGrades();
    const newRecord = {
      id: grades.length > 0 ? grades[grades.length - 1].id + 1 : 1,
      name,
      subject,
      grade
    };

    grades.push(newRecord);
    await saveGrades(grades);
    console.log(`✅ Grade record for "${name}" added successfully.`);
  } catch (error) {
    console.log(`❌ Error adding grade: ${error.message}`);
  }
}

module.exports = addGrade;