function calculateShipping(weight) {
    return new Promise((resolve, reject) => {
        if (weight > 0) {
            resolve(`Shipping cost: ${weight * 5}`);
        } else {
            reject("Invalid weight");
        }
    });
}

calculateShipping(10)
    .then(cost => console.log(cost))
    .catch(error => console.log(error));

calculateShipping(-2)
    .then(cost => console.log(cost))
    .catch(error => console.log(error));