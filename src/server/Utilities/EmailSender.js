const searchByExpiredDate = (foodList, days) => {
    const today = new Date();
    return foodList.filter((food) => {
        const expiredDate = new Date(food.expired_date);
        const diffTime = expiredDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days && diffDays >= 0;
    });
}

const sendDailyNotification = (foodList) => {

    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'noreply.for.hackathon@gmail.com',
            pass: 'vuaq kkes qvcz epag'
        }
    }); 

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    today = `${year}-${month}-${day}`;

    donateFoodList = searchByExpiredDate(foodList, 3);

    var mailOptions = {
        from: 'FoodExp Notification',
        to: 'alatgt88@gmail.com',
        cc: 'valdy.tang@gmail.com',
        subject: 'FoodExp Daily Reminder',
        html: `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FoodExp Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .email-container {
            background-color: #ffffff;
            padding: 20px;
            margin: 20px auto;
            max-width: 600px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 15px 0;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 20px;
            text-align: left;
        }

        .content h2 {
            color: #333333;
            font-size: 20px;
        }

        .content p {
            color: #555555;
            line-height: 1.6;
            margin: 10px 0 20px;
        }

        .item-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 15px;
            margin-bottom: 15px;
            transition: box-shadow 0.3s ease;
        }

        .item-box:hover {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }

        .item-box img {
            height: 80px;
            width: 80px;
            border-radius: 8px;
            object-fit: cover;
        }

        .item-details {
            flex: 4;
            padding: 0 15px;
            width: 100%;
        }

        .item-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            width: 100%;
        }

        .item-category {
            background-color: #8bc34a;
            color: #ffffff;
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 15px;
            margin-bottom: 10px;

            display: inline-block;
        }

        .item-quantity {
            font-size: 14px;
            color: #777;
            margin-bottom: 5px;
        }

        .item-expiration {
        flex: 2;
            color: black;
            padding: 5px 10px;
            border-radius: 15px;
            font-weight: bold;
            text-align: center;
            width: 100%;
            text-align: right;
        }

        .footer {
            padding: 15px;
            background-color: #f4f4f4;
            color: #999999;
            font-size: 12px;
            text-align: center;
            border-radius: 0 0 8px 8px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h1>Daily FoodExp Notification</h1>
        </div>
        <div class="content">
            <h2>Hi there!</h2>
            <p>Don't forget to eat your food today. Some items are about to expire soon!</p>

            <h2>Food List</h2>
            ${foodList.map((item) => `
            <div class="item-box">
                <div class="flex-item-1">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-category">${item.category}</div>
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                </div>
                <div class="item-expiration">
                    Expires: ${item.expired_date}
                </div>
            </div>
            `).join('')}


            <h2>Consider Donating the Food Below</h2>
            
            <p> Sharing is caring </p>
            ${donateFoodList.map((item) => `
            <div class="item-box">
                <div class="flex-item-1">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-category">${item.category}</div>
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                </div>
                <div class="item-expiration">
                    Expires: ${item.expired_date}
                </div>
            </div>
            `).join('')}
        </div>
        <div class="footer">
            <p>This email was sent to you from noreply.for.hackathon@gmail.com</p>
        </div>
    </div>
</body>

</html>

  `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = {
    sendDailyNotification
};