const cart = require("../data/cart");

function listCart() {
    console.log("\n📋 --- Your Shopping Cart ---");
    if (cart.length === 0) {
        console.log("Cart is empty.");
    } else {
        cart.forEach(item => {
            console.log(`- ${item.name} | Price: ${item.price} EGP | Qty: ${item.quantity}`);
        });
    }
    console.log("-----------------------------\n");
}

module.exports = listCart;