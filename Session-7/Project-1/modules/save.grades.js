const { writeFile } = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../data/grades.json");

async function saveGrades(grades) {
  try {
    await writeFile(filePath, JSON.stringify(grades, null, 2));
  } catch (error) {
    console.log(`❌ Error saving grades: ${error.message}`);
  }
}

module.exports = saveGrades;