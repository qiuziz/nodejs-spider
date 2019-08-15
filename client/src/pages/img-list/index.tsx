import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import './index.less'

import { ImgWrap } from '../../components';
import { CloudResouce } from '../../common';

interface Props {
  tag: 'home' | 'like';
}

export class ImgList extends Component<Props, any> {
  static defaultProps= {
    tag: ''
  }
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
  pending = false;
  constructor(props: Props) {
    super(props);
    this.state = {
      images: [{ src: '' }],
      page: 0,
      loadMore: true
    }
  }

  componentDidMount() {
    this.getImages(0);
  }

  componentDidShow() {
    const { tag } = this.props;
    tag === 'like' && this.getImages(0);
  }

  componentDidHide() { }


  getImages = (page: number) => {
    if (this.pending) return;
    this.pending = true;
    const { tag } = this.props;
    CloudResouce[tag === 'like' ? 'getLikeImgs' : 'getImgs']({page}).then((res: any) => {
      const { data } = res.result;
      const { images } = this.state;
      this.pending = false;
      this.setState({
        images: page > 0 ? [...images, ...data] : data,
        page: page + 1,
        loadMore: data.length < 10 ? false : true,
      });
    });
  }

  onBottom = () => {
    const { page, loadMore } = this.state;
    if (!loadMore) return;
    this.getImages(page);
  }

  render() {
    const { images } = this.state;
    const { tag } = this.props;
    return (
      <ScrollView className='home' scrollY={true} onScrollToLower={this.onBottom}>
        {/* <View className="refresh-btn">
            <AtIcon prefixClass="mz" value="refresh" color="#8a8a8a" size="20"></AtIcon>
          </View> */}
        {
          images.map((img: any) => {
            return <ImgWrap src={img.src} key={img._id} tag={tag}></ImgWrap>
          })
        }
      </ScrollView>
    )
  }
}
