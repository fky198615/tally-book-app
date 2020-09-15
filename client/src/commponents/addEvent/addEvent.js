import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import '../addEvent/addEvent.css';
import HandleError from '../Error/error';
import Axios from 'axios';


function AddEvent(props){
    let tempDate = new Date();
    let fileInput = React.createRef();
    const [event, setEvent] = React.useState(undefined);
    const [amount, setAmount] = React.useState(undefined);
    const [date, setDate] = React.useState(tempDate);
    const [error_event, setError_event] = React.useState(undefined);
    const [image, setImage] = React.useState("");
    const endPoint = 'http://localhost:5000/redux_users';
    const token = localStorage.getItem('token');
   
    const updateEvent = e =>{
        setEvent(e.target.value);
    }

    const updateAmount = e=>{
        setAmount(e.target.value);
    }
    

    const uploadImage = async(e) =>{
       try{
        e.preventDefault();
        const selectedFile = fileInput.current.files[0];
        console.log("file size", selectedFile.size);
        if(selectedFile.size > 1024*1024){
            setError_event("The file is too large!");
            return;
        }
        
        const formData = new FormData();
        formData.append('newImage', selectedFile);
        const upload = await Axios.post(`${endPoint}/upload`, formData, {"x-auth-token": token})
        console.log(upload);
        setImage(upload.data.path);
        
       }catch(err){
         console.log("err event, ", err);
        
        }
    }
    
    const submitEvent = async (e) =>{
        try{
            console.log("image ", image);
            e.preventDefault();
            const body = {
                "event": event,
                "amount": amount,
                "date": date,
                "image": image
            };

          const submitE = await Axios.post(`${endPoint}/add`,body,{headers: {"x-auth-token": token}});
          console.log(submitE);
          window.location = "http://localhost:3000/";

        }catch(err){
            console.log("err event, ", err.response.data.msg);
            if(err.response.data.msg){
                setError_event(err.response.data.msg);
            }
        }
    }
     
    return(
        <div className="outterAdding">
            <h1>Adding Events</h1>
            {error_event ? (<HandleError errM={error_event}/>):(void(0))}
            <div className="innerAdding">
            <form className="addingEvent" onSubmit={submitEvent}>
            
            <div className= "form-group">
             <label className="event">Event <span>(required)</span>:</label>
             <input type="text" className="inputEvent" onChange={updateEvent}/>
            </div>
             
            <div className= "form-group">
             <label className="amount">Amount <span>(required)</span>:</label>
             <input type="number" className="inputAmount" step="any" onChange={updateAmount}/>
            </div>

            <div className= "form-group">
             <label>Upload image: </label>
             <input type="file" onChange={uploadImage} ref={fileInput} className="addingFile" accept="image/png, .jpeg, .jpg" />
             </div>
             
             <div className="form-group">
             <label className="dateLabel">Date<span>(required)</span>:</label>
             <DateTimePicker className="datePicker" onChange={setDate} value={date}/>
            </div>
             <button className ="addEventButton">submit</button>
            </form>
            </div>
        </div>
    )
  }

export default AddEvent;
  