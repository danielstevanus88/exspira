
// server/index.js
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { Anthropic } = require('@anthropic-ai/sdk');
const categories = [
    "Dairy", "Fruit", "Vegetable", "Meat", "Grain", "Seafood", "Spice", "Sauce", "Beverage", "Snack", "Other"
]



const app = express();
const PORT = 5000;

app.use(fileUpload());

const anthropic = new Anthropic({ apiKey: "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" });
// Database
var foodList = [
    {
        id: 1,
        name: "Carrot",
        quantity: 5,
        expired_date: "2024-11-11",
        category: "Vegetable",
        image: "https://plus.unsplash.com/premium_photo-1669652909008-d504f70b8129?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 2,
        name: "Apple",
        quantity: 10,
        expired_date: "2024-11-1",
        category: "Fruit",
        image: "https://plus.unsplash.com/premium_photo-1661322640130-f6a1e2c36653?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        name: "Milk",
        quantity: 1,
        expired_date: "2024-10-28",
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?q=80&w=2756&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 4,
        name: "Sushi",
        quantity: 1,
        expired_date: "2024-10-28",
        category: "Other",
        image: "https://www.allrecipes.com/thmb/XT7-9MROYJZvNyQR4J40HGOVDmQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/19511smoked-salmon-sushi-rollfabeveryday4x3-159a22b4d3ac49fe9a146db94b53c930.jpg"
    }
];
const schedule = {
    "2024-10-28": [{ id: 1, quantity: 2 }, { id: 2, quantity: 3 }, { id: 3, quantity: 1 }],
    "2024-10-26": [{ id: 1, quantity: 2 }, { id: 4, quantity: 1 }],
}
app.use(cors());
app.use(express.json());

// Schedule Email Task
const { sendDailyNotification } = require('./Utilities/EmailSender');
const dailyEmailTask = setInterval(() => {
    sendDailyNotification(foodList, notifyUsers);
}, 1000 * 60 * 60 * 24);

app.get('/notify', async (req, res) => {
    // Find today date in schedule
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    today = `${yyyy}-${mm}-${dd}`;

    let foodIds = schedule[today];
    if (!foodIds) {
        res.send("No food to notify today");
        console.log("No food to notify today");
        return;
    }
    let foods = foodList.filter((food) => foodIds.includes(food.id));

    sendDailyNotification(foods);

    res.send("Success");
    console.log("Email sent to users");


});

// Routes
const { appendFoodId } = require('./Utilities/FoodListManager');
app.post('/add', async (req, res) => {
    let food = req.body;
    food = appendFoodId(foodList, food);

    foodList.push(food);

    makeSchedule(food);
    res.send(foodList);
});

app.post('/addmultiple', async (req, res) => {
    let foods = req.body;
    let max = 0;
    if(foodList.length == 0) {
        max = 1;
    }
    
    max = Math.max(...foodList.map((food) => food.id)) + 1;

    foods = foods.map(food => {
        food.id = max;
        max++;
        return food;
    });

    foodList = foodList.concat(foods);
    for (let food of foods) {
        await makeSchedule(food);
    }
    res.send(foodList);
});

app.post('/eat', async (req, res) => {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    today = `${yyyy}-${mm}-${dd}`;

    let foodIds = schedule[today];

    let foods = req.body;

    foods.map((food) => {
        foodIds = foodIds.filter((id) => id != food.id);
        let foodId = food.id;
        for (let foodd of foodIds) {
            if (foodd.id == foodId) {
                food.quantity -= foodd.quantity;
            }
        }   
        return food;
    });

    // Find in foodList with the same id and update the quantity
    foodList = foodList.map((food) => {
        let found = foods.find((f) => f.id == food.id);
        if (found) {
            food.quantity = found.quantity;
        }
        return food;
    });

    foodList = foodList.filter((food) => food.quantity > 0);


    // get all food id in the foods
    let foodIdsToEat = foods.map((food) => food.id);
    // remove the food from schedule
    schedule[today] = schedule[today].filter(({id}) => !foodIdsToEat.includes(id));
    console.log(schedule[today]);
    res.send(foodList);
}
);



const { deleteFood } = require('./Utilities/FoodListManager');
app.post('/delete', async (req, res) => {
    for (let food of req.body) {

        foodList = deleteFood(foodList, food);

        // Go through all schedule and remove the id of the food from schedule
        for (let key in schedule) {
            schedule[key] = schedule[key].filter((id) => id != req.body.id);
        }
    }
    console.log("Delete success");
    res.send(foodList);
});

app.get('/foodlist', (req, res) => {
    res.send(foodList);
});

app.get('/schedule', (req, res) => {
    res.send(schedule);
}
);

const readFoodListFromImage = async (file) => {
    let formData = new FormData();
    formData.append("apikey", "K85864691488957");
    formData.append("base64image", "data:image/jpg;base64," + file.data.toString("base64"));
    formData.append("detectOrientation", "true");
    formData.append("filetype", "JPG");

    let res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
        headers: {
            "Accept": "application/json"
        }
    });

    // Parse the JSON response
    res = await res.json();


    let parsedText = res.ParsedResults[0].ParsedText;

    // Send to anthropic to get the food list
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        temperature: 0,
        system: `I have the following food/groceries receipt (scanned by OCR): ${parsedText}. Can you help me list the food and quantity and define one of the category between ${categories.map(category => category + ", ")} ? 
        Rewrite the name to its abbreviation (or clearer version). Response in the format | Food, Quantity, Category | Food, Quantity, Category | ... | Food, Quantity, Category | or || if empty. If quantity is not specified, assume it's 1. Don't include any other words or characters. Quantity must be an integer which determine an estimation of number of servings until it finish. Only include valid food`,
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `I have the following food/groceries receipt (scanned by OCR): ${parsedText}. Can you help me list the food and quantity and define one of the category between ${categories.map(category => category + ", ")} ? 
        Rewrite the name to its abbreviation (or clearer version) Response in the format | Food, Quantity, Category | Food, Quantity, Category | ... | Food, Quantity, Category | or || if empty. If quantity is not specified, assume it's 1. Don't include any other words or characters.Quantity must be an integer which determine an estimation of number of servings until it finish. Only include valid food`,
        }
                ]
            }
        ]
    });

    let foodList = msg.content[0].text.split("|").map(food => food.trim());
    foodList = foodList.filter(food => food != "");
    foodList = foodList.map(food => {
        let [name, quantity, category] = food.split(",");
        // name, quantiity, category remove trailing
        name = name.trim();
        quantity = quantity.trim();
        category = category.trim();

        return { name: name, quantity: quantity || 1, category: category};
    });

    return foodList;
}


app.post('/readFoodListFromImage', async (req, res) => {
    let file = req.files.file;
    let foodList = await readFoodListFromImage(file);
    res.send(foodList);
});


app.post('/estimate-expiry-date', async (req, res) => {
    let food = req.body;

    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    today = `${yyyy}-${mm}-${dd}`;
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        temperature: 0,
        system: `You help with food management. I just bought the food ${food.name} mentioned today at ${today}. Help me estimates the expiry date. Format answer as YYYY-MM-DD. Do your best estimation and don't add other words.`,
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `I just bought the food ${food.name} today at ${today} and I can't find the expirty date on the package. Can you estimate the expiry date if i bought it today?`
                    }
                ]
            }
        ]
    });
    res.send(msg);

});


const makeSchedule = async (food) => {
    // Get today date
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    today = `${yyyy}-${mm}-${dd}`;

    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        temperature: 0,
        system: `I just bought ${food.name} with an expiry date of ${food.expired_date} and a quantity of ${food.quantity} (estimated number of serving until it finish). Starting from ${today}, can you divide them into multiple dates so I can consume it evenly before the expiry date? Format the answer as | YYYY-MM-DD,Q | YYYY-MM-DD,Q | ... | YYYY-MM-DD,Q |. Q is the quantity . Don't include any other words or characters.`,
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `I just bought ${food.name} with an expiry date of ${food.expired_date} and a quantity of ${food.quantity} (estimated number of serving until it finish). Starting from ${today}, can you divide them into multiple dates (if it is not a singular item and can be divided) so I can consume it evenly before the expiry date? Format the answer as | YYYY-MM-DD,Q | YYYY-MM-DD,Q | ... | YYYY-MM-DD,Q |. Q is the quantity . Don't include any other words or characters.`,

                    }
                ]
            }
        ]
    });

    // Process msg and split to dates and get the quantity
    let dates = msg.content[0].text.split("|").map(date => date.trim());

    dates = dates.filter(date => date != "");
    for (let date of dates) {
        let [dateStr, quantity] = date.split(",");
        if (schedule[dateStr]) {
            schedule[dateStr].push({ id: food.id, quantity: quantity });
        } else {
            schedule[dateStr] = [{ id: food.id, quantity: quantity }];
        }
    }


    console.log(schedule);
}



app.post('/makerecipe', async (req, res) => {
    let foodList = req.body;

    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1000,
        temperature: 0,
        system: `Given the ingredients listed below, create a recipe using as many of them as possible. Provide clear, step-by-step instructions for making the dish. Format the answer as HTML, with styles such as bold headers and <hr> tags. Please do not include any additional words.`,
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `I have the following food: ${foodList.map(food => food.name + " with quantity  " + food.quantity).join(", ")} . Can you make a recipe out of those foods/ingredients (don't need to use all the quantity)?`
                    }
                ]
            }
        ]
    });
    res.send(msg);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
