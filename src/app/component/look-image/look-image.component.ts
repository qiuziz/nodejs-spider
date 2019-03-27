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
  showOpt = false;
  loaded = false;
  press = false;
  box: any;
  position: number;

  private get hammerLib() {
    return typeof window !== 'undefined' ? (window as any).Hammer : undefined;
  }

  constructor(public ele: ElementRef, private loadingService: LoadingService) { }

  ngOnInit() {
    this.box = this.ele.nativeElement.querySelector('.box');
    this.onPress();
    // this.imgBox.nativeElement.addEventListener('contextmenu', function(e) {
    //   e.preventDefault();
    // });
    // const hammer = new window.Hammer.Manager(this.imgBox.nativeElement);
    // hammer.add(new window.Hammer.Press({time: 700, threshold: 5}));
    // hammer.on('press', (e: any) => {
    //   console.log(e);
    //   e.preventDefault();
    //   this.showOpt = true;
    //   this.press = true;
    // });
  }


  toggleOpt(e: any) {
    e.preventDefault();
    e.stopPropagation(); if (this.press) {
      this.press = false;
      return;
    }
    this.showOpt = false;
  }

  onPress() {
    // fromEvent(this.imgBox.nativeElement, 'touchstart').pipe(delay(700))
    // .subscribe((e) => {
    //   alert(111);
    // });
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
