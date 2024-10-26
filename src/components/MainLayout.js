import React from 'react';
import './MainLayout.css';
import Filter from './Filter';
import ItemLayout from './ItemLayout';
import { useState } from 'react';
import AddItemForm from './AddItemForm';
import RecipeBox from './RecipeBox';
import Alert from './Alert';
import AddMultipleItemForm from './AddMultipleItemForm';

function MainLayout({ foodList, setFoodList, schedule, setSchedule }) {
    const [filteredFoodList, setFilteredFoodList] = useState(foodList);
    const [addNewItem, setAddNewItem] = useState(false);
    const [recommendRecipe, setRecommendRecipe] = useState(false);

    const [selectedFood, setSelectedFood] = useState([]);
    const [recipeAsHtmlString, setRecipeAsHtmlString] = useState({ __html: "" });

    const [filterDonate, setFilterDonate] = useState(false);
    const [filterDaily, setFilterDaily] = useState(false);

    const [loadingUpload, setLoadingUpload] = useState(false);

    const [foodListUpload, setFoodListUpload] = useState(false);
    const [billImg, setBillImg] = useState(null);

    const [recipeClick, setRecipeClick] = useState(false);

    const handleScanRecipeClick = (e) => {
        e.preventDefault();
        setRecipeClick(true);
    }

    const handleDaily = () => {
        // set the checkbox to true
        let checkbox_daily = document.getElementById("today");
        checkbox_daily.checked = true;


        setFilterDaily(true);
    }

    const handleRecipe = async () => {

        setRecommendRecipe(true);
        let result = await fetch("http://localhost:5000/makerecipe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedFood),
        });
        let data = await result.json();
        setRecipeAsHtmlString({ __html: data.content[0].text });
    }

    return (
        <>
            <div className="flex-3 jumbotron">

                <div class="p-5 color-green-overlay rounded-3" >
                    <div class="mask">
                        <div class="d-flex align-items-center h-100">
                            <div class="text-white">
                                <h1 class="mb-3">Exspira</h1>
                                <h4 class="mb-3">Stay fresh, waste less</h4>
                                <a data-mdb-ripple-init class="btn btn-outline-light btn-lg btn-to-eat" href="#!" role="button" onClick={handleDaily}> What To Eat Today</a>
                                <a class="text-white mx-2 fw-bold" href="" onClick={handleScanRecipeClick}><i class="fa fa-camera" aria-hidden="true" ></i> Scan Receipt </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Alert
                foodList={foodList}
                setFilterDonate={setFilterDonate}
                filterDonate={filterDonate}
            />

            <div className="flex-container-vertical">
                <div className="flex-6 items">
                    <div className="flex-container-horizontal">
                        <div className="flex-2 filter">
                            <Filter foodList={foodList} setFilteredFoodList={setFilteredFoodList} schedule={schedule}
                                setFilterDonate={setFilterDonate}
                                filterDonate={filterDonate}
                                filterDaily={filterDaily}
                                setFilterDaily={setFilterDaily}
                            />
                        </div>
                        <div className="flex-5 item-cards">
                            <ItemLayout
                                filteredFoodList={filteredFoodList}
                                setAddNewItem={setAddNewItem}
                                setFilteredFoodList={setFilteredFoodList}
                                setSelectedFood={setSelectedFood}
                                selectedFood={selectedFood}
                                setFoodList={setFoodList}
                                schedule={schedule}
                                filterDaily={filterDaily}
                                setFilterDaily={setFilterDaily}
                                setFoodListUpload={setFoodListUpload}
                                foodListUpload={foodListUpload}
                                setLoadingUpload={setLoadingUpload}
                                loadingUpload={loadingUpload}
                                setBillImg={setBillImg}
                                setSchedule={setSchedule}   
                                recipeClick={recipeClick}
                            />
                        </div>
                    </div>
                </div>
                <button className="recommend-recipe-button btn btn-primary" type='button' onClick={handleRecipe}>
                    <i class="fa fa-cutlery" aria-hidden="true"></i> Recommend Recipe
                </button>
            </div>
            {(loadingUpload || foodListUpload) && <AddMultipleItemForm setFoodList={setFoodList} setAddNewItem={setAddNewItem} selectedFood={selectedFood} setSchedule={setSchedule} foodListUpload={foodListUpload} setFoodListUpload={setFoodListUpload}
                foodList={foodList} loadingUpload={loadingUpload} setLoadingUpload={setLoadingUpload} billImg={billImg} />}
            {addNewItem && <AddItemForm setFoodList={setFoodList} setAddNewItem={setAddNewItem} selectedFood={selectedFood} setSchedule={setSchedule} />}
            {recommendRecipe && <RecipeBox recipeAsHtmlString={recipeAsHtmlString} setRecommendRecipe={setRecommendRecipe} setRecipeAsHtmlString={setRecipeAsHtmlString} />}
        </>
    );
}

export default MainLayout;