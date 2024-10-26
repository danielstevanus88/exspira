import React, { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';
import { food as dummyFood, foodList as dummyFoodList } from './DummyData'; // Make sure to create a corresponding file for dummy data

import MainLayout from './components/MainLayout';

function App() {

  const [foodList, setFoodList] = useState([]);
  const [schedule, setSchedule] = useState({});

  // Get foodList from server
  useEffect(() => {

    const fetchData = async () => {
      let foodRes = await fetch('http://localhost:5000/foodlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      foodRes = await foodRes.json();
      setFoodList(foodRes);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if(foodList && foodList.length == 0) return;
    const fetchData = async () => {
    let scheduleRes = await fetch('http://localhost:5000/schedule', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    scheduleRes = await scheduleRes.json();
    setSchedule(scheduleRes);
    }
    fetchData();
  }, [foodList]);

  useEffect(() => {
    if(!schedule) return;
    let today = new Date();
    today = today.toISOString().split('T')[0];
    let foodObjects = schedule[today];
    let newFoodList = foodList;
    if (foodObjects && foodObjects.length != 0 && foodList.length != 0) {
      for (let foodObject of foodObjects) {
        if (foodObject.quantity != 0) {
            newFoodList = foodList.map((food) => {
            if (food.id == foodObject.id) {
              food.toEatQuantity = foodObject.quantity;
            }
            return food;
          });
        }
      }
    }
    setFoodList(newFoodList);
  }, [schedule]);

  return (
    <div className="App">
      <MainLayout foodList={foodList} setFoodList={setFoodList} schedule={schedule} setSchedule={setSchedule}/>

    </div>
  );
}

export default App;
