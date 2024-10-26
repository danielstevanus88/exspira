import ItemBox from './ItemBox';
import './ItemLayout.css';
import { searchByName } from '../Utilities';
import { useEffect, useState } from 'react';

function ItemLayout({ filteredFoodList, setAddNewItem, setSelectedFood, loadingUpload, setLoadingUpload, 
    selectedFood, setFoodList, setFilterDaily, filterDaily, foodListUpload, setFoodListUpload, setBillImg, setSchedule, recipeClick }) {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [foodListToShow, setFoodListToShow] = useState([]);
    

    const handleAddItem = () => {
        setAddNewItem(true);
    }


    const handleUnselectItem = () => {
        setSelectedFood([]);
    }

    const handleDeleteItem = async () => {
        let res = await fetch("http://localhost:5000/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedFood),
        });

        res = await res.json();
        setSelectedFood([]);
        setFoodList(res);
    }

    const handleEatItem = async () => {

        {
            let res = await fetch("http://localhost:5000/eat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedFood)
            });
            
            res = await res.json();
            setSelectedFood([]);
            setFoodList(res);
        }

        {
            // Get new schedule
            let res = await fetch("http://localhost:5000/schedule");
            res = await res.json();
            setSchedule(res);
        }


    }

    const handleSelectAll = () => {
        setSelectedFood(filteredFoodList);
        // Find all checkbox and tick
        let checkboxes = document.querySelectorAll(".item-box input[type=checkbox]");
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });

    }

    const handleUploadGrocery = () => {


        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();

        fileInput.onchange = async (e) => {
            
            setLoadingUpload(true);
            alert("Uploading grocery receipt...");

            let file = e.target.files[0];
            
            // Preview the image
            let img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            img.width = 200;
            img.height = 200;
            
            setBillImg(URL.createObjectURL(file));


            


            
            let formData = new FormData();
            formData.append("file", file);
            
            let res = await fetch("http://localhost:5000/readFoodListFromImage", {
                method: "POST",
                body: formData
            });

            res = await res.json();

            setFoodListUpload(res);
            
            setLoadingUpload(false);
        }
    }

    useEffect(() => {
        handleUploadGrocery();
    }, [recipeClick]);



    const handleChange = (e) => {
        setQuery(e.target.value);
    }

    const handlePageChange = (e) => {
        setPage(e.target.innerHTML);
    }

    const handleNextPage = () => {
        setPage(page => page + 1);
    }

    const handlePreviousPage = () => {
        setPage(page => page - 1);
    }


    useEffect(() => {
        setPage(1);
    }, [query]);


    useEffect(() => {
        let start = (page - 1) * 10;
        let end = start + 10;
        setFoodListToShow(searchByName(filteredFoodList, query).slice(start, end));
    }, [page, query, filteredFoodList]);

    return (
        <div className="item-layout">
            <div className="toolbar">
                {/* search bar */}

                <div className="flex-container-horizontal">
                    <div class="input-group mb-3 me-2 w-100 flex-5">
                        <input type="text" class="form-control input-search" placeholder="Search" onChange={handleChange} />
                        <button class="btn btn-outline-secondary" type="button" id="button-addon2">Search </button>
                    </div>
                    <div className="flex-2 w-100  me-2">
                        <button className="button-add-item btn btn-primary w-100" onClick={handleAddItem}><i class="fa fa-plus" aria-hidden="true" ></i> Add&nbsp;Item</button>

                    </div>

                    <div className="flex-3 w-100  me-2">
                        <button className="button-add-item btn btn-primary w-100" onClick={handleUploadGrocery}><i class="fa fa-camera" aria-hidden="true" ></i> Grocery&nbsp;Receipt</button>

                    </div>
                    
                    <div className="flex-2 w-100 ">
                        <button className="button-add-item btn btn-primary w-100" onClick={handleSelectAll}><i class="fa fa-check" aria-hidden="true" ></i> Select&nbsp;All</button>

                    </div>



                </div>

                {
                selectedFood.length > 0 &&
                <div className="flex-container-horizontal justify-content-end p-0">
                    
                    
                        <div className="me-2">
                            <button className="button-add-item btn btn-primary " onClick={handleDeleteItem}><i class="fa fa-trash" aria-hidden="true" ></i>&nbsp;Remove&nbsp;Selected&nbsp;Items</button>
                        </div>

                        <div className="me-2">
                            <button className="button-add-item btn btn-primary" onClick={handleUnselectItem}><i class="fa fa-minus" aria-hidden="true" ></i>&nbsp;Unselect&nbsp;All&nbsp;Items</button>
                        </div>

                        {filterDaily &&
                        <div className="me-2">
                            <button className="button-add-item btn btn-primary" onClick={handleEatItem}><i class="fa fa-minus" aria-hidden="true" ></i>&nbsp;Eat&nbsp;Selected&nbsp;Items</button>
                        </div>
            }      

                </div>
                }
            </div>

            {

                foodListToShow.map((food) => {
                    return <ItemBox item={food} setSelectedFood={setSelectedFood} selectedFood={selectedFood} filterDaily={filterDaily}
                    setFilterDaily={setFilterDaily}/>
                })

            }

            <nav aria-label="Page navigation example">
                <ul class="pagination">

                    <li class={"page-item " + ((page == 1) ? "disabled" : "")} >
                        <a class="page-link" onClick={handlePreviousPage}>Previous</a>
                    </li>
                    {
                        Array(Math.ceil(searchByName(filteredFoodList, query).length / 10)).fill(0).map((_, i) => {
                            return <li class={"page-item " + (page == i + 1 ? "fw-bold" : "")} ><a class="page-link" href="#" onClick={handlePageChange}>{i + 1}</a></li>
                        })
                    }
                    <li class="page-item">
                        <a class={"page-link " + ((page == (Math.ceil(searchByName(filteredFoodList, query).length / 10))) ? "disabled" : "")} href="#" onClick={handleNextPage}>Next</a>
                    </li>
                </ul>
            </nav>

        </div>
    );
}

export default ItemLayout;