import React, { useState } from 'react';
import { categories, food } from '../DummyData';
import './AddItemForm.css';
import { unsplash_access_key } from '../Key';
import Loading from './Loading';

function AddItemForm({ setFoodList, setAddNewItem, setSchedule }) {

    const [foodData, setFoodData] = useState();
    const [loading, setLoading] = useState(false);
    const handleNameChange = (event) => {
        setFoodData({
            ...foodData,
            name: event.target.value,
        });
    }

    const handleExpiredDateChange = (event) => {
        setFoodData({
            ...foodData,
            expired_date: event.target.value,
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        // Check expired date empty
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
            console.log(foodData.expired_date);
        }

        // Close the form
        // Unsplash api
        {
            let res = await fetch(`https://api.unsplash.com/search/photos?query=${foodData.name}&client_id=${unsplash_access_key}`);
            let urls = (await res.json()).results;
            foodData.image = urls? urls.regular: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D";
        }


        // Save to Server
        let res = await fetch("http://localhost:5000/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(foodData),
        });

        res = await res.json();

        setFoodList(res);
        setLoading(false);
        setAddNewItem(false);
    };

    const handleCategoryChange = (event) => {
        setFoodData({
            ...foodData,
            category: event.target.value,
        });
    }

    const handleQuanitityChange = (event) => {
        setFoodData({
            ...foodData,
            quantity: event.target.value,
        });
    }

    const handleClose = () => {
        setAddNewItem(false);
    }



    return (
        <>
            <div className="dark-background">
                <div className="white-box">
                    {loading && <Loading />}
                    {!loading &&
                        <form onSubmit={handleSubmit}>
                            <div class="d-flex align-items-center">
                                <div class="w-100"><div className="add-title align-self-center">Add New Item</div></div>
                                <div class="p-2 flex-shrink-1 align-self-center" onClick={handleClose}><i class="fa fa-times" aria-hidden="true"></i></div>
                            </div>

                            <label htmlFor="name" className="mt-3">Name</label>
                            <input id="name" className="form-control" type="text" placeholder="Add a new item" onChange={handleNameChange} />
                            <label htmlFor='expired-date' className="mt-3">Expired Date</label>
                            <input id="expired-date" className="form-control" type="date" placeholder="Add the expiry date" onChange={handleExpiredDateChange} />
                            <label htmlFor='quantity' className="mt-3">Quantity</label>
                            <input id="quantity" className="form-control" type="number" placeholder="Add the quantity" onChange={handleQuanitityChange} />
                            <label htmlFor='category' className="mt-3">Category</label>
                            <select id="category" className="form-select" onChange={handleCategoryChange} required>
                                <option value="" disabled selected>Select a category</option>

                                {categories.map((category) => {
                                    return (
                                        <option value={category} >{category}</option>
                                    )
                                })
                                }
                            </select>
                            <button type="submit" className="btn btn-primary w-100 my-3">Add</button>
                        </form>
                    }
                </div>
            </div>
        </>
    );
}


export default AddItemForm;