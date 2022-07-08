import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  user: User;
  userSubscription: Subscription;

  constructor(
    private observer: BreakpointObserver,
    private storeService: StoreService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }
  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
  loadUserData() {
    this.userSubscription = this.storeService
      .getState('userState')
      .subscribe((state) => {
        this.user = state.user;
        console.log(this.user);
      });
  }
  logout() {
    return this.userService.logout();
  }
}
