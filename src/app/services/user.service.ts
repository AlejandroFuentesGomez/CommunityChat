import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { objectToJson, User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) {}

  public getUser(): Observable<User[]> {
    return this.firestore
      .collection('users')
      .valueChanges()
      .pipe(map(this.treatData));
  }
  
  public getUserByEmail(email:string): Observable<User[]> {
    return this.firestore
      .collection('users', ref=>ref.where('email','==',email))
      .valueChanges()
      .pipe(map(this.treatData));
  }
  public getUserByNick(nick:string): Observable<User[]> {
    return this.firestore
      .collection('users', ref=>ref.where('nick','==',nick))
      .valueChanges()
      .pipe(map(this.treatData));
  }
  public createUser(user:User){
    const userObject = objectToJson(user);
    return this.firestore.collection('users').add({...userObject})
  }

  private treatData(data: any[]): User[] {
    return data.map((item: any) => (
      {
        email: item.email,
        name: item.name,
        surname: item.surname,
        birthdate:item.birthdate,
        nick: item.nick,
      }
    ));
  }

}
