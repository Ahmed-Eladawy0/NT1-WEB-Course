const readGrades = require("./modules/read.grades");
const addGrade = require("./modules/add.grade");
const deleteGrade = require("./modules/delete.grade");
const updateGrade = require("./modules/update.grade");

async function run() {
  console.log("📋 Current Grades:");
  console.log(await readGrades());

  console.log("\n--- Adding New Grades ---");
  await addGrade("Sagda", "Networks", 88);
  await addGrade("Dana", "Logic", 60);

  console.log("\n--- Updating Grade ---");
  await updateGrade(1, 98);

  console.log("\n--- Deleting Grade ---");
  await deleteGrade(2);

  console.log("\n📋 Final Grades List:");
  console.log(await readGrades());
}

run();