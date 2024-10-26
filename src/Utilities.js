import { foodList } from "./DummyData";

const searchByName = (foodList, query) => {
    return foodList.filter((food) => {
        return food.name.toLowerCase().includes(query.toLowerCase());
    });
}

const searchByCategory = (foodList, categories) => {
    if (categories.length === 0) {
        return foodList;
    }
    return foodList.filter((food) => {
        return categories.includes(food.category);
    });
}

const searchByExpiredDate = (foodList, days) => {
    const today = new Date();
    return foodList.filter((food) => {
        const expiredDate = new Date(food.expired_date);
        const diffTime = expiredDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days && diffDays >= 0;
    });
}

const searchStartingFromDate = (foodList, start) => {  
    return foodList.filter((food) => {
        if (new Date(food.expired_date) >= (new Date(start))) {
            return food;
        }
    })
}

const searchByExpiredRange = (foodList, start, end) => {
 
    return foodList.filter((food) => {

        if (new Date(food.expired_date)>= (new Date(start)) && new Date(food.expired_date) <= (new Date(end))) {
            return food;
        }
    })
}

 
export { searchByCategory, searchByName, searchByExpiredDate, searchStartingFromDate, searchByExpiredRange }; // Export the search function for use in other files