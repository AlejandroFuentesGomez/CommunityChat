import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { objectToJson, User } from '../models/user.model';
import { StorageService } from './storage.service';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: AngularFirestore,
    private storeService: StoreService,
    private storageService: StorageService,
    private router: Router
  ) {}

  public getUser(): Observable<User[]> {
    return this.firestore
      .collection('users')
      .valueChanges()
      .pipe(map(this.treatData));
  }

  public getUserByEmail(email: string): Observable<User[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .valueChanges()
      .pipe(map(this.treatData));
  }

  public getUserByToken(token: string): Observable<User[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('token', '==', token))
      .valueChanges()
      .pipe(map(this.treatData));
  }
  public getUserByNick(nick: string): Observable<User[]> {
    return this.firestore
      .collection('users', (ref) => ref.where('nick', '==', nick))
      .valueChanges()
      .pipe(map(this.treatData));
  }
  public createUser(user: User) {
    const userObject = objectToJson(user);
    return this.firestore.collection('users').add({ ...userObject });
  }
  public updateDoc(email: string, field: string, value: string) {
    return this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .snapshotChanges()
      .subscribe((res: any) => {
        let id = res[0].payload.doc.id;
        this.firestore.collection('users').doc(id).update({ field: value });
      });
  }
  public logout() {
    this.storageService.deleteAll();
    this.storeService.clearUserState();
    return this.router.navigate(['login'])
  }

  private treatData(data: any[]): User[] {
    return data.map((item: any) => ({
      email: item.email,
      name: item.name,
      surname: item.surname,
      birthdate: item.birthdate,
      nick: item.nick,
      photo: item.photo,
      token: item.token,
    }));
  }
}
