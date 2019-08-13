import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'
import './index.less'

import { Login, ImgWrap } from '../../components';

export default class Index extends Component<any, any> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }
  boxHeight = 0;
  boxArr = [];
  pending = false;
  constructor(props: any) {
    super(props);
    this.state = {
      images: [{src: ''}],

      page: 1,
      boxList: [],
      loading: true,
    }
  }

  componentWillMount () { }

  componentDidMount () {
     this.getImages(1);
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  reAdjustBox() {
    this.boxArr = [];
    this.boxHeight = 0;
    const boxs = document.querySelectorAll('.box');
    boxs.forEach((box: any, index) => {
      this.adjustBoxHeight(index);
    });
  }

  getImages = (page: number) => {
    Taro.cloud.callFunction({
      name: "get-img-list",
      data: {}
    }).then((res: any) => {
      console.log(res);
      const { data } = res.result;
      const { images } = this.state;
      this.pending = false;
      if (images.length < 1) { return; }
      this.setState({
        images: page > 1 ? [...images, ...data] : data,
        page: page++
      })
    });
  }


  download(): void {

  }
  like(): void {
    // const userId = localStorage.getItem('userId');
    // if (!userId) {
    //   this.router.navigate(['login']);
    //   return;
    // }
    // this.httpService.like({src: this.image.src, userId})
    //   .subscribe(res => {
    //     this.loadingService.setLoading(false);
    //     this.showDrawer();
    //   });
  }
  unlink(src): void {
    console.log(src);
  }

  delete() {
    // const userId = localStorage.getItem('userId');
    // this.httpService.deleteImg({src: this.image.src, userId})
    // .subscribe(res => {
    //   this.loadingService.setLoading(false);
    //   this.images.splice(this.image.index, 1);
    //   this.showDrawer();
    // });
  }


  showDrawer() {
    // this.visible = !this.visible;
  }

  adjustBoxHeight(index) {
      // const gap = 10; // 间隔距离px

      // // 1.确定列数  = 页面的宽度 / 图片的宽度
      // const pageWidth = this.getClient().width
      // , itemWidth: number = this.boxList[index].offsetWidth
      // , columns = Math.floor(pageWidth / (itemWidth + gap))
      // , initLeft = (pageWidth - (columns * (itemWidth + gap))) / 2; // 使页面居中，算出剩余空间的一半作为初始的left

      // if (index < columns) {
      //     // 2. 确定第一行
      //     this.boxList[index].style.top = gap + 'px';
      //     this.boxList[index].style.left = (itemWidth + gap) * index + initLeft + 'px';
      //     this.boxArr.push(this.boxList[index].offsetHeight + this.boxList[index].offsetTop);
      // } else {
      //     // 其他行
      //     // 3- 找到数组中最小高度  和 它的索引
      //     const minHeight = Math.min(...this.boxArr), minIndex = this.boxArr.indexOf(minHeight);
      //     // 4- 设置下一行的第一个盒子位置
      //     // top值就是最小列的高度 + gap
      //     this.boxList[index].style.top = this.boxArr[minIndex] + gap + 'px';
      //     // left值就是最小列距离左边的距离
      //     this.boxList[index].style.left = this.boxList[minIndex].offsetLeft + 'px';

      //     // 5- 修改最小列的高度
      //     // 最小列的高度 = 当前自己的高度 + 拼接过来的高度 + 间隙的高度
      //     this.boxArr[minIndex] = this.boxArr[minIndex] + this.boxList[index].offsetHeight + gap;
      // }

      // if (index === this.images.length - 1) {
      //   if (this.page <= 2) { this.loading = false; }
      //   this.loadingService.setLoading(false);
      //   document.body.style.position = 'static';
      // }
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

  render () {
    const { images } = this.state;
    return (
         <ScrollView className='index'>
        {
          images.map((img: any) => {
            return <ImgWrap src={img.src} key={img._id}></ImgWrap>
          })
        }
        </ScrollView>
    )
  }
}
