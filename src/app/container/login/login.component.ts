import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/loading.service';


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
  constructor(
    private loginService: LoginService,
    public loadingService: LoadingService,
    public router: Router) { }

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
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('userName', res.userName);
        localStorage.setItem('auth', res.auth);
        this.passwordError = '';
        this.usernameError = '';
        this.router.navigate(['like']);
        this.loadingService.setLoading(false);
      });
  }

}
