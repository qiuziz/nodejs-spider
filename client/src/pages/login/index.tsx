/*
 * @Author: qiuz
 * @Github: <https://github.com/qiuziz>
 * @Date: 2019-08-13 18:01:52
 * @Last Modified by: qiuz
 * @Last Modified time: 2019-08-13 18:16:29
 */

import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import LOGO from '../../assets/images/logo.png';

export class Login extends Component {
  state = {
    openId: ""
  }

  config: Config = {
    navigationBarTitleText: '登录'
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getLogin = () => {
    Taro.cloud.callFunction({
      name: "login",
      data: {}
    }).then((res: any) => {
      console.log(res);
      const { data = {} } = res.result;
      const { openId = "" } = data;
      this.setState({
        openId
      })
    });
  }

  getUserInfo = (obj: any) => {
    console.log(12, obj);
    if(obj.detail.userInfo){
      this.getLogin();
    }
  }

  render() {
    return (
      <View className='login'>
        <View className="logo">
          <Image src={LOGO} mode="widthFix"></Image>
        </View>
        <Button className="btn" open-type="getUserInfo" onGetUserInfo={this.getUserInfo}>登录</Button>
      </View>
    )
  }
}
