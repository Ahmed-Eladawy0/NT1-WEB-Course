const cart = require("../data/cart");

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        console.log(`🗑️ Removed "${cart[index].name}" from cart.`);
        cart.splice(index, 1);
    } else {
        console.log(`❌ Item with ID ${productId} not found in cart.`);
    }
}

module.exports = removeFromCart;