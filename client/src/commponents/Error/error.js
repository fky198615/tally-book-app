import React from 'react';
import '../Error/error.css';

function Error(props) {
    
    return (
      <div className="Error">
            <div className="message">{props.errM}</div>
     </div>
    );}
  

  export default Error;