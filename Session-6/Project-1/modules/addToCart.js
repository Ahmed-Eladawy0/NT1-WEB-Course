const products = require("../data/products");
const cart = require("../data/cart");

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.log(`❌ Product with ID ${productId} not found.`);
        return;
    }

    // Check if already in cart
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    console.log(`🛒 Added "${product.name}" to cart.`);
}

module.exports = addToCart;