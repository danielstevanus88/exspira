const food = {
    name: "Carrot",
    quantity: 5,
    expired_date: "2021-12-31",
    category: "Vegetable",
}

const foodList = [
    {
        id: 1,
        name: "Carrot",
        quantity: 5,
        expired_date: "2024-12-31",
        category: "Vegetable",
        image: "https://plus.unsplash.com/premium_photo-1669652909008-d504f70b8129?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"    },
    {
        id: 2,
        name: "Apple",
        quantity: 10,
        expired_date: "2024-12-31",
        category: "Fruit",
        image: "https://plus.unsplash.com/premium_photo-1661322640130-f6a1e2c36653?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        name: "Milk",
        quantity: 1,
        expired_date: "2024-12-31",
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=2756&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
]

const categories = [
    "Dairy", "Fruit", "Vegetable", "Meat", "Grain", "Seafood", "Spice", "Sauce", "Beverage", "Snack", "Other"
]

const categoryColor = {
    "Dairy": "#a3b300",
    "Fruit": "#b57348",
    "Vegetable": "#3c9f3c",
    "Meat": "#665131",
    "Grain": "#a08a3a",
    "Seafood": "#35777a",
    "Spice": "#b35600",
    "Sauce": "#5e3a9c",
    "Beverage": "#00827a",
    "Snack": "#b37087",
    "Other": "#789b78"

}

const schedule = {
    "2024-12-31": [1,2,3],
    "2024-12-30": [1,2]
}

export { food, foodList, categories, categoryColor }; // Export the food object for use in other files 
