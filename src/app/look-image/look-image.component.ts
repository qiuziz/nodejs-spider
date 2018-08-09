import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-look-image',
  templateUrl: './look-image.component.html',
  styleUrls: ['./look-image.component.less']
})
export class LookImageComponent implements OnInit {
  @Input() src: string;
  @Input() index: number;
  @Output() fromChild = new EventEmitter();
  showImg = false;
  box: any;
  position: number;
  constructor(public ele: ElementRef, private loadingService: LoadingService) { }

  ngOnInit() {
    this.box = this.ele.nativeElement.querySelector('.box');
  }

  lookImg(): void {
    this.showImg = !this.showImg;

    if (this.showImg) {
      this.position = this.getScrollTop();
      document.body.style.overflow  = 'hidden';
      document.body.style.position  = 'fixed';
    } else {
      const posY = this.position;
      setTimeout(() => window.scrollTo(0, posY), 0);
      this.position = 0;
      document.body.style.overflow  = 'auto';
      document.body.style.position  = 'static';
    }

  }

  getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }


}
