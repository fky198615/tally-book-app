import React from 'react';
import {useSelector,connect} from 'react-redux';
import {register} from '../../redux/reducers/auth';
import { Redirect } from 'react-router-dom';
import Error from '../Error/error';

import '../resgister/register.css';


function Register({register}) {
    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [comfired, setComfirmed] = React.useState("");

    const ifLogged = useSelector(state => state.authResgister.authSuccess);
    const ifError = useSelector(state => state.authResgister.errMessage);

    const updateEmail = e =>{
      setEmail(e.target.value);
    }

    const updateUserName = e=>{
      setUsername(e.target.value);
    }

    const updatePassword = e =>{
      setPassword(e.target.value);
    }

    const updateComfirmed = e=>{
      setComfirmed(e.target.value);
    }


    const submitRegister = e=>{
      e.preventDefault();
      register({username, email, password, comfired});
    }
    
    console.log("if auth, ", ifLogged);
    console.log("message: ", ifError);
    
    if(ifLogged){
      return <Redirect to= "/" />
    }
    
    
   
    return (
      <div className = "register">
        <h1>register</h1>
          {(ifLogged === false && ifError != null) ? (<Error errM ={ifError}/>) : (void(0))}
          
          <form className = "submit" onSubmit={submitRegister}>
            <label htmlFor="username" className="username_">User name: </label>
            <input className="inputUserName" type="text" onChange={updateUserName}/>
            
            <label htmlFor="email" className="email_">Email<span>(required)</span>: </label>
            <input className="inputEmail" type="email" onChange={updateEmail}/>
            
            <label htmlFor="password" className="password_">Password<span>(required)</span>:</label>
            <input className="inputPassword" type="password" onChange={updatePassword}/>

            <label htmlFor="comired" className="comfired_">Comfirm password<span>(required)</span>:</label>
            <input className="inputComfired" type="password" onChange={updateComfirmed}/>
            
            <button className="submitButtion" type="submit">Register</button>
          </form>
      </div>

    );
  }
  
  export default connect(null, { register })(Register);