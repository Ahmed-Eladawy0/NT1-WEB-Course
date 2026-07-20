const products = {
    1: "Laptop",
    2: "Phone",
    3: "Tablet"
};

function getProduct(id) {
    return new Promise((resolve, reject) => {
        if (products[id]) {
            resolve(products[id]);
        } else {
            reject("Product not found");
        }
    });
}

getProduct(1)
    .then(product => console.log(product))
    .catch(error => console.log(error));