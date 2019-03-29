import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
declare var window: any;


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  showLike() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.go('login');
    }
  }

}
