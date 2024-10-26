import { useEffect, useState } from 'react';
import Loading from './Loading';
import { categories, food } from '../DummyData';
import './AddMultipleItemForm.css';
import { unsplash_access_key } from '../Key';

function AddMultipleItemForm({ setAddNewItem, setFoodList,
    foodListUpload, setFoodListUpload, foodList, loadingUpload, setLoadingUpload, billImg }) {

    const [loading, setLoading] = useState(false);
    const [foodListUploadWithId, setFoodListUploadWithId] = useState([]);
    const handleClose = () => {
        setFoodListUpload(false);
        setLoadingUpload(false);
    }

    const handleNameChange = (e) => {
        let id = e.target.id.split("|")[1];
        let newFoodList = foodListUploadWithId.map((food) => {
            if (food.id == id) {
                food.name = e.target.value;
                alert(food.category);
            }
            return food;
        });
        setFoodListUploadWithId(newFoodList);
    }

    const handleExpiredDateChange = (e) => {
        let id = e.target.id.split("|")[1];
        let newFoodList = foodListUploadWithId.map((food) => {
            if (food.id == id) {
                food.expired_date = e.target.value;
            }
            return food;
        });

        setFoodListUploadWithId(newFoodList);
    }

    const handleCategoryChange = (e) => {
        let id = e.target.id.split("|")[1];
        let newFoodList = foodListUploadWithId.map((food) => {
            if (food.id == id) {
                food.category = e.target.value;
            }
            return food;
        }
        );
        setFoodListUploadWithId(newFoodList);
    }

    const handleQuantityChange = (e) => {
        let id = e.target.id.split("|")[1];
        let newFoodList = foodListUploadWithId.map((food) => {
            if (food.id == id) {
                food.quantity = e.target.value;
            }
            return food;
        }
        );
        setFoodListUploadWithId(newFoodList);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let newFoodList = [];
        for(let foodData of foodListUploadWithId){
            if (!foodData.expired_date) {
                let res = await fetch(`http://localhost:5000/estimate-expiry-date`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(foodData),
                });
                let data = await res.json();
                foodData.expired_date = data.content[0].text;
            }


            // Close the form
            // Unsplash api
            {
                let name_no_space = foodData.name.split(" ").join("");
                let res = await fetch(`https://api.unsplash.com/search/photos?query=${name_no_space}&client_id=${unsplash_access_key}`);
                let results = (await res.json()).results[0];
                foodData.image = results? results.urls.regular: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D";
            }

            newFoodList.push(foodData);
        }


        let res = await fetch("http://localhost:5000/addmultiple", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newFoodList),
        });

        res = await res.json();
        setFoodList(res);


        setFoodListUpload(false);
        setLoading(false);
    }






    useEffect(() => {
        if (!loadingUpload) {
            let max = 0;
            for (let food of foodList) {
                if (food.id > max) {
                    max = food.id;
                }
            }

            let newFoodList = foodListUpload.map((food) => {
                food.id = max + 1;
                max++;
                return food;
            });

            setFoodListUploadWithId(newFoodList);
        }
    }, [foodListUpload, foodList, loadingUpload]);



    return (
        <>
            <div id="addmultiple" className="dark-background">
                <div className="white-box">
                    <form onSubmit={handleSubmit}>
                        <div class="d-flex align-items-center">
                            <div class="w-100"><div className="add-title align-self-center">Add New Item</div></div>
                            <div class="p-2 flex-shrink-1 align-self-center" onClick={handleClose}><i class="fa fa-times" aria-hidden="true"></i></div>
                        </div>

                        <div id="image-preview" class="text-center my-2">
                            <img src={billImg} />
                        </div>
                        {loadingUpload && <Loading />}
                        {loading && <Loading />}


                        {!loadingUpload && !loading &&
                            foodListUploadWithId.map((food) => {
                                return (
                                    <>
                                        <div class="item-header">Item#{food.id}</div>
                                        <hr></hr>
                                        <label htmlFor={"name|" + food.id} className="mt-1">Name</label>
                                        <input id={"name|" + food.id} className="form-control" type="text" placeholder="Add a new item" onChange={handleNameChange} value={food.name} />
                                        <label htmlFor={'expired-date|' + food.id} className="mt-3">Expired Date</label>
                                        <input id={'expired-date|' + food.id} className="form-control" type="date" placeholder="Add the expiry date" onChange={handleExpiredDateChange} />
                                        <label htmlFor={'quantity|' + food.id} className="mt-3">Quantity</label>
                                        <input id={'quantity|' + food.id} className="form-control" type="number" placeholder="Add the quantity" onChange={handleQuantityChange} value={food.quantity || 1} />
                                        <label htmlFor={'category|' + food.id} className="mt-3">Category</label>
                                        <select id={'category|' + food.id} className="form-select" onChange={handleCategoryChange} defaultValue={food.category} required>
                                            <option value="" disabled>Select a category</option>

                                            {categories.map((category) => {
                                                return (
                                                    <option key={category} value={category} selected={food.category === category}>{category}</option>
                                                )
                                            })
                                            }
                                        </select>
                                    </>

                                );
                            }
                            )}
                        <button type="submit" className="btn btn-primary w-100 my-3" disabled={loadingUpload || loading}>Add</button>
                    </form>
                </div>
            </div>

        </>
    );


}

export default AddMultipleItemForm;