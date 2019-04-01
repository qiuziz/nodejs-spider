import { Component, OnInit, ElementRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HttpService } from '../../http.service';
import { fromEvent, Observable } from 'rxjs';
import { throttleTime, debounceTime } from 'rxjs/operators';
import { LoadingService } from '../../loading.service';
import { Router } from '@angular/router';

interface Image {
  id: number;
  src: string;
  index?: number;
}

function funDownload(src: string, filename = '') {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = src;
  eleLink.style.display = 'none';
  // // 字符内容转变成blob地址
  eleLink.href = src;
  // // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // // 然后移除
  document.body.removeChild(eleLink);
}

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.less']
})
export class LikeComponent implements OnInit, OnDestroy {
  images: Image[] = [];
  image: Image;
  boxHeight: number;
  boxArr: any[] = [];
  page = 1;
  pending = false;
  boxList: any[] = [];
  loading = true;
  visible = false;
  src = '';
  scrollEvent: any;
  resizeEvent: any;
  loadMore = true;
  constructor(
    public ele: ElementRef,
    private httpService: HttpService,
    public loadingService: LoadingService,
    public router: Router
  ) { }

  ngOnInit() {
    this.getLikeList();
    this.scrollEvent = fromEvent(window, 'scroll').pipe(throttleTime(500))
      .subscribe(() => {
        if (this.pending) { return; }
        if (this.boxList.length > 0 && this.getClient().height + this.getScrollTop() >= this.boxList[this.boxList.length - 1].offsetTop) {
          this.pending = true;
          this.getLikeList();
        }
      });

    this.resizeEvent = fromEvent(window, 'resize').pipe(debounceTime(500))
      .subscribe(() => {
        this.boxArr = [];
        this.boxHeight = 0;
        const boxs = this.ele.nativeElement.querySelectorAll('.box');
        boxs.forEach((box, index) => {
          this.adjustBoxHeight(index);
        });
      });
  }

  ngOnDestroy(): void {
    this.scrollEvent.unsubscribe();
    this.resizeEvent.unsubscribe();
  }

  getLikeList(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['login']);
      return;
    }
    if (!this.loadMore) {
      return;
    }
    this.httpService.getList({userId, page: this.page})
      .subscribe(images => {
        this.pending = false;
        this.loadingService.setLoading(false);
        if (images.length < 10) {
          this.loadMore = false;
        } else {
          this.loadMore = true;
        }
        this.page++;
        this.images = [...this.images, ...images];
      });

  }

  fromChildFunc(event: any) {
    if (event.option) {
      this.image = {...this.images[event.index], index: event.index};
      this.showDrawer();
      return;
    }
    if (event.error) {
      this.images.splice(event.index, 1);
      return;
    }
    this.boxList.push(event.box);
    this.adjustBoxHeight(this.boxList.length - 1);
  }

  download(src): void {
    console.log(src);
    funDownload(src);
  }
  like(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['login']);
      return;
    }
    this.httpService.like({src: this.image.src, userId})
      .subscribe(res => {
        console.log(res);
        this.loadingService.setLoading(false);
      });
  }
  unlink(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['login']);
      return;
    }
    this.httpService.unlike({src: this.image.src, userId})
      .subscribe(res => {
        console.log(res, this.image.index);
        this.images.splice(this.image.index);
        this.showDrawer();
        this.loadingService.setLoading(false);
      });
  }


  showDrawer() {
    this.visible = !this.visible;
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
          this.boxList[index].style.top = 50 + 'px';
          this.boxList[index].style.left = (itemWidth + gap) * index + initLeft + 'px';
          this.boxArr.push(this.boxList[index].offsetHeight + this.boxList[index].offsetTop);
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

      if (index === this.images.length - 1) {
        if (this.page <= 2) { this.loading = false; }
        this.loadingService.setLoading(false);
        document.body.style.position = 'static';
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

