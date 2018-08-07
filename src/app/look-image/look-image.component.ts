import { Component, OnInit, AfterContentInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-look-image',
  templateUrl: './look-image.component.html',
  styleUrls: ['./look-image.component.less']
})
export class LookImageComponent implements OnInit, AfterContentInit {
  @Input() src: string;
  @Input() index: number;
  @Output() fromChild = new EventEmitter();

  box: any;
  constructor(public ele: ElementRef) { }

  ngOnInit() {
    this.box = this.ele.nativeElement.querySelector('.box');
  }

  ngAfterContentInit() {

  }

}
