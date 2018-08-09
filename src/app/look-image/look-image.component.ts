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

  constructor(public ele: ElementRef, private loadingService: LoadingService) { }

  ngOnInit() {
    this.box = this.ele.nativeElement.querySelector('.box');
  }

  lookImg(): void {
    this.showImg = !this.showImg;

    document.body.style.overflow  = this.showImg ? 'hidden' : 'auto';
    document.body.style.position  = this.showImg ? 'fixed' : 'static';
  }


}
