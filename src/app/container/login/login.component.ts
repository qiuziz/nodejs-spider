import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  usernameError: string;
  passwordError: string;
  constructor(private loginService: LoginService) { }

  ngOnInit() {

  }

  inputChange(value: string, type: string) {
    if (value) {
      this[`${type}Error`] = '';
    }
  }

  login() {
    if (!this.username) {
      this.usernameError = '请输入用户名';
      return;
    }
    if (!this.password) {
      this.passwordError = '请输入密码';
      return;
    }
    this.loginService.login({username: this.username, password: this.password})
      .subscribe((res: any) => {
        if (res.errorMsg) {
          this.passwordError = '密码不正确';
          return;
        }
        localStorage.setItem('token', res.token);
        this.passwordError = '';
        this.usernameError = '';
      });
  }

}
