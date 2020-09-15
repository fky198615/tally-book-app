import Axios from 'axios';


//Regiseter part reference and borrow idea from https://www.youtube.com/watch?v=Ui4KrRrJay4
const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
const REGISTER_FAIL = 'REGISTER_FAIL';
const USER_LOAD = 'USER_LOAD';
const AUTH_ERROR = 'AUTH_ERROR';
const LOG_OUT = 'LOG_OUT';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';

const endpoint = 'http://localhost:5000';



const initial = {
     token: localStorage.getItem('token'),
     authSuccess: null,
     user: null,
     errMessage: null
}


function authReducer (state = initial, action){
    const {type, payload} = action

    switch (type){
        case USER_LOAD:
            return {
                token: localStorage.getItem('token'),
                authSuccess: true,
                user: payload.username,
                errMessage: null
            }

        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:    
            localStorage.setItem('token', payload.token)

            return {
                token: localStorage.getItem('token'),
                authSuccess: true,
                user: payload.user.username,
                errMessage: null
            }
        
        case REGISTER_FAIL:
        case LOGIN_FAIL:
            localStorage.removeItem('token');
            return{
                token: null,
                authSuccess: false,
                user: null,
                errMessage: payload

            }
        

        case AUTH_ERROR:
        case LOG_OUT:
            localStorage.removeItem('token');

            return{
                token: null,
                authSuccess: false,
                user: null,
                errMessage: null
            }
        
        default: 
            return state;


    }
}


//Action
export const register = ({username, email, password, comfired}) => async (dispatch) => {
    const body = {
        "username": username,
        "email": email,
        "password": password,
        "checkPassword": comfired
    }

    

    try{

        const resRegister = await Axios.post(`${endpoint}/redux_users/register`,body);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: resRegister.data
        })
    }catch(err){
        console.log("err: ", err.response.data);
        
        dispatch({
            type: REGISTER_FAIL,
            payload: err.response.data.msg
        })

    }
}

export const loadUser = () => async(dispatch)=>{
    if(!localStorage.token){
        delete Axios.defaults.headers.common['x-auth-token'];
        dispatch({
            type: AUTH_ERROR
        })
    }
    
    else{

     try{

        console.log("token, ",localStorage.token);

        const loadRes = await Axios.get(`${endpoint}/redux_users`, {headers:{"x-auth-token": localStorage.token}});
        
        dispatch({
            type: USER_LOAD,
            payload: loadRes.data

        })
        
    }catch(err){
        console.log("Error in load user: ", err);

        dispatch({
            type: AUTH_ERROR
        })
    }
  }}


  export const logout=() => async (dispatch) =>{
      console.log("logging out!!");
      dispatch({
          type: LOG_OUT
      })
  }


  export const login=({loginEmail,loginPassword}) =>async(dispatch)=>{
    const body ={
        "email": loginEmail,
        "password": loginPassword
    }
    
    

    try{
       const resLogin = await Axios.post(`${endpoint}/redux_users/login`,body);
       console.log("logging in ", resLogin);

       dispatch({
           type: LOGIN_SUCCESS,
           payload: resLogin.data
         }
       )
       
    }catch(err){
        console.log("err: ", err.response.data);
        
        dispatch({
            type: LOGIN_FAIL,
            payload: err.response.data.msg
          })
    }}


export default authReducer;