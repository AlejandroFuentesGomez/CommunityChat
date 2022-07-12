import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { objectToJson, User } from 'src/app/models/user.model';
import { StoreService } from 'src/app/services/store.service';
import { UserService } from 'src/app/services/user.service';
import { ACTION_CHANGE_USER } from 'src/app/store/actions/appActions';
import { first } from 'rxjs/operators';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  error: string = '';
  userSubscription: Subscription;
  angularSubscription: Subscription;
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),    ]),
    surname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    nick: new FormControl('', [Validators.required, Validators.minLength(5)]),
    birthdate: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    showPassword: new FormControl(false, [Validators.required]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private angularFireAuth: AngularFireAuth,
    private storeService: StoreService,
    private storageService: StorageService,
  ) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.angularSubscription) {
      this.angularSubscription.unsubscribe();
    }
  }
  signUp() {
    if (this.signUpForm.valid) {
      const email = this.signUpForm.controls['email'].value
        .trim()
        .toLowerCase();
      const name = this.signUpForm.controls['name'].value;
      const surname = this.signUpForm.controls['surname'].value;
      const nick = this.signUpForm.controls['nick'].value;
      const birthdate = new Date(this.signUpForm.controls['birthdate'].value);
      const password = this.signUpForm.controls['password'].value;
      this.userSubscription = this.userService
        .getUserByNick(nick)
        .subscribe((response: any) => {
          if (response.length === 0) {
            this.angularFireAuth
              .createUserWithEmailAndPassword(email, password)
              .then((responseSignUp: any) => {
                this.angularSubscription =
                  this.angularFireAuth.authState.subscribe(async (data) => {
                    const token = await data!.getIdToken();
                    this.storageService.setToken(token)
                    const newUser = new User(
                      email,
                      nick,
                      name,
                      surname,
                      birthdate,
                      '',
                      token
                    );
                    this.userService
                      .createUser(newUser)
                      .then((response: any) => {
                        this.updateUser(newUser);
                        this.router.navigate(['home'])
                      });
                  });
              })
              .catch((error) => {
                this.error = error.code;
              });
          } else {
            this.error = 'user/nick-already-exists';
          }
        });
    }
  }
  goToLogin() {
    this.router.navigate(['login']);
  }
  updateUser(user: User) {
    const obj = {
      type: ACTION_CHANGE_USER,
      payload: user,
    };
    this.storeService.updateState(obj);
  }
}
