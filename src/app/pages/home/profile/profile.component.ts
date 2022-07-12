import { newArray } from '@angular/compiler/src/util';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, finalize, take } from "rxjs/operators";

import { User } from 'src/app/models/user.model';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  newProfilePhoto:any;
  user:User;
  userSubscription:Subscription;
  editSubscription: Subscription;
  downloadURL:any;
  enableForm = false;
  error:string = '';
  userBirthdate :Date;
  editProfileForm: FormGroup;
  constructor(private storeService: StoreService, private storage: AngularFireStorage, 
    private store: StoreService, private userService:UserService) { }

  ngOnInit(): void {
    this.loadUserData();
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  loadUserData() {
    this.userSubscription = this.storeService
      .getState('userState')
      .subscribe((state) => {
        this.userBirthdate = new Date(state.user.birthdate.seconds *1000);
        this.user = state.user;
        this.fillProfileForm(this.user);
      });
  }
  fillProfileForm(user: User){
    this.editProfileForm = new FormGroup({
      email: new FormControl(user.email),
      name: new FormControl(user.name,[Validators.required, Validators.minLength(3)]),
      surname: new FormControl(user.surname, [Validators.required, Validators.minLength(3)]),
      nick: new FormControl(user.nick, [Validators.required, Validators.minLength(3)]),
      birthdate: new FormControl(new Date(),[Validators.required]),
    })
  }
  submit(){
    if(this.editProfileForm.valid){
      const email = this.user.email;
      const nick = this.editProfileForm.controls['nick'].value;
      const name = this.editProfileForm.controls['name'].value;
      const surname = this.editProfileForm.controls['surname'].value;
      const birthdate = this.userBirthdate;
          var newUser = new User(email, nick, name,surname,birthdate,
            this.user.photo, this.user.token)
          const updateFields = {
            'nick':nick,
            'name':name,
            'surname':surname,
          }
        this.userService.updateDoc(email, updateFields);
        this.store.updateUserState(newUser); 
        this.enableForm = false;
   
    }
  }

  changeProfilePhoto(photo:any){
    this.newProfilePhoto = photo.target.files[0];
  }
  onUpload(){
    if(this.newProfilePhoto){

      var n = Date.now();
      const filePath = `ProfilesImages/${n}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.newProfilePhoto);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            this.downloadURL   = downloadURL;
            this.saveUserData();
          });
        })
        ).subscribe();
        
      }
  }
  saveUserData(){
    const updateFields = {
      'photo': this.downloadURL
    }
    this.userService.updateDoc(this.user.email, updateFields);
    var newUser = new User(this.user.email, this.user.nick, this.user.name,this.user.surname,this.user.birthdate,
      this.downloadURL, this.user.token)
    this.store.updateUserState(newUser);
  }

}
