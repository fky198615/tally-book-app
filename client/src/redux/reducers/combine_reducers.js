import {combineReducers} from 'redux';
import authResgister from './auth';

//combine all reducers into one reducer
const combine = combineReducers({
    authResgister
})

export default combine;