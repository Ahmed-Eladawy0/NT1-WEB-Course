const addToCart = require("./modules/addToCart");
const removeFromCart = require("./modules/removeFromCart");
const listCart = require("./modules/listCart");
const calculateTotal = require("./modules/calculateTotal");

// 1. Add products to cart
addToCart(1); // Laptop
addToCart(2); // Phone
addToCart(3); // Headphones

// 2. List items in cart
listCart();

// 3. Calculate total
calculateTotal();

// 4. Remove an item
removeFromCart(3); // Remove Headphones

// 5. List items again and calculate total
listCart();
calculateTotal();