import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  error: string = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    showPassword: new FormControl(false, [Validators.required]),
  });

  constructor(
    private angularFireAuth: AngularFireAuth,
    private userService: UserService
  ) {}

  ngOnInit(): void {}
  login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.error = '';
      const email = this.loginForm.controls['email'].value.trim().toLowerCase();
      const password = this.loginForm.controls['password'].value.trim();
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((response: any) => {
        })
        .catch((error) => {
          // * CONTROL ERROR RESPONSE IN ORDER TO GIVE FEEDBACK TO THE USER
          this.error = error.code;
        });
    }
  }
}
