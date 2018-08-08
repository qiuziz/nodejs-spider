import { Component, OnInit, ElementRef } from '@angular/core';
import { ImageService } from './image.service';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Image {
  id: number;
  images: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  images: Image[];
  boxHeight: number;
  boxArr: any[] = [];
  page = 1;
  pending = false;
  boxList: any[] = [];

  constructor(public ele: ElementRef, private imageService: ImageService) { }

  ngOnInit() {
    this.getImages();

    fromEvent(window, 'scroll').pipe(debounceTime(500))
      .subscribe(() => {
        if (this.pending) { return; }
        if (this.getClient().height + this.getScrollTop() >= this.boxList[this.boxList.length - 1].offsetTop) {
          this.pending = true;
          this.imageService.getImages(this.page)
          .subscribe(images => {
            this.pending = false;
            this.page++;
            this.images = [...this.images, ...images];
          });
        }
      });

    fromEvent(window, 'resize').pipe(debounceTime(500))
      .subscribe(() => {
        this.boxArr = [];
        this.boxHeight = 0;
        const boxs = this.ele.nativeElement.querySelectorAll('.box');
        boxs.forEach((box, index) => {
          this.adjustBoxHeight(index);
        });
      });
  }

  getImages(): void {
    this.imageService.getImages()
      .subscribe(images => {
        this.page++;
        this.images = images;
      });
    console.log(this.images);

  }

  fromChildFunc(event) {
    this.boxList.push(event.box);
    this.adjustBoxHeight(this.boxList.length - 1);
  }

  adjustBoxHeight(index) {
      const gap = 10; // 间隔距离px

      // 1.确定列数  = 页面的宽度 / 图片的宽度
      const pageWidth = this.getClient().width
      , itemWidth: number = this.boxList[index].offsetWidth
      , columns = Math.floor(pageWidth / (itemWidth + gap))
      , initLeft = (pageWidth - (columns * (itemWidth + gap))) / 2; // 使页面居中，算出剩余空间的一半作为初始的left

      if (index < columns) {
          // 2. 确定第一行
          this.boxList[index].style.top = 10 + 'px';
          this.boxList[index].style.left = (itemWidth + gap) * index + initLeft + 'px';
          this.boxArr.push(this.boxList[index].offsetHeight);
      } else {
          // 其他行
          // 3- 找到数组中最小高度  和 它的索引
          const minHeight = Math.min(...this.boxArr), minIndex = this.boxArr.indexOf(minHeight);
          // 4- 设置下一行的第一个盒子位置
          // top值就是最小列的高度 + gap
          this.boxList[index].style.top = this.boxArr[minIndex] + gap + 'px';
          // left值就是最小列距离左边的距离
          this.boxList[index].style.left = this.boxList[minIndex].offsetLeft + 'px';

          // 5- 修改最小列的高度
          // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
          this.boxArr[minIndex] = this.boxArr[minIndex] + this.boxList[index].offsetHeight + gap;
      }
  }

 // clientWidth 处理兼容性
  getClient() {
    return {
      width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
  }
  // scrollTop兼容性处理
  getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
}
