// Install Node.js from https://nodejs.org/en/download/
// Complete the uitiities functions below
// You can run this file after installing node.js by running the command `node WordsProcessor.js`


// Given a string as follow
// |DD-MM-YYYY|DD-MM-YYYY|...|DD-MM-YYYY|
// The function should return an array of strings
// Example:
// Input
// "|01-01-2022|02-01-2022|03-01-2022|"
// Output
// ["01-01-2022", "02-01-2022", "03-01-2022"]

function extractDates(str) {
    // Write your code here
    let dates = str.split("|").filter(date => date.length > 0);
    return dates;
}

// Given a list of string 01-01-2022
// Convert it into an integer
// This function will be used as a helper to sort the dates
function convertDateToInt(date) {
    let [day, month, year] = date.split("-");
    return parseInt(year * 366 + month * 31 + day);
}

// Given a list of string DD-MM-YYYY
// Sort the dates in ascending order
function sortDates(dates) {
    return dates.sort((a, b) => convertDateToInt(a) - convertDateToInt(b));
}


// Given foodList as in ./DummyData.js
// Return an object with the key as the date and the value as an array of food objects
// Example
// Input
// [
//     {
//         name: "Carrot",
//         quantity: 5,
//         expired_date: "2024-12-30",
//         category: "Vegetable",
//     },
//     {
//         name: "Apple",
//         quantity: 10,
//         expired_date: "2025-12-31",
//         category: "Fruit",
//     },
//     {
//         name: "Milk",
//         quantity: 1,
//         expired_date: "2024-11-30",
//         category: "Dairy",
//     },
//     {
//         name: "Milk",
//         quantity: 1,
//         expired_date: "2025-12-31"
//         category: "Dairy",
//     },
// ]
// Output
// {
//     "2024-12-30": [{name: "Carrot", quantity: 5, expired_date: "2024-12-30", category: "Vegetable"}],
//     "2025-12-31": [
//                      {name: "Apple", quantity: 10, expired_date: "2025-12-31", category: "Fruit"}, 
//                      {name: "Milk", quantity: 1, expired_date: "2025-12-31", category: "Dairy"}
//     ],
//     "2024-11-30": [{name: "Milk", quantity: 1, expired_date: "2024-11-30", category: "Dairy"}]
// }
function foodListToDateList(foodList) {
    // Write your code here
    let dateList = {};
    for (let food of foodList) {
        if (dateList[food.expired_date]) {
            dateList[food.expired_date].push(food);
        } else {
            dateList[food.expired_date] = [food];
        }
    }
    return dateList;
}


// Test the functions
let dates = extractDates("|01-01-2022|02-01-2022|03-01-2022|");
console.log(dates); // ["01-01-2022", "02-01-2022", "03-01-2022"]
console.log(sortDates(dates)); // ["01-01-2022", "02-01-2022", "03-01-2022"]

let foodList = [
    {
        name: "Carrot",
        quantity: 5,
        expired_date: "2024-12-30",
        category: "Vegetable",
    },
    {
        name: "Apple",
        quantity: 10,
        expired_date: "2025-12-31",
        category: "Fruit",
    },
    {
        name: "Milk",
        quantity: 1,
        expired_date: "2024-11-30",
        category: "Dairy",
    },
    {
        name: "Milk",
        quantity: 1,
        expired_date: "2025-12-31",
        category: "Dairy",
    },
]

console.log(foodListToDateList(foodList)); // {
//     "2024-12-30": [{name: "Carrot", quantity: 5, expired_date: "2024-12-30", category: "Vegetable"}],
//     "2025-12-31": [
//                      {name: "Apple", quantity: 10, expired_date: "2025-12-31", category: "Fruit"},
//                      {name: "Milk", quantity: 1, expired_date: "2025-12-31", category: "Dairy"}
//     ],
//     "2024-11-30": [{name: "Milk", quantity: 1, expired_date: "2024-11-30", category: "Dairy"}]
// }