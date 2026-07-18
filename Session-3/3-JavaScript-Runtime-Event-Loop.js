console.log("Start");
setTimeout(() => {
    console.log("Timeout 1");
}, 2000);
console.log("End");

console.log("A");
setTimeout(() => {
    console.log("B");
}, 0);
console.log("C");

console.log("Step 1");
setTimeout(() => {
    console.log("Step 2 (Async)");
}, 0);
console.log("Step 3");

function demonstrateQueue() {
    console.log("Task 1");
    setTimeout(() => {
        console.log("Task 2 (Delayed)");
    }, 0);
    console.log("Task 3");
}
demonstrateQueue();