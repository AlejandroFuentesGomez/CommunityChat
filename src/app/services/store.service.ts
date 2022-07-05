import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store'
import { IAppStore } from '../store/IAppStore';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private store: Store<IAppStore>, ) { }

  getState(state:string){
    return this.store.select('userState');
  }

  updateState(obj:any){
    this.store.dispatch({
      type:obj.type,
      payload:obj.payload
    })
  }

}
