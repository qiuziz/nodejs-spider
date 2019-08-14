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
    navigationBarTitleText: '收藏'
  }
  pending = false;
  constructor(props: any) {
    super(props);
    this.state = {
      images: [{ src: '' }],
      page: 1,
      loadMore: true
    }
  }

  componentDidMount() {
    this.getImages(0);
  }

  getImages = (page: number) => {
    Taro.cloud.callFunction({
      name: "get-img-list",
      data: {
        page,
        where: {
          like: '5c9c7eff0daa4339bca0b709'
        }
      }
    }).then((res: any) => {
      console.log(res);
      const { data } = res.result;
      const { images } = this.state;
      this.pending = false;
      if (data.length < 1) {
        this.setState({
          loadMore: false
        })
        return;
      }
      this.setState({
        images: page > 0 ? [...images, ...data] : data,
        page: page + 1
      })
    });
  }

  onBottom = () => {
    const { page, loadMore } = this.state;
    if (!loadMore) return;
    console.log(page);
    this.getImages(page);
  }

  refresh = () => {
    this.setState({
      loadMore: true
    }, () => this.getImages(0));
  }

  render() {
    const { images } = this.state;
    return (
      <ScrollView
        className='like'
        scrollY={true}
        lowerThreshold={100}
        onScrollToLower={this.onBottom}>
        {
          images.map((img: any) => {
            return <ImgWrap src={img.src} key={img._id}></ImgWrap>
          })
        }
      </ScrollView>
    )
  }
}
