/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-09 17:13:57
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-14 17:57:06
 */

import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.less';

interface ImgWrapProps {
  src: string;
  onLoad: () => void;
  onError: () => void;
}

export class ImgWrap extends Component<ImgWrapProps, any> {
  static defaultProps = {
    src: '',
    onLoad: () => { },
    onError: () => { },
  }
  constructor(props: ImgWrapProps) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
    }
  }

  componentWillMount() { }

  componentDidMount() {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  lookImg = () => {

  }

  onError = () => {
    this.setState({error: true});
    this.props.onError();
  }

  onLoad = () => {
    this.setState({loaded: true});
    this.props.onLoad();
  }

  previewImage = () => {
    const { src } = this.state;
    Taro.previewImage({
      current: src,
      urls: [src]
    });
  }

  render() {
    const { src } = this.props;
    const { error } = this.state;
    if (error) return null;
    return (
        <View className="img-wrap-box">
          {
            <View className="content" onClick={this.previewImage}>
              <View onClick={this.lookImg} className="img">
                <Image lazyLoad={true} src={src} mode="widthFix" onLoad={this.onLoad} onError={this.onError} />
              </View>
              {/* <View className="more">
                <AtIcon prefixClass="mz" value="more" size="20"></AtIcon>
              </View> */}
            </View>
          }
        </View>
    )
  }
}
