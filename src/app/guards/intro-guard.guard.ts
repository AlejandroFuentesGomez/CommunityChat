import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { jsonToUser } from '../models/user.model';
import { StorageService } from '../services/storage.service';
import { StoreService } from '../services/store.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class IntroGuardGuard implements CanLoad, OnDestroy {
  loginSubscription: Subscription;
  constructor(
    private router: Router,
    private storageService: StorageService,
    private storeService: StoreService,
    private userService: UserService
  ) {}
  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
  async canLoad(): Promise<boolean> {
    const token = await this.storageService.getToken();
    if (!token) {
      return true;
    }
    this.loginSubscription = this.userService
      .getUserByToken(token)
      .subscribe((userObj: any) => {
        console.log('userObj', userObj);
        if (userObj.length >= 0) {
          const user = jsonToUser(userObj[0]);
          this.storeService.updateUserState(user);
          return this.router.navigate(['/home']);
        }
        return true;
      });
    return true;
  }
}
