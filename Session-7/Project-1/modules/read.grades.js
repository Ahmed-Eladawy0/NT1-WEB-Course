const { readFile } = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../data/grades.json");

async function readGrades() {
  try {
    const data = await readFile(filePath, "utf-8");
    if (!data.trim()) {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

module.exports = readGrades;    