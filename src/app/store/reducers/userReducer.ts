import { User } from 'src/app/models/user.model'
import {ACTION_CHANGE_USER} from '../actions/appActions'
import {UserReducerState} from '../state/userState'

const initialState:UserReducerState = {
    user: new User('', '', '','',{seconds: new Date().getSeconds(), nanoseconds:0},'',''),
} 

export function userReducer(state = initialState, action:any):UserReducerState{
    switch(action.type){
        case ACTION_CHANGE_USER:
            return {...state, user:action.payload} 
        
    }
    return state;

}