function Alert({foodList, setFilterDonate, filterDonate}) {

    // Check if there is expir date within 3days
    let today = new Date();
    let food = foodList.filter((food) => {
        let expiredDate = new Date(food.expired_date);
        let diffTime = expiredDate - today;
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
    });

    if(food.length == 0) {
        return null;
    }

    const handleDonateClick = (e) => {
        setFilterDonate(true);
        document.getElementById("donate").checked = true;
    }

    return (
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Reminder:</strong> You have {food.length} food items that will expire within 3 days. 
            Please consider <a className="fw-bold" href="#" onClick={handleDonateClick}>donating</a> them.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
}

export default Alert;