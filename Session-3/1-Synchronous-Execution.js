console.log("Start");
console.log("Middle");
console.log("End");
function stepOne() {
    console.log("Inside stepOne");
    stepTwo();
}
function stepTwo() {
    console.log("Inside stepTwo");
}
stepOne();
const num1 = 10;
const num2 = 5;
const sum = num1 + num2;
console.log("Sum result:", sum);
const product = sum * 2;
console.log("Product result:", product);
function getBaseValue() {
    return 50;
}
function addBonus(value) {
    return value + 25;
}
const base = getBaseValue();
const finalResult = addBonus(base);
console.log("Final result from flow:", finalResult);