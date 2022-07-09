import { Component, OnDestroy, OnInit } from '@angular/core';
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
        console.log(this.user);
      });
  }

}
