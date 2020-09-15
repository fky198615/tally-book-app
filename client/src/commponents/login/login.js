import React from 'react';
import {useSelector,connect} from 'react-redux';
import {login} from '../../redux/reducers/auth';
import { Redirect } from 'react-router-dom';
import Error from '../Error/error';

import '../login/login.css';


function Login({login}) {
    const [loginEmail, setLoginEmail] = React.useState("");
    const [loginPassword, setLoginPassword] = React.useState("");
    const ifLogIn = useSelector(state => state.authResgister.authSuccess);
    const logErr = useSelector(state => state.authResgister.errMessage);
    
    const updateLoginEmail = e =>{
      setLoginEmail(e.target.value);
    }

    const updateLoginPassword = e =>{
      setLoginPassword(e.target.value);
    }

    const submitLogin = e=>{
      e.preventDefault();
      login({loginEmail, loginPassword});

      console.log("if login ", ifLogIn);
   }

   if(ifLogIn){
    return <Redirect to= "/" />
  }


  return (
      <div className = "loginOutter">
        <h1>login</h1>
        {ifLogIn===false&&logErr!=null ? (<Error errM ={logErr}/>) : (void(0))}
        <div className = "loginInner">
          <form className = "from" onSubmit={submitLogin}>
            <label forhtml ="logEmail" className="logEmail_">Email<span>(required)</span>: </label>
            <input type = "email" className="loginInputEmail" onChange={updateLoginEmail}/>
            <label forhtml="logPassword" className="logPassword_">Password<span>(required)</span>:</label>
            <input type = "password" className="loginInputPassword" onChange={updateLoginPassword}/>
            <button className="loginButton">Login</button>
          </form>
        </div>
      </div>
    );
  }
  
export default connect(null, { login })(Login);