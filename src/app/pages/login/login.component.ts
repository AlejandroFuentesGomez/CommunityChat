import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/services/user.service';
import { jsonToUser, User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { ACTION_CHANGE_USER } from 'src/app/store/actions/appActions';
import { StoreService } from 'src/app/services/store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  error: string = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    showPassword: new FormControl(false, [Validators.required]),
  });
  loginSubscription: Subscription;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
    private storeService: StoreService
  ) {}
  ngOnInit(): void {
    }
  ngOnDestroy(): void {
    if (this.loginSubscription) {
    this.loginSubscription.unsubscribe();
    }
  }

  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.error = '';
      const email = this.loginForm.controls['email'].value.trim().toLowerCase();
      const password = this.loginForm.controls['password'].value.trim();
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((response: any) => {
          // * Si obtenemos una respuesta correcta , seguimos con el login
          this.loginSubscription = this.userService
            .getUserByEmail(email)
            .subscribe((userObj: any) => {
              const user = jsonToUser(userObj[0]);
              this.updateUser(user);
              this.router.navigate(['home']);
            });
        })
        .catch((error) => {
          // * CONTROL ERROR RESPONSE IN ORDER TO GIVE FEEDBACK TO THE USER
          this.error = error.code;
        });
    }
  }
  goToRegistro() {
    this.router.navigate(['sign-up']);
  }
  updateUser(user: User) {
    const obj = {
      type: ACTION_CHANGE_USER,
      payload: user,
    };
    this.storeService.updateState(obj);
  }
}
