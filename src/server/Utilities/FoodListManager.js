const createNewFood = (foodList, food) => {
    food.id = Math.max(...foodList.map((food) => food.id)) + 1;
    return [...foodList, food];
}

const appendFoodId = (foodList, food) => {
    if(foodList.length == 0) {
        food.id = 1;
        return food;
    }
    food.id = Math.max(...foodList.map((food) => food.id)) + 1;
    return food;
}

const deleteFood = (foodList, food) => {
    return foodList.filter((f) => f.id != food.id);
}



module.exports = {
    appendFoodId,
    deleteFood
};