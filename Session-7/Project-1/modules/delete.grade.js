const readGrades = require("./read.grades");
const saveGrades = require("./save.grades");

async function deleteGrade(identifier) {
  try {
    const grades = await readGrades();
    const index = grades.findIndex(
      item => item.id === Number(identifier) || item.name.toLowerCase() === String(identifier).toLowerCase()
    );

    if (index === -1) {
      console.log(`❌ Grade record for "${identifier}" not found.`);
      return;
    }

    const deleted = grades.splice(index, 1);
    await saveGrades(grades);
    console.log(`🗑️ Grade record for "${deleted[0].name}" deleted successfully.`);
  } catch (error) {
    console.log(`❌ Error deleting grade: ${error.message}`);
  }
}

module.exports = deleteGrade;