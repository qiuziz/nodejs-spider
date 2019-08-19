/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-15 13:44:47
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-19 10:19:26
 */

import Taro, { Component, Config } from '@tarojs/taro'
import './index.less'
import { ImgList } from '../img-list';

export default class Index extends Component<any, any> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '去记录'
  }
  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }


  render() {
    return (
      <ImgList tag="home" />
    )
  }
}
