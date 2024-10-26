import React from 'react';
import './RecipeBox.css';
import Loading from './Loading';

function RecipeBox({recipeAsHtmlString, setRecommendRecipe, setRecipeAsHtmlString}) {
    const handleClose = () => {
        
        setRecipeAsHtmlString({__html: ""});
        setRecommendRecipe(false);

    }

    function handlePrint() {
        // Create a new window
        const printWindow = window.open('', '', 'height=600,width=800');

        // Write the HTML string to the new window's document
        printWindow.document.write(recipeAsHtmlString.__html);

        // Wait for the content to load and then trigger the print
        printWindow.document.close(); // Needed for some browsers
        printWindow.focus(); // Ensures the new window has focus

        // Call the print function
        printWindow.print();

        // Close the print window after printing
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    }
    return (
        <div className="recipe-dark-background">
                <div className="recipe-white-box">
                        <div class="d-flex align-items-center">
                            <div class="d-flex w-100 align-items-center">
                                <span className="add-title align-self-center">Recipe Recommendation</span>
                                <button className="btn-print align-self-center mx-2" onClick={handlePrint}><i class="fa fa-print" aria-hidden="true"></i> Print</button>
                            </div>
                            <div class="p-2 flex-shrink-1 align-self-center" onClick={handleClose}><i class="fa fa-times" aria-hidden="true"></i></div>
                        </div>

                    <div className="recipe">
                        
                        {recipeAsHtmlString.__html === "" && <Loading />}
                        <div dangerouslySetInnerHTML={recipeAsHtmlString}></div>
                    </div>
                </div>
        </div>
    );

}


export default RecipeBox;