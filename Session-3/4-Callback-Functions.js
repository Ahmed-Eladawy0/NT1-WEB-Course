function greet(name, callback) {
    console.log(`Hello ${name}`);
    callback();
}
greet("Adawy", () => console.log("Callback executed"));

function calculate(a, b, operation) {
    return operation(a, b);
}
const add = (x, y) => x + y;
const subtract = (x, y) => x - y;
const multiply = (x, y) => x * y;
console.log(calculate(10, 5, add));
console.log(calculate(10, 5, subtract));
console.log(calculate(10, 5, multiply));

function loadData(callback) {
    setTimeout(() => {
        console.log("Data loaded");
        callback();
    }, 2000);
}
loadData(() => console.log("Processing finished"));

function login(username, successCallback, nextStepCallback) {
    console.log(`Logging in ${username}...`);
    setTimeout(() => {
        console.log("Login successful");
        successCallback();
        nextStepCallback();
    }, 1000);
}
login("Adawy", () => console.log("Welcome!"), () => console.log("Redirecting to dashboard..."));