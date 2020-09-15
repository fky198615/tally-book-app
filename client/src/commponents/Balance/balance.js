import React from 'react';
import '../Balance/balance.css';

function Balance(props){
      return(
        <div className="blanceOuter">
            <div className="balenceTitle">Your Balance: </div>
            <div className="blance">${props.balance}</div>
        </div>
    )
  }

  export default Balance;
  