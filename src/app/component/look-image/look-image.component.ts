import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { LoadingService } from '../../loading.service';
declare var window: any;



@Component({
  selector: 'app-look-image',
  templateUrl: './look-image.component.html',
  styleUrls: ['./look-image.component.less']
})
export class LookImageComponent implements OnInit {
  @Input() src: string;
  @Input() index: number;
  @Output() fromChild = new EventEmitter();
  @ViewChild('imgBox') imgBox: any;
  showImg = false;
  loaded = false;
  showCenter = true;
  box: any;
  position: number;

  constructor(public ele: ElementRef, private loadingService: LoadingService) { }

  ngOnInit() {
    this.box = this.ele.nativeElement.querySelector('.box');
  }

  lookImg(): void {
    this.showImg = !this.showImg;
    if (this.showImg) {
      setTimeout(() => {
        const imgWrap = this.ele.nativeElement.querySelector('.img-wrap img');
        const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        if (imgWrap > clientHeight) {
          this.showCenter = false;
        }
      }, 0);
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
