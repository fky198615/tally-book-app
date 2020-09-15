import React from 'react';
import Axios from 'axios';
import "./event.css";

function Event(props){
    let tokenDetele = localStorage.getItem("token");
    const [hide, setHide] = React.useState(false);
    const endPoint = 'http://localhost:5000/redux_users';
    
    //reference https://stackoverflow.com/questions/19491222/convert-gmt-time-to-local-time
    function convertTime(time){
        let local = new Date(time);
        let newDate = new Date(local);
        let date = newDate.toLocaleString(newDate);
        console.log("local, ", date);
        return date;
        
    }

    let time = convertTime(props.date);
    console.log("time, ", time);

    function showAndHide(){
        setHide(!hide);
    }

    const deleteTodo = async (e) =>{
        try{
         console.log("delete in front");
         console.log("id, ", props.id);
         const deleteE = await Axios.delete(`${endPoint}/delete/${props.id}`,{headers: {"x-auth-token": tokenDetele}});
         console.log("delete todo, ", deleteE);
        }catch(err){
          console.log(err.response.data.msg);
        }
     }
    
    function edit(){
      window.location = "http://localhost:3000/edit/"+props.id
    }
    
    return(
     <div className="historyInner">
       <div className ="history">
           <span className="date">Create time: {time}</span>
           <span className="event">{props.cases}:</span>
           <span className="amount">${props.money}</span>
       </div>
       <div className="imageContainer">
        {props.image.length > 0 && hide ? (<img className="eventImage" src ={"http://localhost:5000/"+props.image}  alt="Logo" /> )
          :(void(0))
        } 
       </div>
       <div className="buttonContainer">
        <div className ="button">
           <form onSubmit={deleteTodo}>
               <button className = "deleted" type="submit">delete</button>
           </form>
        </div>
        <div className="edit">
          <button className ="editButton" onClick={edit}>edit</button>
        </div>
        {props.image.length > 0 ?(!hide ? (<button className="show" onClick={showAndHide}>Show image</button>) : 
                                          (<button className="hide" onClick={showAndHide}>Close image</button>)):(void(0))
        }
      </div>
     </div>
    );
}

export default Event;