import './Filter.css';
import { searchByCategory, searchByExpiredRange } from '../Utilities';
import { categories } from '../DummyData';
import { useEffect, useState } from 'react';
import { searchByExpiredDate } from '../Utilities';
import { searchStartingFromDate } from '../Utilities';

function Filter({ foodList, setFilteredFoodList, schedule, filterDonate, setFilterDonate, filterDaily, setFilterDaily }) {

    const [checkedCategories, setCheckedCategories] = useState([]);

    const [filterExpiredWithin, setFilterExpiredWithin] = useState(0);
    const [filterExpiredRange, setFilterExpiredRange] = useState({ start: "", end: "" });
    function handleDailySuggestions(e) {
        if(e.target.checked) {
            setFilterDaily(true);
        }
        else {
            setFilterDaily(false);
        }
    }

    function handleDonateSuggestions(e) {
        if(e.target.checked) {
            setFilterDonate(true);
        }
        else {
            setFilterDonate(false);
        }
    }


    function handleBeforeExpired(e) {
        let days = e.target.value;
        if (days === "") {
            setFilterExpiredWithin(0);
            setFilteredFoodList(searchByCategory(foodList, checkedCategories));
            return;
        }
        setFilterExpiredWithin(days);
    }

    function handleExpireRange(e) {
        setFilterExpiredRange({ start: document.getElementById("filter-start").value, end: document.getElementById("filter-end").value });
    
    }
    function handleChange(e) {
        let category = e.target.value;
        if (e.target.checked) {
            setCheckedCategories(checkedCategories => [...checkedCategories, category]);
        }
        else {
            setCheckedCategories(checkedCategories => checkedCategories.filter((checkedCategory) => checkedCategory !== category));
        }
    }


    useEffect(() => {
        let filteredFoodList = foodList;
        if (filterDaily) {
            
            filteredFoodList = foodList.filter((food) => food.toEatQuantity > 0);
        }
        
        if(filterExpiredWithin > 0) {
            filteredFoodList = searchByExpiredDate(filteredFoodList, filterExpiredWithin);
        }


        if(filterExpiredRange.start || filterExpiredRange.end) {
            if (filterExpiredRange.start == "" && filterExpiredRange.end != "") {
                const today = new Date();
                const today_str = today.toISOString().split('T')[0];
                filteredFoodList = searchByExpiredRange(filteredFoodList, today_str, filterExpiredRange.end);
            }
            else if (filterExpiredRange.end == "" && filterExpiredRange.start != "") {
                filteredFoodList = searchStartingFromDate(filteredFoodList, filterExpiredRange.start);
            }
            else if (filterExpiredRange.start != "" && filterExpiredRange.end != "") {
                filteredFoodList = searchByExpiredRange(filteredFoodList, filterExpiredRange.start, filterExpiredRange.end);
            }
        }

        if(filterDonate) {
            filteredFoodList = searchByExpiredDate(filteredFoodList, 3);
        }



        setFilteredFoodList(searchByCategory(filteredFoodList, checkedCategories));

    }, [checkedCategories, filterDaily, filterExpiredWithin, filterExpiredRange, foodList, schedule, filterDonate]);

    return (
        <div className="filter-box">
            <div className="filter-item">
                <label className='filter-header' htmlFor="filter-stock">Daily Suggestion</label>
                
                <div class="category-checkbox">
                        <input type="checkbox" id="today" name="today" value="today" onChange={handleDailySuggestions} />
                        <label htmlFor="today">To Eat Today</label>
                </div>
                <div class="category-checkbox">
                        <input type="checkbox" id="donate" name="donate" value="donate" onChange={handleDonateSuggestions} />
                        <label htmlFor="donate">To Donate</label>
                </div>
            </div>
            <div className="filter-item">
                <div className="filter-header">Category</div>
                {/* // make a tick box for the different categories not a drop down */}
                {
                    categories.map((category) => {
                        return (
                            <div class="category-checkbox">
                                <input type="checkbox" id={"category" + category} name={category} value={category} onChange={handleChange} />
                                <label htmlFor={"category" + category}>{category}</label>
                            </div>
                        )
                    })
                }
            </div>

            <div className="filter-item">
                <label className='filter-header' htmlFor="filter-stock">Expired Within </label>
                <div class="input-group mb-3">
                    <input id="filter-stock" type="text" class="form-control" placeholder="" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={handleBeforeExpired} />
                    <span class="input-group-text" id="basic-addon2">day(s)</span>
                </div>
            </div>
            <div className="filter-item">
                <label className="filter-header" htmlFor="filter-range">Expired Date Range</label>
                <br />
                <label htmlFor="filter-start">From </label>
                <input className="form-control" type="date" id="filter-start" onChange={handleExpireRange} />
                <label htmlFor="filter-end"> To </label>
                <input className="form-control" type="date" id="filter-end" onChange={handleExpireRange} />
            </div>
        </div>
    )
}

export default Filter;