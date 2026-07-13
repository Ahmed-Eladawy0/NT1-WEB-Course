// University Student Portal
let studentName = "Adawy";
let attendance = 85;
let midterm = 20;
let finalExam = 40;
let assignment = 15;
let tuitionPaid = true;

if (!tuitionPaid) {
    console.log("Access Denied: Tuition not paid.");
} else {
    if (attendance < 75) {
        console.log("Status: Fail (Attendance too low)");
    } else {
        let totalScore = midterm + finalExam + assignment;
        let grade = "";

        if (totalScore >= 90) grade = "A";
        else if (totalScore >= 75) grade = "B";
        else if (totalScore >= 50) grade = "Pass";
        else grade = "Fail";

        console.log("Name: " + studentName);
        console.log("Total Score: " + totalScore);
        console.log("Grade: " + grade);

        if (totalScore >= 95) {
            console.log("Scholarship Eligible!");
        }
    }
}