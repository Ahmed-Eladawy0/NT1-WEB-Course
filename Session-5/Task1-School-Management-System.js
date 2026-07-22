class Person {
    #email;
    #id;

    constructor(name, email, id) {
        this.name = name;
        this.email = email;
        this.id = id;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        if (!value || !value.includes("@")) {
            console.log(`❌ Invalid email for ${this.name}`);
            return;
        }
        this.#email = value;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        if (!value || value <= 0) {
            console.log(`❌ Invalid ID for ${this.name}`);
            return;
        }
        this.#id = value;
    }

    describeRole() {
        console.log(`Generic school member: ${this.name}`);
    }
}

class Principal extends Person {
    constructor(name, email, id) {
        super(name, email, id);
        this.members = [];
    }

    addMember(member) {
        this.members.push(member);
        console.log(`👤 Principal ${this.name} added member: ${member.name}`);
    }

    removeMember(memberId) {
        const index = this.members.findIndex(m => m.id === memberId);
        if (index !== -1) {
            console.log(`🗑️ Principal ${this.name} removed member: ${this.members[index].name}`);
            this.members.splice(index, 1);
        } else {
            console.log(`❌ Member with ID ${memberId} not found.`);
        }
    }

    listMembers() {
        console.log(`\n📋 --- School Members List (Managed by Principal ${this.name}) ---`);
        this.members.forEach(m => {
            console.log(`- ${m.name} (ID: ${m.id}, Email: ${m.email})`);
        });
        console.log(`-------------------------------------------------------------\n`);
    }

    describeRole() {
        console.log(`👑 Role: Principal | Name: ${this.name} | Manages the entire school system.`);
    }
}

class Teacher extends Person {
    constructor(name, email, id, subject) {
        super(name, email, id);
        this.subject = subject;
        this.gradedStudents = [];
    }

    gradeStudent(student, grade) {
        this.gradedStudents.push({ studentName: student.name, grade: grade, subject: this.subject });
        console.log(`✍️ Teacher ${this.name} graded ${student.name}: ${grade} in ${this.subject}`);
    }

    listGradedStudents() {
        console.log(`\n📝 Graded Students by Teacher ${this.name} (${this.subject}):`);
        this.gradedStudents.forEach(item => {
            console.log(`   * Student: ${item.studentName} | Grade: ${item.grade}`);
        });
    }

    describeRole() {
        console.log(`📚 Role: Teacher | Name: ${this.name} | Teaches: ${this.subject}`);
    }
}

class Student extends Person {
    constructor(name, email, id) {
        super(name, email, id);
        this.enrolledSubjects = [];
    }

    enrollSubject(subjectName) {
        this.enrolledSubjects.push(subjectName);
        console.log(`🎓 Student ${this.name} successfully enrolled in: ${subjectName}`);
    }

    viewSubjects() {
        console.log(`📖 Subjects enrolled by ${this.name}: ${this.enrolledSubjects.join(", ")}`);
    }

    describeRole() {
        console.log(`🎒 Role: Student | Name: ${this.name} | Enrolled in ${this.enrolledSubjects.length} subjects.`);
    }
}

const principal = new Principal("Dr. Soha", "Soha@school.com", 1);
const teacher1 = new Teacher("Ms. Noha", "Noha.Cyb@school.com", 2, "Cyber Security");
const teacher2 = new Teacher("Ms. Esraa", "Esraa.Web@school.com", 3, "Web Development");
const student1 = new Student("Adawy", "Adawy@student.com", 101);
const student2 = new Student("Soli", "Soli@student.com", 102);

principal.addMember(teacher1);
principal.addMember(teacher2);
principal.addMember(student1);
principal.addMember(student2);

student1.enrollSubject("Cyber Security");
student1.enrollSubject("Web Development");
student2.enrollSubject("Cyber Security");

teacher1.gradeStudent(student1, "A+");
teacher1.gradeStudent(student2, "B");
teacher2.gradeStudent(student1, "A+");
teacher2.gradeStudent(student2, "A");

principal.listMembers();

const schoolMembers = [principal, teacher1, teacher2, student1, student2];
schoolMembers.forEach(member => {
    member.describeRole();
});