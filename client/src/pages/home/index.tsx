import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import './index.less'

import { ImgWrap } from '../../components';

export default class Index extends Component<any, any> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '妹子图'
  }
  boxHeight = 0;
  boxArr = [];
  pending = false;
  constructor(props: any) {
    super(props);
    this.state = {
      images: [{src: ''}],

      page: 0,
      boxList: [],
      loading: true,
    }
  }

  componentWillMount () { }

  componentDidMount () {
     this.getImages(0);
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  getImages = (page: number) => {
    Taro.cloud.callFunction({
      name: "get-img-list",
      data: {page}
    }).then((res: any) => {
      const { data } = res.result;
      const { images } = this.state;
      this.pending = false;
      if (images.length < 1) { return; }
      this.setState({
        images: page > 0 ? [...images, ...data] : data,
        page: page + 1
      });
    });
  }

  onBottom = () => {
    const { page } = this.state;
    console.log(page);
    this.getImages(page);
  }

  render () {
    const { images } = this.state;
    return (
         <ScrollView className='home' scrollY={true} onScrollToLower={this.onBottom}>
        {
          images.map((img: any) => {
            return <ImgWrap src={img.src} key={img._id}></ImgWrap>
          })
        }
        </ScrollView>
    )
  }
}
