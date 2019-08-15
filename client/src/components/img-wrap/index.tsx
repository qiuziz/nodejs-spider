/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-09 17:13:57
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-15 17:09:51
 */

import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.less';
import { AtActionSheet, AtActionSheetItem } from "taro-ui";
import { CloudResouce } from '../../common';
interface ImgWrapProps {
  src: string;
  tag: string;
  onLoad: () => void;
  onError: () => void;
}

export class ImgWrap extends Component<ImgWrapProps, any> {
  static defaultProps = {
    src: '',
    tag: '',
    onLoad: () => { },
    onError: () => { },
  }
  constructor(props: ImgWrapProps) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      isOpened: false
    }
  }

  onError = () => {
    this.setState({error: true});
    this.delete(false);
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

  showAction = () => {
    this.setState({
      isOpened: true
    });
  }

  like = () => {
    const { src } = this.props;
    CloudResouce.like({imgUrl: src}).then(res => {
      console.log(res);
      Taro.showToast({
        title: '收藏成功',
        icon: 'none'
      });
      this.setState({
        isOpened: false
      });
    }).catch(err => console.log(err));
  }

  delete = (toast: boolean = true) => () => {
    const { src } = this.props;
    CloudResouce.deleteImg({imgUrl: src}).then(res => {
      console.log(res);
      toast && Taro.showToast({
        title: '删除成功',
        icon: 'none'
      });
      this.setState({
        isOpened: false,
        error: true
      });
    }).catch(err => console.log(err));
  }

  unlike = () => {
    const { src } = this.props;
    CloudResouce.unlike({imgUrl: src}).then(res => {
      console.log(res);
      Taro.showToast({
        title: '移除成功',
        icon: 'none'
      });
      this.setState({
        isOpened: false,
        error: true
      });
    }).catch(err => console.log(err));
  }

  render() {
    const { src, tag } = this.props;
    const { error, isOpened } = this.state;
    if (error) return null;
    return (
        <View className="img-wrap-box">
          {
            <View onLongPress={this.showAction} className="content" onClick={this.previewImage}>
              <View className="img">
                <Image lazyLoad={true} src={src} mode="widthFix" onLoad={this.onLoad} onError={this.onError} />
              </View>
              {/* <View className="more">
                <AtIcon prefixClass="mz" value="more" size="20"></AtIcon>
              </View> */}
            </View>
          }
          <AtActionSheet isOpened={isOpened} cancelText='取消'>
            <AtActionSheetItem onClick={this.like}>
              收藏
            </AtActionSheetItem>
            {
              tag === 'like'
              ? <AtActionSheetItem onClick={this.unlike}>
                  移除
                </AtActionSheetItem>
              : <AtActionSheetItem onClick={this.delete()}>
                  删除
                </AtActionSheetItem>
            }

          </AtActionSheet>
        </View>
    )
  }
}
