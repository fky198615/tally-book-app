import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import allReducers from './redux/reducers/combine_reducers';
import { Provider } from 'react-redux';
import {loadUser} from './redux/reducers/auth';
import Axios from 'axios';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import Resgister from './commponents/resgister/resgister';
import Login from './commponents/login/login';
import FrontPage from './commponents/frontPage/frontPage';
import AddEvent from './commponents/addEvent/addEvent';
import Edit from './commponents/Edit/edit';


import './App.css';

const initialState = {};

const middleware = [thunk];


const store = createStore(
    allReducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)


function App() {

  if(localStorage.token){
    Axios.defaults.headers.common['x-auth-token'] = localStorage.token;
  }else{
    delete Axios.defaults.headers.common['x-auth-token'];
  }

  React.useEffect(()=>{
    console.log("loaduser!!!");
    store.dispatch(loadUser());
  },[]);
  
  return (
    <div className="fill">
      <Provider store={store}>
      <BrowserRouter>
      <Switch>
        <Route path = '/' exact component = {FrontPage}/>
        <Route path = '/register' component = {Resgister}/>
        <Route path = '/login' component = {Login}/>
        <Route path = '/add' component = {AddEvent}/>
        <Route path = '/edit/:id' component = {Edit}/>
     </Switch>
     </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
