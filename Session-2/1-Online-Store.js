function processOrders(orders) {
    let totalRevenue = 0;
    let successfulOrders = 0;
    let processedOrdersCount = 0;
    let skippedInARow = 0;
    let stockFailures = 0;
    let stopMessage = null;

    for (let order of orders) {
        if (order.status === "cancelled" || order.status === "invalid" || !order.stockAvailable) {
            skippedInARow++;
            if (!order.stockAvailable) stockFailures++;

            if (skippedInARow === 3 || stockFailures === 3) {
                stopMessage = "System stopped due to critical failure";
                break;
            }
        } else {
            skippedInARow = 0;
            totalRevenue += order.amount;
            successfulOrders++;
        }
        processedOrdersCount++;
    }

    return {
        totalRevenue,
        successfulOrders,
        processedOrdersCount,
        stopMessage
    };
}

//TEST CASES
const myOrders = [
    { id: 1, status: "valid", stockAvailable: true, amount: 100 },
    { id: 2, status: "valid", stockAvailable: true, amount: 200 },
    { id: 3, status: "cancelled", stockAvailable: true, amount: 0 },
    { id: 4, status: "valid", stockAvailable: true, amount: 300 },
    { id: 5, status: "invalid", stockAvailable: true, amount: 0 },
    { id: 6, status: "valid", stockAvailable: false, amount: 0 },
    { id: 7, status: "valid", stockAvailable: false, amount: 0 },
    { id: 8, status: "valid", stockAvailable: false, amount: 0 }
];

const result = processOrders(myOrders);
console.log(result);