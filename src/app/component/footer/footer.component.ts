import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
declare var window: any;


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
  currentPath = '';
  constructor(public router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.router.events
    .pipe(filter(evt => evt instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.currentPath = event.url;
    });
  }

  go(path: string) {
    this.router.navigate([path]);
  }

  showLike() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.go('login');
      return;
    }
    this.go('like');
  }

}
