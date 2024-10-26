import React from 'react';
import './ItemBox.css';
import { categoryColor } from '../DummyData';
const ItemBox = ({ item, setSelectedFood, selectedFood, filterDaily }) => {
    const handleCheckboxClick = (e) => {
         if(e.target.checked){
             setSelectedFood((selectedFood) => {
                 if(!selectedFood.find((food) => food.id == item.id)){
                     return [...selectedFood, item];
                 }
             });
         } else {
             setSelectedFood((selectedFood) => {
                 return selectedFood.filter((food) => food.id != item.id);
             });
         }
     }

    const today = new Date();
    const expiredDate = new Date(item.expired_date);
    const diffTime = expiredDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let difftext;
        
    if (diffDays < 0) {
        difftext= 
            <div className="expired-heading"> 
                <div>Expired</div>
            </div>
    }
    else if (diffDays == 0) {
        difftext=
            <div className="expiring-today-heading"> 
                <div>Expiring Today</div>
            </div>
    }
    else {
        difftext=
        <div>
            <div className="not-expired-text">
                {"Expired in " }
            </div>
            <div className="not-expired-text">
                {+ diffDays + " days"}
            </div>
            {diffDays <= 3 && 
            <div className="donate-text fw-bold">
            (Donate)
        </div>}
            
        </div>
    }   
    

    return (
        <div className="item-box">
            <div className="flex-container">
                <div className="flex-item-1">
                    <img className="item-image" src={item.image} />
                </div>
                <div className="flex-item-2">
                    <div className="item-header">
                        <div className="item-name">
                            {item.name}
                        </div>
                        <div style={{ backgroundColor: categoryColor[item.category] }} className={"item-category"}>
                            {item.category}
                        </div>
                    </div>
                    <div className="item-quantity">
                        {!filterDaily &&
                            <span>
                            Quantity: {item.quantity}
                            </span>
                        }

                        {filterDaily &&
                            <span>
                                Quantity To Eat: {item.toEatQuantity}
                            </span>
                        }

                    </div>
                </div>
                <div className="flex-item-3 expired-text-box">
                    {difftext}
                </div>
                
                <div className="item-checkbox">
                        <input className="checkbox" id={item.id} type="checkbox" value={item.id} onClick={handleCheckboxClick} checked={selectedFood.some(food => food.id === item.id)} />         
                </div>
            </div>
        </div>
    );
};

export default ItemBox;