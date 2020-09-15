import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import '../Edit/edit.css';
import HandleError from '../Error/error';
import Axios from 'axios';


function EditEvent(props){
    let tempDate = new Date();
    let fileInput = React.createRef();
    const [eventEdit, setEventEdit] = React.useState("");
    const [amountEdit, setAmountEdit] = React.useState("");
    const [dateEdit, setDateEdit] = React.useState(tempDate);
    const [error_eventEdit, setError_eventEdit] = React.useState(undefined);
    const [imageEdit, setImageEdit] = React.useState("");
    const [changeImage, setChangeImage] = React.useState(false);
    const endPoint = 'http://localhost:5000/redux_users';
    const token = localStorage.getItem('token');
    const path = window.location.pathname;
    const id = path.substr(6,path.length-1);

    React.useEffect(()=>{
       const getOrigin = async () =>{
        try{
         console.log("id edit, ", id);
         const originItem = await Axios.get(`${endPoint}/origin/${id}`, {headers: {"x-auth-token": token}});
         console.log("originItem, ", originItem);
         setEventEdit(originItem.data.event);
         setAmountEdit(originItem.data.amount);
         setDateEdit(new Date(originItem.data.createDate));
         setImageEdit(originItem.data.image);
        } catch(err){
            console.log(err.response.data.msg);
         }
       }

       getOrigin();
    },[]);
   
    const editEvent = e =>{
        setEventEdit(e.target.value);
    }

    const editAmount = e=>{
        setAmountEdit(e.target.value);
    }
    

    const editImage = async(e) =>{
       try{
        e.preventDefault();
        const selectedFile = fileInput.current.files[0];
        console.log("file size", selectedFile.size);
        if(selectedFile.size > 1024*1024){
            setError_eventEdit("The file is too large!");
            return;
        }
        
        const formData = new FormData();
        formData.append('newImage', selectedFile);
        const uploadEdit = await Axios.post(`${endPoint}/upload`, formData, {"x-auth-token": token});
        console.log(uploadEdit);
        setImageEdit(uploadEdit.data.path);
        
       }catch(err){
         console.log("err event, ", err);
        
        }
    }
    
    const submitEventEdit = async (e) =>{
        try{
            console.log("image ", imageEdit);
            e.preventDefault();
            const body = {
                "event": eventEdit,
                "amount": amountEdit,
                "date": dateEdit,
                "image": imageEdit
            };

          const submitEdit = await Axios.post(`${endPoint}/edit/${id}`,body,{headers: {"x-auth-token": token}});
          console.log(submitEdit);
          window.location = "http://localhost:3000/";

        }catch(err){
            console.log("err event, ", err.response.data.msg);
            if(err.response.data.msg){
                setError_eventEdit(err.response.data.msg);
            }
        }
    }
    
    function showChange(){
          setChangeImage(!changeImage);
    }
    
    return(
        <div className="outterAdding">
            <h1>Edit Events</h1>
            {error_eventEdit ? (<HandleError errM={error_eventEdit}/>):(void(0))}
            <div className="innerAdding">
            <form className="addingEvent" onSubmit={submitEventEdit}>
            
            <div className= "form-group">
             <label className="event">Event <span>(required)</span>:</label>
             <input type="text" className="inputEvent" value={eventEdit} onChange={editEvent}/>
            </div>
             
            <div className= "form-group">
             <label className="amount">Amount <span>(required)</span>:</label>
             <input type="number" className="inputAmount" step="any" value ={amountEdit} onChange={editAmount}/>
            </div>
            
            {
             changeImage ?
             (<div className= "form-group">
             <label>Upload image: </label>
             <input type="file" onChange={editImage} ref={fileInput} className="addingFile" accept="image/png, .jpeg, .jpg" />
             </div>):(<button className="changeButton" onClick={showChange}>Change Image</button>)
            } 
             <div className="form-group">
             <label className="dateLabel">Date<span>(required)</span>:</label>
             <DateTimePicker className="datePicker" onChange={setDateEdit} value={dateEdit}/>
            </div>
             <button className ="addEventButton">submit</button>
            </form>
            </div>
        </div>
    )
  }

export default EditEvent;