function getGreaterNumbers(arr, value) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > value) {
            result.push(arr[i]);
        }
    }
    return result;
}
console.log(getGreaterNumbers([10, 5, 20, 8, 30], 15));