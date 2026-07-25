const cart = require("../data/cart");

function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log(`💰 Total Cart Price: ${total} EGP`);
    return total;
}

module.exports = calculateTotal;