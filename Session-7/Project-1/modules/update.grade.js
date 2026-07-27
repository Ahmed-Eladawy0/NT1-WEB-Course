const readGrades = require("./read.grades");
const saveGrades = require("./save.grades");

async function updateGrade(identifier, newGrade) {
  if (newGrade === undefined) {
    console.log("❌ New grade value is missing.");
    return;
  }

  try {
    const grades = await readGrades();
    // Supports updating by ID or Name
    const record = grades.find(
      item => item.id === Number(identifier) || item.name.toLowerCase() === String(identifier).toLowerCase()
    );

    if (!record) {
      console.log(`❌ Grade record for "${identifier}" not found.`);
      return;
    }

    record.grade = newGrade;
    await saveGrades(grades);
    console.log(`✅ Grade for "${record.name}" updated successfully to ${newGrade}.`);
  } catch (error) {
    console.log(`❌ Error updating grade: ${error.message}`);
  }
}

module.exports = updateGrade;