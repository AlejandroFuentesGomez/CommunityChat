
import {userReducer} from './userReducer'
import {ActionReducerMap} from '@ngrx/store'
import { IAppStore } from '../IAppStore'


export const rootReducer: ActionReducerMap<IAppStore> = {
    userState: userReducer,

}