// E-Commerce Checkout System
let productPrice = 500;
let quantity = 2;
let category = "electronics";
let coupon = "SAVE10";
let paymentMethod = "credit";

let subtotal = productPrice * quantity;
let discount = 0;

if (category === "electronics") {
    discount = subtotal * 0.1;
}

if (coupon === "SAVE10") {
    discount = discount + 50;
}

if (paymentMethod === "credit") {
    discount = discount + 20;
}

let vat = (subtotal - discount) * 0.14;
let finalPrice = (subtotal - discount) + vat;

if (finalPrice < 0) {
    finalPrice = 0;
}

console.log("Subtotal: " + subtotal);
console.log("Final Total: " + finalPrice);