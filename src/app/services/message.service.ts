import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Observable, map } from 'rxjs';
import { jsonToMessage, Message } from '../models/message.model';
import { objectToJson } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore: AngularFirestore) {}

  public getMessage(): Observable<Message[]> {
    return this.firestore
      .collection('messages', ref => ref.orderBy('date', 'asc'))
      .valueChanges()
      .pipe(map(this.treatData));
  }
 
  public createMessage(message:Message){
    const messageObject = objectToJson(message);
    return this.firestore.collection('messages').add({...messageObject})
  }
  public updateDoc(email: string, field: string ,value: string) {
    return this.firestore.collection('messages', ref => ref.where('email', '==', email)).snapshotChanges().subscribe((res:any)=>{
      let id = res[0].payload.doc.id;
      this.firestore.collection('messages').doc(id).update({field: value});
    });
  }
  private treatData(data: any[]): Message[] {
    return data.map((item: any) => (
      {
        message: item.message,
        date: new Date(item.date.seconds*1000),
        nick: item.nick,
      }
    ));
  }
}
