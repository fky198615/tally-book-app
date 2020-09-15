import React from 'react';
import "./outcome.css";

function Outcome(props){
    return(
        <div className="outcomeOuter">
          <div className="incomeInner">
            <div className="inComeTitle">Your Income: </div>
            <div className="income">${props.income}</div>
         </div>
         <div className="expenseInner">
            <div className="expeseTitle">Your Expense: </div>
            <div className="expense">${props.spent}</div>
         </div>

        </div>
    )
}

export default Outcome;