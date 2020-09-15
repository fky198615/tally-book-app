import React from 'react';
import Axios from 'axios';
import {useSelector, connect} from 'react-redux';
import {logout} from '../../redux/reducers/auth';
import Balance from '../Balance/balance';
import Outcome from '../outcome/outcome';
import Event from '../Event/event';
import '../frontPage/frontPage.css';

function Front({logout}) {
  const ifLogged = useSelector(state => state.authResgister.authSuccess);
  const user = useSelector(state => state.authResgister.user);
  const [balance, setBalance] = React.useState(0);
  const [earn, setEarn] = React.useState(0);
  const [expanse, setExpanse] = React.useState(0);
  const [items, setItems] = React.useState([]);
  const endPoint = 'http://localhost:5000/redux_users';
  const token = localStorage.getItem('token');
  const submitLogout = e =>{
    logout();
  }

  function login(){
    window.location = "http://localhost:3000/login";
   }

   function signup(){
    window.location = "http://localhost:3000/register";
   }
   
   function adding(){
    window.location = "http://localhost:3000/add";
   }
   
   React.useEffect(()=>{
    const getAllItems = async() =>
    {
     try{
     const allItems = await Axios.get(`${endPoint}/all`, {headers: {"x-auth-token": token}} );
     console.log(allItems.data.data);

     setItems(allItems.data.data);

     let tempBalance = 0;
     let tempEarning = 0;
     let tempExpanse = 0;

     for(let i = 0; i < allItems.data.data.length; i++){
       tempBalance = tempBalance + allItems.data.data[i].amount;

       if(allItems.data.data[i].amount > 0){
         tempEarning += allItems.data.data[i].amount;
       }

       if(allItems.data.data[i].amount < 0){
         tempExpanse += allItems.data.data[i].amount;
       }
     }
    
     console.log("tempBalance ", tempBalance);
     console.log("tempEarning ", tempEarning);
     console.log("tempExpanse)", tempExpanse);
     setBalance(tempBalance.toFixed(2));
     setEarn(tempEarning.toFixed(2));
     setExpanse(tempExpanse.toFixed(2));

    }catch(err){
      console.log("err front page, ", err);
    }}

    getAllItems();

   },[])


   return (
      <div className = "front_body">
        <h1 className="title">Earning and Expense</h1>
   <div className="greeting">Welcome! {user}</div>
        {
         ifLogged ? (
         <div className = "haveUser">
         <Balance balance={balance} />
         <Outcome income={earn} spent={expanse}/>
         <div className = "eventContainer">
           <h1>History</h1>
           {items.map((item, i)=>(
             <div key={i}>
               <Event cases={item.event} money={item.amount} id={item._id} image={item.image} date={item.createDate}/>
             </div>
           ))}
          </div>
          <div className ="buttonArea">
          <form className = "logoutButton" onSubmit={submitLogout}>
            <button className="logout">Log out</button>
          </form>

          <button className = "addButton" onClick={adding}>Add new event</button>
          </div>
          </div>
        ):
        ( 
          <div className="noUser">
          <div className="reminder">If you already have an account, please log in first! Otherwise, please sign up. Thank you!</div>
          <button className ="in" onClick={login}>Log in</button>
          <button className ="up"onClick={signup}>Sign up</button>
          </div>
        )
        }
      </div>
    );
  }


export default connect(null, { logout })(Front);;