// ATM Banking System
const correctPin = 1234;
let balance = 1000;
let userPin = 1234;
let operation = "withdraw";
let amount = 200;
let newPin = 5678;

if (userPin === correctPin) {
    if (operation === "withdraw") {
        if (amount > balance) {
            console.log("Error: Insufficient balance.");
        } else {
            balance = balance - amount;
            console.log("Success: New balance is " + balance);
        }
    } else if (operation === "deposit") {
        if (amount > 0) {
            balance = balance + amount;
            console.log("Success: New balance is " + balance);
        } else {
            console.log("Error: Invalid deposit amount.");
        }
    } else if (operation === "check") {
        console.log("Your current balance is " + balance);
    } else if (operation === "changePin") {
        if (newPin >= 1000 && newPin <= 9999) {
            userPin = newPin;
            console.log("Success: PIN changed.");
        } else {
            console.log("Error: PIN must be exactly 4 digits.");
        }
    }
} else {
    console.log("Error: Incorrect PIN.");
}