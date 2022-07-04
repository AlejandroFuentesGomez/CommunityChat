import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { objectToJson, User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  error: string = '';
  userSubscription: Subscription;
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.pattern('[aA-zZ]{2,50}')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('[aA-zZ]{2,50}')]),
    nick: new FormControl('', [Validators.required, Validators.minLength(5)]),
    birthdate: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')]),
    showPassword: new FormControl(false, [Validators.required]),
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private angularFireAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    if(this.userSubscription){
      this.userSubscription.unsubscribe();
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
      const birthdate = this.signUpForm.controls['birthdate'].value;
      const password = this.signUpForm.controls['password'].value;
      this.userSubscription = this.userService
      .getUserByNick(nick)
      .subscribe((response: any) => {
      if(response.length===0){
      this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((responseSignUp: any)=>{
            const newUser = new User(email, nick, name, surname, birthdate);
            this.userService.createUser(newUser).then((response:any)=>{
              console.log(response)
            })
          }).catch(error=>{
            this.error = error.code;
          });
        }
        else{
          this.error = 'user/nick-already-exists'
        }
      })
    }
  }
  goToLogin() {
    this.router.navigate(['login']);
  }

}
