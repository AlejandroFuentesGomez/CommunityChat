import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  
  deleteAll() {
    sessionStorage.clear();
  }
  getToken() {
    return sessionStorage.getItem('user-token') || '';
  }


  setToken(token: string) {
    sessionStorage.setItem('user-token', token);
  }


  deleteToken() {
    sessionStorage.removeItem('user-token');
  }

}
