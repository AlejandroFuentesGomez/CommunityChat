import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user:User;
  userSubscription:Subscription;
  enableForm = true;
  editProfileForm: FormGroup;
  constructor(private storeService: StoreService) { }

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
        this.user = state.user;
        this.fillProfileForm(this.user);
        console.log(this.user);
      });
  }
  fillProfileForm(user: User){
    this.editProfileForm = new FormGroup({
      email: new FormControl(user.email),
      name: new FormControl(user.name),
      surname: new FormControl(user.surname),
      nick: new FormControl(user.nick),
      birthdate: new FormControl(user.birthdate),
      

    })
  }

}
