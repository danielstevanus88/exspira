const food = {
    name: "Carrot",
    quantity: 5,
    expired_date: "2024-12-31",
    category: "Vegetable",
}

const { Anthropic } = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({  apiKey: "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" });

const msg = anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1000,
    temperature: 0,
    system: `You help with food management. Format answer as | DDMMYYYY | DDMMYYYY | ... | DDMMYYYY |. Don't add other words.`,
    messages: [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": `I just bought the food ${food.name} with the expiry date ${food.expired_date}
                    with quantity ${food.quantity}. Can you divide them into multiple dates to eat so that I can eat it at the date you give before the expiry date?`
                }
            ]
        }
    ]
});
console.log(msg);