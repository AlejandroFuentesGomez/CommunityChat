import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { User } from 'src/app/models/user.model';
import { MessageService } from 'src/app/services/message.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy{

  chatForm = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });
  user: User;
  messages: Message[];
  messagesSubscription: Subscription;
  userSubscription: Subscription;
  constructor(private messageService: MessageService, private storeService: StoreService) { }
  ngOnDestroy(): void {
    this.messagesSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubscription = this.storeService.getState('userState').subscribe(state=>{
      this.user = state.user;
    })   
    this.messagesSubscription = this.messageService.getMessage().subscribe(data=>{
      this.messages = data;
      console.log(this.messages)
    })
  }
  sendMessage(){
    console.log('message', this.chatForm.controls['message'].value)
    if(this.chatForm.valid){
      const messageStr = this.chatForm.controls['message'].value;
      const message : Message = new Message(messageStr,this.user.nick,new Date())
      this.messageService.createMessage(message);
      this.chatForm.reset() 
    }
  }

}
