import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

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

  constructor(public ele: ElementRef) { }

  ngOnInit() {
    this.box = this.ele.nativeElement.querySelector('.box');
  }

  lookImg(): void {
    this.showImg = !this.showImg;

    document.body.style.overflow  = this.showImg ? 'hidden' : 'auto';
  }


}
