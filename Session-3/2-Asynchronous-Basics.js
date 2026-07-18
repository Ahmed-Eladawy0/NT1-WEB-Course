console.log("Hello");
setTimeout(() => {
    console.log("World");
}, 2000);

function printNumbers() {
    for (let i = 1; i <= 5; i++) {
        setTimeout(() => {
            console.log(i);
        }, i * 1000);
    }
}
printNumbers();

console.log("Loading...");
setTimeout(() => {
    console.log("Done");
}, 3000);

function delayedMessage(message, delay) {
    setTimeout(() => {
        console.log(message);
    }, delay);
}
delayedMessage("This is a delayed message", 4000);